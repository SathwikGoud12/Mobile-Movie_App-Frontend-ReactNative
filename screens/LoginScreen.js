import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import api from "../app/services/api";
import { setAccessToken, setUserData } from "../app/utils/token";


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            console.log("Attempting login to:", api.defaults.baseURL + "/users/login");
            console.log("With email:", email);

            const res = await api.post("/users/login", {
                email,
                password,
            });

            console.log("Login response:", res.data);

            if (res.data && res.data.accessToken) {
                await setAccessToken(res.data.accessToken);

                // Save user data
                if (res.data.user) {
                    await setUserData({
                        id: res.data.user.id,
                        fullName: res.data.user.fullName,
                        email: res.data.user.email,
                        profileImage: res.data.user.profileImage,
                    });
                }

                navigation.replace("Main");
            } else {
                console.error("No accessToken in response:", res.data);
                Alert.alert("Error", "Invalid response from server");
            }
        }
        catch (error) {
            console.error("Login error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error message:", error.message);

            let errorMessage = "Login failed";

            if (error.message === "Network Error" || error.code === "ECONNABORTED") {
                errorMessage = "Cannot connect to server. Please check:\n1. Backend server is running\n2. IP address is correct: " + api.defaults.baseURL;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert("Login Error", errorMessage);
        }
    }

    return (
        <View className="flex-1 justify-center px-6 bg-primary">
            <Text className="text-3xl font-bold text-white mb-8 text-center">Login</Text>

            <TextInput
                className="bg-dark-100 text-white p-4 rounded-lg mb-4"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#8B92B4"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                className="bg-dark-100 text-white p-4 rounded-lg mb-6"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#8B92B4"
                secureTextEntry
            />

            <TouchableOpacity
                className="bg-accent p-4 rounded-lg mb-4"
                onPress={handleLogin}
            >
                <Text className="text-white text-center font-bold text-lg">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text className="text-light-200 text-center">
                    Don't have an account? <Text className="text-accent font-bold">Register</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}
