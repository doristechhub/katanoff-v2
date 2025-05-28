import { toast } from 'react-toastify';

import { toastError } from '.';
import {
  setCustomJewelryList,
  setCrudCustomJewelryLoading,
} from 'src/store/slices/customJewelrySlice';
import { helperFunctions } from 'src/_helpers';
import { customJewelryService } from 'src/_services';

// ----------------------------------------------------------------------

export const getCustomJewelryList = () => async (dispatch) => {
  try {
    const res = await dispatch(customJewelryService.getAllCustomJewelryList());

    if (res) {
      let list = res?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setCustomJewelryList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  }
};

export const deleteCustomJewelry = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCustomJewelryLoading(true));
    const res = await customJewelryService.deleteCustomJewelry(payload);

    if (res) {
      toast.success('Custom Jewelry request deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCustomJewelryLoading(false));
  }
};
