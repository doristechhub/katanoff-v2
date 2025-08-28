import { uid } from 'uid';
import {
  fetchWrapperService,
  productTypeUrl,
  productsUrl,
  sanitizeObject,
  isValidFileType,
  isValidFileSize,
  uploadFile,
  deleteFile,
} from '../_helpers';
import { menuCategoryService } from './menuCategory.service';
import { menuSubCategoryService } from './menuSubCategory.service';
import { productService } from './product.service';
import fileSettings from 'src/_utils/fileSettings';

const getAllProductType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(productTypeUrl);
      const tempProductType = respData ? Object.values(respData) : [];
      const menuCategoryData = await menuCategoryService.getAllMenuCategory();
      const menuSubCategoryData = await menuSubCategoryService.getAllMenuSubCategory();

      const productTypeData = tempProductType
        .map((productType) => {
          const findedCategory = menuCategoryData.find(
            (category) => category.id === productType.categoryId
          );
          const findedSubCategory = menuSubCategoryData.find(
            (subCategory) => subCategory.id === productType.subCategoryId
          );
          return {
            ...productType,
            categoryName: findedCategory?.title || '',
            categoryPosition: findedCategory?.position || 0,
            subCategoryName: findedSubCategory?.title || '',
            subCategoryPosition: findedSubCategory?.position || 0,
          };
        })
        .sort((a, b) => {
          // Sort by category position first
          if (a.categoryPosition !== b.categoryPosition) {
            return (a.categoryPosition || 0) - (b.categoryPosition || 0);
          }
          // If category positions are equal, sort by subcategory position
          if (a.subCategoryPosition !== b.subCategoryPosition) {
            return (a.subCategoryPosition || 0) - (b.subCategoryPosition || 0);
          }
          // If subcategory positions are equal, sort by product type position
          return (a.position || 0) - (b.position || 0);
        });

      resolve(productTypeData);
    } catch (e) {
      reject(e);
    }
  });
};

const getDefaultPosition = async (categoryId, subCategoryId) => {
  try {
    const respData = await fetchWrapperService.getAll(productTypeUrl);
    const allProductTypes = respData ? Object.values(respData) : [];
    const categorySubCategoryProductTypes = allProductTypes.filter(
      (item) => item.categoryId === categoryId && item.subCategoryId === subCategoryId
    );
    const maxPosition = categorySubCategoryProductTypes.reduce(
      (max, item) => Math.max(max, item.position || 0),
      0
    );
    return maxPosition + 1;
  } catch (e) {
    throw new Error('Error calculating default position');
  }
};

const validateFiles = async (files, type, name) => {
  if (files.length > fileSettings.BANNER_IMAGE_FILE_LIMIT) {
    throw new Error(
      `Maximum ${fileSettings.BANNER_IMAGE_FILE_LIMIT} ${name !== 'image' ? 'banner image' : 'image'} allowed`
    );
  }
  if (files.length) {
    if (!isValidFileType(fileSettings.IMAGE_FILE_NAME, files)) {
      throw new Error(`Invalid ${name} file type. Only JPG, JPEG, PNG, WEBP allowed`);
    }
    if (!isValidFileSize(fileSettings.IMAGE_FILE_NAME, files)) {
      throw new Error(
        `Invalid ${name} file size. Maximum ${fileSettings.MAX_FILE_SIZE_MB}MB allowed`
      );
    }
  }
};

const uploadFiles = async (filesPayload) => {
  if (!filesPayload.length) return { imageUrl: '' };
  const fileNames = await uploadFile(productTypeUrl, filesPayload);
  if (fileNames.length !== filesPayload.length) {
    throw new Error(`Expected ${filesPayload.length} files, received ${fileNames.length}`);
  }
  return { imageUrl: fileNames[0] || '' };
};

const deleteFiles = async (urls) => {
  const filesToDelete = urls.filter(Boolean);
  if (filesToDelete.length) {
    await Promise.all(
      filesToDelete.map((url) =>
        deleteFile(productTypeUrl, url).catch((e) => {
          console.warn(`Failed to delete file ${url}: ${e.message}`);
        })
      )
    );
  }
};

