import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isInitializing: true
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isInitializing = false;
    },
    signOut: (state) => {
      state.user = null;
      state.isInitializing = false;
    },
    setInitializing: (state, action) => {
      state.isInitializing = action.payload;
    }
  }
});

export const { setUser, signOut, setInitializing } = authSlice.actions;

export default authSlice.reducer;
