import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/users";
import deliveryReducer from "./slices/deliverySlices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    delivery: deliveryReducer,
  },
});
