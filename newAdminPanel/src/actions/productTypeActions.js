import { toast } from 'react-toastify';

import { toastError } from '.';
import {
  setMenuProductTypeList,
  setMenuProductTypeLoading,
  setCrudMenuProductTypeLoading,
} from 'src/store/slices/menuSlice';
import { helperFunctions } from 'src/_helpers';
import { productTypeService } from 'src/_services';

// ----------------------------------------------------------------------

export const getMenuProductTypeList = () => async (dispatch) => {
  try {
    dispatch(setMenuProductTypeLoading(true));
    const res = await productTypeService.getAllProductType();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setMenuProductTypeList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuProductTypeLoading(false));
  }
};

export const createMenuProductType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMenuProductTypeLoading(true));
    const res = await productTypeService.insertProductType(payload);

    if (res) {
      toast.success('Product type added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudMenuProductTypeLoading(false));
  }
};

export const updateMenuProductType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMenuProductTypeLoading(true));
    const res = await productTypeService.updateProductType(payload);

    if (res) {
      toast.success('Product type updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudMenuProductTypeLoading(false));
  }
};

export const deleteMenuProductType = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMenuProductTypeLoading(true));
    const res = await productTypeService.deleteProductType(payload);

    if (res) {
      toast.success('Product type deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudMenuProductTypeLoading(false));
  }
};
