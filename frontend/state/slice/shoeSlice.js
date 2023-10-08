import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosBase/api";
import { refreshAccessToken } from "./userSlice";

const initialState = {
  allShoes: [],
  wishList: [],
  cart: [],
  orders: [],
  shoeBrands: [],
  shoeSizes: [],
  shoeColors: [],
  singleShoe: {},
  cartTotalAmount: null,
  errorMessage: null,
  errorMessageFrom: "",
  isOutOfStock: false,
  //possible values: [ idle, loading, success, failed ]
  allShoesStatus: "idle",
  wishListStatus: "idle",
  cartStatus: "idle",
  getUserOrdersStatus: "idle",
  addToWishListStatus: "idle",
  addToCartStatus: "idle",
  removeFromWishListStatus: "idle",
  removeFromCartStatus: "idle",
  uploadNewShoeStatus: "idle",
  updateShoeStatus: "idle",
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
          await dispatch(refreshAccessToken());

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
          await dispatch(refreshAccessToken());

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
          await dispatch(refreshAccessToken());

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
          await dispatch(refreshAccessToken());

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
          await dispatch(refreshAccessToken());

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
          await dispatch(refreshAccessToken());

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

export const addToCart = createAsyncThunk(
  "shoe/addToCart",
  async (params, { getState, dispatch }) => {
    const individualId = getState().user.individualId;
    try {
      const response = await api.post(
        "/api/shoes/addToCart",
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

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessToken());

          const response = await api.post(
            "/api/shoes/addToCart",
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

export const removeFromCart = createAsyncThunk(
  "shoe/removeFromCart",
  async (params, { getState, dispatch }) => {
    const individualId = getState().user.individualId;
    try {
      const response = await api.post(
        "/api/shoes/removeFromCart",
        {
          userId: individualId,
          productId: params.productId,
          removeItemCompletely: params.removeItemCompletely,
        },
        {
          headers: {
            Authorization: `Bearer ${getState().user.token}`,
          },

          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessToken());

          const response = await api.post(
            "/api/shoes/removeFromCart",
            {
              userId: individualId,
              productId: params.productId,
              removeItemCompletely: params.removeItemCompletely,
            },
            {
              headers: {
                Authorization: `Bearer ${getState().user.token}`,
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

export const getUserOrders = createAsyncThunk(
  "shoe/getUserOrders",
  async (_, { getState, dispatch }) => {
    try {
      const token = getState().user.token;
      const userId = getState().user.individualId;

      const response = await api.get(`/api/shoes/getUserOrders/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessToken());

          const token = getState().user.token;
          const userId = getState().user.individualId;

          const response = await api.get(`/api/shoes/getUserOrders/${userId}`, {
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

export const uploadNewShoe = createAsyncThunk(
  "shoe/uploadNewShoe",
  async (params, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      formData.set("shoeName", params.shoeName);
      formData.set("shoePrice", params.shoePrice);
      formData.set("shoeColor", params.shoeColor);
      formData.set("shoesAvailable", params.shoesAvailable);
      formData.set("shoeRating", params.shoeRating);
      formData.set("shoeBrand", params.shoeBrand);
      formData.set("shoeSize", params.shoeSize);
      formData.set("shoeGenderCategory", params.shoeGenderCategory);

      for (let i = 0; i < params.shoeImages.length; i++) {
        formData.append("shoeImages", params.shoeImages[i]);
      }

      const response = await api.post("/api/shoes/uploadNewShoe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getState().user.token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessToken());

          const formData = new FormData();
          formData.set("shoeName", params.shoeName);
          formData.set("shoePrice", params.shoePrice);
          formData.set("shoeColor", params.shoeColor);
          formData.set("shoesAvailable", params.shoesAvailable);
          formData.set("shoeRating", params.shoeRating);
          formData.set("shoeBrand", params.shoeBrand);
          formData.set("shoeSize", params.shoeSize);
          formData.set("shoeGenderCategory", params.shoeGenderCategory);

          for (let i = 0; i < params.shoeImages.length; i++) {
            formData.append("shoeImages", params.shoeImages[i]);
          }

          const response = await api.post(
            "/api/shoes/uploadNewShoe",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getState().user.token}`,
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

export const updateShoeDetails = createAsyncThunk(
  "shoe/updateShoeDetails",
  async (params, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      formData.set("shoeId", params.shoeId);
      formData.set("shoeName", params.shoeName);
      formData.set("shoePrice", params.shoePrice);
      formData.set("shoeColor", params.shoeColor);
      formData.set("shoesAvailable", params.shoesAvailable);
      formData.set("shoeRating", params.shoeRating);
      formData.set("shoeBrand", params.shoeBrand);
      formData.set("shoeSize", params.shoeSize);
      formData.set("shoeGenderCategory", params.shoeGenderCategory);

      for (let i = 0; i < params.shoeImages.length; i++) {
        formData.append("shoeImages", params.shoeImages[i]);
      }

      const response = await api.put("/api/shoes/updateShoeDetails", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getState().user.token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          await dispatch(refreshAccessToken());

          const formData = new FormData();
          formData.set("shoeId", params.shoeId);
          formData.set("shoeName", params.shoeName);
          formData.set("shoePrice", params.shoePrice);
          formData.set("shoeColor", params.shoeColor);
          formData.set("shoesAvailable", params.shoesAvailable);
          formData.set("shoeRating", params.shoeRating);
          formData.set("shoeBrand", params.shoeBrand);
          formData.set("shoeSize", params.shoeSize);
          formData.set("shoeGenderCategory", params.shoeGenderCategory);

          for (let i = 0; i < params.shoeImages.length; i++) {
            formData.append("shoeImages", params.shoeImages[i]);
          }

          const response = await api.put(
            "/api/shoes/updateShoeDetails",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getState().user.token}`,
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
  reducers: {
    clearAddToCartStatus: (state) => {
      state.addToCartStatus = "idle";
      state.errorMessageFrom = "";
    },
    clearProductDetails: (state) => {
      state.allShoes = [];
      state.wishList = [];
      state.cart = [];
      state.orders = [];
      state.shoeBrands = [];
      state.shoeSizes = [];
      state.shoeColors = [];
      state.singleShoe = {};
      state.cartTotalAmount = null;
      state.errorMessage = null;
      state.errorMessageFrom = "";
      state.allShoesStatus = "idle";
      state.wishListStatus = "idle";
      state.cartStatus = "idle";
      state.getUserOrdersStatus = "idle";
      state.addToWishListStatus = "idle";
      state.addToCartStatus = "idle";
      state.removeFromWishListStatus = "idle";
      state.removeFromCartStatus = "idle";
      state.uploadNewShoeStatus = "idle";
      state.updateShoeStatus = "idle";
      state.singleShoeStatus = "idle";
    },
    clearStatus: (state, action) => {
      state[action.payload] = "idle";
      state.errorMessageFrom = "";
    },
    clearState: (state, action) => {
      if (
        typeof state[action.payload] === "object" &&
        !Array.isArray(state[action.payload]) &&
        state[action.payload] !== null
      ) {
        state[action.payload] = {};
      } else if (Array.isArray(state[action.payload])) {
        state[action.payload] = [];
      } else if (typeof state[action.payload] === "string") {
        state[action.payload] = "";
      } else if (typeof state[action.payload] === "number") {
        state[action.payload] = null;
      }
    },

    clearAddToWishListStatus: (state) => {
      state.addToWishListStatus = "idle";
      state.errorMessageFrom = "";
    },
  },
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

          // check for out of stock products

          if (shoe.shoesAvailable === 0) {
            state.isOutOfStock = true;
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
      })
      //---------------------------------------------------------------------------
      .addCase(addToCart.pending, (state) => {
        state.addToCartStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const product = action.payload?.product;
        const newAddition = action.payload?.newAddition;

        if (newAddition) {
          const shoeFound = state.allShoes.find(
            (shoe) => shoe._id === product.shoe,
          );
          state.cart.cartItems.push({
            shoe: shoeFound,
            shoeCount: product.shoeCount,
          });
        } else {
          for (let i = 0; i < state.cart.cartItems.length; i++) {
            if (state.cart.cartItems[i].shoe._id === product.shoe) {
              state.cart.cartItems[i].shoeCount = product.shoeCount;
            }
          }
        }

        let totalAmount = 0;

        state.cart.cartItems.forEach((ob) => {
          totalAmount += Number(ob.shoe.shoePrice) * Number(ob.shoeCount);
        });

        state.cartTotalAmount = totalAmount;

        state.addToCartStatus = "success";
        state.errorMessage = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addToCartStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "addToCart";
      })
      //---------------------------------------------------------------------------
      .addCase(removeFromCart.pending, (state) => {
        state.removeFromCartStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const product = action.payload?.product;
        const removeItemCompletely = action.payload?.removeItemCompletely;

        if (removeItemCompletely) {
          state.cart.cartItems = state.cart.cartItems.filter(
            (ob) => ob.shoe._id !== product.shoe,
          );
        } else {
          for (let i = 0; i < state.cart.cartItems.length; i++) {
            if (state.cart.cartItems[i].shoe._id === product.shoe) {
              state.cart.cartItems[i].shoeCount = product.shoeCount;
            }
          }
        }

        let totalAmount = 0;

        state.cart.cartItems.forEach((ob) => {
          totalAmount += Number(ob.shoe.shoePrice) * Number(ob.shoeCount);
        });

        state.cartTotalAmount = totalAmount;

        state.removeFromCartStatus = "success";
        state.errorMessage = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removeFromCartStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "removeFromCart";
      })
      //---------------------------------------------------------------------------
      .addCase(uploadNewShoe.pending, (state) => {
        state.uploadNewShoeStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(uploadNewShoe.fulfilled, (state, action) => {
        const newShoe = action.payload?.newProduct;
        state.allShoes.push(newShoe);

        state.uploadNewShoeStatus = "success";
        state.errorMessage = null;
      })
      .addCase(uploadNewShoe.rejected, (state, action) => {
        state.uploadNewShoeStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "uploadNewShoe";
      })
      //---------------------------------------------------------------------------
      .addCase(getUserOrders.pending, (state) => {
        state.getUserOrdersStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload || [];
        state.getUserOrdersStatus = "success";
        state.errorMessage = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.getUserOrdersStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "getUserOrders";
      })
      //---------------------------------------------------------------------------
      .addCase(updateShoeDetails.pending, (state) => {
        state.updateShoeStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(updateShoeDetails.fulfilled, (state, action) => {
        const updatedShoe = action.payload;

        state.allShoes = state.allShoes.filter(
          (shoe) => shoe._id !== updatedShoe._id,
        );

        state.allShoes.push(updatedShoe);

        state.shoeBrands = state.shoeBrands.filter(
          (item) => item !== updatedShoe.shoeBrand,
        );

        state.shoeBrands.push(updatedShoe.shoeBrand);

        state.shoeColors = state.shoeColors.filter(
          (item) => item !== updatedShoe.shoeColor,
        );

        state.shoeColors.push(updatedShoe.shoeColor);

        state.shoeSizes = state.shoeSizes.filter(
          (item) => item !== updatedShoe.shoeSize,
        );

        state.shoeSizes.push(updatedShoe.shoeSize);

        let productSOutOfStock = false;

        state.allShoes.forEach((shoe) => {
          if (shoe.shoesAvailable === 0) {
            productSOutOfStock = true;
          }
        });

        state.isOutOfStock = productSOutOfStock;

        state.updateShoeStatus = "success";
        state.errorMessage = null;
      })
      .addCase(updateShoeDetails.rejected, (state, action) => {
        state.updateShoeStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "updateShoeDetails";
      });
  },
});

export const allShoesCB = (state) => state.shoe.allShoes;
export const wishListCB = (state) => state.shoe.wishList;
export const cartCB = (state) => state.shoe.cart;
export const ordersCB = (state) => state.shoe.orders;
export const getUserOrdersStatusCB = (state) => state.shoe.getUserOrdersStatus;
export const singleShoeCB = (state) => state.shoe.singleShoe;
export const cartTotalAmountCB = (state) => state.shoe.cartTotalAmount;
export const allShoesStatusCB = (state) => state.shoe.allShoesStatus;
export const wishListStatusCB = (state) => state.shoe.wishListStatus;
export const cartStatusCB = (state) => state.shoe.cartStatus;
export const addToWishListStatusCB = (state) => state.shoe.addToWishListStatus;
export const addToCartStatusCB = (state) => state.shoe.addToCartStatus;
export const uploadNewShoeStatusCB = (state) => state.shoe.uploadNewShoeStatus;
export const updateShoeStatusCB = (state) => state.shoe.updateShoeStatus;
export const removeFromWishListStatusCB = (state) =>
  state.shoe.removeFromWishListStatus;
export const removeFromCartStatusCB = (state) =>
  state.shoe.removeFromCartStatus;
export const getSingleShoeStatusCB = (state) => state.shoe.singleShoeStatus;
export const getShoeBrandsCB = (state) => state.shoe.shoeBrands;
export const getShoeColorsCB = (state) => state.shoe.shoeColors;
export const getIsOutOfStockStatusCB = (state) => state.shoe.isOutOfStock;
export const getshoeSizesCB = (state) => state.shoe.shoeSizes;
export const errorMessageCB = (state) => state.shoe.errorMessage;
export const errorMessageFromCB = (state) => state.shoe.errorMessageFrom;

export const {
  clearProductDetails,
  clearStatus,
  clearState,
  clearAddToCartStatus,
  clearAddToWishListStatus,
} = shoeSlice.actions;

export default shoeSlice.reducer;
