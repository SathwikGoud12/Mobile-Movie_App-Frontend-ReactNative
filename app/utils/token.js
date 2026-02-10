import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAccessToken = async () => {
    return await AsyncStorage.getItem("accessToken");
}

export const setAccessToken = async (accessToken) => {
    return await AsyncStorage.setItem("accessToken", accessToken);
}

export const removeAccessToken = async () => {
    return await AsyncStorage.removeItem("accessToken");
}

// User data storage
export const setUserData = async (userData) => {
    try {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

export const getUserData = async () => {
    try {
        const data = await AsyncStorage.getItem("userData");
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
}

export const removeUserData = async () => {
    try {
        await AsyncStorage.removeItem("userData");
    } catch (error) {
        console.error("Error removing user data:", error);
    }
}