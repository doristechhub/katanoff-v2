import { toast } from 'react-toastify';
import { toastError } from '.';
import { helperFunctions } from 'src/_helpers';
import { discountService } from 'src/_services';
import {
  setDiscountList,
  setDiscountLoading,
  setCrudDiscountLoading,
  initDiscount,
  setSelectedDiscount,
  defaultBeginsAt,
  defaultBeginsAtDate,
} from 'src/store/slices/discountSlice';
import moment from 'moment';
import { DATE_FORMAT } from 'src/_helpers/constants';

// ----------------------------------------------------------------------

export const getDiscountList = () => async (dispatch) => {
  try {
    dispatch(setDiscountLoading(true));
    const res = await discountService.getAllDiscounts();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setDiscountList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setDiscountLoading(false));
  }
};

export const createDiscount = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudDiscountLoading(true));
    const res = await discountService.insertDiscount(payload);

    if (res) {
      toast.success('Discount added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiscountLoading(false));
  }
};

export const updateDiscount = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudDiscountLoading(true));
    const res = await discountService.updateDiscount(payload);

    if (res) {
      toast.success('Discount updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiscountLoading(false));
  }
};

export const toggleDiscountStatus = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudDiscountLoading(true));
    const res = await discountService.toggleDiscountStatus(payload);

    if (res) {
      toast.success(res?.message || 'Discount status updated successfully');
      dispatch(getDiscountList()); // Refresh the discount list after status update
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiscountLoading(false));
  }
};

export const deleteDiscount = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudDiscountLoading(true));
    const res = await discountService.deleteDiscount(payload);

    if (res) {
      toast.success('Discount deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiscountLoading(false));
  }
};

export const getSingleDiscount = (discountId) => async (dispatch) => {
  try {
    dispatch(setCrudDiscountLoading(true));
    const res = await discountService.getSingleDiscount(discountId);

    if (res) {
      const parsedBeginsAt = res.dateRange?.beginsAt
        ? helperFunctions.parseDateTime(moment(res.dateRange.beginsAt, DATE_FORMAT).toDate())
        : { date: defaultBeginsAtDate, time: defaultBeginsAt };

      const parsedExpiresAt = res.dateRange?.expiresAt
        ? helperFunctions.parseDateTime(moment(res.dateRange.expiresAt, DATE_FORMAT).toDate())
        : { date: null, time: null };

      const discount = {
        ...initDiscount,
        ...res,
        discountId: res?.id,
        dateRange: {
          beginsAtDate: parsedBeginsAt?.date,
          beginsAtTime: parsedBeginsAt?.time,
          expiresAtDate: parsedExpiresAt?.date,
          expiresAtTime: parsedExpiresAt?.time,
          beginsAt: res.dateRange?.beginsAt || defaultBeginsAt,
          expiresAt: res.dateRange?.expiresAt || null,
        },
      };

      dispatch(setSelectedDiscount(discount));
      return res;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiscountLoading(false));
  }
};
