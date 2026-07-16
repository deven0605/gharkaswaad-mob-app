import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import KitchenDetailScreen from '../screens/KitchenDetailScreen';
import MenuDetailsScreen from '../screens/MenuDetailsScreen';
import ThaliCustomizeScreen from '../screens/ThaliCustomizeScreen';
import CartScreen from '../screens/CartScreen';
import SelectAddressScreen from '../screens/SelectAddressScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import PlaceOrderScreen from '../screens/PlaceOrderScreen';
import OrderPlacedScreen from '../screens/OrderPlacedScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="KitchenDetail" component={KitchenDetailScreen} />
      <Stack.Screen name="MenuDetails" component={MenuDetailsScreen} />
      <Stack.Screen
        name="ThaliCustomize"
        component={ThaliCustomizeScreen}
        options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="SelectAddress" component={SelectAddressScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="Favourites" component={FavouritesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
