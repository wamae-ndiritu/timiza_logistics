import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  vehicles: [],
  currentVehicle: null,
  error: null,
  success: false,
  successDelete: false,
  successUpdate: false,
};

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    vehicleActionStart: (state) => {
        state.loading = true;
        state.success = false;
        state.successDelete = false;
        state.successUpdate = false;
        state.error = null;
    },
    vehicleActionFail: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    resetVehicleState: (state) => {
        state.success = false;
        state.successDelete= false;
        state.successUpdate = false;
        state.error = null;
    },
    registerVehicleSuccess: (state) => {
        state.loading = false;
        state.success = true;
    },
    getVehiclesSuccess: (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
    },
    getVehicleSuccess: (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
    },
    updateVehicleSuccess: (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
        state.successUpdate = true;
    },
    deleteVehicleSuccess: (state) => {
        state.loading = false;
        state.successDelete = true;
    }
  },
});

export const {
    vehicleActionStart,
    vehicleActionFail,
    resetVehicleState,
    registerVehicleSuccess,
    getVehiclesSuccess,
    getVehicleSuccess,
    updateVehicleSuccess,
    deleteVehicleSuccess
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
