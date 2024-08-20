import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/users";
import deliveryReducer from "./slices/deliverySlices";
import vehicleReducer from "./slices/vehicleSlices";
import tripReducer from "./slices/tripSlices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    delivery: deliveryReducer,
    vehicle: vehicleReducer,
    trip: tripReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check middleware
    }),
});
