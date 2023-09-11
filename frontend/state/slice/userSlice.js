import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axiosBase/api";

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

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // singup
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
      });
    // ----------------------------------------------------
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
