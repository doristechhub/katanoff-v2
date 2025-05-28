import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  returnLoader: false,
  returnsList: [],
  detailLoader: false,
  trackReturnLoading: false,
  returnDetail: {},
  currentPage: 0,
  returnReqLoader: false,
  deleteReturnReqLoader: false,
  cancelReturnReqLoader: false,
  returnMessage: { message: "", type: "" },
  selectedProducts: [],
  returnOrder: "",
};

const returnSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {
    setReturnsList: (state, action) => {
      state.returnsList = action.payload;
    },
    setReturnLoader: (state, action) => {
      state.returnLoader = action.payload;
    },
    setReturnDetail: (state, action) => {
      state.returnDetail = action.payload;
    },
    setReturnRequestLoader: (state, action) => {
      state.returnReqLoader = action.payload;
    },
    setDeleteReturnRequestLoader: (state, action) => {
      state.deleteReturnReqLoader = action.payload;
    },
    setCancelReturnRequestLoader: (state, action) => {
      state.cancelReturnReqLoader = action.payload;
    },
    setReturnMessage: (state, action) => {
      state.returnMessage = action.payload;
    },
    clearReturnMessage: (state) => {
      state.returnMessage = { message: "", type: "" };
    },
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setReturnOrder: (state, action) => {
      state.returnOrder = action.payload;
    },
    setTrackReturnLoading: (state, action) => {
      state.trackReturnLoading = action.payload;
    },
  },
});

export const {
  setReturnsList,
  setReturnDetail,
  setReturnLoader,
  setReturnRequestLoader,
  setDeleteReturnRequestLoader,
  setCancelReturnRequestLoader,
  setReturnMessage,
  clearReturnMessage,
  setCurrentPage,
  setSelectedProducts,
  setReturnOrder,
  setTrackReturnLoading,
} = returnSlice.actions;

export default returnSlice.reducer;
