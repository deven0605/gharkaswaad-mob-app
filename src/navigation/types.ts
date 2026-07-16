import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Otp: { phone: string };
  CompleteProfile: undefined;
  LocationPermission: undefined;
  SearchLocation: undefined;
  ConfirmLocation: { address?: string; latitude?: number; longitude?: number };
  Home: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  SearchResults: { query?: string } | undefined;
  KitchenDetail: { kitchenId: string };
  MenuDetails: { kitchenId: string; slot?: 'lunch' | 'dinner' };
  ThaliCustomize: { kitchenId: string; mealTypeId: string; slot?: 'lunch' | 'dinner' };
  Cart: undefined;
  SelectAddress: undefined;
  AddAddress: undefined;
  PlaceOrder: undefined;
  OrderPlaced: {
    orderId: string;
    kitchenName: string;
    kitchenImageUrl: string | null;
    itemsSummary: string;
    addressLabel: string;
    addressText: string;
    etaText: string;
    placedAt: string;
  };
  OrderTracking: {
    orderId: string;
    kitchenName: string;
    addressText: string;
    etaText: string;
    placedAt: string;
  };
  Favourites: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};
