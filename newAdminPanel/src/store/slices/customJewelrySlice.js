import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customJewelryPage: 0,
  customJewelryList: [],
  customJewelryLoader: false,
  crudCustomJewelryLoading: false,
  showCustomJewelryDetailModel: false,
};

const customJewelrySlice = createSlice({
  name: 'customJewelry',
  initialState,
  reducers: {
    setCustomJewelryPage: (state, action) => {
      state.customJewelryPage = action.payload;
    },
    setCustomJewelryList: (state, action) => {
      state.customJewelryList = action.payload;
    },
    setCustomJewelryLoader: (state, action) => {
      state.customJewelryLoader = action.payload;
    },
    setCrudCustomJewelryLoading: (state, action) => {
      state.crudCustomJewelryLoading = action.payload;
    },
    setCustomJewelryDetailModel: (state, action) => {
      state.showCustomJewelryDetailModel = action.payload;
    },
  },
});

export const {
  setCustomJewelryPage,
  setCustomJewelryList,
  setCustomJewelryLoader,
  setCustomJewelryDetailModel,
  setCrudCustomJewelryLoading,
  setShowRejectAppointmentModel,
} = customJewelrySlice.actions;
export default customJewelrySlice.reducer;
