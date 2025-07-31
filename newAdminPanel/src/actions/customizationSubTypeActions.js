import { toast } from 'react-toastify';

import { toastError } from '.';
import {
  setCustomizationSubTypeList,
  setCustomizationSubTypeLoading,
  setCrudCustomizationSubTypeLoading,
} from 'src/store/slices/customizationSlice';
import { helperFunctions } from 'src/_helpers';
import { customizationSubTypeService } from 'src/_services';

// ----------------------------------------------------------------------

export const getCustomizationSubTypeList = () => async (dispatch) => {
  try {
    dispatch(setCustomizationSubTypeLoading(true));
    const res = await customizationSubTypeService.getAllCustomizationSubTypes();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setCustomizationSubTypeList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCustomizationSubTypeLoading(false));
  }
};

export const deleteCustomizationSubType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCustomizationSubTypeLoading(true));
    const res = await customizationSubTypeService.deleteCustomizationSubType(payload);

    if (res) {
      toast.success('Customization sub type deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCustomizationSubTypeLoading(false));
  }
};

export const createCustomizationSubType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCustomizationSubTypeLoading(true));
    const res = await customizationSubTypeService.insertCustomizationSubType(payload);

    if (res) {
      toast.success('Customization subtype added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCustomizationSubTypeLoading(false));
  }
};

export const updateCustomizationSubType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCustomizationSubTypeLoading(true));
    const res = await customizationSubTypeService.updateCustomizationSubType(payload);

    if (res?.success) {
      if (res.productsUpdated) {
        toast.success('Customization subtype updated successfully');
      } else {
        toast.warning('Customization subtype updated, but product prices could not be updated');
      }
      return true;
    } else {
      toast.error('Customization subtype update failed');
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCustomizationSubTypeLoading(false));
  }
};