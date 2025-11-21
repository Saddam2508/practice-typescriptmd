import { api } from "@/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Banner, BannerState } from "./bannerTypes";
import { AxiosError } from "axios";

// Error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message || error.message;
  }
  if (error instanceof Error) return error.message || "Something went wrong";
  if (typeof error === "string") return error;
  return "Something went wrong";
};

// ----------------------
// Async Thunks
// ----------------------

// Fetch all banners
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

// Create a new banner
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

// Update a banner
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
// delete a banner
export const deleteBanner = createAsyncThunk<
  string, // fulfilled value type (যা return হবে)
  string, // argument type (banner id)
  { rejectValue: string }
>("banner/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/banners/${id}`);
    return res.data; // backend থেকে যেটা আসে সেটা return করুন
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// ----------------------
// Initial State
// ----------------------
const initialState: BannerState = {
  banners: [],
  backendResponse: undefined,
  backendHistory: [],
  status: "idle",
  error: null,
};

// ----------------------
// Slice
// ----------------------
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    resetBanner: (state) => {
      state.status = "idle";
      state.error = null;
      state.banners = [];
      state.backendResponse = undefined;
      state.backendHistory = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        fetchBanner.fulfilled,
        (state, action: PayloadAction<Banner[]>) => {
          state.status = "fulfilled";
          state.error = null;
          state.banners = action.payload;
        }
      )
      .addCase(fetchBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });

    // Create
    builder
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
      });

    // Update
    builder
      .addCase(updateBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        updateBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.status = "fulfilled";
          state.error = null;

          // Update frontend array
          const index = state.banners.findIndex(
            (b) => b._id === action.payload._id
          );
          if (index !== -1) {
            state.banners[index] = action.payload;
          } else {
            state.banners.push(action.payload);
          }

          // Save latest backend response and history
          state.backendResponse = action.payload;
          state.backendHistory.push(action.payload);
        }
      )
      .addCase(updateBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      // Delete

      .addCase(deleteBanner.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter((b) => b._id !== action.meta.arg);
        // action.meta.arg → delete করার জন্য পাঠানো banner id
        state.backendResponse = undefined; // optional
        state.status = "fulfilled";
        state.error = null;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export const { resetBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
