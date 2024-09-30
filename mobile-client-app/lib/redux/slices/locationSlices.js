import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  locations: [],
  branches: [],
  currentLocation: null,
  error: null,
  successDelete: false,
  successCreate: false,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    locationActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.successDelete = false;
      state.successCreate = false;
      state.currentLocation = null;
    },
    locationActionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetLocationState: (state) => {
      state.error = null;
      state.successDelete = false;
      state.successCreate = false;
      state.currentLocation = null;
    },
    getLocationsSuccess: (state, action) => {
      state.loading = false;
      state.locations = action.payload;
    },
    getBranchesSuccess: (state, action) => {
      state.loading = false;
      state.branches = action.payload;
    },
    createLocationSuccess: (state) => {
      state.loading = false;
      state.successCreate = true;
    },
    createBranchSuccess: (state) => {
      state.loading = false;
      state.successCreate = true;
    },
    getLocationDetailsSuccess: (state, action) => {
      state.loading = false;
      state.currentLocation = action.payload;
    },
    deleteLocationBranchSuccess: (state) => {
      state.loading = false;
      state.successDelete = true;
    },
  },
});

export const {
  locationActionStart,
  locationActionFail,
  resetLocationState,
  getLocationsSuccess,
  getBranchesSuccess,
  createLocationSuccess,
  createBranchSuccess,
  deleteLocationBranchSuccess,
  getLocationDetailsSuccess
} = locationSlice.actions;

export default locationSlice.reducer;
