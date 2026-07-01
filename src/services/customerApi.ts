import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CustomerProfile {
  id: string;
  mobileNumber: string;
  fullName: string;
  email: string;
  profilePicUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileRequest {
  fullName: string;
  email: string;
  profilePicUrl?: string;
}

export type UpdateProfileRequest = Partial<CreateProfileRequest>;

// ── API slice ────────────────────────────────────────────────────────────────

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile'],
  endpoints: builder => ({

    createProfile: builder.mutation<CustomerProfile, CreateProfileRequest>({
      query: body => ({
        url: '/customer/profile',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    getProfile: builder.query<CustomerProfile, void>({
      query: () => '/customer/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<CustomerProfile, UpdateProfileRequest>({
      query: body => ({
        url: '/customer/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

  }),
});

export const {
  useCreateProfileMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = customerApi;
