import { View, TextInput, Image } from "react-native";
import { icons } from "@/constants/icons";

const SearchBar = ({ placeholder, value, onChangeText, onPress }) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />

      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"
        onFocus={onPress}
      />
    </View>
  );
};

export default SearchBar;
