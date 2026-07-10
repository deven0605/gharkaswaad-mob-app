import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Kitchen {
  id: string;
  name: string;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  etaMinMinutes: number;
  etaMaxMinutes: number;
  isOpen: boolean;
  isVeg: boolean;
  featuredDish?: string | null;
}

export interface FoodItem {
  id: string;
  name: string;
  imageUrl: string | null;
  kitchenId: string;
  kitchenName: string;
  subtitle: string;
}

export interface SearchResults {
  kitchens: Kitchen[];
  foodItems: FoodItem[];
}

export type KitchenSortOption = 'relevance' | 'rating' | 'distance' | 'deliveryTime';

export interface GetKitchensParams {
  lat: number;
  lng: number;
  radiusKm?: number;
  veg?: boolean;
  minRating?: number;
  maxEtaMinutes?: number;
  openNow?: boolean;
  sort?: KitchenSortOption;
}

export interface SearchKitchensParams {
  q: string;
  lat: number;
  lng: number;
  radiusKm?: number;
}

export interface GetKitchenDetailsParams {
  id: string;
  lat: number;
  lng: number;
}

export interface MealTypeOption {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

export interface MenuSlot {
  vegetables: string[];
  chapatiCount: number;
  riceType: string;
  riceCount: number;
  dal: string;
}

export interface DayMenu {
  date: string;
  lunch: MenuSlot;
  dinner: MenuSlot;
}

export interface KitchenMenu {
  hasActivePlan: boolean;
  mealTypes: MealTypeOption[];
  days: DayMenu[];
}

// ── Backend response shapes (vendor-service's KitchenCardResponse / FoodItemResult) ─

interface KitchenCardDto {
  id: string;
  name: string;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  etaMinMinutes: number;
  etaMaxMinutes: number;
  isOpen: boolean;
  isVeg: boolean;
  featuredDish: string | null;
}

interface FoodItemDto {
  kitchenId: string;
  kitchenName: string;
  imageUrl: string | null;
  itemName: string;
  subtitle: string;
}

interface SearchResultsDto {
  kitchens: KitchenCardDto[];
  foodItems: FoodItemDto[];
}

const toKitchen = (dto: KitchenCardDto): Kitchen => ({ ...dto });

const toFoodItem = (dto: FoodItemDto): FoodItem => ({
  id: `${dto.kitchenId}-${dto.itemName}`,
  name: dto.itemName,
  imageUrl: dto.imageUrl,
  kitchenId: dto.kitchenId,
  kitchenName: dto.kitchenName,
  subtitle: dto.subtitle,
});

// KitchenSort.fromParam (vendor-service) does value.toUpperCase().replace('-', '_'),
// so multi-word options must be sent kebab-case to land on DELIVERY_TIME.
const SORT_PARAM: Record<KitchenSortOption, string> = {
  relevance: 'relevance',
  rating: 'rating',
  distance: 'distance',
  deliveryTime: 'delivery-time',
};

// fetchBaseQuery passes params straight into `new URLSearchParams(...)`, which
// stringifies `undefined` as the literal text "undefined" — strip them first.
function omitUndefined<T extends Record<string, unknown>>(params: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(params) as (keyof T)[]) {
    if (params[key] !== undefined) out[key] = params[key];
  }
  return out;
}

// ── API slice ────────────────────────────────────────────────────────────────

export const kitchenApi = createApi({
  reducerPath: 'kitchenApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Kitchen'],
  endpoints: builder => ({

    // GET /api/kitchens (S08 Home) — FR-3.1/3.2
    getKitchens: builder.query<Kitchen[], GetKitchensParams>({
      query: ({ lat, lng, radiusKm, veg, minRating, maxEtaMinutes, openNow, sort }) => ({
        url: '/kitchens',
        params: omitUndefined({
          lat,
          lng,
          radiusKm,
          veg,
          minRating,
          maxEtaMinutes,
          openNow,
          sort: sort ? SORT_PARAM[sort] : undefined,
        }),
      }),
      transformResponse: (response: { data: KitchenCardDto[] }) => response.data.map(toKitchen),
      providesTags: result =>
        result
          ? [...result.map(k => ({ type: 'Kitchen' as const, id: k.id })), { type: 'Kitchen' as const, id: 'LIST' }]
          : [{ type: 'Kitchen' as const, id: 'LIST' }],
    }),

    // GET /api/kitchens/{id} (Kitchen Detail) — FR-3.1
    getKitchenDetails: builder.query<Kitchen, GetKitchenDetailsParams>({
      query: ({ id, lat, lng }) => ({
        url: `/kitchens/${id}`,
        params: { lat, lng },
      }),
      transformResponse: (response: { data: KitchenCardDto }) => toKitchen(response.data),
      providesTags: (_result, _error, { id }) => [{ type: 'Kitchen' as const, id }],
    }),

    // GET /api/kitchens/{id}/menu (Kitchen Detail menu, S10) — vendor-service's KitchenDiscoveryController
    getKitchenMenu: builder.query<KitchenMenu, string>({
      query: kitchenId => `/kitchens/${kitchenId}/menu`,
      transformResponse: (response: { data: KitchenMenu }) => response.data,
      providesTags: (_result, _error, kitchenId) => [{ type: 'Kitchen' as const, id: `${kitchenId}-menu` }],
    }),

    // GET /api/search (S09 Search) — FR-3.5/3.6
    searchKitchens: builder.query<SearchResults, SearchKitchensParams>({
      query: ({ q, lat, lng, radiusKm }) => ({
        url: '/search',
        params: omitUndefined({ q, lat, lng, radiusKm }),
      }),
      transformResponse: (response: { data: SearchResultsDto }) => ({
        kitchens: response.data.kitchens.map(toKitchen),
        foodItems: response.data.foodItems.map(toFoodItem),
      }),
    }),

  }),
});

export const {
  useGetKitchensQuery,
  useGetKitchenDetailsQuery,
  useGetKitchenMenuQuery,
  useLazySearchKitchensQuery,
} = kitchenApi;
