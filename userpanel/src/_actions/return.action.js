import {
  setReturnsList,
  setReturnDetail,
  setDeleteReturnRequestLoader,
  setReturnMessage,
  setReturnRequestLoader,
  setReturnLoader,
  setCancelReturnRequestLoader,
  setTrackReturnLoading,
} from "@/store/slices/returnSlice";

import { returnService, orderService } from "@/_services";
import { messageType } from "@/_helper/constants";
import { setOrderDetail, setOrderLoading } from "@/store/slices/orderSlice";

export const fetchReturnsHistory = () => async (dispatch) => {
  dispatch(setReturnLoader(true));
  try {
    const returnsData = await returnService.getUserReturnsList();
    dispatch(setReturnsList(returnsData || []));
  } catch (error) {
    console.error("Failed to fetch returns history:", error);
    dispatch(setReturnsList([]));
  } finally {
    dispatch(setReturnLoader(false));
  }
};

export const fetchTrackReturnByOrderNumberAndEmail = (payload) => {
  return async (dispatch) => {
    dispatch(setReturnLoader(true));
    dispatch(setTrackReturnLoading(true));
    dispatch(setReturnMessage({ message: "", type: "" }));
    dispatch(setReturnDetail(null));
    try {
      const returnDetail = await returnService.trackReturnByOrderNumberAndEmail(
        payload
      );
      if (returnDetail) {
        dispatch(setReturnDetail(returnDetail));
        return returnDetail;
      }
      return false;
    } catch (e) {
      dispatch(
        setReturnMessage({ message: e?.message, type: messageType.ERROR })
      );
      return false;
    } finally {
      dispatch(setReturnLoader(false));
      dispatch(setTrackReturnLoading(false));
    }
  };
};

export const fetchReturnDetail = (returnId) => async (dispatch) => {
  try {
    dispatch(setReturnLoader(true)); // Start loading

    const returnDetail = await returnService.getReturnDetailByReturnId(
      returnId
    );

    dispatch(setReturnDetail(returnDetail || {}));

    return returnDetail || false;
  } catch (error) {
    console.error("Failed to fetch return detail:", error);
    dispatch(setReturnDetail({})); // Always reset on error
    return false;
  } finally {
    dispatch(setReturnLoader(false)); // Stop loading regardless of success or error
  }
};

export const fetchOrderDetailByOrderId = (orderId) => async (dispatch) => {
  try {
    dispatch(setOrderLoading(true));
    const orderDetail = await orderService.getOrderDetailByOrderId(orderId);
    if (orderDetail) {
      orderDetail.products = orderDetail.products.map((item) => ({
        ...item,
        returnQuantity: item.cartQuantity,
        isChecked: false,
      }));
      dispatch(setOrderDetail(orderDetail));
      return orderDetail;
    }
    return false;
  } catch (err) {
    dispatch(setOrderDetail({}));
    return false;
  } finally {
    dispatch(setOrderLoading(false)); // End loading
  }
};

export const createReturnRequest = (payload) => async (dispatch) => {
  dispatch(setReturnMessage({ message: "", type: "" }));
  dispatch(setReturnRequestLoader(true));
  try {
    const response = await returnService.insertReturnRequest(payload);
    if (response) {
      // toasterService.success(
      //   "Your return request has been successfully submitted. Please await confirmation"
      // );
      const message =
        "Your return request has been successfully submitted. Please await confirmation";

      dispatch(setReturnMessage({ message, type: messageType.SUCCESS }));

      return true;
    }
    return false;
  } catch (err) {
    const message = err?.message || "Something went wrong";
    dispatch(setReturnMessage({ message, type: messageType.ERROR }));
    return false;
  } finally {
    dispatch(setReturnRequestLoader(false));
  }
};

export const cancelReturnRequest = (payload) => async (dispatch) => {
  dispatch(setReturnMessage({ message: "", type: "" }));
  dispatch(setCancelReturnRequestLoader(true));

  try {
    const response = await returnService.cancelReturnRequest(payload);
    if (response) {
      // toasterService.success("Your return request has been cancelled");
      const message = "Your return request has been Cancelled";

      dispatch(setReturnMessage({ message, type: messageType.SUCCESS }));
      return true;
    }
    return false;
  } catch (err) {
    const message = err?.message || "Something went wrong";
    dispatch(setReturnMessage({ message, type: messageType.ERROR }));
    return false;
  } finally {
    dispatch(setCancelReturnRequestLoader(false));
  }
};

export const deleteReturnRequest = (payload) => async (dispatch) => {
  dispatch(setReturnMessage({ message: "", type: "" }));
  dispatch(setDeleteReturnRequestLoader(true));
  try {
    const response = await returnService.deleteReturnRequest(payload);
    if (response) {
      const message = "Your return request has been deleted";

      dispatch(setReturnMessage({ message, type: messageType.SUCCESS }));
      // toasterService.success("Your return request has been deleted");
      return true;
    }
    return false;
  } catch (err) {
    const message = err?.message || "Something went wrong";
    dispatch(setReturnMessage({ message, type: messageType.ERROR }));
    return false;
  } finally {
    dispatch(setDeleteReturnRequestLoader(false));
  }
};
