import { createSlice } from '@reduxjs/toolkit';

export const customizedSettingsInit = {
  customProductPriceMultiplier: 1,
  sideDiamondPricePerCarat: 0,
  metalPricePerGram: 0,
  diamondColors: [],
  diamondClarities: [],
  caratRanges: [],
};

const initialState = {
  priceMultiplier: 1,
  customizedSettings: customizedSettingsInit,
  nonCustomizedLoading: false,
  customizedLoading: false,
  nonCustomizedError: '',
  customizedError: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPriceMultiplier: (state, action) => {
      state.priceMultiplier = action.payload;
    },
    setCustomizedSettings: (state, action) => {
      state.customizedSettings = action.payload;
    },
    setCustomizedLoading(state, action) {
      state.customizedLoading = action.payload;
    },
    setNonCustomizedLoading(state, action) {
      state.nonCustomizedLoading = action.payload;
    },
    setNonCustomizedError: (state, action) => {
      state.nonCustomizedError = action.payload;
    },
    setCustomizedError: (state, action) => {
      state.customizedError = action.payload;
    },
  },
});

export const {
  setPriceMultiplier,
  setCustomizedSettings,
  setNonCustomizedLoading,
  setCustomizedLoading,
  setNonCustomizedError,
  setCustomizedError
} = settingsSlice.actions;

export default settingsSlice.reducer;