import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import useFetch from "@/services/usefetch";
import { fetchMovieDetails } from "@/services/api";

const MovieInfo = ({ label, value }) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-xs">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-1 flex-wrap max-w-xs">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id)
  );

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-96"
            resizeMode="cover"
          />

          <View className="absolute top-8 left-5 z-10">
            <TouchableOpacity 
              className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
              onPress={() => router.back()}
            >
              <Text className="text-white text-xl">←</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-16 bg-accent flex items-center justify-center shadow-lg">
            <Image
              source={icons.play}
              className="w-7 h-7"
              resizeMode="contain"
              tintColor="#000"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-6 px-5 bg-primary">
          <Text className="text-white font-bold text-2xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime || "N/A"}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-3 py-2 rounded-lg gap-x-1 mt-3">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {(movie?.vote_average ?? 0).toFixed(1)}/10
            </Text>
            <Text className="text-light-200 text-xs">
              ({movie?.vote_count || 0} votes)
            </Text>
          </View>

          <MovieInfo label="📝 Overview" value={movie?.overview} />
          <MovieInfo
            label="🎬 Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex-row gap-x-8 w-full mt-4">
            <MovieInfo
              label="💰 Budget"
              value={movie?.budget ? `$${(movie?.budget / 1_000_000).toFixed(1)}M` : "N/A"}
            />
            <MovieInfo
              label="📈 Revenue"
              value={movie?.revenue ? `$${(movie?.revenue / 1_000_000).toFixed(1)}M` : "N/A"}
            />
          </View>

          <MovieInfo
            label="🏢 Production"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-5 right-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={() => router.back()}
      >
        <Text className="text-black font-bold text-lg">← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;