import { messageType } from "@/_helper/constants";
import { subscribersService } from "@/_services";
import {
  setSubscriberMessage,
  setSubscriberLoading,
} from "@/store/slices/subscriberSlice";

export const createSubscriber = (payload) => {
  return async (dispatch) => {
    dispatch(setSubscriberMessage({ message: "", type: "" }));
    dispatch(setSubscriberLoading(true));
    try {
      const response = await subscribersService?.addNewSubscriber(payload);
      if (response) {
        dispatch(
          setSubscriberMessage({
            message: "Congratulations! You're now subscribed! 🎉",
            type: messageType.SUCCESS,
          })
        );
        return true;
      }
    } catch (e) {
      dispatch(setSubscriberLoading(false));
      const errorMessage = e.message || "something went wrong";
      dispatch(
        setSubscriberMessage({ message: errorMessage, type: messageType.ERROR })
      );
      return false;
    } finally {
      dispatch(setSubscriberLoading(false));
    }
  };
};
