import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_CONFIG from '../../config/api.config';

const API_URL = API_CONFIG.API_URL;

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(`${API_URL}/bookings/create`, bookingData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params
      };
      const response = await axios.get(`${API_URL}/bookings`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_URL}/bookings/${id}`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`${API_URL}/bookings/${id}/cancel`, {}, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkout = createAsyncThunk(
  'bookings/checkout',
  async (checkoutData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(`${API_URL}/payment/checkout`, checkoutData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'bookings/verifyPayment',
  async (paymentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(`${API_URL}/payment/verify`, paymentData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    selectedBooking: null,
    checkoutData: null,
    totalPages: 0,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    setCheckoutData: (state, action) => {
      state.checkoutData = action.payload;
    },
    clearCheckoutData: (state) => {
      state.checkoutData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings.push(action.payload.data);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Booking By Id
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBooking = action.payload.data;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.bookings.findIndex(b => b.id === action.payload.data.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.data;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Checkout
      .addCase(checkout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.checkoutData = action.payload;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, setCheckoutData, clearCheckoutData } = bookingSlice.actions;
export default bookingSlice.reducer;