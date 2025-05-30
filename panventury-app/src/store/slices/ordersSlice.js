import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index].estado = action.payload.estado;
      }
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  addOrder,
  updateOrderStatus,
} = ordersSlice.actions;

export default ordersSlice.reducer; 