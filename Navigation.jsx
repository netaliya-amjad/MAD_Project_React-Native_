import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginSignupChoiceScreen from './screens/LoginSignupChoiceScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';

// Nail Art & Booking
import NailArtDesignScreen from './screens/NailArtDesignScreen';
import BookingScreen from './screens/BookingScreen';
import ThankyouScreen from './screens/ThankyouScreen';

// 🛍️ Nail Paint Shopping
import ShoppingScreen from './screens/ShoppingScreen';
import OrderScreen from './screens/OrderScreen';
import GreetingsScreen from './screens/GreetingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = ({ route }) => {
  const user = route.params?.user;
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShoppingScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppStack = () => (
  <Stack.Navigator initialRouteName="Welcome">
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoginSignupChoice" component={LoginSignupChoiceScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    <Stack.Screen name="NailArtDesign" component={NailArtDesignScreen} options={{ title: 'Nail Art Designs' }} />
    <Stack.Screen name="BookingScreen" component={BookingScreen} options={{ title: 'Book Appointment' }} />
    <Stack.Screen name="ThankyouScreen" component={ThankyouScreen} options={{ headerShown: false }} />
    <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ title: 'Order Details' }} />
    <Stack.Screen name="GreetingsScreen" component={GreetingsScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const Navigation = () => (
  <NavigationContainer>
    <AppStack />
  </NavigationContainer>
);

export default Navigation;
