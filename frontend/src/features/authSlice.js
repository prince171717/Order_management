import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const adminLogin = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || "Login failed");
  }
});

const tokenFromStorage = localStorage.getItem("admintoken") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: { token: tokenFromStorage, admin: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.admin = null;
      localStorage.removeItem("admintoken");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(adminLogin.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.token = payload.token;
        s.admin = payload.admin;
        localStorage.setItem("admintoken", payload.token);
      })
      .addCase(adminLogin.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
