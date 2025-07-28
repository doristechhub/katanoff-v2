import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  diamondSelection: {
    shape: null,
    caratWeight: null,
    clarity: null,
    color: null,
  },
  diamondMessage: { message: "", type: "" },
  diamondLoading: false,
  customizeProductSettings: {},
  customizeProductSettingsLoading: false,
};

const selectDiamondSlice = createSlice({
  name: "selectedDiamond",
  initialState,
  reducers: {
    setDiamondSelection: (state, action) => {
      state.diamondSelection = {
        ...state.diamondSelection,
        ...action.payload,
      };
    },
    resetDiamondSelection: (state) => {
      state.diamondSelection = initialState.diamondSelection;
    },
    setDiamondMessage: (state, action) => {
      state.diamondMessage = action.payload;
    },
    setDiamondLoading: (state, action) => {
      state.diamondLoading = action.payload;
    },
    setCustomizeProductSettings: (state, action) => {
      state.customizeProductSettings = action.payload;
    },
    setCustomizeProductSettingsLoading: (state, action) => {
      state.customizeProductSettingsLoading = action.payload;
    },
  },
});

export const {
  setDiamondSelection,
  resetDiamondSelection,
  setDiamondMessage,
  setDiamondLoading,
  setCustomizeProductSettings,
  setCustomizeProductSettingsLoading,
} = selectDiamondSlice.actions;

export default selectDiamondSlice.reducer;
