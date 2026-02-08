import { Client, Databases, ID, Query } from "appwrite";


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
