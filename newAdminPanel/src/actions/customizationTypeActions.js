import { toast } from 'react-toastify';

import { toastError } from '.';
import {
  setCustomizationTypeList,
  setCustomizationTypeLoading,
  setCrudCustomizationTypeLoading,
} from 'src/store/slices/customizationSlice';
import { helperFunctions } from 'src/_helpers';
import { customizationTypeService } from 'src/_services';

// ----------------------------------------------------------------------

export const getCustomizationTypeList = () => async (dispatch) => {
  try {
    dispatch(setCustomizationTypeLoading(true));
    const res = await customizationTypeService.getAllCustomizationTypes();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setCustomizationTypeList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCustomizationTypeLoading(false));
  }
};

export const deleteCustomizationType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCustomizationTypeLoading(true));
    const res = await customizationTypeService.deleteCustomizationType(payload);

    if (res) {
      toast.success('Customization type deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCustomizationTypeLoading(false));
  }
};

export const createCustomizationType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCustomizationTypeLoading(true));
    const res = await customizationTypeService.insertCustomizationType(payload);

    if (res) {
      toast.success('Customization type added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCustomizationTypeLoading(false));
  }
};

export const updateCustomizationType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCustomizationTypeLoading(true));
    const res = await customizationTypeService.updateCustomizationType(payload);

    if (res) {
      toast.success('Customization type updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCustomizationTypeLoading(false));
  }
};
