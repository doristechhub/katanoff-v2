import { createSlice } from '@reduxjs/toolkit';
import { initMessageObj } from 'src/_helpers/constants';

export const initApproveReturn = {
  imageFile: [],
  previewImage: [],
  deleteUploadedShippingLabel: [],
};

export const initRejectReturn = {
  adminNote: '',
};

export const initRefundReturn = {
  refundAmount: '',
  refundDescription: '',
};

export const returnStatusList = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Received', value: 'received' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const orderStatusListForUpdate = [
  { label: 'Shipped', value: 'shipped' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Delivered', value: 'delivered' },
];

export const returnPaymentStatusList = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Failed Refund', value: 'failed_refund' },
  { label: 'Pending Refund', value: 'pending_refund' },
  { label: 'Cancelled Refund', value: 'cancelled_refund' },
  { label: 'Refund Initialization Failed', value: 'refund_initialization_failed' },
];

const initialState = {
  returnPage: 0,
  returnList: [],
  selectedReturn: {}, //view single order in orderDetail page
  refundReturnPage: 0,
  returnRefundList: [],
  returnLoading: false,
  crudReturnLoading: false, //update operation
  returnRefundLoader: false,
  refundReturnLoading: false,
  refundReturnMessage: initMessageObj,
  rejectReturnLoading: false,
  recievedReturnLoading: false,
  selectedRefundReturn: initRefundReturn,
  selectedRejectReturn: initRejectReturn,
  selectedApproveReturn: initApproveReturn,
};

const returnSlice = createSlice({
  initialState,
  name: 'returns', // with Return Refund
  reducers: {
    setReturnPage: (state, action) => {
      state.returnPage = action.payload;
    },
    setRefundReturnPage: (state, action) => {
      state.refundReturnPage = action.payload;
    },
    setReturnList: (state, action) => {
      state.returnList = action.payload;
    },
    setReturnLoading: (state, action) => {
      state.returnLoading = action.payload;
    },
    setSelectedReturn: (state, action) => {
      state.selectedReturn = action.payload;
    },
    setCrudReturnLoading: (state, action) => {
      state.crudReturnLoading = action.payload;
    },
    setRejectReturnLoading: (state, action) => {
      state.rejectReturnLoading = action.payload;
    },
    setSelectedApproveReturn: (state, action) => {
      state.selectedApproveReturn = action.payload;
    },
    setSelectedRejectReturn: (state, action) => {
      state.selectedRejectReturn = action.payload;
    },
    setRecievedReturnLoading: (state, action) => {
      state.recievedReturnLoading = action.payload;
    },
    setRefundReturnLoading: (state, action) => {
      state.refundReturnLoading = action.payload;
    },
    setRefundReturnMessage: (state, action) => {
      state.refundReturnMessage = action.payload;
    },
    setSelectedRefundReturn: (state, action) => {
      state.selectedRefundReturn = action.payload;
    },

    //Return Refund
    setReturnRefundList: (state, action) => {
      state.returnRefundList = action.payload;
    },
    setReturnRefundLoader: (state, action) => {
      state.returnRefundLoader = action.payload;
    },
  },
});

export const {
  setReturnList,
  setReturnPage,
  setReturnLoading,
  setSelectedReturn,
  setReturnRefundList,
  setRefundReturnPage,
  setCrudReturnLoading,
  setReturnRefundLoader,
  setRejectReturnLoading,
  setRefundReturnLoading,
  setRefundReturnMessage,
  setSelectedRefundReturn,
  setSelectedRejectReturn,
  setSelectedApproveReturn,
  setRecievedReturnLoading,
} = returnSlice.actions;
export default returnSlice.reducer;
