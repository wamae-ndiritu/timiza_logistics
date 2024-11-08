import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/users";
import deliveryReducer from "./slices/deliverySlices";
import vehicleReducer from "./slices/vehicleSlices";
import tripReducer from "./slices/tripSlices";
import globalReducer from "./slices/globalSlices";
import errorMiddleware from "./middleware/errorMiddleware";
import locationReducer from "./slices/locationSlices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    delivery: deliveryReducer,
    vehicle: vehicleReducer,
    trip: tripReducer,
    global: globalReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(errorMiddleware),
});
