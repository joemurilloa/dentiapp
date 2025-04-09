import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClientes, createCliente } from '../../services/googleApi';

export const fetchClientes = createAsyncThunk(
  'clientes/fetchClientes',
  async (_, { rejectWithValue }) => {
    try {
      return await getClientes();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCliente = createAsyncThunk(
  'clientes/addCliente',
  async (cliente, { rejectWithValue }) => {
    try {
      return await createCliente(cliente);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCliente.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  }
});

export default clientesSlice.reducer;