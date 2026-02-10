import axios from 'axios';

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  ACCESS_TOKEN: process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN}`,
  },
};

// Validate TMDB token on load
if (!TMDB_CONFIG.ACCESS_TOKEN) {
  console.warn("⚠️ TMDB_ACCESS_TOKEN is missing! Add EXPO_PUBLIC_TMDB_ACCESS_TOKEN to your .env file");
}


// Fetch movies (search OR popular)
export const fetchMovies = async ({ query }) => {
  try {
    const endpoint = query
      ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    console.log("Fetching movies from:", endpoint);
    console.log("Using token:", TMDB_CONFIG.ACCESS_TOKEN ? "Token exists" : "NO TOKEN!");

    const response = await axios.get(endpoint, {
      headers: TMDB_CONFIG.headers,
    });

    console.log("Response status:", response.status);
    console.log("Movies fetched successfully:", response.data.results?.length || 0);

    return response.data.results;
  } catch (error) {
    console.error("Fetch movies error:", error);
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("API Error Status:", error.response.status);
    }
    throw error;
  }
};

// Fetch movie details
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`,
      {
        headers: TMDB_CONFIG.headers,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

