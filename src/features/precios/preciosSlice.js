// src/features/precios/preciosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPrecios } from '../../services/googleApi';

export const fetchPrecios = createAsyncThunk(
  'precios/fetchPrecios',
  async (_, { rejectWithValue }) => {
    try {
      return await getPrecios();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

export const preciosSlice = createSlice({
  name: 'precios',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrecios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrecios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPrecios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default preciosSlice.reducer;