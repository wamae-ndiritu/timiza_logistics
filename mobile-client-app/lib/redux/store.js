import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/users";
import deliveryReducer from "./slices/deliverySlices";
import vehicleReducer from "./slices/vehicleSlices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    delivery: deliveryReducer,
    vehicle: vehicleReducer,
  },
});
