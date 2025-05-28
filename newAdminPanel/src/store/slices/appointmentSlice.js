import { createSlice } from '@reduxjs/toolkit';

export const initRejectReason = { rejectReason: '' };

const initialState = {
  apptItem: {},
  appointmentPage: 0,
  appointmentList: [],
  appointmentLoader: false,
  showApptDetailModel: false,
  crudAppointmentLoading: false,
  rejectAppointmentLoading: false,
  rejectAppointmentReason: initRejectReason,
};

/**
 * @param {*} MUI color in chip
 */
// 'default'
// | 'primary'
// | 'secondary'
// | 'error'
// | 'info'
// | 'success'
// | 'warning'
// | string

export const getStatusWiseTagBg = (status) => {
  switch (status) {
    case 'pending':
      return 'info';
    case 'rejected':
      return 'error';
    case 'approved':
      return 'success';
    default:
      return 'primary';
  }
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setApptItem: (state, action) => {
      state.apptItem = action.payload;
    },
    setAppointmentPage: (state, action) => {
      state.appointmentPage = action.payload;
    },
    setAppointmentList: (state, action) => {
      state.appointmentList = action.payload;
    },
    setAppointmentLoader: (state, action) => {
      state.appointmentLoader = action.payload;
    },
    setShowApptDetailModel: (state, action) => {
      state.showApptDetailModel = action.payload;
    },
    setCrudAppointmentLoading: (state, action) => {
      state.crudAppointmentLoading = action.payload;
    },
    setRejectAppointmentReason: (state, action) => {
      state.rejectAppointmentReason = action.payload;
    },
    setRejectAppointmentLoading: (state, action) => {
      state.rejectAppointmentLoading = action.payload;
    },
  },
});

export const {
  setApptItem,
  setAppointmentPage,
  setAppointmentList,
  setAppointmentLoader,
  setShowApptDetailModel,
  setCrudAppointmentLoading,
  setRejectAppointmentReason,
  setRejectAppointmentLoading,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
