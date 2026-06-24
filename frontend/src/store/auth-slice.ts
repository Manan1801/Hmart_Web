import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../lib/api/endpoints";
import { setAccessToken } from "../lib/api/client";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (body: { email: string; password: string }) => {
    const res = await authApi.login(body);
    setAccessToken(res.data.accessToken);
    return res.data.user;
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body: { email: string; password: string; fullName: string }) => {
    const res = await authApi.register(body);
    setAccessToken(res.data.accessToken);
    return res.data.user;
  },
);

export const refreshThunk = createAsyncThunk("auth/refresh", async () => {
  const res = await authApi.refresh();
  setAccessToken(res.data.accessToken);
  const meRes = await authApi.me();
  return meRes.data.user;
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
  setAccessToken(null);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(registerThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
