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
};

export type MainTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};
