import { Platform } from 'react-native';

// Android emulator reaches the host machine via 10.0.2.2; iOS simulator uses localhost.
const DEV_HOST = Platform.OS === 'android' ? '192.168.1.10' : 'localhost';

export const GATEWAY_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:8080/api`
  : 'https://api.gharkaswaad.com/api';
