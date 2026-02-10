import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import api from "../app/services/api";
import { setAccessToken } from "../app/utils/token";

export default function RegisterScreen({ navigation }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            console.log("Attempting registration...");

            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("password", password);

            const res = await api.post("/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Registration response:", res.data);

            if (res.data && res.data.accessToken) {
                await setAccessToken(res.data.accessToken);
                navigation.replace("Main");
            } else {
                Alert.alert("Error", "Invalid response from server");
            }
        } catch (error) {
            console.error("Registration error:", error);
            console.error("Error response:", error.response?.data);

            const errorMessage = error.response?.data?.message || error.message || "Registration failed";
            Alert.alert("Registration Error", errorMessage);
        }
    };

    return (
        <View className="flex-1 justify-center px-6 bg-primary">
            <Text className="text-3xl font-bold text-white mb-8 text-center">Register</Text>

            <TextInput
                className="bg-dark-100 text-white p-4 rounded-lg mb-4"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor="#8B92B4"
            />

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
                onPress={handleRegister}
            >
                <Text className="text-white text-center font-bold text-lg">Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-light-200 text-center">
                    Already have an account? <Text className="text-accent font-bold">Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}
