import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  priceMultiplier: 1,
  loading: false,
  setttingsError: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPriceMultiplier: (state, action) => {
      state.priceMultiplier = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSetttingsError: (state, action) => {
      state.setttingsError = action.payload;
    },
  },
});

export const { setPriceMultiplier, setLoading, setSetttingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
