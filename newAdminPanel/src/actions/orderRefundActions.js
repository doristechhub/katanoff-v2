import { toastError } from '.';
import { orderService } from 'src/_services';
import { helperFunctions } from 'src/_helpers';
import { setOrderRefundList, setOrderRefundPaymentLoading } from 'src/store/slices/refundSlice';

// ----------------------------------------------------------------------

export const getOrderRefundList = () => async (dispatch) => {
  try {
    const res = await dispatch(orderService.getAllRefundList());
    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setOrderRefundList(list || []));
      return list;
    }
  } catch (e) {
    toastError(e);
    return false;
  }
};

export const orderRefundPayment = (payload, abortController) => async (dispatch) => {
  try {
    dispatch(setOrderRefundPaymentLoading(true));
    const res = await orderService.refundPayment(payload, abortController);

    if (res) return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setOrderRefundPaymentLoading(false));
  }
};
