import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import LocationPermissionScreen from '../screens/LocationPermissionScreen';
import SearchLocationScreen from '../screens/SearchLocationScreen';
import ConfirmLocationScreen from '../screens/ConfirmLocationScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="SearchLocation" component={SearchLocationScreen} />
      <Stack.Screen name="ConfirmLocation" component={ConfirmLocationScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
