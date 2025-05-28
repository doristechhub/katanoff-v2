import { createSlice } from "@reduxjs/toolkit";

export const initCustomJewelry = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: undefined,
  attachment: undefined,
  description: "",
};

const initialState = {
  customJewelryLoading: false,
  customJewelryMessage: { message: "", type: "" },
};

const customJewelrySlice = createSlice({
  name: "customJewelry",
  initialState,
  reducers: {
    setCustomJewelryLoading: (state, action) => {
      state.customJewelryLoading = action.payload;
    },
    setCustomJewelryMessage: (state, action) => {
      state.customJewelryMessage = action.payload;
    },
  },
});

export const {
  setCustomJewelryLoading,
  setCustomJewelryMessage,
} = customJewelrySlice.actions;

export default customJewelrySlice.reducer;