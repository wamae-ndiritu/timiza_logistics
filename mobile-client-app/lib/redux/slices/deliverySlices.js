import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  deliveries: [],
  error: null,
  success: false,
};

export const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    deliveryActionStart: (state) => {
      state.loading = true;
      state.error = null;
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
        state.loading = true;
        state.deliveries = action.payload;
    }
  },
});

export const {
    deliveryActionFail,
    deliveryActionStart,
    resetDeliveryState,
    createDeliverySuccess,
    getDeliveriesSuccess
} = deliverySlice.actions;

export default deliverySlice.reducer;
