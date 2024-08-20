import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stats: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    getStatsSuccess: (state, action) => {
        state.stats = action.payload;
    }
  },
});

export const {
    getStatsSuccess
} = globalSlice.actions;

export default globalSlice.reducer;
