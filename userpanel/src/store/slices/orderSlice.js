import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  orderList: [],
  orderDetail: null,
  orderLoading: false,
  orderMessage: { message: "", type: "" },
  cancelOrderLoading: false,
  currentPage: 0,
  orderDetailLoading: false,
  invoiceLoading: false,
  selectedOrder: "",
  trackOrderLoading: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Order History States
    setOrderList: (state, action) => {
      state.orderList = action.payload;
    },
    setOrderDetail: (state, action) => {
      state.orderDetail = action.payload;
    },
    setOrderDetailLoading: (state, action) => {
      state.orderDetailLoading = action.payload;
    },
    // Order Detail Invoice Download Loading State
    setInvoiceLoading: (state, action) => {
      state.invoiceLoading = action.payload;
    },
    // 
    setOrderLoading: (state, action) => {
      state.orderLoading = action.payload;
    },
    setCancelOrderLoading: (state, action) => {
      state.cancelOrderLoading = action.payload;
    },
    setOrderMessage: (state, action) => {
      state.orderMessage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setTrackOrderLoading: (state, action) => {
      state.trackOrderLoading = action.payload;
    },

  },
});

export const {
  setSelectedOrder,
  setOrderList,
  setOrderLoading,
  setCurrentPage,
  setCancelOrderLoading,
  setOrderMessage,
  setOrderDetail,
  setOrderDetailLoading,
  setInvoiceLoading,
  setShowSummary,
  setSubmittedData,
  setTrackOrderLoading
} = orderSlice.actions;

export default orderSlice.reducer;
