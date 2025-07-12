import axios from "axios";
import {
  apiUrl,
  fetchWrapperService,
  ordersUrl,
  sanitizeObject,
} from "../_helper";

const createPaymentIntent = (payload, abortController) => {
  return new Promise(async (resolve, reject) => {
    try {
      const signal = abortController?.signal;

      const response = await axios.post(
        `${apiUrl}/stripe/create-payment-intent`,
        sanitizeObject(payload),
        { signal }
      );

      const {
        orderId,
        status,
        clientSecret,
        message,
        paymentIntentId,
        paymentMethod,
      } = response.data;

      if (status === 200 && clientSecret) {
        const secretData = {
          clientSecret,
          orderId,
          paymentIntentId,
          paymentMethod,
        };
        const encoded = btoa(JSON.stringify(secretData));
        resolve({ success: true, encoded });
        return encoded;
      } else {
        resolve({ success: false, message });
      }
    } catch (error) {
      resolve({ success: false, message: error?.message });
    }
  });
};

const checkPaymentIntentStatus = async (payload, abortController) => {
  try {
    if (payload) {
      const signal = abortController && abortController.signal;
      const response = await axios.post(
        "/stripe/check-payment-intent-status",
        sanitizeObject(payload),
        { signal }
      );
      const { status, paymentIntentStatus } = response.data;
      if (status === 200 && paymentIntentStatus) {
        return { success: true, data: response.data };
      }
    }
    return {
      success: false,
      message: "Something went wrong with the payment. Please try again later.",
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
};

const retrivePaymentIntent = async (payload) => {
  try {
    if (payload) {
      const response = await axios.post(
        "/stripe/retrive-payment-intent",
        sanitizeObject(payload)
      );
      const { status, paymentIntent } = response.data;
      if (status === 200 && paymentIntent) {
        return { success: true, data: response.data };
      }
    }
    return {
      success: false,
      message:
        "Something went wrong with the retrive payment intent. Please try again later.",
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
};

const cancelPaymentIntent = (payload) => {
  try {
    if (payload) {
      const response = axios.post(
        "/stripe/cancel-payment-intent",
        sanitizeObject(payload)
      );
      return {
        success: true,
        data: response?.data,
      };
    }
    return {
      success: false,
      message:
        "Something went wrong with the cancel payment intent. Please try again later.",
    };
  } catch (error) {
    console.error("cancel payment error : ", error?.message);
    return {
      success: false,
      message: error?.message,
    };
  }
};

const updateBillingAddress = async (payload) => {
  try {
    const { orderId, billingAddress, paymentMethodDetails } = payload;
    if (payload) {
      const orderData = await fetchWrapperService.findOne(ordersUrl, {
        id: orderId,
      });
      if (orderData) {
        const updatePattern = {
          url: `${ordersUrl}/${orderId}`,
          payload: {
            billingAddress,
            paymentMethodDetails,
          },
        };
        fetchWrapperService
          ._update(updatePattern)
          .then((response) => {
            return true;
          })
          .catch((e) => {
            return false;
          });
      }
    }
  } catch (error) {
    console.error("update billing address error : ", error?.message);
    return false;
  }
};

const updatePaymentStatus = async (payload) => {
  try {
    if (payload) {
      const response = await axios.post(
        "order/updatePaymentStatus",
        sanitizeObject(payload)
      );
      const { status, message, data } = response.data;
      if (status === 200) {
        return { success: true, data };
      }
      return { success: false, message };
    }
    return { success: false, message: "Payload not found" };
  } catch (error) {
    console.log("update payment status error : ", error?.message);
    return { success: false, message: error?.message };
  }
};

const createOrderForPaypal = (payload, abortController) => {
  return new Promise(async (resolve, reject) => {
    try {
      const signal = abortController?.signal;

      const response = await axios.post(
        `${apiUrl}/order/insertOrder`,
        payload,
        { signal }
      );
      const { status, createdOrder, message } = response.data;
      if (status == 200 && createdOrder) {
        const secretData = {
          orderId: createdOrder?.id,
          total: createdOrder?.total,
          paymentMethod: createdOrder?.paymentMethod,
        };
        const encoded = btoa(JSON.stringify(secretData));
        resolve({ success: true, encoded });
        return encoded;
      } else {
        resolve({ success: false, message });
      }
    } catch (error) {
      resolve({ success: false, message: error?.message });
    }
  });
};

const insertPaypalOrder = async (payload) => {
  try {
    if (payload) {
      const response = await axios.post(
        `${apiUrl}/paypal/create-paypal-order`,
        payload
      );

      const { status, message, paypalOrderData } = response.data;
      if (status === 200) {
        return { success: true, paypalOrderData };
      }
      return { success: false, message };
    }
    return { success: false, message: "Payload not found" };
  } catch (error) {
    console.log("update payment status error : ", error?.message);
    return { success: false, message: error?.message };
  }
};

const paypalCaptureOrder = async (payload) => {
  try {
    const captureRes = await axios.post(
      `${apiUrl}/paypal/capture-order`,
      payload
    );
    const { paypalOrderCaptureResult, message } = captureRes.data;
    if (paypalOrderCaptureResult?.status === "COMPLETED") {
      return { success: true, paypalOrderCaptureResult };
    }
    return { success: false, message };
  } catch (error) {
    console.log("update payment status error : ", error?.message);
    return { success: false, message: error?.message };
  }
};

export const paymentService = {
  createPaymentIntent,
  checkPaymentIntentStatus,
  retrivePaymentIntent,
  cancelPaymentIntent,
  updateBillingAddress,
  updatePaymentStatus,
  createOrderForPaypal,
  insertPaypalOrder,
  paypalCaptureOrder,
};
