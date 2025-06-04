import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  diamondSelection: {
    shape: null,
    caratWeight: null,
    clarity: null,
    color: null,
  },
  diamondMessage: { message: "", type: "" },
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
  },
});

export const { setDiamondSelection, resetDiamondSelection, setDiamondMessage } =
  selectDiamondSlice.actions;

export default selectDiamondSlice.reducer;
