import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import shoeReducer from "../slice/shoeSlice";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "user",
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    shoe: shoeReducer,
  },
  middleware: [thunk],
});

export const persistor = persistStore(store);
