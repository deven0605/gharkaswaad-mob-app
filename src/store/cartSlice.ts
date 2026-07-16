import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartAddOn {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface CartLineItem {
  id: string;
  mealTypeId: string;
  name: string;
  imageUrl: string | null;
  basePrice: number;
  addOns: CartAddOn[];
  quantity: number;
}

export interface CartCoupon {
  code: string;
  discount: number;
}

interface CartState {
  kitchenId: string | null;
  kitchenName: string;
  kitchenImageUrl: string | null;
  items: CartLineItem[];
  coupon: CartCoupon | null;
}

const initialState: CartState = {
  kitchenId: null,
  kitchenName: '',
  kitchenImageUrl: null,
  items: [],
  coupon: null,
};

interface AddItemPayload {
  kitchenId: string;
  kitchenName: string;
  kitchenImageUrl: string | null;
  mealTypeId: string;
  name: string;
  imageUrl: string | null;
  basePrice: number;
  addOns: CartAddOn[];
  quantity: number;
}

function lineItemId(mealTypeId: string, addOns: CartAddOn[]): string {
  const signature = addOns
    .filter(a => a.qty > 0)
    .map(a => `${a.id}:${a.qty}`)
    .sort()
    .join(',');
  return `${mealTypeId}|${signature}`;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { kitchenId, kitchenName, kitchenImageUrl, mealTypeId, name, imageUrl, basePrice, addOns, quantity } =
        action.payload;

      // Cart holds items from a single kitchen at a time — switching kitchens starts fresh.
      if (state.kitchenId && state.kitchenId !== kitchenId) {
        state.items = [];
      }
      state.kitchenId = kitchenId;
      state.kitchenName = kitchenName;
      state.kitchenImageUrl = kitchenImageUrl;

      const activeAddOns = addOns.filter(a => a.qty > 0);
      const id = lineItemId(mealTypeId, activeAddOns);
      const existing = state.items.find(item => item.id === id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ id, mealTypeId, name, imageUrl, basePrice, addOns: activeAddOns, quantity });
      }
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.items.length === 0) {
        state.kitchenId = null;
        state.kitchenName = '';
        state.kitchenImageUrl = null;
        state.coupon = null;
      }
    },

    incrementItem(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decrementItem(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    applyCoupon(state, action: PayloadAction<CartCoupon>) {
      state.coupon = action.payload;
    },

    restoreCart(
      state,
      action: PayloadAction<{
        kitchenId: string;
        kitchenName: string;
        kitchenImageUrl: string | null;
        items: CartLineItem[];
      }>,
    ) {
      state.kitchenId = action.payload.kitchenId;
      state.kitchenName = action.payload.kitchenName;
      state.kitchenImageUrl = action.payload.kitchenImageUrl;
      state.items = action.payload.items;
      state.coupon = null;
    },

    removeCoupon(state) {
      state.coupon = null;
    },

    clearCart() {
      return initialState;
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementItem,
  decrementItem,
  applyCoupon,
  removeCoupon,
  restoreCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
