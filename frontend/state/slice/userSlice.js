import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosBase/api";
import jwt_decode from "jwt-decode";
import { clearProductDetails } from "./shoeSlice";

const initialState = {
  token: null,
  individualName: null,
  individualId: null,
  isAdmin: false,
  isUser: false,
  errorMessage: null,
  errorMessageFrom: "", // [login, signup]
  //possible values: [ idle, loading, success, failed ]
  signupStatus: "idle",
  loginStatus: "idle",
  refreshStatus: "idle",
};

export const signup = createAsyncThunk(
  "user/signup",
  async (userCredentials) => {
    try {
      const response = await api.post("/api/users/signup", userCredentials);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
);

export const login = createAsyncThunk("user/login", async (userCredentials) => {
  try {
    const response = await api.post("/api/users/login", userCredentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error;
    if (errorMessage) {
      throw new Error(errorMessage);
    }
    throw error;
  }
});

export const refreshAccessToken = createAsyncThunk(
  "user/refreshAccessToken",
  async () => {
    try {
      const response = await api.get("/api/users/refreshAccessToken", {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { getState, dispatch }) => {
    try {
      const response = await api.get("/api/users/logout", {
        withCredentials: true,
      });
      dispatch(clearProductDetails());
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // -------------------------------------------------singup
      .addCase(signup.pending, (state) => {
        state.signupStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.signupStatus = "success";
        state.errorMessage = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "signup";
      })
      // -------------------------------------------------login
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const tokenRecieved = action.payload.accessToken;
        const decoded = jwt_decode(tokenRecieved);
        const rolesArray = decoded.UserInfo.roles || [];

        rolesArray.forEach((roleGiven) => {
          if (roleGiven === Number(import.meta.env.VITE_ROLE_ADMIN)) {
            state.isAdmin = true;
          }
          if (roleGiven === Number(import.meta.env.VITE_ROLE_USER)) {
            state.isUser = true;
          }
        });

        state.token = tokenRecieved;
        state.individualName = decoded?.UserInfo?.username || null;
        state.individualId = decoded?.UserInfo?.userId || null;
        state.loginStatus = "success";
        state.refreshStatus = "success";
        state.errorMessage = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "login";
      })
      // -------------------------------------------------refreshAccessToken
      .addCase(refreshAccessToken.pending, (state) => {
        state.refreshStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const tokenRecieved = action.payload.accessToken;
        const decoded = jwt_decode(tokenRecieved);
        const rolesArray = decoded.UserInfo.roles;

        rolesArray.forEach((roleGiven) => {
          if (roleGiven === Number(import.meta.env.VITE_ROLE_ADMIN)) {
            state.isAdmin = true;
          }
          if (roleGiven === Number(import.meta.env.VITE_ROLE_USER)) {
            state.isUser = true;
          }
        });

        state.token = tokenRecieved;
        state.individualName = decoded?.UserInfo?.username || null;
        state.individualId = decoded?.UserInfo?.userId || null;
        state.refreshStatus = "success";
        state.loginStatus = "success";
        state.errorMessage = null;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.refreshStatus = "failed";
        state.loginStatus = "idle";
        state.signupStatus = "idle";
        state.errorMessageFrom = "refreshInitial";
      })
      // -------------------------------------------------logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.individualId = null;
        state.individualName = null;
        state.isAdmin = false;
        state.isUser = false;
        state.errorMessageFrom = "";
        state.refreshStatus = "idle";
        state.loginStatus = "idle";
        state.signupStatus = "idle";
        state.errorMessage = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.token = null;
        state.individualId = null;
        state.individualName = null;
        state.isAdmin = false;
        state.isUser = false;
        state.refreshStatus = "failed";
        state.loginStatus = "idle";
        state.signupStatus = "idle";
        state.errorMessage = action.error.message;
        state.errorMessageFrom = "logout";
      });
  },
});

export const getLoginStatusCB = (state) => state.user.loginStatus;
export const getAccessTokenCB = (state) => state.user.token;
export const getSignupStatusCB = (state) => state.user.signupStatus;
export const getIndividualIdCB = (state) => state.user.individualId;
export const getRefreshStatusCB = (state) => state.user.refreshStatus;
export const getIndividualNameCB = (state) => state.user.individualName;
export const getUserRoleStatusCB = (state) => state.user.isUser;
export const getAdminRoleStatusCB = (state) => state.user.isAdmin;
export const getIndividualErrorMessageCB = (state) => state.user.errorMessage;
export const getIndividualErrorMessageFromCB = (state) =>
  state.user.errorMessageFrom;

export default userSlice.reducer;
