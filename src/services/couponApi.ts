import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ValidateCouponRequest {
  code: string;
  subtotal: number;
}

export interface ValidateCouponResult {
  code: string;
  discount: number;
}

interface CouponApiError {
  status: number;
  message: string;
}

// coupon-service (customer_app_specification.md §7 "Coupon Service", POST
// /coupon/validate — FR-12.3/FR-12.4) hasn't been stood up yet. This mocks that
// contract with a hardcoded rule so Cart can apply coupons end-to-end today.
// Swapping to the real service later only means replacing the `queryFn` below with
// `query: ({ code, subtotal }) => ({ url: '/coupon/validate', method: 'POST', body: { code, subtotal } })`
// against baseQueryWithReauth — CartScreen's useValidateCouponMutation call is unaffected.
const HARDCODED_COUPONS: Record<string, number> = {
  TEST5: 5, // flat 5% off, testing only
};

const MOCK_LATENCY_MS = 400;

export const couponApi = createApi({
  reducerPath: 'couponApi',
  baseQuery: fakeBaseQuery<CouponApiError>(),
  endpoints: builder => ({
    validateCoupon: builder.mutation<ValidateCouponResult, ValidateCouponRequest>({
      async queryFn({ code, subtotal }) {
        await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));

        const normalizedCode = code.trim().toUpperCase();
        const discountPercent = HARDCODED_COUPONS[normalizedCode];
        if (!normalizedCode || discountPercent === undefined) {
          return { error: { status: 404, message: 'Invalid or expired coupon code.' } };
        }
        if (subtotal <= 0) {
          return { error: { status: 422, message: 'Add items to your cart before applying a coupon.' } };
        }

        const discount = Math.round(subtotal * (discountPercent / 100));
        return { data: { code: normalizedCode, discount } };
      },
    }),
  }),
});

export const { useValidateCouponMutation } = couponApi;
