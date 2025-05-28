import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminPermisisonsLoader : true,
  adminWisePermisisons : [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminPermissionsLoader: (state, action) => {
      state.adminPermisisonsLoader = action.payload;
    },
    setAdminWisePermisisons: (state, action) => {
      state.adminWisePermisisons = action.payload;
    }
  },
});

export const {
  setAdminPermissionsLoader, 
  setAdminWisePermisisons
 } = adminSlice.actions;
export default adminSlice.reducer;