const insertProductType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title, categoryId, subCategoryId, position, imageFile } = sanitizeObject(params);
      title = title ? title.trim() : null;
      categoryId = categoryId ? categoryId.trim() : null;
      subCategoryId = subCategoryId ? subCategoryId.trim() : null;
      imageFile = imageFile && typeof imageFile === 'object' ? [imageFile] : [];

      if (title && categoryId && subCategoryId && uuid) {
        const respData = await fetchWrapperService.getAll(productTypeUrl);
        const allProductTypes = respData ? Object.values(respData) : [];

        // Check for duplicate title within categoryId and subCategoryId
        const productTypeData = allProductTypes?.find(
          (x) =>
            x?.categoryId === categoryId &&
            x?.subCategoryId === subCategoryId &&
            x?.title?.toLowerCase() === title?.toLowerCase()
        );

        if (productTypeData) {
          reject(new Error('Title already exists'));
          return;
        }

        // Assign default position if not provided
        const finalPosition = position
          ? parseInt(position, 10)
          : await getDefaultPosition(categoryId, subCategoryId);

        // Check for position conflict
        const positionConflict = allProductTypes.find(
          (x) =>
            x.categoryId === categoryId &&
            x.subCategoryId === subCategoryId &&
            x.position === finalPosition
        );

        if (positionConflict) {
          reject(new Error('Position already taken for this category and subcategory'));
          return;
        }

        await validateFiles(imageFile, 'IMAGE_FILE_NAME', 'image');

        const { imageUrl } = await uploadFiles(imageFile).catch((e) => {
          throw new Error('An error occurred during image uploading.');
        });

        const insertPattern = {
          id: uuid,
          title: title,
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          position: finalPosition,
          createdDate: Date.now(),
          image: imageUrl,
        };
        const createPattern = {
          url: `${productTypeUrl}/${uuid}`,
          insertPattern: insertPattern,
        };
        fetchWrapperService
          .create(createPattern)
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            deleteFiles([imageUrl]);
            reject(new Error('An error occurred during product type creation.'));
          });
      } else {
        reject(new Error('Title, categoryId, and subCategoryId are required'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productTypeId, categoryId, subCategoryId, title, position, imageFile, deletedImage } =
        sanitizeObject(params);
      title = title ? title.trim() : null;
      imageFile = imageFile && typeof imageFile === 'object' ? [imageFile] : [];
      deletedImage = deletedImage ? deletedImage.trim() : null;

      if (productTypeId && title) {
        const productTypeData = await fetchWrapperService.findOne(productTypeUrl, {
          id: productTypeId,
        });
        if (productTypeData) {
          categoryId = categoryId ? categoryId.trim() : productTypeData.categoryId;
          subCategoryId = subCategoryId ? subCategoryId.trim() : productTypeData.subCategoryId;

          const respData = await fetchWrapperService.getAll(productTypeUrl);
          const allProductTypes = respData ? Object.values(respData) : [];

          // Check for duplicate title within categoryId and subCategoryId
          const duplicateData = allProductTypes?.filter(
            (x) =>
              x?.categoryId === categoryId &&
              x?.subCategoryId === subCategoryId &&
              x?.title?.toLowerCase() === title?.toLowerCase() &&
              x?.id !== productTypeId
          );

          if (duplicateData.length) {
            reject(new Error('Title already exists'));
            return;
          }

          // Validate position if provided
          let finalPosition = productTypeData.position;
          if (position) {
            finalPosition = parseInt(position, 10);
            const positionConflict = allProductTypes.find(
              (x) =>
                x.categoryId === categoryId &&
                x.subCategoryId === subCategoryId &&
                x.position === finalPosition &&
                x.id !== productTypeId
            );
            if (positionConflict) {
              reject(new Error('Position already taken for this category and subcategory'));
              return;
            }
          }

          let image = productTypeData?.image || null;
          if (deletedImage && image === deletedImage) {
            image = null;
          }

          await validateFiles(imageFile, 'IMAGE_FILE_NAME', 'image');

          const { imageUrl } = await uploadFiles(imageFile).catch((e) => {
            throw new Error(`File upload failed: ${e.message}`);
          });

          const payload = {
            title,
            categoryId,
            subCategoryId,
            position: finalPosition,
            image: imageUrl || image,
          };
          const updatePattern = {
            url: `${productTypeUrl}/${productTypeId}`,
            payload: payload,
          };
          await fetchWrapperService._update(updatePattern).catch(async (e) => {
            await deleteFiles([imageUrl]);
            throw new Error(`Update failed: ${e.message}`);
          });

          await deleteFiles([deletedImage]);

          resolve(true);
        } else {
          reject(new Error('Product type not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductTypePosition = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { productTypes, categoryId, subCategoryId } = sanitizeObject(params);
      if (!Array.isArray(productTypes) || !categoryId || !subCategoryId) {
        reject(
          new Error('Invalid input: productTypes array, categoryId, and subCategoryId required')
        );
        return;
      }

      const respData = await fetchWrapperService.getAll(productTypeUrl);
      const allProductTypes = respData ? Object.values(respData) : [];

      // Verify all productTypes belong to the specified categoryId and subCategoryId
      const invalidProductType = productTypes.find(
        (item) =>
          !allProductTypes.some(
            (pt) =>
              pt.id === item.productTypeId &&
              pt.categoryId === categoryId &&
              pt.subCategoryId === subCategoryId
          )
      );
      if (invalidProductType) {
        reject(
          new Error(
            'One or more productTypeIds do not match the specified category and subcategory'
          )
        );
        return;
      }

      // Check for duplicate positions
      const positions = productTypes.map((item) => item.position);
      const uniquePositions = new Set(positions);
      if (uniquePositions.size !== positions.length) {
        reject(new Error('Duplicate positions detected'));
        return;
      }

      // Update positions
      const updatePromises = productTypes.map(async (item) => {
        const payload = {
          position: item.position,
        };
        const updatePattern = {
          url: `${productTypeUrl}/${item.productTypeId}`,
          payload: payload,
        };
        return fetchWrapperService._update(updatePattern);
      });

      await Promise.all(updatePromises);
      resolve(true);
    } catch (e) {
      reject(new Error('An error occurred during position update'));
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
            await deleteFiles([productTypeData.image]);
            resolve(true);
          } else {
            reject(
              new Error('Product type cannot be deleted because it is associated with products')
            );
          }
        } else {
          reject(new Error('Product type not found!'));
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
  updateProductTypePosition,
  deleteProductType,
  getDefaultPosition,
};
