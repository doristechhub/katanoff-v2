import { messageType } from "@/_helper/constants";
import { paymentService } from "@/_services";
import {
  setCheckPIStatusLoader,
  setPaymentIntentLoader,
  setPaymentIntentMessage,
  setPaymentMessage,
  setPaymentStatusLoader,
  setPaymentStatusMessage,
  setPaypalPaymentLoader,
  setPaypalPaymentMessage,
} from "@/store/slices/paymentSlice";

export const handleCreatePaymentIntentError = (message = "") => {
  return (dispatch) => {
    dispatch(
      setPaymentIntentMessage({
        type: message ? messageType.ERROR : "",
        message,
      })
    );
  };
};

export const createPaymentIntent = (payload, abortController) => {
  return async (dispatch) => {
    try {
      dispatch(setPaymentIntentMessage({ type: "", message: "" }));
      dispatch(setPaymentIntentLoader(true));

      const response = await paymentService.createPaymentIntent(
        payload,
        abortController
      );
      if (response?.success) {
        return response.encoded;
      } else {
        dispatch(
          setPaymentIntentMessage({
            message: response?.message || "Something went wrong",
            type: messageType.ERROR,
          })
        );
        return false;
      }
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong";
      dispatch(
        setPaymentIntentMessage({
          message: errorMessage,
          type: messageType.ERROR,
        })
      );
      return false;
    } finally {
      dispatch(setPaymentIntentLoader(false));
    }
  };
};

export const createOrderForPaypal = (payload, abortController) => {
  return async (dispatch) => {
    try {
      dispatch(setPaypalPaymentMessage({ type: "", message: "" }));
      dispatch(setPaypalPaymentLoader(true));
      const response = await paymentService.createOrderForPaypal(
        payload, abortController
      );
      if (response?.success) {
        return response.encoded;
      } else {
        dispatch(
          setPaypalPaymentMessage({
            message: response?.message || "Something went wrong",
            type: messageType.ERROR,
          })
        );
        return false;
      }
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong";
      dispatch(
        setPaypalPaymentMessage({
          message: errorMessage,
          type: messageType.ERROR,
        })
      );
      return false;
    } finally {
      dispatch(setPaypalPaymentLoader(false));
    }
  };
};

export const checkPaymentIntentStatus = (payload, abortController) => {
  return async (dispatch) => {
    try {
      dispatch(setPaymentIntentMessage({ type: "", message: "" }));
      dispatch(setCheckPIStatusLoader(true));

      const response = await paymentService.checkPaymentIntentStatus(
        payload,
        abortController
      );
      if (response?.success) {
        return response?.data;
      } else {
        dispatch(
          setPaymentIntentMessage({
            message: response?.message || "Something went wrong",
            type: messageType.ERROR,
          })
        );
        return false;
      }
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong";
      dispatch(
        setPaymentIntentMessage({
          message: errorMessage,
          type: messageType.ERROR,
        })
      );
      return false;
    } finally {
      dispatch(setCheckPIStatusLoader(false));
    }
  };
};

export const cancelPaymentIntent = (payload) => {
  return async (dispatch) => {
    try {
      const response = await paymentService.cancelPaymentIntent(payload);
      if (response?.success) {
        return response?.data;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
};

export const updateBillingAddress = (payload) => {
  return async (dispatch) => {
    try {
      const response = await paymentService.updateBillingAddress(payload);
      if (response) {
        return response;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
};

export const updatePaymentStatus = (payload) => async (dispatch) => {
  try {
    dispatch(setPaymentStatusMessage({ message: "", type: "" }));
    dispatch(setPaymentStatusLoader(false));

    const response = await paymentService.updatePaymentStatus(payload);

    if (response?.success) {
      return response?.data;
    }
    dispatch(
      setPaymentStatusMessage({
        message: response?.message,
        type: messageType.ERROR,
      })
    );
    return false;
  } catch (error) {
    dispatch(
      setPaymentStatusMessage({
        message: error?.message,
        type: messageType.ERROR,
      })
    );
    return false;
  } finally {
    dispatch(setPaymentStatusLoader(false));
  }
};


export const insertPaypalOrder = (payload) => async (dispatch) => {
  try {
    const response = await paymentService.insertPaypalOrder(payload)
    if (response?.success) {
      return response;
    }

    dispatch(
      setPaypalPaymentMessage({
        message: response?.message || "Failed to complete PayPal payment.",
        type: messageType.ERROR,
      })
    );
    return false
  } catch (error) {
    dispatch(
      setPaymentMessage({
        message: "Unable to create PayPal order.",
        type: messageType.ERROR,
      })
    );
    throw error;
  }
}


export const paypalCaptureOrder = (payload) => async (dispatch) => {
  try {
    dispatch(setPaypalPaymentLoader(true));


    const response = await paymentService.paypalCaptureOrder(payload);

    if (response?.success) {
      return response;
    }
    dispatch(
      setPaymentStatusMessage({
        message: response?.message,
        type: messageType.ERROR,
      })
    );
    return false;
  } catch (error) {
    console.error("PayPal approval error:", error);
    dispatch(
      setPaypalPaymentMessage({
        message: "Failed to complete PayPal payment.",
        type: messageType.ERROR,
      })
    );
    return false;
  } finally {
    dispatch(setPaypalPaymentLoader(false));
  }
};
