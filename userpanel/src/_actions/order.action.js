import { messageType } from "@/_helper/constants";
import { orderService } from "@/_services";

import {
  setCancelOrderLoading,
  setOrderDetailLoading,
  setOrderDetail,
  setOrderList,
  setOrderLoading,
  setOrderMessage,
  setInvoiceLoading,
  setTrackOrderLoading,
} from "@/store/slices/orderSlice";
import {
  setVerifyOrderLoader,
  setVerifyOrderMessage,
} from "@/store/slices/paymentSlice";

// actions/orderActions.js or similar
export const fetchOrderHistory = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const orderData = await orderService.getAllOrderList();

      if (orderData) {
        dispatch(setOrderList(orderData));
      } else {
        dispatch(setOrderList([]));
      }
    } catch (e) {
      console.error("Error fetching order history:", e);
      dispatch(setOrderList([]));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const orderCancel = (payload, abortController) => {
  return async (dispatch) => {
    dispatch(setOrderMessage({ message: "", type: "" }));
    dispatch(setCancelOrderLoading(true));
    try {
      const response = await orderService.cancelOrder(payload, abortController);
      const { status, message } = response;
      if (status === 200) {
        dispatch(
          setOrderMessage({
            message:
              "Your order has been cancelled and refund will be initiated",
            type: messageType.SUCCESS,
          })
        );
        return true;
      }
      dispatch(setOrderMessage({ message, type: messageType.ERROR }));
      return false;
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        dispatch(
          setOrderMessage({
            message: error?.message,
            type: messageType.ERROR,
          })
        );
      }
      return false;
    } finally {
      dispatch(setCancelOrderLoading(false));
    }
  };
};

export const fetchOrderDetail = (orderId) => {
  return async (dispatch) => {
    dispatch(setOrderDetailLoading(true));
    try {
      const orderDetail = await orderService.getOrderDetailByOrderId(orderId);
      if (orderDetail) {
        dispatch(setOrderDetail(orderDetail));
        return orderDetail;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      dispatch(setOrderDetailLoading(false));
    }
  };
};

export const deleteOrder = (orderId) => {
  return async (dispatch) => {
    try {
      const response = await orderService.deleteOrder(orderId);
      if (response) {
        return response;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
};

export const downloadOrderInvoice = (orderNumber) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const response = await orderService.downloadOrderInvoice(orderNumber);
      if (response?.success) {
        return response;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      dispatch(setInvoiceLoading(false));
    }
  };
};

export const verifyOrder = (orderId) => {
  return async (dispatch) => {
    dispatch(setVerifyOrderLoader(true));
    dispatch(setVerifyOrderMessage({ message: "", type: "" }));

    try {
      const response = await orderService.verifyOrder(orderId);
      if (response?.success) {
        dispatch(setOrderDetail(response?.orderDetail));
        dispatch(setIsVerifiedOrder(true));
        return response;
      }
      dispatch(
        setVerifyOrderMessage({
          message: response.message,
          type: messageType.ERROR,
        })
      );
      return false;
    } catch (error) {
      return false;
    } finally {
      dispatch(setVerifyOrderLoader(false));
    }
  };
};

export const fetchInvoiceOrderDetail = (orderId) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true));
    try {
      const orderDetail = await orderService.getOrderDetailByOrderId(orderId);
      if (orderDetail) {
        dispatch(setOrderDetail(orderDetail));
        return orderDetail;
      }
      return false;
    } catch (e) {
      dispatch(setInvoiceLoading(false));
      console.log('error', e)
      return false;
    }
  };
};

export const fetchTrackOrderByOrderNumberAndEmail = (payload) => {
  return async (dispatch) => {
    dispatch(setOrderDetailLoading(true));
    dispatch(setOrderMessage({ message: "", type: "" }));
    dispatch(setOrderDetail(null));
    dispatch(setTrackOrderLoading(true));
    try {
      const orderDetail = await orderService.trackOrderByOrderNumberAndEmail(
        payload
      );
      if (orderDetail) {
        dispatch(setOrderDetail(orderDetail));
        return orderDetail;
      }
      return false;
    } catch (e) {
      dispatch(
        setOrderMessage({ message: e?.message, type: messageType.ERROR })
      );
      return false;
    } finally {
      dispatch(setOrderDetailLoading(false));
      dispatch(setTrackOrderLoading(false));
    }
  };
};

// export const handleCancelOrderError = (payload) => {
//   return async (dispatch, getState) => {
//     dispatch({
//       type: actionTypes.CANCEL_ORDER_ERROR,
//       setCancelOrderError: payload.setCancelOrderError,
//     });
//   };
// };

// export const fetchTopSellingProducts = () => {
//   return async (dispatch, getState) => {
//     try {
//       const topSellingProducts = await orderService.getTopSellingProducts();
//       if (topSellingProducts) {
//         dispatch({
//           type: actionTypes.FETCH_TOP_SELLING_PRODUCTS,
//           topSellingProducts: topSellingProducts,
//         });
//         return topSellingProducts;
//       }
//       return false;
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_TOP_SELLING_PRODUCTS,
//         topSellingProducts: [],
//       });
//       return false;
//     }
//   };
// };
