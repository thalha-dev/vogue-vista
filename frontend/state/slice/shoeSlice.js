import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosBase/api";
import { refreshAccessTokenSubsequent } from "./userSlice";

const initialState = {
  allShoes: [],
  wishList: [],
  cart: [],
  shoeBrands: [],
  shoeSizes: [],
  shoeColors: [],
  singleShoe: {},
  cartTotalAmount: null,
  errorMessage: null,
  errorMessageFrom: "",
  //possible values: [ idle, loading, success, failed ]
  allShoesStatus: "idle",
  wishListStatus: "idle",
  cartStatus: "idle",
  addToWishListStatus: "idle",
  removeFromWishListStatus: "idle",
  singleShoeStatus: "idle",
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

export const addToWishList = createAsyncThunk(
  "shoe/addToWishList",
  async (params, { getState, dispatch }) => {
    const individualId = getState().user.individualId;
    try {
      const response = await api.post(
        "/api/shoes/addToWishList",
        {
          userId: individualId,
          productId: params.productId,
        },
        {
          headers: {
            Authorization: `Bearer ${getState().user.token}`,
          },

          withCredentials: true,
        },
      );

      await dispatch(getAllShoesFromWishList());

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessTokenSubsequent());

          const response = await api.post(
            "/api/shoes/addToWishList",
            {
              userId: individualId,
              productId: params.productId,
            },
            {
              headers: {
                Authorization: `Bearer ${getState().user.token}`,
              },

              withCredentials: true,
            },
          );

          await dispatch(getAllShoesFromWishList());

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

export const removeFromWishList = createAsyncThunk(
  "shoe/removeFromWishList",
  async (params, { getState, dispatch }) => {
    const individualId = getState().user.individualId;
    try {
      const response = await api.post(
        "/api/shoes/removeFromWishList",
        {
          userId: individualId,
          productId: params.productId,
        },
        {
          headers: {
            Authorization: `Bearer ${getState().user.token}`,
          },

          withCredentials: true,
        },
      );

      await dispatch(getAllShoesFromWishList());

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessTokenSubsequent());

          const response = await api.post(
            "/api/shoes/removeFromWishList",
            {
              userId: individualId,
              productId: params.productId,
            },
            {
              headers: {
                Authorization: `Bearer ${getState().user.token}`,
              },

              withCredentials: true,
            },
          );

          await dispatch(getAllShoesFromWishList());

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

export const getSingleShoe = createAsyncThunk(
  "shoe/getSingleShoe",
  async (params, { getState, dispatch }) => {
    try {
      const response = await api.get(
        `/api/shoes/getSingleShoe/${params.shoeId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${getState().user.token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessTokenSubsequent());

          const response = await api.get(
            `/api/shoes/getSingleShoe/${params.shoeId}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${getState().user.token}`,
              },
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

export const getAllShoesFromCart = createAsyncThunk(
  "shoe/getAllShoesFromCart",
  async (_, { getState, dispatch }) => {
    try {
      const token = getState().user.token;
      const individualId = getState().user.individualId;

      const response = await api.get(
        `/api/shoes/getAllShoesFromCart/${individualId}`,
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
            `/api/shoes/getAllShoesFromCart/${individualId}`,
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
      })
      //---------------------------------------------------------------------------
      .addCase(addToWishList.pending, (state) => {
        state.addToWishListStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(addToWishList.fulfilled, (state) => {
        state.addToWishListStatus = "success";
        state.errorMessage = null;
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.addToWishListStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "addToWishList";
      })
      //---------------------------------------------------------------------------
      .addCase(removeFromWishList.pending, (state) => {
        state.removeFromWishListStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(removeFromWishList.fulfilled, (state) => {
        state.removeFromWishListStatus = "success";
        state.errorMessage = null;
      })
      .addCase(removeFromWishList.rejected, (state, action) => {
        state.removeFromWishListStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "removeFromWishList";
      })
      //---------------------------------------------------------------------------
      .addCase(getSingleShoe.pending, (state) => {
        state.singleShoeStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(getSingleShoe.fulfilled, (state, action) => {
        state.singleShoeStatus = "success";
        state.singleShoe = action.payload?.product || {};
        state.errorMessage = null;
      })
      .addCase(getSingleShoe.rejected, (state, action) => {
        state.singleShoeStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "getSingleShoe";
      })
      //---------------------------------------------------------------------------
      .addCase(getAllShoesFromCart.pending, (state) => {
        state.cartStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(getAllShoesFromCart.fulfilled, (state, action) => {
        state.cart = action.payload || [];

        if (action.payload) {
          let totalAmount = 0;

          action.payload.cartItems.forEach((ob) => {
            totalAmount += Number(ob.shoe.shoePrice) * Number(ob.shoeCount);
          });

          state.cartTotalAmount = totalAmount;
        }

        state.cartStatus = "success";
        state.errorMessage = null;
      })
      .addCase(getAllShoesFromCart.rejected, (state, action) => {
        state.cartStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "getAllShoesFromCart";
      });
  },
});

export const allShoesCB = (state) => state.shoe.allShoes;
export const wishListCB = (state) => state.shoe.wishList;
export const cartCB = (state) => state.shoe.cart;
export const singleShoeCB = (state) => state.shoe.singleShoe;
export const cartTotalAmountCB = (state) => state.shoe.cartTotalAmount;
export const allShoesStatusCB = (state) => state.shoe.allShoesStatus;
export const wishListStatusCB = (state) => state.shoe.wishListStatus;
export const cartStatusCB = (state) => state.shoe.cartStatus;
export const getSingleShoeStatusCB = (state) => state.shoe.singleShoeStatus;
export const getShoeBrandsCB = (state) => state.shoe.shoeBrands;
export const getShoeColorsCB = (state) => state.shoe.shoeColors;
export const getshoeSizesCB = (state) => state.shoe.shoeSizes;

export default shoeSlice.reducer;
