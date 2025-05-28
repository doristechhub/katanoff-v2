import { messageType } from "@/_helper";
import { contactService } from "@/_services";
import {
  setContactLoading,
  setContactMessage,
} from "@/store/slices/contactSlice";

export const sendContact = (payload) => async (dispatch) => {
  try {
    dispatch(setContactLoading(true));
    dispatch(setContactMessage({ message: "", type: "" }));
    const res = await contactService.sendContactDetails(payload);

    if (res?.status === 200) {
      dispatch(
        setContactMessage({
          message:
            "Thank you for contacting us. We'll get back to you shortly.",
          type: messageType.SUCCESS,
        })
      );
      return true;
    } else {
      dispatch(
        setContactMessage({
          message: "Failed to contact us.",
          type: messageType.ERROR,
        })
      );
      return false;
    }
  } catch (error) {
    dispatch(
      setContactMessage({
        message: error?.message || "Something went wrong.",
        type: messageType.ERROR,
      })
    );
    return false;
  } finally {
    dispatch(setContactLoading(false));
  }
};
