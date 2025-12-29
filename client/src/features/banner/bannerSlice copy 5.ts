import { api } from '@/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Banner, BannerState } from './bannerTypes';
import { AxiosError } from 'axios';

// error handle

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Something went wrong';
};

//fetch Banner

export const fetchBanner = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>('banner/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/banners');
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
>('banner/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/banners', data);
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//create Banner

export const updateBanner = createAsyncThunk<
  Banner,
  { id: string; data: FormData },
  { rejectValue: string }
>('banner/update', async ({ id, data }, { rejectWithValue }) => {
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
>('banner/delete', async (id, { rejectWithValue }) => {
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
  backendBanner: undefined,
  bannerHistory: [],
  fetch: { status: 'idle', error: null },
  create: { status: 'idle', error: null },
  update: { status: 'idle', error: null },
  delete: { status: 'idle', error: null },
};

// slice

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    resetBanner: (state) => {
      state.banners = [];
      state.backendBanner = undefined;
      state.bannerHistory = [];
      state.fetch = { status: 'idle', error: null };
      state.create = { status: 'idle', error: null };
      state.update = { status: 'idle', error: null };
      state.delete = { status: 'idle', error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanner.pending, (state) => {
        state.fetch.status = 'pending';
        state.fetch.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.fetch.status = 'fulfilled';
        state.fetch.error = null;
        state.banners = action.payload;
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.fetch.status = 'rejected';
        state.fetch.error = action.payload;
      })
      .addCase(createBanner.pending, (state) => {
        state.create.status = 'pending';
        state.create.error = null;
      })
      .addCase(
        createBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.create.status = 'fulfilled';
          state.create.error = null;
          state.banners.push(action.payload);
          state.bannerHistory.push(action.payload);
          state.backendBanner = action.payload;
        }
      )
      .addCase(createBanner.rejected, (state, action) => {
        state.create.status = 'rejected';
        state.create.error = action.payload;
      })
      .addCase(updateBanner.pending, (state) => {
        state.update.status = 'pending';
        state.update.error = null;
      })
      .addCase(
        updateBanner.fulfilled,
        (state, action: PayloadAction<Banner>) => {
          state.update.status = 'fulfilled';
          state.update.error = null;
          const index = state.banners.findIndex(
            (b) => b._id === action.payload._id
          );
          if (index !== -1) {
            state.banners[index] = action.payload;
            state.bannerHistory[index] = action.payload;
            state.backendBanner = action.payload;
          }
        }
      )
      .addCase(updateBanner.rejected, (state, action) => {
        state.update.status = 'rejected';
        state.update.error = action.payload;
      })
      .addCase(deleteBanner.pending, (state) => {
        state.delete.status = 'pending';
        state.delete.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.delete.status = 'fulfilled';
        state.delete.error = null;
        state.banners = state.banners.filter((b) => b._id === action.meta.arg);

        state.backendBanner = undefined;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.delete.status = 'rejected';
        state.delete.error = action.payload;
      });
  },
});

export const { resetBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
