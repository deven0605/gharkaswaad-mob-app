export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Otp: { phone: string };
  CompleteProfile: undefined;
  LocationPermission: undefined;
  SearchLocation: undefined;
  ConfirmLocation: { address?: string };
  Home: undefined;
};
