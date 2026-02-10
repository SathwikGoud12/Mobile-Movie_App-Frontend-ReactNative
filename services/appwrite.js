import { Client, Databases, ID, Query, Permission, Role } from "appwrite";


const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);
const database = new Databases(client);

// ✅ Validate Appwrite credentials
const validateAppwriteConfig = () => {
  if (!DATABASE_ID || !COLLECTION_ID) {
    console.warn(
      "⚠️ Appwrite credentials missing. Add EXPO_PUBLIC_APPWRITE_DATABASE_ID and EXPO_PUBLIC_APPWRITE_COLLECTION_ID to your .env file"
    );
    return false;
  }
  return true;
};

// ✅ Update search count (NO trending logic)
export const updateSearchCount = async (query, movie) => {
  try {
    // Skip if Appwrite is not configured
    if (!validateAppwriteConfig()) {
      console.log("Skipping search count update - Appwrite not configured");
      return;
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", query)]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title || "Unknown",
          count: 1,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Poster",
        }
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};


// ✅ Get trending movies (sorted by search count)
export const getTrendingMovies = async () => {
  try {
    // Skip if Appwrite is not configured
    if (!validateAppwriteConfig()) {
      console.log("Skipping trending movies fetch - Appwrite not configured");
      return [];
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.orderDesc("count"), Query.limit(10)]
    );

    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// ========== SAVED MOVIES FUNCTIONS ==========

// You'll need to create a "saved_movies" collection in Appwrite with these attributes:
// - movie_id (string, required)
// - title (string, required)
// - poster_path (string, optional)
// - backdrop_path (string, optional)
// - vote_average (number, optional)
// - release_date (string, optional)
// - overview (string, optional)
// - saved_at (datetime, required)

const SAVED_MOVIES_COLLECTION_ID = "saved_movies"; // You'll need to create this collection

// ✅ Save a movie
export const saveMovie = async (movie) => {
  try {
    if (!validateAppwriteConfig()) {
      console.log("Skipping save movie - Appwrite not configured");
      return null;
    }

    // Check if already saved
    const existing = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("movie_id", movie.id.toString())]
    );

    if (existing.documents.length > 0) {
      console.log("Movie already saved");
      return existing.documents[0];
    }

    // Save the movie with permissions
    const result = await database.createDocument(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      ID.unique(),
      {
        movie_id: movie.id.toString(),
        title: movie.title || "Unknown",
        poster_path: movie.poster_path || "",
        backdrop_path: movie.backdrop_path || "",
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || "",
        overview: movie.overview || "",
        saved_at: new Date().toISOString(),
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );

    console.log("Movie saved successfully:", result);
    return result;
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

// ✅ Unsave a movie
export const unsaveMovie = async (movieId) => {
  try {
    if (!validateAppwriteConfig()) {
      console.log("Skipping unsave movie - Appwrite not configured");
      return;
    }

    // Find the saved movie document
    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("movie_id", movieId.toString())]
    );

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        result.documents[0].$id
      );
      console.log("Movie unsaved successfully");
    }
  } catch (error) {
    console.error("Error unsaving movie:", error);
    throw error;
  }
};

// ✅ Check if a movie is saved
export const isMovieSaved = async (movieId) => {
  try {
    if (!validateAppwriteConfig()) {
      return false;
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("movie_id", movieId.toString())]
    );

    return result.documents.length > 0;
  } catch (error) {
    console.error("Error checking if movie is saved:", error);
    return false;
  }
};

// ✅ Get all saved movies
export const getSavedMovies = async () => {
  try {
    if (!validateAppwriteConfig()) {
      console.log("Skipping get saved movies - Appwrite not configured");
      return [];
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.orderDesc("saved_at"), Query.limit(100)]
    );

    return result.documents;
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return [];
  }
};
