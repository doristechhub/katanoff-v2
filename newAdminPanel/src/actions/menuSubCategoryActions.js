import { toastError } from '.';
import { toast } from 'react-toastify';

import {
  setMenuCrudSubCategoryLoading,
  setMenuSubCategoryList,
  setMenuSubCategoryLoading,
} from 'src/store/slices/menuSlice';
import { helperFunctions } from 'src/_helpers';
import { menuSubCategoryService } from 'src/_services';

// ----------------------------------------------------------------------

export const getMenuSubCategoryList = () => async (dispatch) => {
  try {
    dispatch(setMenuSubCategoryLoading(true));
    const res = await menuSubCategoryService.getAllMenuSubCategory();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setMenuSubCategoryList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuSubCategoryLoading(false));
  }
};

export const createMenuSubCategory = (payload) => async (dispatch) => {
  try {
    dispatch(setMenuCrudSubCategoryLoading(true));
    const res = await menuSubCategoryService.insertMenuSubCategory(payload);

    if (res) {
      toast.success('Menu sub category added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuCrudSubCategoryLoading(false));
  }
};

export const updateMenuSubCategory = (payload) => async (dispatch) => {
  try {
    dispatch(setMenuCrudSubCategoryLoading(true));
    const res = await menuSubCategoryService.updateMenuSubCategory(payload);

    if (res) {
      toast.success('Menu sub category updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuCrudSubCategoryLoading(false));
  }
};

export const deleteMenuSubCategory = (payload) => async (dispatch) => {
  try {
    dispatch(setMenuCrudSubCategoryLoading(true));
    const res = await menuSubCategoryService.deleteMenuSubCategory(payload);

    if (res) {
      toast.success('Menu sub category deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuCrudSubCategoryLoading(false));
  }
};
