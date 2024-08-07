import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  deliveries: [],
  error: null,
  success: false,
  currentDelivery: null,
};

export const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    deliveryActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    deliveryActionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetDeliveryState: (state) => {
      state.error = null;
      state.success = false;
    },
    createDeliverySuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    getDeliveriesSuccess: (state, action) => {
      state.loading = false;
      state.deliveries = action.payload;
    },
    getDeliverySuccess: (state, action) => {
      state.loading = false;
      state.currentDelivery = action.payload;
    },
    updateDeliverySuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.currentDelivery = action.payload;
    }
  },
});

export const {
    deliveryActionFail,
    deliveryActionStart,
    resetDeliveryState,
    createDeliverySuccess,
    getDeliveriesSuccess,
    getDeliverySuccess,
    updateDeliverySuccess
} = deliverySlice.actions;

export default deliverySlice.reducer;
