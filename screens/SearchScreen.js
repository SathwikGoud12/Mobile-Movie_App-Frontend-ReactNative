import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";

import { images } from "../constants/images";
import { icons } from "../constants/icons";

import { fetchMovies } from "../services/api";
import { updateSearchCount } from "../services/appwrite";

import SearchBar from "../components/SearchBar";
import MovieDisplayCard from "../components/MovieCard";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Debounced search effect - only save when query is 3+ characters
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      // Only search if query is at least 3 characters
      if (searchQuery.trim().length >= 3) {
        try {
          setLoading(true);
          setError(null);
          const results = await fetchMovies({ query: searchQuery });
          setMovies(results || []);

          // Update search count only if results exist AND query is complete
          if (results && results.length > 0 && results[0]) {
            await updateSearchCount(searchQuery, results[0]);
          }
        } catch (err) {
          console.error("Search error:", err);
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setMovies([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset if query is less than 3 characters
        setMovies([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieDisplayCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#AB8BFF"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim().length >= 3 &&
              movies.length > 0 && (
                <Text className="text-xl text-white font-bold mb-4">
                  Search Results for{" "}
                  <Text className="text-accent">"{searchQuery}"</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-400">
                {searchQuery.trim().length > 0 && searchQuery.trim().length < 3
                  ? `Type at least 3 characters to search`
                  : searchQuery.trim()
                    ? "No movies found"
                    : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default SearchScreen;
