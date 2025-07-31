import { uid } from 'uid';
import {
  sanitizeObject,
  fetchWrapperService,
  customizationTypeUrl,
  customizationSubTypeUrl,
  isValidFileType,
  isValidFileSize,
  deleteFile,
  uploadFile,
} from '../_helpers';
import { productService } from './product.service';
import { customizationTypeService } from './customizationType.service';
import fileSettings from 'src/_utils/fileSettings';
import { settingsService } from './settings.service';

const getAllCustomizationSubTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const tempSubTypeData = await getAllSubTypes();
      const customizationTypesData = await customizationTypeService.getAllCustomizationTypes();
      const customizationSubTypeData = tempSubTypeData.map((customizationSubType) => {
        const findedItem = customizationTypesData.find(
          (customizationType) => customizationType.id === customizationSubType.customizationTypeId
        );
        return {
          ...customizationSubType,
          customizationTypeName: findedItem.title,
        };
      });
      resolve(customizationSubTypeData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllSubTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(customizationSubTypeUrl);
      const customizationTypesData = respData ? Object.values(respData) : [];
      resolve(customizationTypesData);
    } catch (e) {
      reject(e);
    }
  });
};

const insertCustomizationSubType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title, customizationTypeId, type, hexCode, imageFile, unit, price } =
        sanitizeObject(params);
      type = type ? type.trim() : null;
      customizationTypeId = customizationTypeId ? customizationTypeId.trim() : null;
      title = title ? title.trim() : null;
      hexCode = hexCode ? hexCode.trim() : '';
      unit = unit ? unit?.trim() : null;
      price =
        !isNaN(price) && price !== '' && price !== null
          ? Math.round(parseFloat(price) * 100) / 100
          : 0;
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];

      if (title && customizationTypeId && type && uuid) {
        // Check for duplicate title within the specific customizationTypeId using getAll
        const allSubTypes = await getAllSubTypes();
        const isDuplicate = allSubTypes.some(
          (subType) =>
            subType.title?.toLowerCase() === title?.toLowerCase() &&
            subType.customizationTypeId === customizationTypeId
        );

        if (!isDuplicate) {
          const customizationTypeData = await fetchWrapperService.findOne(customizationTypeUrl, {
            id: customizationTypeId,
          });
          if (customizationTypeData) {
            if (type === 'color' && !hexCode) {
              reject(new Error('Hex code not found'));
              return;
            }
            if (type === 'image' && !imageFile.length) {
              reject(new Error('Image not found'));
              return;
            }

            if (price && price <= 0) {
              reject(new Error('Invalid Price: Must be a positive number'));
              return;
            }

            let imageUrl = '';
            if (type === 'image' && imageFile.length) {
              if (imageFile?.length > fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT) {
                reject(
                  new Error(
                    `You can only upload ${fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT} image`
                  )
                );
                return;
              }
              const imageValidFileType = isValidFileType(fileSettings.IMAGE_FILE_NAME, imageFile);
              if (!imageValidFileType) {
                reject(new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)'));
                return;
              }

              const imageValidFileSize = isValidFileSize(fileSettings.IMAGE_FILE_NAME, imageFile);
              if (!imageValidFileSize) {
                reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
                return;
              }

              const filesPayload = [...imageFile];
              await uploadFile(customizationSubTypeUrl, filesPayload)
                .then((fileNames) => {
                  if (imageFile.length) {
                    imageUrl = fileNames[0];
                  }
                })
                .catch((e) => {
                  reject(new Error('An error occurred during image uploading.'));
                  return;
                });
            }

            const insertPattern = {
              id: uuid,
              type,
              customizationTypeId,
              title,
              hexCode,
              image: imageUrl,
              unit,
              price: unit ? price : 0,
              createdDate: Date.now(),
            };
            const createPattern = {
              url: `${customizationSubTypeUrl}/${uuid}`,
              insertPattern,
            };
            fetchWrapperService
              .create(createPattern)
              .then((response) => {
                resolve(insertPattern);
              })
              .catch((e) => {
                reject(new Error('An error occurred during customizationSubType creation.'));
                // whenever an error occurs for creating a product the file is deleted
                if (imageUrl) {
                  deleteFile(customizationSubTypeUrl, imageUrl);
                }
              });
          } else {
            reject(new Error('Customization type data not found'));
          }
        } else {
          reject(new Error('Title already exists for this customization type'));
        }
      } else {
        reject(new Error('Title, customization type, and type are required'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCustomizationSubType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        type,
        customizationSubTypeId,
        title,
        customizationTypeId,
        hexCode,
        imageFile,
        deletedImage,
        unit,
        price,
      } = sanitizeObject(params);
      title = title?.trim() ?? null;
      type = type?.trim() ?? null;
      unit = unit?.trim() ?? null;
      price =
        !isNaN(price) && price !== '' && price !== null
          ? Math.round(parseFloat(price) * 100) / 100
          : 0;

      if (!customizationSubTypeId || !title || !type) {
        reject(new Error('Invalid Data'));
        return;
      }

      const customizationSubTypeData = await fetchWrapperService.findOne(customizationSubTypeUrl, {
        id: customizationSubTypeId,
      });
      if (!customizationSubTypeData) {
        reject(new Error('Customization sub type not found!'));
        return;
      }

      let products = [];
      if (
        (customizationTypeId &&
          customizationSubTypeData.customizationTypeId !== customizationTypeId) ||
        Number(customizationSubTypeData?.price || 0) !== price ||
        customizationSubTypeData?.unit !== unit
      ) {
        products = await productService.getAllProductsWithPagging();
        if (
          customizationTypeId &&
          customizationSubTypeData.customizationTypeId !== customizationTypeId &&
          products.some((product) =>
            product.variComboWithQuantity?.some((combo) =>
              combo.combination?.some(
                (variation) => variation.variationTypeId === customizationSubTypeId
              )
            )
          )
        ) {
          reject(
            new Error('Cannot update Customization Type because this subtype is used in products.')
          );
          return;
        }
      }

      // Check for duplicate title within the specific customizationTypeId using getAll
      const allSubTypes = await getAllSubTypes();
      const isDuplicate = allSubTypes.some(
        (subType) =>
          subType.title?.toLowerCase() === title.toLowerCase() &&
          subType.customizationTypeId ===
          (customizationTypeId || customizationSubTypeData.customizationTypeId) &&
          subType.id !== customizationSubTypeId
      );

      if (isDuplicate) {
        reject(new Error('Title already exists for this customization type'));
        return;
      }

      customizationTypeId =
        customizationTypeId?.trim() ?? customizationSubTypeData.customizationTypeId;
      const customizationTypeData = await fetchWrapperService.findOne(customizationTypeUrl, {
        id: customizationTypeId,
      });
      if (!customizationTypeData) {
        reject(new Error('Customization type data not found'));
        return;
      }

      let uHexCode = '';
      if (type === 'color') {
        uHexCode = hexCode?.trim() ?? customizationTypeData?.hexCode ?? '';
        if (!uHexCode) {
          reject(new Error('Hex code not found'));
          return;
        }
      }

      if (price && price <= 0) {
        reject(new Error('Invalid Price: Must be a positive number'));
        return;
      }

      imageFile = typeof imageFile === 'object' ? [imageFile] : [];
      deletedImage = deletedImage?.trim() ?? null;

      if (type === 'image' && !deletedImage && !imageFile.length) {
        reject(new Error('Image not found'));
        return;
      }

      let uploadedImage = '';
      if (type === 'image' && imageFile.length) {
        if (imageFile.length > fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT) {
          reject(
            new Error(
              `You can only upload ${fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT} image`
            )
          );
          return;
        }

        if (!isValidFileType(fileSettings.IMAGE_FILE_NAME, imageFile)) {
          reject(new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)'));
          return;
        }

        if (!isValidFileSize(fileSettings.IMAGE_FILE_NAME, imageFile)) {
          reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
          return;
        }

        const filesPayload = [...imageFile];
        await uploadFile(customizationSubTypeUrl, filesPayload)
          .then((fileNames) => {
            if (imageFile.length) {
              uploadedImage = fileNames[0] || '';
            }
          })
          .catch((e) => {
            reject(new Error('An error occurred during image uploading.'));
            return;
          });
      }

      const imageUrl = deletedImage ? '' : customizationSubTypeData?.image ?? '';
      price = unit ? price : 0;
      const payload = {
        title,
        customizationTypeId,
        type,
        hexCode: uHexCode,
        image: type === 'image' ? (imageFile.length ? uploadedImage : imageUrl) : '',
        unit,
        price,
      };

      const updatePattern = {
        url: `${customizationSubTypeUrl}/${customizationSubTypeId}`,
        payload,
      };

      await fetchWrapperService._update(updatePattern);

      let productsUpdated = true;

      if (
        Number(customizationSubTypeData?.price || 0) !== price ||
        customizationSubTypeData?.unit !== unit
      ) {
        try {
          const priceMultiplier = await settingsService.fetchPriceMultiplier();
          const affectedProducts = products.filter((product) =>
            product.variComboWithQuantity?.some((combo) =>
              combo.combination?.some((variation) => variation.variationTypeId === customizationSubTypeId)
            )
          );

          const BATCH_SIZE = 10;
          for (let i = 0; i < affectedProducts.length; i += BATCH_SIZE) {
            const batch = affectedProducts.slice(i, i + BATCH_SIZE);
            await Promise.all(
              batch.map((product) =>
                productService.updateSingleProductPrice({
                  product,
                  priceMultiplier,
                  allSubTypes: allSubTypes.map((subType) =>
                    subType.id === customizationSubTypeId ? { ...subType, price, unit } : subType
                  ),
                })
              )
            );
          }

        } catch (e) {
          console.error('Batch update failed', e);
          productsUpdated = false;
        }
      }

      // Whenever a new file is uploaded for a customization sub type, the old file will be deleted.
      const oldImage =
        deletedImage || (type !== 'image' && customizationSubTypeData?.image) || null;
      if (oldImage) {
        await deleteFile(customizationSubTypeUrl, oldImage);
      }
      resolve({ success: true, productsUpdated });

    } catch (e) {
      // whenever an error occurs for updating a customization sub type image the uploaded file is deleted
      if (uploadedImage) {
        await deleteFile(customizationSubTypeUrl, uploadedImage);
      }
      reject(new Error('An error occurred during update customizationSubType.'));
    }
  });
};

