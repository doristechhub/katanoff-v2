import { createSlice } from '@reduxjs/toolkit';

export const initDiamondShape = {
  title: '',
  imageFile: [],
  previewImage: [],
  deleteUploadedImage: [],
};

const initialState = {
  diamondShapeList: [],
  diamondShapeLoading: false,
  crudDiamondShapeLoading: false,
  selectedDiamondShape: initDiamondShape,
};

const diamondShapeSlice = createSlice({
  name: 'diamondShape',
  initialState,
  reducers: {
    setDiamondShapeLoading: (state, action) => {
      state.diamondShapeLoading = action.payload;
    },
    setDiamondShapeList: (state, action) => {
      state.diamondShapeList = action.payload;
    },
    setCrudDiamondShapeLoading: (state, action) => {
      state.crudDiamondShapeLoading = action.payload;
    },
    setSelectedDiamondShape: (state, action) => {
      state.selectedDiamondShape = action.payload;
    },
  },
});

export const {
  setDiamondShapeList,
  setDiamondShapeLoading,
  setSelectedDiamondShape,
  setCrudDiamondShapeLoading,
} = diamondShapeSlice.actions;
export default diamondShapeSlice.reducer;
