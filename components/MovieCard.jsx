import { Text, Image, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { icons } from "../constants/icons";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="w-[30%] bg-dark-200 rounded-xl overflow-hidden"
      onPress={() => navigation.navigate("MovieDetails", { movieId: id })}
    >
      <Image
        source={{
          uri: poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
        }}
        className="w-full h-52 rounded-t-xl"
        resizeMode="cover"
      />

      <View className="px-2 py-3 bg-dark-200">
        <Text className="text-sm font-bold text-white" numberOfLines={2}>
          {title}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1 mt-1">
          <Image source={icons.star} className="size-3" />
          <Text className="text-xs text-amber-400 font-bold">
            {(vote_average / 2).toFixed(1)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-xs text-gray-400 font-medium">
            {release_date?.split("-")[0] || "N/A"}
          </Text>
          <Text className="text-xs font-medium text-gray-400 uppercase">
            Movie
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
