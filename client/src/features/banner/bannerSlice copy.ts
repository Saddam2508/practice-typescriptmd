"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/store/axiosInstance";
import { AxiosError } from "axios";
import { Banner, BannerState } from "./bannerTypes copy";

export const fetchBanners = createAsyncThunk<Banner[]>(
  "banner/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/banners");
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(
        "fetch Banners :",
        axiosError.response?.data || axiosError.message
      );
      return rejectWithValue(
        axiosError.response?.data?.message || "Fail to fetch Banner"
      );
    }
  }
);
export const createBanners = createAsyncThunk<Banner, FormData>(
  "banner/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/banners", data, {
        headers: { "content-type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(
        "create Banners :",
        axiosError.response?.data || axiosError.message
      );
      return rejectWithValue(
        axiosError.response?.data?.message || "Fail to create Banner"
      );
    }
  }
);
export const updateBanners = createAsyncThunk<
  Banner,
  { id: string; data: Partial<Banner> | FormData }
>("banner/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/banners/${id}`, data, {
      headers: { "content-type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error(
      "update Banners :",
      axiosError.response?.data || axiosError.message
    );
    return rejectWithValue(
      axiosError.response?.data?.message || "Fail to update Banner"
    );
  }
});

export const deleteBanners = createAsyncThunk<
  string, // fulfilled হলে যা রিটার্ন করবে (id)
  string // ফাংশন কল করার সময় যা পাঠাবে (id)
>("banner/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/banners/${id}`);
    return id; // delete সফল হলে সেই id ফেরত দিচ্ছে
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error(
      "delete Banners :",
      axiosError.response?.data || axiosError.message
    );
    return rejectWithValue(
      axiosError.response?.data?.message || "Fail to delete Banner"
    );
  }
});

const initialState: BannerState = {
  banners: [],
  status: "idle",
  error: null,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    resetBanner: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        fetchBanners.fulfilled,
        (state, action: PayloadAction<Banner[]>) => {
          state.status = "fulfilled";
          state.banners = action.payload;
        }
      )
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message || "Fail to fetch Banner";
      })
      .addCase(createBanners.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        createBanners.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          state.banners.push(action.payload);
        }
      )
      .addCase(createBanners.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message || "Fail to fetch Banner";
      })
      .addCase(updateBanners.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        updateBanners.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          const index = state.banners.findIndex(
            (p) => p._id === action.payload._id
          );
          if (index !== -1) {
            state.banners[index] = action.payload;
          }
        }
      )
      .addCase(updateBanners.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message || "Fail to fetch Banner";
      })
      .addCase(deleteBanners.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        deleteBanners.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "fulfilled";
          state.banners = state.banners.filter((p) => p._id !== action.payload);
        }
      )
      .addCase(deleteBanners.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message || "Fail to delete Banner";
      });
  },
});

export const { resetBanner } = bannerSlice.actions;

export default bannerSlice.reducer;
