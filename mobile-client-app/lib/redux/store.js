import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/users";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
