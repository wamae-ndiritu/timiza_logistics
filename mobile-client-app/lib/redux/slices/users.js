import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userData: null,
  error: null,
  success: false,
  usersList: [],
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.usersList = [];
    },
    userActionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogin: (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    },
    userRegister: (state) => {
      state.loading = false;
      state.success = true;
    },
    userList: (state, action) => {
      state.loading = false;
      state.usersList = action.payload;
    },
    resetUserState: (state) => {
      state.error = null;
      state.success = false;
    },
    logoutUser: (state) => {
      state.userData = null;
    }
  },
});


export const { userActionStart, userActionFail, userLogin, userRegister, resetUserState, userList, logoutUser } = userSlice.actions;

export default userSlice.reducer;
