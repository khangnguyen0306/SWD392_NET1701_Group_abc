import { flowerApi } from "../services/flowerApi";
import flowerReducer from "../slices/flower.slice";
import { productAPI } from "../services/productAPI";
import ProductReducer from "../slices/product.slice";
import { userAPI } from "../services/userAPI";
import UserReducer from "../slices/user.slice";
import { authApi } from "../services/authAPI";
import AuthReducer from "../slices/auth.slice";
import { postAPI } from "../services/postAPI";
import postReducer from "../slices/post.slice";
import { exchangeAPI } from "../services/exchangeAPI";
import exchangeReducer from "../slices/exchange.slice";
// import { chatAPI } from "../services/chatAPI";
import chatReducer from "../slices/chat.slice";
import { appealApi } from "../services/appealAPI";
import appealReducer from "../slices/appeal.slice";
import NotiReducer from "../slices/notification.slice";

import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Using localStorage

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, flowerReducer);
const ProductPerisReducer = persistReducer(persistConfig, ProductReducer);
const UserPerisReducer = persistReducer(persistConfig, UserReducer);
const AuthPerisReducer = persistReducer(persistConfig, AuthReducer);
const PostPerisReducer = persistReducer(persistConfig, postReducer);
const ExchangePerisReducer = persistReducer(persistConfig, exchangeReducer);
const ChatPerisReducer = persistReducer(persistConfig, chatReducer);
const AppealPerisReducer = persistReducer(persistConfig, appealReducer);
const NotificationReducer = persistReducer(persistConfig, NotiReducer);

export const store = configureStore({
  reducer: {
    [flowerApi.reducerPath]: flowerApi.reducer,
    flower: persistedReducer,
    [productAPI.reducerPath]: productAPI.reducer,
    product: ProductPerisReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    user: UserPerisReducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: AuthPerisReducer,
    [postAPI.reducerPath]: postAPI.reducer,
    post: PostPerisReducer,
    [exchangeAPI.reducerPath]: exchangeAPI.reducer,
    exchange: ExchangePerisReducer,
    chat: ChatPerisReducer,
    [appealApi.reducerPath]: appealApi.reducer,
    appeal: AppealPerisReducer,
    notifications:NotificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      flowerApi.middleware,
      productAPI.middleware,
      userAPI.middleware,
      authApi.middleware,
      postAPI.middleware,
      exchangeAPI.middleware,
      appealApi.middleware,
    ),
});

export const Persister = persistStore(store);
