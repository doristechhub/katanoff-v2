import { toast } from 'react-toastify';

import { toastError } from '.';
import {
  setAppointmentList,
  setAppointmentLoader,
  setCrudAppointmentLoading,
  setRejectAppointmentLoading,
} from 'src/store/slices/appointmentSlice';
import { helperFunctions } from 'src/_helpers';
import { appointmentService } from 'src/_services';

// ----------------------------------------------------------------------

export const getAppointmentList = () => async (dispatch) => {
  try {
    dispatch(setAppointmentLoader(true));
    const res = await dispatch(appointmentService.getAllAppointmentList());

    if (res) {
      let list = res?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setAppointmentList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setAppointmentLoader(false));
  }
};

export const deleteAppointment = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudAppointmentLoading(true));
    const res = await appointmentService.deleteAppointment(payload);

    if (res) {
      toast.success('Appointment deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudAppointmentLoading(false));
  }
};

export const updateStatusAppointment = (payload, abortController) => async (dispatch) => {
  try {
    if (payload?.appointmentStatus === 'rejected') dispatch(setRejectAppointmentLoading(true));
    else dispatch(setCrudAppointmentLoading(true));

    const res = await appointmentService.updateAppointmentStatus(payload, abortController);

    if (res) return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    if (payload?.appointmentStatus === 'rejected') dispatch(setRejectAppointmentLoading(false));
    else dispatch(setCrudAppointmentLoading(false));
  }
};
