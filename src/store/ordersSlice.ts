import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartLineItem } from './cartSlice';

export interface OrderRecord {
  orderId: string;
  kitchenId: string;
  kitchenName: string;
  kitchenImageUrl: string | null;
  items: CartLineItem[];
  grandTotal: number;
  addressLabel: string;
  addressText: string;
  etaText: string;
  placedAt: string;
}

interface OrdersState {
  orders: OrderRecord[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<OrderRecord>) {
      state.orders.unshift(action.payload);
    },
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
