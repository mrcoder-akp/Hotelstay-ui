import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import hotelReducer from './slices/hotelSlice';
import cartReducer from './slices/cartSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    cart: cartReducer,
    bookings: bookingReducer,
  },
});