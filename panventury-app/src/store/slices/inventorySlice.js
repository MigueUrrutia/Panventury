import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventory: [],
  loading: false,
  error: null,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    fetchInventoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action) => {
      state.loading = false;
      state.inventory = action.payload;
    },
    fetchInventoryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateInventory: (state, action) => {
      const index = state.inventory.findIndex(i => i.producto.id === action.payload.producto.id);
      if (index !== -1) {
        state.inventory[index] = action.payload;
      }
    },
  },
});

export const {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  updateInventory,
} = inventorySlice.actions;

export default inventorySlice.reducer; 