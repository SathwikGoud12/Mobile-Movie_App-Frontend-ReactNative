import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { fetchMovieDetails } from "../services/api";
import { saveMovie, unsaveMovie, isMovieSaved } from "../services/appwrite";
import { icons } from "../constants/icons";

export default function MovieDetailsScreen() {
    const route = useRoute();
    const { movieId } = route.params;

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [savingLoading, setSavingLoading] = useState(false);

    useEffect(() => {
        loadMovieDetails();
        checkIfSaved();
    }, [movieId]);

    const loadMovieDetails = async () => {
        try {
            setLoading(true);
            const data = await fetchMovieDetails(movieId);
            setMovie(data);
        } catch (err) {
            console.error("Error loading movie details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkIfSaved = async () => {
        try {
            const saved = await isMovieSaved(movieId);
            setIsSaved(saved);
        } catch (err) {
            console.error("Error checking if movie is saved:", err);
        }
    };

    const handleToggleSave = async () => {
        if (!movie) return;

        try {
            setSavingLoading(true);

            if (isSaved) {
                await unsaveMovie(movieId);
                setIsSaved(false);
                Alert.alert("Success", "Movie removed from saved list");
            } else {
                await saveMovie(movie);
                setIsSaved(true);
                Alert.alert("Success", "Movie saved successfully!");
            }
        } catch (err) {
            console.error("Error toggling save:", err);
            Alert.alert("Error", "Failed to save movie. Please try again.");
        } finally {
            setSavingLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-primary items-center justify-center">
                <ActivityIndicator size="large" color="#AB8BFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-primary items-center justify-center px-6">
                <Text className="text-red-500 text-center">Error: {error}</Text>
            </View>
        );
    }

    if (!movie) {
        return (
            <View className="flex-1 bg-primary items-center justify-center">
                <Text className="text-white">Movie not found</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-primary">
            {/* Backdrop Image with Save Button Overlay */}
            <View className="relative">
                <Image
                    source={{
                        uri: movie.backdrop_path
                            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    }}
                    className="w-full h-64"
                    resizeMode="cover"
                />

                {/* Save Button - Floating Heart */}
                <TouchableOpacity
                    onPress={handleToggleSave}
                    disabled={savingLoading}
                    className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-accent items-center justify-center shadow-lg"
                    style={{ elevation: 5 }}
                >
                    {savingLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-3xl">{isSaved ? "❤️" : "🤍"}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View className="px-5 py-6">
                {/* Title */}
                <Text className="text-3xl font-bold text-white mb-2">{movie.title}</Text>

                {/* Rating and Release Date */}
                <View className="flex-row items-center gap-4 mb-4">
                    <View className="flex-row items-center gap-1">
                        <Image source={icons.star} className="w-5 h-5" />
                        <Text className="text-amber-400 font-bold text-lg">
                            {(movie.vote_average / 2).toFixed(1)}
                        </Text>
                    </View>
                    <Text className="text-gray-400">
                        {movie.release_date?.split("-")[0] || "N/A"}
                    </Text>
                    <Text className="text-gray-400">
                        {movie.runtime ? `${movie.runtime} min` : ""}
                    </Text>
                </View>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        {movie.genres.map((genre) => (
                            <View key={genre.id} className="bg-dark-200 px-3 py-1 rounded-full">
                                <Text className="text-light-200 text-sm">{genre.name}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Overview */}
                <Text className="text-xl font-bold text-white mb-2">Overview</Text>
                <Text className="text-light-200 leading-6 mb-4">
                    {movie.overview || "No overview available"}
                </Text>

                {/* Additional Info */}
                {movie.tagline && (
                    <View className="mb-4">
                        <Text className="text-lg font-bold text-white mb-1">Tagline</Text>
                        <Text className="text-light-200 italic">"{movie.tagline}"</Text>
                    </View>
                )}

                {movie.budget > 0 && (
                    <View className="mb-2">
                        <Text className="text-white">
                            <Text className="font-bold">Budget:</Text> $
                            {movie.budget.toLocaleString()}
                        </Text>
                    </View>
                )}

                {movie.revenue > 0 && (
                    <View className="mb-2">
                        <Text className="text-white">
                            <Text className="font-bold">Revenue:</Text> $
                            {movie.revenue.toLocaleString()}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
