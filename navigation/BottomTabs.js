import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuizListScreen from "../screens/QuizListScreen";
import QuizScreen from '../screens/QuizScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import Fontisto from '@expo/vector-icons/Fontisto';
const Tab = createBottomTabNavigator();
const QuizStack = createStackNavigator();

function QuizStackNavigator() {
  return (
    <QuizStack.Navigator>
      <QuizStack.Screen name="Quiz List" component={QuizListScreen} />
      <QuizStack.Screen name="Quiz Details" component={QuizScreen} />
    </QuizStack.Navigator>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingVertical: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Marketplace') {
            iconName = 'shopping-bag';
          } 
          
          else if (route.name === 'Doctors') { // Add this condition
            iconName = 'user-plus';
          }else if (route.name === "Quiz") iconName = "book"; 
          else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size || 24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketplace" component={ExploreScreen} />
      <Tab.Screen name="Doctors" component={DoctorsScreen} /> 
      <Tab.Screen name="Quiz" component={QuizStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}