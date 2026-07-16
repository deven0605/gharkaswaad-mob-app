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

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type SaveLocationRequest = DeliveryLocation;

// Shape actually returned/accepted by customer-service (uses lat/lng, no city/state/etc.)
interface CustomerLocationDto {
  lat: number;
  lng: number;
  address: string;
}

const toDeliveryLocation = (dto: CustomerLocationDto): DeliveryLocation => ({
  latitude: dto.lat,
  longitude: dto.lng,
  address: dto.address,
});

export interface PlaceSuggestion {
  placeId: string;
  name: string;
  subtitle: string;
  latitude?: number;
  longitude?: number;
}

// Mirrors customer-service's Address entity / AddressRequest / AddressResponse exactly
// (SRS §8 Address data model) — flat structured fields, not a pre-composed string.
export type AddressLabel = 'HOME' | 'WORK' | 'OTHER';

export interface Address {
  id: string;
  label: AddressLabel;
  flatNo: string;
  building?: string;
  street: string;
  area: string;
  landmark?: string;
  city: string;
  pinCode: string;
  lat?: number;
  lng?: number;
  defaultAddress: boolean;
}

export type CreateAddressRequest = Omit<Address, 'id' | 'defaultAddress'> & {
  defaultAddress?: boolean;
};

export type UpdateAddressRequest = CreateAddressRequest;

// ── API slice ────────────────────────────────────────────────────────────────

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile', 'Location', 'Address'],
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

    // ── Location (S06 / S07) ─────────────────────────────────────────────────

    saveLocation: builder.mutation<DeliveryLocation, SaveLocationRequest>({
      query: body => ({
        url: '/customer/location',
        method: 'POST',
        body: { lat: body.latitude, lng: body.longitude, address: body.address },
      }),
      transformResponse: (response: { data: CustomerLocationDto }) => toDeliveryLocation(response.data),
      invalidatesTags: ['Location'],
    }),

    getLocation: builder.query<DeliveryLocation, void>({
      query: () => '/customer/location',
      transformResponse: (response: { data: CustomerLocationDto }) => toDeliveryLocation(response.data),
      providesTags: ['Location'],
    }),

    searchLocation: builder.query<PlaceSuggestion[], string>({
      query: q => ({
        url: '/customer/location/search',
        params: { q },
      }),
      transformResponse: (response: { data: PlaceSuggestion[] }) => response.data,
    }),

    // ── Addresses ────────────────────────────────────────────────────────────

    getAddresses: builder.query<Address[], void>({
      query: () => '/customer/addresses',
      transformResponse: (response: { data: Address[] }) => response.data,
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Address' as const, id })),
              { type: 'Address' as const, id: 'LIST' },
            ]
          : [{ type: 'Address' as const, id: 'LIST' }],
    }),

    addAddress: builder.mutation<Address, CreateAddressRequest>({
      query: body => ({
        url: '/customer/addresses',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: Address }) => response.data,
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),

    updateAddress: builder.mutation<Address, { id: string; body: UpdateAddressRequest }>({
      query: ({ id, body }) => ({
        url: `/customer/addresses/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { data: Address }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Address', id }, { type: 'Address', id: 'LIST' }],
    }),

    deleteAddress: builder.mutation<void, string>({
      query: id => ({
        url: `/customer/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Address', id }, { type: 'Address', id: 'LIST' }],
    }),

    setDefaultAddress: builder.mutation<Address, string>({
      query: id => ({
        url: `/customer/addresses/${id}/default`,
        method: 'POST',
      }),
      transformResponse: (response: { data: Address }) => response.data,
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),

  }),
});

export const {
  useCreateProfileMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSaveLocationMutation,
  useGetLocationQuery,
  useLazySearchLocationQuery,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = customerApi;