const deleteCustomizationSubType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { customizationSubTypeId } = sanitizeObject(params);
      if (customizationSubTypeId) {
        const customizationSubTypeData = await fetchWrapperService.findOne(
          customizationSubTypeUrl,
          { id: customizationSubTypeId }
        );
        if (customizationSubTypeData) {
          const productsBySubTypeId = await getAllProductsBySubTypeId(customizationSubTypeId);
          if (!productsBySubTypeId.length) {
            await fetchWrapperService._delete(
              `${customizationSubTypeUrl}/${customizationSubTypeId}`
            );
            if (customizationSubTypeData?.image) {
              deleteFile(customizationSubTypeUrl, customizationSubTypeData?.image);
            }
            resolve(true);
          } else {
            reject(
              new Error('Customization sub type cannot be deleted because it is used in products')
            );
          }
        } else {
          reject(new Error('Customization sub type not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductsBySubTypeId = (customizationSubTypeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const activeProductData = await productService.getAllActiveProducts();
      const productsWithCustomizationSubTypeId = activeProductData.filter((product) => {
        const variations = product?.variations || [];
        return variations.some((variation) => {
          const variationTypes = variation.variationTypes || [];
          return variationTypes.some((type) => type.variationTypeId === customizationSubTypeId);
        });
      });
      resolve(productsWithCustomizationSubTypeId);
    } catch (e) {
      reject(e);
    }
  });
};

export const customizationSubTypeService = {
  getAllSubTypes,
  getAllCustomizationSubTypes,
  insertCustomizationSubType,
  updateCustomizationSubType,
  deleteCustomizationSubType,
};
