import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { CartLineItem } from '../store/cartSlice';
import { PaymentMethodApiCode } from '../config/paymentMethods';

// ── Types ────────────────────────────────────────────────────────────────────

// order-service's OrderStatus enum (Pending -> Preparing -> Ready -> Dispatched -> Delivered)
export type OrderStatusCode = 'PENDING' | 'PREPARING' | 'READY' | 'DISPATCHED' | 'DELIVERED';

export interface PlaceOrderDeliveryAddress {
  label: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

export interface PlaceOrderRequest {
  kitchenId: string;
  items: CartLineItem[];
  deliveryAddress: PlaceOrderDeliveryAddress;
  paymentMethod: PaymentMethodApiCode;
  couponCode?: string;
  // Only meaningful alongside couponCode — order-service has no coupon-service to
  // validate against yet, so it trusts this figure but clamps it to the subtotal
  // it computes itself. See couponApi.ts for why coupons are still client-side.
  discount?: number;
}

export interface PlacedOrder {
  orderId: string;
  status: OrderStatusCode;
  paymentMethod: PaymentMethodApiCode;
  grandTotal: number;
  placedAt: string;
}

// ── Backend request/response shapes (order-service's OrderController) ─────────
//
// Item/add-on prices are deliberately absent from the wire format: order-service
// re-prices every mealTypeId/addOnId against meal-plan-service's catalog and
// ignores anything a client might submit, so there's nothing to send.

interface AddOnSelectionDto {
  addOnId: string;
  quantity: number;
}

interface OrderItemDto {
  mealTypeId: string;
  quantity: number;
  addOns: AddOnSelectionDto[];
}

interface PlaceOrderBody {
  kitchenId: string;
  items: OrderItemDto[];
  deliveryAddress: PlaceOrderDeliveryAddress;
  paymentMethod: PaymentMethodApiCode;
  couponCode?: string;
  discount?: number;
}

interface OrderDto {
  id: string;
  status: OrderStatusCode;
  paymentMethod: PaymentMethodApiCode;
  grandTotal: number;
  placedAt: string;
}

const toAddOnDto = (addOn: CartLineItem['addOns'][number]): AddOnSelectionDto => ({
  addOnId: addOn.id,
  quantity: addOn.qty,
});

const toOrderItemDto = (item: CartLineItem): OrderItemDto => ({
  mealTypeId: item.mealTypeId,
  quantity: item.quantity,
  addOns: item.addOns.map(toAddOnDto),
});

const toPlacedOrder = (dto: OrderDto): PlacedOrder => ({
  orderId: dto.id,
  status: dto.status,
  paymentMethod: dto.paymentMethod,
  grandTotal: dto.grandTotal,
  placedAt: dto.placedAt,
});

// ── API slice ────────────────────────────────────────────────────────────────

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Order'],
  endpoints: builder => ({

    // POST /orders (S15 Order Review & Checkout, M7/M8) — order-service's OrderController
    placeOrder: builder.mutation<PlacedOrder, PlaceOrderRequest>({
      query: ({ items, ...rest }) => ({
        url: '/orders',
        method: 'POST',
        body: { ...rest, items: items.map(toOrderItemDto) } satisfies PlaceOrderBody,
      }),
      transformResponse: (response: { data: OrderDto }) => toPlacedOrder(response.data),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

  }),
});

export const { usePlaceOrderMutation } = orderApi;
