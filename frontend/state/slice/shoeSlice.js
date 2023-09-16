import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosBase/api";
import { refreshAccessTokenSubsequent } from "./userSlice";

const initialState = {
  allShoes: [],
  wishList: [],
  shoeBrands: [],
  shoeSizes: [],
  shoeColors: [],
  errorMessage: null,
  errorMessageFrom: "",
  //possible values: [ idle, loading, success, failed ]
  allShoesStatus: "idle",
  wishListStatus: "idle",
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

export const getAllShoesFromWishList = createAsyncThunk(
  "shoe/getAllShoesFromWishList",
  async (_, { getState, dispatch }) => {
    try {
      const token = getState().user.token;
      const individualId = getState().user.individualId;

      const response = await api.get(
        `/api/shoes/getAllShoesFromWishList/${individualId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessTokenSubsequent());

          const token = getState().user.token;
          const individualId = getState().user.individualId;

          const response = await api.get(
            `/api/shoes/getAllShoesFromWishList/${individualId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            },
          );

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
        state.allShoes = action.payload?.products || [];

        // Extracting unique brands, colors, and sizes
        const brandsSet = new Set();
        const colorsSet = new Set();
        const sizesSet = new Set();

        action.payload?.products?.forEach((shoe) => {
          if (shoe?.shoeBrand) {
            brandsSet.add(shoe.shoeBrand);
          }
          if (shoe?.shoeColor) {
            colorsSet.add(shoe.shoeColor);
          }
          if (shoe?.shoeSize) {
            sizesSet.add(shoe.shoeSize);
          }
        });

        state.shoeBrands = [...brandsSet];
        state.shoeColors = [...colorsSet];
        state.shoeSizes = [...sizesSet].sort();

        state.allShoesStatus = "success";
        state.errorMessage = null;
      })
      .addCase(getAllShoes.rejected, (state, action) => {
        state.allShoesStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "getAllShoes";
      })
      //---------------------------------------------------------------------------
      .addCase(getAllShoesFromWishList.pending, (state) => {
        state.wishListStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(getAllShoesFromWishList.fulfilled, (state, action) => {
        state.wishList = action.payload?.wishListItems || [];
        state.wishListStatus = "success";
        state.errorMessage = null;
      })
      .addCase(getAllShoesFromWishList.rejected, (state, action) => {
        state.wishListStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "getAllShoesFromWishList";
      });
  },
});

export const allShoesCB = (state) => state.shoe.allShoes;
export const wishListCB = (state) => state.shoe.wishList;
export const allShoesStatusCB = (state) => state.shoe.allShoesStatus;
export const wishListStatusCB = (state) => state.shoe.wishListStatus;
export const getShoeBrandsCB = (state) => state.shoe.shoeBrands;
export const getShoeColorsCB = (state) => state.shoe.shoeColors;
export const getshoeSizesCB = (state) => state.shoe.shoeSizes;

export default shoeSlice.reducer;
