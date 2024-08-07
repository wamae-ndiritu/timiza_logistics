import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  deliveries: [],
  error: null,
  success: false,
  successDelete: false,
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
      successDelete = false;
    },
    deliveryActionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetDeliveryState: (state) => {
      state.error = null;
      state.success = false;
      state.successDelete = false;
    },
    getDeliveriesStart: (state) => {
      state.deliveries = [];
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
    },
    deleteDeliverySuccess: (state) => {
      state.loading = false;
      state.successDelete = true;
      state.currentDelivery = null;
    }
  },
});

export const {
    deliveryActionFail,
    deliveryActionStart,
    resetDeliveryState,
    getDeliveriesStart,
    createDeliverySuccess,
    getDeliveriesSuccess,
    getDeliverySuccess,
    updateDeliverySuccess,
    deleteDeliverySuccess
} = deliverySlice.actions;

export default deliverySlice.reducer;
