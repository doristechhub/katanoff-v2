import { toastError } from '.';
import { orderService } from 'src/_services';
import { helperFunctions } from 'src/_helpers';
import {
  setOrderRefundList,
  setOrderRefundPaymentLoading,
  setOrderRefundPaymentMessage,
} from 'src/store/slices/refundSlice';
import { initMessageObj, messageType } from 'src/_helpers/constants';

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
    dispatch(setOrderRefundPaymentMessage(initMessageObj));
    dispatch(setOrderRefundPaymentLoading(true));
    const res = await orderService.refundPayment(payload, abortController);
    if (res) {
      if (res?.status === 200) {
        dispatch(
          setOrderRefundPaymentMessage({
            message:
              'Refund request initiated successfully. The payment status will be updated in the system shortly.',
            type: messageType.SUCCESS,
          })
        );
      }
      return true;
    }
  } catch (e) {
    console.log('e', e);
    toastError(e);
    return false;
  } finally {
    dispatch(setOrderRefundPaymentLoading(false));
  }
};
