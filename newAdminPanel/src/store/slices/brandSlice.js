import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brandLoading: true,
  crudBrandLoading: false,
  brandsList: [],
  perPageCount: 12,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setBrandLoading: (state, action) => {
      state.brandLoading = action.payload;
    },
    setCrudBrandLoading: (state, action) => {
      state.crudBrandLoading = action.payload;
    },
    setBrandsList: (state, action) => {
      state.brandsList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
  },
});

export const { setBrandsList, setBrandLoading, setCrudBrandLoading, setPerPageCount } =
  brandSlice.actions;
export default brandSlice.reducer;
