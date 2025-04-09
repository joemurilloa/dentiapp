import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import clientesReducer from './features/clientes/clientesSlice';
import preciosReducer from './features/precios/preciosSlice';
import citasReducer from './features/citas/citasSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clientes: clientesReducer,
    precios: preciosReducer,
    citas: citasReducer
  }
});