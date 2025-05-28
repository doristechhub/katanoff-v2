import { appointmentService } from "../_services/appointment.service";
import { messageType } from "@/_helper/constants";
import {
  setAppointmentLoading,
  setAppointmentMessage,
} from "@/store/slices/appointmentSlice";

export const bookNewAppointment = (payload) => async (dispatch) => {
  try {
    dispatch(setAppointmentLoading(true));

    const res = await appointmentService.addNewAppointment(payload);

    if (res) {
      dispatch(
        setAppointmentMessage({
          message:
            "Success! Your appointment request has been received. We'll send you confirmation email!",
          type: messageType.SUCCESS,
        })
      );
      dispatch(setAppointmentLoading(false));
      return res;
    }
  } catch (e) {
    dispatch(setAppointmentLoading(false));
    dispatch(
      setAppointmentMessage({ message: e.message, type: messageType.ERROR })
    );
    return false;
  }
};
