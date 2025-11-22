import { api } from "@/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Banner, BannerState } from "./bannerTypes";
import { AxiosError } from "axios";

//error control

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error || "Something went wrong";
  return "Something went wrong";
};

//fetch Banner

export const fetchBanner = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>("banner/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/banners");
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//create Banner

export const createBanner = createAsyncThunk<
  Banner,
  FormData,
  { rejectValue: string }
>("banner/create", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/banners", data);
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//update Banner

export const updateBanner = createAsyncThunk<
  Banner,
  { id: string; data: FormData },
  { rejectValue: string }
>("banner/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/banners/${id}`, data);
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//delete Banner

export const deleteBanner = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("banner/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/banners/${id}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//initialState

const initialState: BannerState = {
  banners: [],
  backendResponse: undefined,
  backendHistory: [],
  status: "idle",
  error: null,
};

//slice

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    resetBanner: (state) => {
      state.status = "idle";
      state.banners = [];
      state.backendResponse = undefined;
      state.backendHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.error = null;
        state.banners = action.payload;
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(createBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        createBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          state.error = null;
          state.banners.push(action.payload);
          state.backendResponse = action.payload;
          state.backendHistory.push(action.payload);
        }
      )
      .addCase(createBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(updateBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        updateBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          state.error = null;
          const index = state.banners.findIndex(
            (n) => n._id === action.payload._id
          );
          if (index !== -1) {
            state.banners[index] = action.payload;
          } else {
            state.banners.push(action.payload);
          }
          state.backendResponse = action.payload;
          state.backendHistory.push(action.payload);
        }
      )
      .addCase(updateBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(deleteBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.error = null;
        state.banners = state.banners.filter((n) => n._id !== action.meta.arg);
        state.backendResponse = undefined;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export const { resetBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
