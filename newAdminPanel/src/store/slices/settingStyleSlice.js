import { createSlice } from '@reduxjs/toolkit';

export const initSettingStyle = {
  title: '',
  imageFile: [],
  previewImage: [],
  deleteUploadedImage: [],
};

const initialState = {
  settingStyleList: [],
  settingStyleLoading: false,
  crudSettingStyleLoading: false,
  selectedSettingStyle: initSettingStyle,
};

const settingStyleSlice = createSlice({
  name: 'settingStyle',
  initialState,
  reducers: {
    setSettingStyleLoading: (state, action) => {
      state.settingStyleLoading = action.payload;
    },
    setSettingStyleList: (state, action) => {
      state.settingStyleList = action.payload;
    },
    setCrudSettingStyleLoading: (state, action) => {
      state.crudSettingStyleLoading = action.payload;
    },
    setSelectedSettingStyle: (state, action) => {
      state.selectedSettingStyle = action.payload;
    },
  },
});

export const {
  setSettingStyleList,
  setSettingStyleLoading,
  setSelectedSettingStyle,
  setCrudSettingStyleLoading,
} = settingStyleSlice.actions;
export default settingStyleSlice.reducer;
