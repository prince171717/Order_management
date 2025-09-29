import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchOrders = createAsyncThunk("orders/fetch", async (params, thunkAPI) => {
  try {
    const { data } = await api.get("/orders", { params });
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || "Fetch failed");
  }
});

export const updateQuantity = createAsyncThunk("orders/updateQty", async ({ id, quantity }, thunkAPI) => {
  try {
    const { data } = await api.patch(`/orders/${id}/quantity`, { quantity });
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || "Update failed");
  }
});

export const deleteOrder = createAsyncThunk("orders/delete", async (id, thunkAPI) => {
  try {
    await api.delete(`/orders/${id}`);
    return id;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || "Delete failed");
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], loading: false, error: null, filters: { productName: "", startDate: "", endDate: "" } },
  reducers: {
    setFilters: (s, { payload }) => { s.filters = { ...s.filters, ...payload }; },
    addOrderRealtime: (s, { payload }) => { s.list.unshift(payload); },
    updateOrderRealtime: (s, { payload }) => {
      const idx = s.list.findIndex(o => o._id === payload._id);
      if (idx !== -1) s.list[idx] = payload;
    },
    deleteOrderRealtime: (s, { payload }) => {
      s.list = s.list.filter(o => o._id !== payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrders.fulfilled, (s, { payload }) => { s.loading = false; s.list = payload; })
      .addCase(fetchOrders.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      .addCase(updateQuantity.fulfilled, (s, { payload }) => {
        const idx = s.list.findIndex(o => o._id === payload._id);
        if (idx !== -1) s.list[idx] = payload;
      })
      .addCase(deleteOrder.fulfilled, (s, { payload }) => {
        s.list = s.list.filter(o => o._id !== payload);
      });
  }
});

export const { setFilters, addOrderRealtime, updateOrderRealtime, deleteOrderRealtime } = ordersSlice.actions;
export default ordersSlice.reducer;
