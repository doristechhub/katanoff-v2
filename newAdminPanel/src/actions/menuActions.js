import { toast } from 'react-toastify';

import { toastError } from '.';
import { menuCategoryService } from 'src/_services';
import { setCategoryList, setCrudMenuLoading, setMenuLoading } from 'src/store/slices/menuSlice';
import { setCategoriesList, setMenuList } from 'src/store/slices/productSlice';

// ----------------------------------------------------------------------

export const getMenuCategoryList = () => async (dispatch) => {
  try {
    dispatch(setMenuLoading(true));
    const res = await menuCategoryService.getAllMenuCategory();

    if (res) {
      const sortedData = res.sort((a, b) => a.position - b.position);
      dispatch(setCategoryList(sortedData || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuLoading(false));
  }
};

export const deleteMenuCategory = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMenuLoading(true));
    const res = await menuCategoryService.deleteMenuCategory(payload);

    if (res) {
      toast.success('Menu category deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudMenuLoading(false));
  }
};

export const createMenuCategory = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMenuLoading(true));
    const res = await menuCategoryService.insertMenuCategory(payload);

    if (res) {
      toast.success('Menu category added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudMenuLoading(false));
  }
};

export const updateMenuCategory = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudMenuLoading(true));
    const res = await menuCategoryService.updateMenuCategory(payload);

    if (res) {
      toast.success('Menu category updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudMenuLoading(false));
  }
};

export const updateMenuCategoriesPosition =
  ({ categories }) =>
  async (dispatch) => {
    try {
      dispatch(setCrudMenuLoading(true));
      const updatePromises = categories.map(async (element) => {
        return await menuCategoryService.updateMenuCategory(element);
      });

      const results = await Promise.all(updatePromises);

      if (results.every((res) => res)) {
        return true;
      }
    } catch (e) {
      toastError(e);
      return false;
    } finally {
      dispatch(setCrudMenuLoading(false));
    }
  };

export const getAllMenuCategoryList = () => async (dispatch) => {
  try {
    dispatch(setMenuLoading(true));
    const res = await menuCategoryService.getAllMenuItems();
    dispatch(setMenuList(res || {}));
    dispatch(setCategoriesList(res.categories || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuLoading(false));
  }
};
