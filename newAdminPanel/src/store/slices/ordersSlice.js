import { createSlice } from '@reduxjs/toolkit';

export const initOrderStatus = {
  status: '',
  trackingNumber: '',
};

export const initCancelOrder = {
  cancelReason: '',
};

export const orderStatusList = [
  { label: 'All', value: 'all' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Pending', value: 'pending' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Delivered', value: 'delivered' },
];

export const orderStatusListForUpdate = [
  { label: 'Shipped', value: 'shipped' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Delivered', value: 'delivered' },
];

export const paymentStatusList = [
  { label: 'All', value: 'all' },
  { label: 'Failed', value: 'failed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Success', value: 'success' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Failed Refund', value: 'failed_refund' },
  { label: 'Pending Refund', value: 'pending_refund' },
  { label: 'Cancelled Refund', value: 'cancelled_refund' },
  { label: 'Refund Initialization Failed', value: 'refund_initialization_failed' },
];

const initialState = {
  orderPage: 0,
  ordersList: [],
  selectedOrder: {}, //view single order in orderDetail page
  ordersLoading: false,
  crudOrdersLoading: false, //update operation
  cancelOrderLoading: false,
  selectedOrderStatus: initOrderStatus,
  selectedCancelOrder: initCancelOrder,
};

const ordersSlice = createSlice({
  initialState,
  name: 'orders',
  reducers: {
    setOrderPage: (state, action) => {
      state.orderPage = action.payload;
    },
    setOrdersList: (state, action) => {
      state.ordersList = action.payload;
    },
    setOrdersLoading: (state, action) => {
      state.ordersLoading = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setCrudOrdersLoading: (state, action) => {
      state.crudOrdersLoading = action.payload;
    },
    setCancelOrderLoading: (state, action) => {
      state.cancelOrderLoading = action.payload;
    },
    setSelectedOrderStatus: (state, action) => {
      state.selectedOrderStatus = action.payload;
    },
    setSelectedCancelOrder: (state, action) => {
      state.selectedCancelOrder = action.payload;
    },
  },
});

export const {
  setOrderPage,
  setOrdersList,
  setOrdersLoading,
  setSelectedOrder,
  setCrudOrdersLoading,
  setCancelOrderLoading,
  setSelectedOrderStatus,
  setSelectedCancelOrder,
} = ordersSlice.actions;
export default ordersSlice.reducer;
