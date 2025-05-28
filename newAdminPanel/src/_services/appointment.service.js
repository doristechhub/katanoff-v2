import axios from 'axios';
import { toast } from 'react-toastify';
import { appointmentsUrl, fetchWrapperService, helperFunctions, sanitizeObject } from '../_helpers';

const getAllAppointmentList = () => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(appointmentsUrl);
      const appointmentData = respData ? Object.values(respData) : [];
      const sortedData = helperFunctions.sortByField([...appointmentData]);
      resolve(sortedData);
    } catch (e) {
      reject(e);
    }
  });
};

const updateAppointmentStatus = async (payload, abortController) => {
  try {
    if (Object.values(payload)?.length) {
      const signal = abortController && abortController.signal;
      const response = await axios.post(
        '/appointments/updateAppointmentStatus',
        sanitizeObject(payload),
        { signal }
      );
      const { status, message } = response.data;

      if (status === 200) {
        toast.success('Appointment status has been updated successfully');
        return response?.data;
      } else {
        toast.error(message);
        return false;
      }
    } else {
      toast.error('Something went wrong!');
      return false;
    }
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const deleteAppointment = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { appointmentId } = sanitizeObject(params);
      if (appointmentId) {
        const apptData = await fetchWrapperService.findOne(appointmentsUrl, {
          id: appointmentId,
        });
        if (apptData) {
          if (apptData.appointmentStatus === 'pending') {
            reject(new Error("Unable to delete. Appointment status is 'pending'."));
            return;
          }
          await fetchWrapperService._delete(`${appointmentsUrl}/${appointmentId}`);
          resolve(true);
        } else {
          reject(new Error('Appointment not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const appointmentService = {
  getAllAppointmentList,
  updateAppointmentStatus,
  deleteAppointment,
};
