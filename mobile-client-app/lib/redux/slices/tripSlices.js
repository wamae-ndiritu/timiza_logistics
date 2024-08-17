import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  trips: [],
  currentTrip: null,
  error: null,
  success: false,
  successDelete: false,
  successUpdate: false,
  completed: false,
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
      state.completed = false;
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
      state.completed = false;
    },
    createTripSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    completeTripSuccess: (state) => {
      state.loading = false;
      state.completed = true;
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
  getTripSuccess,
  completeTripSuccess,
} = tripSlice.actions;

export default tripSlice.reducer;
