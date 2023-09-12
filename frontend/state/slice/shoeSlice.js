import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosBase/api";
import { refreshAccessTokenSubsequent } from "./userSlice";

const initialState = {
  allShoes: [],
  errorMessage: null,
  errorMessageFrom: "",
  //possible values: [ idle, loading, success, failed ]
  allShoesStatus: "idle",
};

export const getAllShoes = createAsyncThunk(
  "shoe/getAllShoes",
  async (_, { getState, dispatch }) => {
    try {
      const token = getState().user.token;

      const response = await api.get("/api/shoes/getAllShoes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessTokenSubsequent());

          const token = getState().user.token;
          const response = await api.get("/api/shoes/getAllShoes", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          return response.data;
        } catch (refreshError) {
          const errorMessage = refreshError.response?.data?.error;
          if (errorMessage) {
            throw new Error(errorMessage);
          }
          throw refreshError;
        }
      } else {
        const errorMessage = error.response?.data?.error;
        if (errorMessage) {
          throw new Error(errorMessage);
        }
        throw error;
      }
    }
  },
);

const shoeSlice = createSlice({
  name: "shoe",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllShoes.pending, (state) => {
        state.allShoesStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(getAllShoes.fulfilled, (state, action) => {
        state.allShoes = action.payload?.products;
        state.allShoesStatus = "success";
        state.errorMessage = null;
      })
      .addCase(getAllShoes.rejected, (state, action) => {
        state.allShoesStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "getAllShoes";
      });
  },
});

export const getAllShoesCB = (state) => state.shoe.allShoes;
export const getAllShoesStatusCB = (state) => state.shoe.allShoesStatus;

export default shoeSlice.reducer;
