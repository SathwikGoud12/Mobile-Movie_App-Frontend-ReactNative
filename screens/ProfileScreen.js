import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator, Modal, Pressable } from "react-native";
import { removeAccessToken, getUserData, removeUserData, setUserData } from "../app/utils/token";
import { getCurrentUser } from "../app/services/api";
import { useNavigation } from "@react-navigation/native";
import { images } from "../constants/images";
import { icons } from "../constants/icons";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [userData, setUserDataState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageModalVisible, setImageModalVisible] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            // First, try to get from AsyncStorage
            let data = await getUserData();

            // If not in storage, fetch from backend
            if (!data) {
                console.log("User data not in storage, fetching from backend...");
                try {
                    const response = await getCurrentUser();

                    if (response && response.user) {
                        data = {
                            id: response.user.id,
                            fullName: response.user.fullName,
                            email: response.user.email,
                            profileImage: response.user.profileImage,
                        };

                        // Save to AsyncStorage for future use
                        await setUserData(data);
                    }
                } catch (apiError) {
                    // Handle 404 or other API errors gracefully
                    if (apiError.response?.status === 404) {
                        console.log("Backend endpoint /users/me not found. Please logout and login again.");
                    } else {
                        console.error("Error fetching from backend:", apiError);
                    }
                    // Don't show alert, just continue with null data
                }
            }

            setUserDataState(data);
        } catch (error) {
            console.error("Error loading user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeAccessToken();
                            await removeUserData();
                            navigation.replace("Auth");
                        } catch (error) {
                            console.error("Logout error:", error);
                            Alert.alert("Error", "Failed to logout");
                        }
                    }
                }
            ]
        );
    };

    const getProfileImageUrl = () => {
        return userData?.profileImage ||
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(userData?.fullName || "User") +
            "&size=400&background=AB8BFF&color=fff";
    };

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

            <ScrollView
                className="flex-1 px-5 pt-20"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-white mb-2">Profile</Text>
                    <Text className="text-light-200">Manage your account</Text>
                </View>

                {/* Profile Card */}
                <View className="bg-dark-200 rounded-2xl p-6 mb-6 border border-dark-100">
                    {/* Profile Image - Clickable */}
                    <View className="items-center mb-6">
                        <TouchableOpacity
                            onPress={() => setImageModalVisible(true)}
                            activeOpacity={0.8}
                        >
                            <View className="relative">
                                <Image
                                    source={{ uri: getProfileImageUrl() }}
                                    className="w-32 h-32 rounded-full border-4 border-accent"
                                    resizeMode="cover"
                                />
                                <View className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full items-center justify-center border-4 border-dark-200">
                                    <Text className="text-2xl">✨</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text className="text-light-300 text-xs mt-2">Tap to view</Text>
                    </View>

                    {/* User Info */}
                    <View className="space-y-4">
                        {/* Full Name */}
                        <View className="bg-dark-100 rounded-xl p-4">
                            <Text className="text-light-300 text-xs mb-1">Full Name</Text>
                            <Text className="text-white text-lg font-bold">
                                {userData?.fullName || "Not available"}
                            </Text>
                        </View>

                        {/* Email */}
                        <View className="bg-dark-100 rounded-xl p-4 mt-3">
                            <Text className="text-light-300 text-xs mb-1">Email</Text>
                            <Text className="text-white text-base">
                                {userData?.email || "Not available"}
                            </Text>
                        </View>

                        {/* User ID */}
                        <View className="bg-dark-100 rounded-xl p-4 mt-3">
                            <Text className="text-light-300 text-xs mb-1">User ID</Text>
                            <Text className="text-white text-sm font-mono">
                                {userData?.id || "Not available"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Logout Button - Moved up */}
                <TouchableOpacity
                    className="bg-red-500 py-4 rounded-xl shadow-lg"
                    onPress={handleLogout}
                    style={{ elevation: 5 }}
                >
                    <Text className="text-white font-bold text-lg text-center">Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Image Viewer Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={imageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-black/90 justify-center items-center"
                    onPress={() => setImageModalVisible(false)}
                >
                    <View className="w-full px-5">
                        {/* Close Button */}
                        <TouchableOpacity
                            className="absolute top-12 right-5 w-12 h-12 bg-red-500 rounded-full items-center justify-center z-10"
                            onPress={() => setImageModalVisible(false)}
                            style={{ elevation: 10 }}
                        >
                            <Text className="text-white text-2xl font-bold">×</Text>
                        </TouchableOpacity>

                        {/* Large Profile Image */}
                        <View className="items-center">
                            <Image
                                source={{ uri: getProfileImageUrl() }}
                                className="w-80 h-80 rounded-2xl border-4 border-accent"
                                resizeMode="cover"
                            />
                            <View className="mt-6 bg-dark-200 rounded-xl p-4 w-full">
                                <Text className="text-white text-xl font-bold text-center">
                                    {userData?.fullName || "User"}
                                </Text>
                                <Text className="text-light-200 text-center mt-1">
                                    {userData?.email || ""}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
