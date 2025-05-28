import { uid } from 'uid';
import {
  fetchWrapperService,
  menuCategoriesUrl,
  menuSubCategoriesUrl,
  menuUrl,
  sanitizeObject,
} from '../_helpers';

const getAllMenuCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(menuCategoriesUrl);
      const menuCategoryData = respData ? Object.values(respData) : [];
      resolve(menuCategoryData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMenuItems = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await fetchWrapperService.getAll(menuUrl);
      const categories = menuData?.categories ? Object.values(menuData.categories) : [];
      const subCategories = menuData?.subCategories ? Object.values(menuData.subCategories) : [];
      const productType = menuData?.productType ? Object.values(menuData.productType) : [];
      resolve({ categories, subCategories, productType });
    } catch (e) {
      reject(e);
    }
  });
};

const insertMenuCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title } = sanitizeObject(params);
      title = title ? title.trim() : null;

      if (title && uuid) {
        const menuCategoriesList = await getAllMenuCategory();
        const foundedCategory = menuCategoriesList.find(
          (cItem) => cItem.title?.toLowerCase() === title?.toLowerCase()
        );

        if (!foundedCategory) {
          const maxPosition = menuCategoriesList.reduce(
            (max, item) => (item?.position > max ? item.position : max),
            0
          );

          const insertPattern = {
            id: uuid,
            title,
            position: Number(maxPosition) + 1,
            createdDate: Date.now(),
          };
          const createPattern = {
            url: `${menuCategoriesUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(insertPattern);
            })
            .catch((e) => {
              reject(new Error('An error occurred during menuCategory creation.'));
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

const updateMenuCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { categoryId, title, position } = sanitizeObject(params);
      title = title ? title.trim() : null;
      if (categoryId && title) {
        const categoryData = await fetchWrapperService.findOne(menuCategoriesUrl, {
          id: categoryId,
        });
        if (categoryData) {
          const findPattern = {
            id: categoryId,
            key: 'title',
            value: title,
          };

          const duplicateData = await fetchWrapperService.findOneWithNotEqual(
            menuCategoriesUrl,
            findPattern
          );
          if (!duplicateData.length) {
            position = position ? Number(position) : categoryData?.position;
            const payload = {
              title,
              position,
            };
            const updatePattern = {
              url: `${menuCategoriesUrl}/${categoryId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update menuCategory.'));
              });
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('customization Type not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMenuCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { categoryId } = sanitizeObject(params);
      if (categoryId) {
        const categoryData = await fetchWrapperService.findOne(menuCategoriesUrl, {
          id: categoryId,
        });
        if (categoryData) {
          const subCategoryData = await getAllMenuSubCategoryByCategoryId(categoryId);
          if (!subCategoryData?.length) {
            await fetchWrapperService._delete(`${menuCategoriesUrl}/${categoryId}`);
            resolve(true);
          } else {
            reject(new Error('Menu category can not delete Because it has child category'));
          }
        } else {
          reject(new Error('Menu cateogry Type not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMenuSubCategoryByCategoryId = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: menuSubCategoriesUrl,
        key: 'categoryId',
        value: categoryId,
      };
      const subCategoryData = await fetchWrapperService.find(findPattern);
      resolve(subCategoryData);
    } catch (e) {
      reject(e);
    }
  });
};

export const menuCategoryService = {
  getAllMenuCategory,
  getAllMenuItems,
  insertMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
};
