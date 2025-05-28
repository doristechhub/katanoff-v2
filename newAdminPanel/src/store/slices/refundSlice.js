import { createSlice } from '@reduxjs/toolkit';

export const initRefundPayment = {
  refundDescription: '',
};

const initialState = {
  orderRefundPage: 0,
  orderRefundList: [],
  orderRefundLoader: false,
  orderRefundPaymentLoading: false,
  selectedOrderRefund: initRefundPayment,
};

// Used Order and Returns //
export const refundStatuses = [
  { label: 'All', value: 'all' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Failed Refund', value: 'failed_refund' },
  { label: 'Pending Refund', value: 'pending_refund' },
  { label: 'Cancelled Refund', value: 'cancelled_refund' },
  { label: 'Refund Initialization Failed', value: 'refund_initialization_failed' },
];

const refundSlice = createSlice({
  name: 'refund', // Order Refund Slice
  initialState,
  reducers: {
    setOrderRefundPage: (state, action) => {
      state.orderRefundPage = action.payload;
    },
    setOrderRefundList: (state, action) => {
      state.orderRefundList = action.payload;
    },
    setOrderRefundLoader: (state, action) => {
      state.orderRefundLoader = action.payload;
    },
    setSelectedOrderRefund: (state, action) => {
      state.selectedOrderRefund = action.payload;
    },
    setOrderRefundPaymentLoading: (state, action) => {
      state.orderRefundPaymentLoading = action.payload;
    },
  },
});

export const {
  setOrderRefundPage,
  setOrderRefundList,
  setOrderRefundLoader,
  setSelectedOrderRefund,
  setOrderRefundPaymentLoading,
} = refundSlice.actions;
export default refundSlice.reducer;
