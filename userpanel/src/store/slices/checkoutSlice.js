import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stateList: [],
  standardizedAddress: "",
  selectedShippingAddress: null,
  activeIndex: null,
  selectedShippingCharge: null,
  isSubmitted: false,
  isNewYorkState: "",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setStateList: (state, action) => {
      state.stateList = action.payload;
    },
    setStandardizedAddress: (state, action) => {
      state.standardizedAddress = action.payload;
    },
    setSelectedShippingAddress: (state, action) => {
      state.selectedShippingAddress = action.payload;
    },
    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
    setSelectedShippingCharge: (state, action) => {
      state.selectedShippingCharge = action.payload;
    },
    setIsNewYorkState: (state, action) => {
      state.isNewYorkState = action.payload;
    },
  },
});

export const {
  setStateList,
  setStandardizedAddress,
  setSelectedShippingAddress,
  setActiveIndex,
  setSelectedShippingCharge,
  setIsNewYorkState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
