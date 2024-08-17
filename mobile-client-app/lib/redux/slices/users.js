import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userData: null,
  error: null,
  success: false,
  updateSuccess: false,
  usersList: [],
  profile: null,
  resetPass: false,
  activeUser: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userActionStart: (state) => {
      state.loading = true;
      state.error = null;
      state.updateSuccess = false;
      state.resetPass = false;
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
    userUpdate: (state) => {
      state.loading = false;
      state.updateSuccess = true;
    },
    forgotPassReqSuccess: (state, action) => {
      state.loading = false;
      state.resetPass = true;
      state.activeUser = action.payload;
    },
    resetUserState: (state) => {
      state.error = null;
      state.success = false;
      state.updateSuccess = false;
      state.resetPass = false;
    },
    getProfile: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    logoutUser: (state) => {
      state.userData = null;
    }
  },
});


export const { userActionStart, userActionFail, userLogin, userRegister, resetUserState, userList, logoutUser, userUpdate, getProfile, forgotPassReqSuccess } = userSlice.actions;

export default userSlice.reducer;
