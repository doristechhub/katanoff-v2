import { uid } from 'uid';
import { fetchWrapperService, productTypeUrl, productsUrl, sanitizeObject } from '../_helpers';
import { menuCategoryService } from './menuCategory.service';
import { menuSubCategoryService } from './menuSubCategory.service';
import { productService } from './product.service';

const getAllProductType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(productTypeUrl);
      const tempProductType = respData ? Object.values(respData) : [];
      const menuCategoryData = await menuCategoryService.getAllMenuCategory();
      const menuSubCategoryData = await menuSubCategoryService.getAllMenuSubCategory();
      const productTypeData = tempProductType.map((productType) => {
        const findedCategory = menuCategoryData.find(
          (category) => category.id === productType.categoryId
        );
        const findedSubCategory = menuSubCategoryData.find(
          (subCategory) => subCategory.id === productType.subCategoryId
        );
        return {
          ...productType,
          categoryName: findedCategory?.title,
          subCategoryName: findedSubCategory?.title,
        };
      });
      resolve(productTypeData);
    } catch (e) {
      reject(e);
    }
  });
};

const insertProductType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title, categoryId, subCategoryId } = sanitizeObject(params);
      title = title ? title.trim() : null;
      categoryId = categoryId ? categoryId.trim() : null;
      subCategoryId = subCategoryId ? subCategoryId.trim() : null;
      if (title && categoryId && subCategoryId && uuid) {
        const respData = await fetchWrapperService.getAll(productTypeUrl);
        const allProductType = respData ? Object.values(respData) : [];
        const productTypeData = allProductType?.find(
          (x) =>
            x?.categoryId === categoryId &&
            x?.subCategoryId === subCategoryId &&
            x?.title?.toLowerCase() === title?.toLowerCase()
        );

        if (!productTypeData) {
          const insertPattern = {
            id: uuid,
            title: title,
            categoryId: categoryId,
            subCategoryId: subCategoryId,
            createdDate: Date.now(),
          };
          const createPattern = {
            url: `${productTypeUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during product type creation.'));
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

const updateProductType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productTypeId, categoryId, subCategoryId, title } = sanitizeObject(params);
      title = title ? title.trim() : null;
      if (productTypeId && title) {
        const productTypeData = await fetchWrapperService.findOne(productTypeUrl, {
          id: productTypeId,
        });
        if (productTypeData) {
          categoryId = categoryId ? categoryId.trim() : productTypeData.categoryId;
          subCategoryId = subCategoryId ? subCategoryId.trim() : productTypeData.subCategoryId;

          const respData = await fetchWrapperService.getAll(productTypeUrl);
          const allProductType = respData ? Object.values(respData) : [];
          const duplicateData = allProductType?.filter(
            (x) =>
              x?.categoryId === categoryId &&
              x?.subCategoryId === subCategoryId &&
              x?.title?.toLowerCase() === title?.toLowerCase() &&
              x?.id !== productTypeId
          );

          if (!duplicateData.length) {
            const payload = {
              title,
              categoryId,
              subCategoryId: subCategoryId ? subCategoryId.trim() : productTypeData.subCategoryId,
            };
            const updatePattern = {
              url: `${productTypeUrl}/${productTypeId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update product type.'));
              });
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('product type not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProductType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { productTypeId } = sanitizeObject(params);
      if (productTypeId) {
        const productTypeData = await fetchWrapperService.findOne(productTypeUrl, {
          id: productTypeId,
        });
        if (productTypeData) {
          const productsData = await getAllProductsByProductTypeId(productTypeId);
          if (!productsData?.length) {
            await fetchWrapperService._delete(`${productTypeUrl}/${productTypeId}`);
            resolve(true);
          } else {
            reject(new Error('product type can not delete Because it is products'));
          }
        } else {
          reject(new Error('product type not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductsByProductTypeId = (productTypeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productData = await productService.getAllProductsWithPagging();
      const foundProducts = productData.filter((product) =>
        product?.productTypeIds?.some((id) => id === productTypeId)
      );
      resolve(foundProducts);
    } catch (e) {
      reject(e);
    }
  });
};

export const productTypeService = {
  getAllProductType,
  insertProductType,
  updateProductType,
  deleteProductType,
};
