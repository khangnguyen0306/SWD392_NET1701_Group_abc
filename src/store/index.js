import { flowerApi } from "../services/flowerApi";
import flowerReducer from "../slices/flower.slice";
import { productAPI } from "../services/productAPI";
import ProductReducer from "../slices/product.slice";
import { userAPI } from "../services/userAPI";
import UserReducer from "../slices/user.slice";

import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage

const persistConfig = {
  key: "root",
  storage,
};
// Define the Reducers that will always be present in the application
const staticReducers = {
  theme: "theme",
};

const persistedReducer = persistReducer(persistConfig, flowerReducer);
const ProductPerisReducer = persistReducer(persistConfig, ProductReducer);
const UserPerisReducer = persistReducer(persistConfig, UserReducer);
export const store = configureStore({
  reducer: {
    [flowerApi.reducerPath]: flowerApi.reducer,
    flower: persistedReducer,
    [productAPI.reducerPath]: productAPI.reducer,
    product: ProductPerisReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    user: UserPerisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      flowerApi.middleware,
      productAPI.middleware,
      userAPI.middleware,
    ),
});

// Add a dictionary to keep track of the registered async reducers
store.asyncReducers = {};

// Create an inject reducer function
// This function adds the async reducer, and creates a new combined reducer
export const injectReducer = (key, asyncReducer) => {
  store.asyncReducers[key] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
  return asyncReducer;
};

function createReducer(asyncReducers = {}) {
  if (Object.keys(asyncReducers).length === 0) {
    return (state) => state;
  } else {
    return combineReducers({
      ...staticReducers,
      ...asyncReducers,
    });
  }
}

export const Persister = persistStore(store);
