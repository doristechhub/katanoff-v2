import { toastError } from '.';
import { toast } from 'react-toastify';

import {
  setMenuCrudSubCategoryLoading,
  setMenuSubCategoryList,
  setMenuSubCategoryLoading,
} from 'src/store/slices/menuSlice';
import { menuCategoryService, menuSubCategoryService } from 'src/_services';

// ----------------------------------------------------------------------

export const getMenuSubCategoryList =
  (initLoading = true) =>
  async (dispatch) => {
    try {
      if (initLoading) dispatch(setMenuSubCategoryLoading(true));

      const [categoryRes, subCategoryRes] = await Promise.all([
        menuCategoryService.getAllMenuCategory(),
        menuSubCategoryService.getAllMenuSubCategory(),
      ]);

      if (categoryRes && subCategoryRes) {
        const sortedCategories = categoryRes.sort((a, b) => a.position - b.position);

        // Create a map of categoryId to categoryName and position for lookup
        const categoryMap = sortedCategories.reduce((map, category) => {
          map[category.id] = {
            categoryName: category.title,
            position: category.position,
          };
          return map;
        }, {});

        // Group subcategories by categoryId and sort by position within each category
        const groupedSubCategories = subCategoryRes.reduce((acc, subCategory) => {
          const categoryId = subCategory.categoryId;
          if (!acc[categoryId]) {
            acc[categoryId] = [];
          }
          acc[categoryId].push(subCategory);
          return acc;
        }, {});

        // Sort subcategories within each category by position
        Object.keys(groupedSubCategories).forEach((categoryId) => {
          groupedSubCategories[categoryId].sort((a, b) => a.position - b.position);
        });

        const sortedSubCategories = sortedCategories.flatMap((category) => {
          const subCategories = groupedSubCategories[category.id] || [];
          return subCategories.map((subCategory) => ({
            ...subCategory,
            categoryName: categoryMap[category.id]?.categoryName || 'Unknown Category',
          }));
        });
        dispatch(setMenuSubCategoryList(sortedSubCategories));
        return true;
      }
      return false;
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

export const updateMenuSubCategoryPosition = (payload) => async (dispatch) => {
  try {
    dispatch(setMenuCrudSubCategoryLoading(true));
    const res = await menuSubCategoryService.updateMenuSubCategoryPosition(payload);

    if (res) {
      // toast.success('Menu sub category positions updated successfully');
      dispatch(getMenuSubCategoryList(false));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setMenuCrudSubCategoryLoading(false));
  }
};
