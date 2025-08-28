import { toast } from 'react-toastify';
import { toastError } from '.';
import {
  setMenuProductTypeList,
  setMenuProductTypeLoading,
  setCrudMenuProductTypeLoading,
} from 'src/store/slices/menuSlice';
import { productTypeService } from 'src/_services';

// ----------------------------------------------------------------------

export const getMenuProductTypeList =
  (initLoading = true) =>
  async (dispatch) => {
    try {
      if (initLoading) dispatch(setMenuProductTypeLoading(true));
      const res = await productTypeService.getAllProductType();

      if (res) {
        dispatch(setMenuProductTypeList(res || []));
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

export const updateMenuProductTypePosition = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMenuProductTypeLoading(true));
    const res = await productTypeService.updateProductTypePosition(payload);

    if (res) {
      // toast.success('Menu product type positions updated successfully');
      dispatch(getMenuProductTypeList(false));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudMenuProductTypeLoading(false));
  }
};
