import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import favoritesReducer from './favoritesSlice';
import { authApi } from '../services/authApi';
import { customerApi } from '../services/customerApi';
import { kitchenApi } from '../services/kitchenApi';
import { couponApi } from '../services/couponApi';
import { orderApi } from '../services/orderApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    favorites: favoritesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [kitchenApi.reducerPath]: kitchenApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(customerApi.middleware)
      .concat(kitchenApi.middleware)
      .concat(couponApi.middleware)
      .concat(orderApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
