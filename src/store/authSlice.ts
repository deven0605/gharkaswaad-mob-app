import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveTokens, clearTokens } from '../utils/secureStorage';

interface AuthState {
  phone: string;
  accessToken: string | null;
  refreshToken: string | null;
  isNewUser: boolean;
  locationSaved: boolean;
}

const initialState: AuthState = {
  phone: '',
  accessToken: null,
  refreshToken: null,
  isNewUser: false,
  locationSaved: false,
};

interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },

    setCredentials(state, action: PayloadAction<TokenPayload>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isNewUser = action.payload.isNewUser;
      // Persist to Keychain / Keystore (fire-and-forget, does not block render)
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
    },

    // Called on app start after loading tokens from secure storage
    restoreTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    // Issued by the re-auth middleware when a silent token refresh succeeds
    refreshCredentials(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
    },

    setLocationSaved(state) {
      state.locationSaved = true;
    },

    logout(state) {
      clearTokens();
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPhone,
  setCredentials,
  restoreTokens,
  refreshCredentials,
  setLocationSaved,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
