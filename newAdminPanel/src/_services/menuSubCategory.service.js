import { uid } from 'uid';
import {
  fetchWrapperService,
  menuSubCategoriesUrl,
  productTypeUrl,
  sanitizeObject,
} from '../_helpers';
import { menuCategoryService } from './menuCategory.service';

const getAllMenuSubCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(menuSubCategoriesUrl);
      const tempSubTypeData = respData ? Object.values(respData) : [];
      const menuCategoryData = await menuCategoryService.getAllMenuCategory();
      const menuSubCategoryData = tempSubTypeData.map((SubType) => {
        const findedItem = menuCategoryData.find((category) => category.id === SubType.categoryId);
        return {
          ...SubType,
          categoryName: findedItem.title,
        };
      });
      resolve(menuSubCategoryData);
    } catch (e) {
      reject(e);
    }
  });
};

const insertMenuSubCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title, categoryId } = sanitizeObject(params);
      title = title ? title.trim() : null;
      categoryId = categoryId ? categoryId.trim() : null;
      if (title && categoryId && uuid) {
        const respData = await fetchWrapperService.getAll(menuSubCategoriesUrl);
        const allSubCategoryData = respData ? Object.values(respData) : [];
        const menuSubCategoryData = allSubCategoryData?.find(
          (x) => x?.categoryId === categoryId && x?.title?.toLowerCase() === title?.toLowerCase()
        );

        if (!menuSubCategoryData) {
          const insertPattern = {
            id: uuid,
            title: title,
            categoryId: categoryId,
            createdDate: Date.now(),
          };
          const createPattern = {
            url: `${menuSubCategoriesUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during menu subcategory creation.'));
            });
        } else {
          reject(new Error('title already exists'));
        }
      } else {
        reject(new Error('title is required'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateMenuSubCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { subCategoryId, title, categoryId } = sanitizeObject(params);
      title = title ? title.trim() : null;
      if (subCategoryId && title) {
        const menuSubCategoryData = await fetchWrapperService.findOne(menuSubCategoriesUrl, {
          id: subCategoryId,
        });
        if (menuSubCategoryData) {
          categoryId = categoryId ? categoryId.trim() : menuSubCategoryData.categoryId;

          const respData = await fetchWrapperService.getAll(menuSubCategoriesUrl);
          const allSubCategoryData = respData ? Object.values(respData) : [];
          const duplicateData = allSubCategoryData?.filter(
            (x) =>
              x?.categoryId === categoryId &&
              x?.title?.toLowerCase() === title?.toLowerCase() &&
              x?.id !== subCategoryId
          );

          if (!duplicateData.length) {
            const payload = {
              title,
              categoryId,
            };
            const updatePattern = {
              url: `${menuSubCategoriesUrl}/${subCategoryId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update MenuSubCategory.'));
              });
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('menu sub category not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMenuSubCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { subCategoryId } = sanitizeObject(params);
      if (subCategoryId) {
        const menuSubCategoryData = await fetchWrapperService.findOne(menuSubCategoriesUrl, {
          id: subCategoryId,
        });
        if (menuSubCategoryData) {
          const productTypeData = await getAllProductTypesBySubCategoryId(subCategoryId);
          if (!productTypeData?.length) {
            await fetchWrapperService._delete(`${menuSubCategoriesUrl}/${subCategoryId}`);
            resolve(true);
          } else {
            reject(new Error('menu sub category can not delete Because it is product types'));
          }
        } else {
          reject(new Error('menu sub category not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductTypesBySubCategoryId = (subCategoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: productTypeUrl,
        key: 'subCategoryId',
        value: subCategoryId,
      };
      const productTypeData = await fetchWrapperService.find(findPattern);
      resolve(productTypeData);
    } catch (e) {
      reject(e);
    }
  });
};

export const menuSubCategoryService = {
  getAllMenuSubCategory,
  insertMenuSubCategory,
  updateMenuSubCategory,
  deleteMenuSubCategory,
};
