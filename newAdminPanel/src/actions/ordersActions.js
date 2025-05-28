import {
  setOrdersList,
  setOrdersLoading,
  setCrudOrdersLoading,
  setCancelOrderLoading,
  setSelectedOrder,
} from 'src/store/slices/ordersSlice';
import { toastError } from '.';
import { orderService } from 'src/_services';
import { helperFunctions } from 'src/_helpers';

// ----------------------------------------------------------------------

export const getOrdersList = () => async (dispatch) => {
  try {
    dispatch(setOrdersLoading(true));
    const res = await orderService.getAllOrderList();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setOrdersList(list || []));
      return list;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setOrdersLoading(false));
  }
};

export const deleteOrder = (payload, abortController) => async (dispatch) => {
  try {
    dispatch(setCrudOrdersLoading(true));
    const res = await orderService.deleteOrder(payload, abortController);

    if (res) return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudOrdersLoading(false));
  }
};

export const updateStatusOfOrder = (payload, abortController) => async (dispatch) => {
  try {
    dispatch(setCrudOrdersLoading(true));
    const res = await orderService.updateOrderStatus(payload, abortController);

    if (res) return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudOrdersLoading(false));
  }
};

export const cancelOrder = (payload, abortController) => async (dispatch) => {
  try {
    dispatch(setCancelOrderLoading(true));
    const res = await orderService.cancelOrder(payload, abortController);

    if (res) return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCancelOrderLoading(false));
  }
};

export const getSingleOrderById = (id) => async (dispatch) => {
  try {
    dispatch(setOrdersLoading(true));
    const res = await orderService.getOrderDetailByOrderId(id);

    if (res) {
      dispatch(setSelectedOrder(res));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setOrdersLoading(false));
  }
};
