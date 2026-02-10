import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getSavedMovies, unsaveMovie } from "../services/appwrite";
import { icons } from "../constants/icons";
import { images } from "../constants/images";

const SavedScreen = () => {
    const navigation = useNavigation();
    const [savedMovies, setSavedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Reload saved movies when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadSavedMovies();
        }, [])
    );

    useEffect(() => {
        loadSavedMovies();
    }, []);

    const loadSavedMovies = async () => {
        try {
            setLoading(true);
            const movies = await getSavedMovies();
            setSavedMovies(movies);
        } catch (error) {
            console.error("Error loading saved movies:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadSavedMovies();
    };

    const handleUnsave = async (movieId, documentId) => {
        try {
            await unsaveMovie(movieId);
            // Remove from local state
            setSavedMovies(savedMovies.filter(movie => movie.$id !== documentId));
        } catch (error) {
            console.error("Error unsaving movie:", error);
        }
    };

    const renderMovieCard = ({ item }) => (
        <View className="w-[48%] mb-4">
            <TouchableOpacity
                onPress={() => navigation.navigate("MovieDetails", { movieId: item.movie_id })}
                className="bg-dark-200 rounded-xl overflow-hidden"
            >
                <Image
                    source={{
                        uri: item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
                    }}
                    className="w-full h-64"
                    resizeMode="cover"
                />

                <View className="p-3">
                    <Text className="text-white font-bold text-sm" numberOfLines={2}>
                        {item.title}
                    </Text>

                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center gap-1">
                            <Image source={icons.star} className="w-4 h-4" />
                            <Text className="text-amber-400 font-bold text-xs">
                                {(item.vote_average / 2).toFixed(1)}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => handleUnsave(item.movie_id, item.$id)}
                            className="bg-red-500 px-2 py-1 rounded-full"
                        >
                            <Text className="text-white text-xs font-bold">Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 bg-primary items-center justify-center">
                <ActivityIndicator size="large" color="#AB8BFF" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <View className="flex-1 px-5 pt-20">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-3xl font-bold text-white">Saved Movies</Text>
                        <Text className="text-light-200 mt-1">
                            {savedMovies.length} {savedMovies.length === 1 ? "movie" : "movies"} saved
                        </Text>
                    </View>
                    <Image source={icons.save} className="w-8 h-8" tintColor="#AB8BFF" />
                </View>

                {/* Movies Grid */}
                <FlatList
                    data={savedMovies}
                    renderItem={renderMovieCard}
                    keyExtractor={(item) => item.$id}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                    }}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center mt-20">
                            <Text className="text-6xl mb-4">🎬</Text>
                            <Text className="text-white text-xl font-bold mb-2">No Saved Movies</Text>
                            <Text className="text-light-200 text-center px-10">
                                Start saving your favorite movies to watch them later!
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

export default SavedScreen;
