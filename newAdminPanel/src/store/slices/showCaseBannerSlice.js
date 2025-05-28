import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showCaseBannersList: [],
  showCaseBannerLoading: true,
  crudShowCaseBannerLoading: false,
};

const showCaseBannerSlice = createSlice({
  initialState,
  name: 'showCaseBanner',
  reducers: {
    setShowCaseBannersList: (state, action) => {
      state.showCaseBannersList = action.payload;
    },
    setShowCaseBannerLoading: (state, action) => {
      state.showCaseBannerLoading = action.payload;
    },
    setCrudShowCaseBannerLoading: (state, action) => {
      state.crudShowCaseBannerLoading = action.payload;
    },
  },
});

export const { setShowCaseBannersList, setShowCaseBannerLoading, setCrudShowCaseBannerLoading } =
  showCaseBannerSlice.actions;
export default showCaseBannerSlice.reducer;
