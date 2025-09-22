import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_CONFIG from '../../config/api.config';

const API_URL = API_CONFIG.API_URL;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_URL}/cart`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post(`${API_URL}/cart/add`, itemData, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.delete(`${API_URL}/cart/item/${itemId}`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, guests }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`${API_URL}/cart/item/${itemId}`, { guests }, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.delete(`${API_URL}/cart/clear`, config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    items: [],
    totalAmount: 0,
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.data;
        state.items = action.payload.data?.items || [];
        state.totalAmount = action.payload.data?.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.data;
        state.items = action.payload.data?.items || [];
        state.totalAmount = action.payload.data?.totalAmount || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.data;
        state.items = action.payload.data?.items || [];
        state.totalAmount = action.payload.data?.totalAmount || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.data;
        state.items = action.payload.data?.items || [];
        state.totalAmount = action.payload.data?.totalAmount || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload.data;
        state.items = [];
        state.totalAmount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;