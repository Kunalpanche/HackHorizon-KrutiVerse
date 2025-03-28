import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "../screens/AuthScreen";  // Ensure correct path
import BottomTabs from "./BottomTabs";
import PlantDetailsScreen from "../screens/PlantDetailsScreen";  // Import the missing screen
import DoctorProfileScreen from "../screens/DoctorProfileScreen";
import DoctorsScreen from "../screens/DoctorsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import QuizScreen from "../screens/QuizScreen";
const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("isLoggedIn");
        setIsAuthenticated(value === "true");
      } catch (error) {
        console.error("Failed to check login status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="MainTabs" component={BottomTabs} />
      ) : (
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
      )}
       <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
       <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="DoctorsScreen" component={DoctorsScreen} />
    </Stack.Navigator>
  );
}
