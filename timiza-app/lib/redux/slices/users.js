import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userData: null,
  error: null,
  success: false,
  updateSuccess: false,
  deleteSuccess: false,
  usersList: [],
  profile: null,
  loaders: [],
  resetPass: false,
  activeUser: null,
  currentTruck: null,
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
      state.deleteSuccess = false;
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
    userDeleteSuccess: (state) => {
      state.loading = false;
      state.deleteSuccess = true;
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
    fetchLoaders: (state, action) => {
      state.loading = false;
      state.loaders = action.payload;
    },
    getUserTruck: (state, action) => {
      state.loading = false;
      state.currentTruck = action.payload;
    },
    logoutUser: (state) => {
      state.userData = null;
    },
  },
});


export const { userActionStart, userActionFail, userLogin, userRegister, resetUserState, userList, logoutUser, userUpdate, userDeleteSuccess, getProfile, forgotPassReqSuccess, getUserTruck, fetchLoaders } = userSlice.actions;

export default userSlice.reducer;
