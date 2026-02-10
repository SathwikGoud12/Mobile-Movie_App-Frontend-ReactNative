import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TrendingCard = ({ movie: { movie_id, title, poster_url }, index }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="flex-col w-36"
      onPress={() => navigation.navigate("MovieDetails", { movieId: movie_id })}
    >
      {/* Image Container with Badge */}
      <View className="relative w-full h-48">
        <Image
          source={{ uri: poster_url }}
          className="w-full h-full rounded-lg"
          resizeMode="cover"
        />

        {/* Ranking Badge - Bottom Left */}
        <View className="absolute -bottom-6 left-0 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg border-4 border-primary">
          <Text className="font-bold text-black text-2xl">{index + 1}</Text>
        </View>
      </View>

      {/* Title with padding for badge space */}
      <Text
        className="text-sm font-bold mt-8 text-light-200 px-1"
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default TrendingCard;