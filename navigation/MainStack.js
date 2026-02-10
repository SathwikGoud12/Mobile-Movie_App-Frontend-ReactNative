import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import MovieDetailsScreen from "../screens/MovieDetailsScreen";

const Stack = createNativeStackNavigator();

export default function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
                name="MovieDetails"
                component={MovieDetailsScreen}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#0A0E27",
                    },
                    headerTintColor: "#fff",
                    headerTitle: "",
                }}
            />
        </Stack.Navigator>
    );
}
