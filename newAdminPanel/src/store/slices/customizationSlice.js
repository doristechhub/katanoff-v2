import { createSlice } from '@reduxjs/toolkit';

export const initCustomizationType = {
  title: '',
};

export const initCustomizationSubType = {
  title: '',
  hexCode: '',
  type: 'default',
  unit: 'other',
  price: 0,
  customizationTypeId: '',
  imageFile: [],
  previewImage: [],
  deleteUploadedImage: [],
};

const initialState = {
  page: 0,
  customizationTypeList: [],
  customizationSubTypeList: [],
  customizationTypeLoading: false,
  customizationSubTypeLoading: false,
  crudCustomizationTypeLoading: false,
  crudCustomizationSubTypeLoading: false,
  failedProductUpdates: [],
  selectedCustomizationType: initCustomizationType,
  selectedCustomizationSubType: initCustomizationSubType,
};

const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setCustomizationTypeList: (state, action) => {
      state.customizationTypeList = action.payload;
    },
    setCustomizationSubTypeList: (state, action) => {
      state.customizationSubTypeList = action.payload;
    },
    setCustomizationTypeLoading: (state, action) => {
      state.customizationTypeLoading = action.payload;
    },
    setCrudCustomizationTypeLoading: (state, action) => {
      state.crudCustomizationTypeLoading = action.payload;
    },
    setCustomizationSubTypeLoading: (state, action) => {
      state.customizationSubTypeLoading = action.payload;
    },
    setCrudCustomizationSubTypeLoading: (state, action) => {
      state.crudCustomizationSubTypeLoading = action.payload;
    },
    setFailedProductUpdates: (state, action) => {
      state.failedProductUpdates = action.payload;
    },
    setSelectedCustomizationType: (state, action) => {
      state.selectedCustomizationType = action.payload;
    },
    setSelectedCustomizationSubType: (state, action) => {
      state.selectedCustomizationSubType = action.payload;
    },
  },
});

export const {
  setPage,
  setCustomizationTypeList,
  customizationTypeLoading,
  setCustomizationTypeLoading,
  setCustomizationSubTypeList,
  setSelectedCustomizationType,
  setCustomizationSubTypeLoading,
  setSelectedCustomizationSubType,
  setCrudCustomizationTypeLoading,
  setCrudCustomizationSubTypeLoading,
  setFailedProductUpdates,
} = customizationSlice.actions;
export default customizationSlice.reducer;
