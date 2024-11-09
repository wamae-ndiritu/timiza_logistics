import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userReducer from "./slices/users";
import deliveryReducer from "./slices/deliverySlices";
import vehicleReducer from "./slices/vehicleSlices";
import tripReducer from "./slices/tripSlices";
import globalReducer from "./slices/globalSlices";
import errorMiddleware from "./middleware/errorMiddleware";
import locationReducer from "./slices/locationSlices";

const rootReducer = combineReducers({
  user: userReducer,
  delivery: deliveryReducer,
  vehicle: vehicleReducer,
  trip: tripReducer,
  global: globalReducer,
  location: locationReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["user"], // Only persist the user slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorMiddleware),
});

export const persistor = persistStore(store);
