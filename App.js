import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthStack from "./navigation/AuthStack";
import MainStack from "./navigation/MainStack";

import "./app/globals.css";

const Stack = createNativeStackNavigator();

export default function App() {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            setInitialRoute(token ? "Main" : "Auth");
        } catch (error) {
            console.error("Error checking auth:", error);
            setInitialRoute("Auth");
        }
    };

    if (!initialRoute) {
        return null; // Loading
    }

    return (
        <>
            <StatusBar hidden={true} />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={initialRoute}
                    screenOptions={{ headerShown: false }}
                >
                    <Stack.Screen name="Auth" component={AuthStack} />
                    <Stack.Screen name="Main" component={MainStack} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
