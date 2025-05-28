import { createSlice } from "@reduxjs/toolkit";

export const currentYear = new Date().getFullYear();

const initialState = {
  dashLoader: false,
  dashboardDetail : {},
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashLoader: (state, action) => {
      state.dashLoader = action.payload;
    },
    setDashboardDetail: (state, action) => {
      state.dashboardDetail = action.payload;
    }
  },
});

export const { 
  setDashLoader,
  setDashboardDetail
 } = dashboardSlice.actions;
export default dashboardSlice.reducer;