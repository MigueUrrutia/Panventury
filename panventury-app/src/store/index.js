import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import inventoryReducer from './slices/inventorySlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    inventory: inventoryReducer,
    cart: cartReducer,
  },
}); 