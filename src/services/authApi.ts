import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

// ── Request / Response types ────────────────────────────────────────────────

interface SendOtpRequest {
  phone: string;
}

interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ── API slice ────────────────────────────────────────────────────────────────

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({

    sendOtp: builder.mutation<void, SendOtpRequest>({
      query: body => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: body => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    refreshToken: builder.mutation<RefreshResponse, RefreshRequest>({
      query: body => ({
        url: '/auth/customer/refresh',
        method: 'POST',
        body,
      }),
    }),

    logoutUser: builder.mutation<void, { refreshToken: string }>({
      query: body => ({
        url: '/auth/customer/logout',
        method: 'POST',
        body,
      }),
    }),

  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApi;
