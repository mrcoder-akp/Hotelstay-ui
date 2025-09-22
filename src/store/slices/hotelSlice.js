import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_CONFIG from '../../config/api.config';

const API_URL = API_CONFIG.API_URL;

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (params, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/hotels`, { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchHotelById',
  async ({ id, params }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/hotels/${id}`, { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchFeaturedHotels = createAsyncThunk(
  'hotels/fetchFeaturedHotels',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/hotels/featured`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const searchHotels = createAsyncThunk(
  'hotels/searchHotels',
  async (searchData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/hotels/search`, searchData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    hotels: [],
    featuredHotels: [],
    selectedHotel: null,
    searchResults: [],
    totalPages: 0,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isError: false,
    message: '',
    searchParams: {
      destination: '',
      checkin: null,
      checkout: null,
      guests: 1
    }
  },
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
    },
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hotels = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Hotel By Id
      .addCase(fetchHotelById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedHotel = action.payload.data;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch Featured Hotels
      .addCase(fetchFeaturedHotels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeaturedHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredHotels = action.payload.data;
      })
      .addCase(fetchFeaturedHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Search Hotels
      .addCase(searchHotels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { setSearchParams, clearSelectedHotel, reset } = hotelSlice.actions;
export default hotelSlice.reducer;