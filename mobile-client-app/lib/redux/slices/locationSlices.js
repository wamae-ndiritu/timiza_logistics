import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  locations: [],
  branches: [],
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
    },
    locationActionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetLocationState: (state) => {
      state.error = null;
      state.successDelete = false;
      state.successCreate = false;
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
  deleteLocationBranchSuccess
} = locationSlice.actions;

export default locationSlice.reducer;
