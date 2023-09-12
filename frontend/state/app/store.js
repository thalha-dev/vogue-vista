import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import shoeReducer from "../slice/shoeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    shoe: shoeReducer,
  },
});
