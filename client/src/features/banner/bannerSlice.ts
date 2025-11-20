"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/store/axiosInstance";
import { AxiosError } from "axios";
import { Banner, BannerState } from "./bannerTypes";

export const fetchBan = createAsyncThunk<Banner, void, { rejectValue: string }>(
  "banner/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/banners");
      return res.data;
    } catch (error) {
      return rejectWithValue("banner get fail");
    }
  }
);

// 🔹 একক ব্যানার ফেচ
export const fetchBanner = createAsyncThunk<
  Banner,
  void,
  { rejectValue: string }
>("banner/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/banners");
    return res.data; // ধরছি backend থেকে object আসছে
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to fetch banner";
    console.error("fetch Banner error:", message);
    return rejectWithValue(message);
  }
});

// 🔹 নতুন ব্যানার তৈরি
export const createBanner = createAsyncThunk<
  Banner,
  FormData,
  { rejectValue: string }
>("banner/create", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/banners", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to create banner";
    console.error("create Banner error:", message);
    return rejectWithValue(message);
  }
});

// 🔹 ব্যানার আপডেট
export const updateBanner = createAsyncThunk<
  Banner,
  { id: string; data: FormData },
  { rejectValue: string }
>("banner/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/banners/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to update banner";
    console.error("update Banner error:", message);
    return rejectWithValue(message);
  }
});

// 🔹 ব্যানার ডিলিট
export const deleteBanner = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("banner/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/banners/${id}`);
    return id;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to delete banner";
    console.error("delete Banner error:", message);
    return rejectWithValue(message);
  }
});

// 🔹 initial state
const initialState: BannerState = {
  banner: null,
  status: "idle",
  error: null,
};

// 🔹 Slice তৈরি
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    resetBanner: (state) => {
      state.status = "idle";
      state.error = null;
      state.banner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        fetchBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          state.banner = action.payload;
        }
      )
      .addCase(fetchBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Failed to fetch banner";
      })

      // Create
      .addCase(createBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        createBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          state.banner = action.payload;
        }
      )
      .addCase(createBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Failed to create banner";
      })

      // Update
      .addCase(updateBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        updateBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          state.banner = action.payload;
        }
      )
      .addCase(updateBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Failed to update banner";
      })

      // Delete
      .addCase(deleteBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.status = "fulfilled";
        state.banner = null;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Failed to delete banner";
      });
  },
});

export const { resetBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
