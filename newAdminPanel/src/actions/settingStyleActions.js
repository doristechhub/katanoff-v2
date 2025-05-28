import { toast } from 'react-toastify';

import { toastError } from '.';
import { helperFunctions } from 'src/_helpers';
import { settingStyleService } from 'src/_services';
import {
  setSettingStyleList,
  setSettingStyleLoading,
  setCrudSettingStyleLoading,
} from 'src/store/slices/settingStyleSlice';

// ----------------------------------------------------------------------

export const getSettingStyleList = () => async (dispatch) => {
  try {
    dispatch(setSettingStyleLoading(true));
    const res = await settingStyleService.getAllSettingStyle();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setSettingStyleList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setSettingStyleLoading(false));
  }
};

export const deleteSettingStyle = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudSettingStyleLoading(true));
    const res = await settingStyleService.deleteSettingStyle(payload);

    if (res) {
      toast.success('SettingStyle deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudSettingStyleLoading(false));
  }
};

export const createSettingStyle = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudSettingStyleLoading(true));
    const res = await settingStyleService.insertSettingStyle(payload);

    if (res) {
      toast.success('SettingStyle added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudSettingStyleLoading(false));
  }
};

export const updateSettingStyle = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudSettingStyleLoading(true));
    const res = await settingStyleService.updateSettingStyle(payload);

    if (res) {
      toast.success('SettingStyle updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudSettingStyleLoading(false));
  }
};
