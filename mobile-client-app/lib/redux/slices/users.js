import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
  error: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userActionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    userActionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogin: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    }
  },
});


export const { userActionStart, userActionFail, userLogin } = userSlice.actions;

export default userSlice.reducer;
