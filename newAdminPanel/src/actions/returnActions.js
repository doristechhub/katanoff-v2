import { toastError } from '.';

import {
  setReturnList,
  setReturnLoading,
  setSelectedReturn,
  setReturnRefundList,
  setCrudReturnLoading,
  setReturnRefundLoader,
  setRefundReturnLoading,
  setRejectReturnLoading,
} from 'src/store/slices/returnSlice';
import { helperFunctions } from 'src/_helpers';
import { returnService, toast } from 'src/_services';
import { setSelectedOrder } from 'src/store/slices/ordersSlice';

// ----------------------------------------------------------------------

export const getReturnList = () => async (dispatch) => {
  try {
    dispatch(setReturnLoading(true));
    const res = await returnService.getAllReturnsList();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setReturnList(list || []));
      return list;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setReturnLoading(false));
  }
};

export const submitReturnRequest = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudReturnLoading(true));
    const res = await returnService.createApprovedReturnRequest(payload);

    if (res) {
      toast.success(`Return request has been Submitted`);
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudReturnLoading(false));
  }
};

export const rejectReturn = (payload, abortController) => async (dispatch) => {
  try {
    dispatch(setRejectReturnLoading(true));
    const res = await returnService.rejectReturn(payload, abortController);

    if (res) return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setRejectReturnLoading(false));
  }
};

export const approveReturn = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudReturnLoading(true));
    const res = await returnService.approveReturnRequest(payload);
    dispatch(setSelectedOrder({}));
    if (res) {
      // In this it will now be difficult to know whether the request is been updated ot approved as shipping label is now optional so we have written submitted in this
      // toast.success(`Return request has been ${payload?.shippingLabel ? 'updated' : 'approved'}`);
      toast.success(`Return request has been Submitted`);
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudReturnLoading(false));
  }
};

export const recievedReturn = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudReturnLoading(true));
    const res = await returnService.receivedReturn(payload);

    if (res) {
      toast.success(`Received Return request updated successfully`);
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudReturnLoading(false));
  }
};

export const refundReturn = (payload, abortController) => async (dispatch) => {
  try {
    dispatch(setRefundReturnLoading(true));
    const res = await returnService.refundPaymentForReturn(payload, abortController);

    if (res) return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setRefundReturnLoading(false));
  }
};

export const getSingleReturnById = (payload) => async (dispatch) => {
  try {
    dispatch(setReturnLoading(true));
    const res = await returnService.getReturnDetailByReturnId(payload);

    if (res) {
      dispatch(setSelectedReturn(res));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setReturnLoading(false));
  }
};

export const getReturnRefundList = (payload) => async (dispatch) => {
  try {
    dispatch(setReturnRefundLoader(true));
    const res = await returnService.getAllReturnRefundList(payload);

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setReturnRefundList(list || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setReturnRefundLoader(false));
  }
};
