// src/features/citas/citasSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCalendarEvent } from '../../services/googleApi';
import { generateExpedientePdf } from '../../utils/pdfGenerator';

export const addCita = createAsyncThunk(
  'citas/addCita',
  async (cita, { rejectWithValue, getState }) => {
    try {
      // Crear evento en Calendar
      const eventId = await createCalendarEvent(cita);
      
      // Actualizar la cita con el ID del evento
      cita.EventID_Calendar = eventId;
      
      // TODO: Guardar la cita en Google Sheets
      
      return cita;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateExpediente = createAsyncThunk(
  'citas/generateExpediente',
  async ({ cliente, historialCitas }, { rejectWithValue }) => {
    try {
      return await generateExpedientePdf(cliente, historialCitas);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  generatedExpedientes: []
};

export const citasSlice = createSlice({
  name: 'citas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCita.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCita.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addCita.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(generateExpediente.fulfilled, (state, action) => {
        state.generatedExpedientes.push(action.payload);
      });
  }
});

export default citasSlice.reducer;