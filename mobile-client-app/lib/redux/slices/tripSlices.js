import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  trips: [],
  currentTrip: null,
  error: null,
  success: false,
  successDelete: false,
  successUpdate: false,
};

export const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    tripActionStart: (state) => {
      state.loading = true;
      state.success = false;
      state.successDelete = false;
      state.successUpdate = false;
      state.error = null;
    },
    tripActionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetTripState: (state) => {
      state.success = false;
      state.successDelete = false;
      state.successUpdate = false;
      state.error = null;
    },
    createTripSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    getTripsSuccess: (state, action) => {
      state.loading = false;
      state.trips = action.payload;
    },
    getTripSuccess: (state, action) => {
      state.loading = false;
      state.currentTrip = action.payload;
    },
  },
});

export const {
  tripActionStart,
  tripActionFail,
  resetTripState,
  createTripSuccess,
  getTripsSuccess,
  getTripSuccess
} = tripSlice.actions;

export default tripSlice.reducer;
