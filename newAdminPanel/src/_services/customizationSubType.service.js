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

const getAllCustomizationSubTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(customizationSubTypeUrl);
      const tempSubTypeData = respData ? Object.values(respData) : [];
      const customizatinTypesData = await customizationTypeService.getAllCustomizationTypes();
      const customizationSubTypeData = tempSubTypeData.map((customizationSubType) => {
        const findedItem = customizatinTypesData.find(
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

const insertCustomizationSubType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title, customizationTypeId, type, hexCode, imageFile } = sanitizeObject(params);
      type = type ? type.trim() : null;
      customizationTypeId = customizationTypeId ? customizationTypeId.trim() : null;
      title = title ? title.trim() : null;
      hexCode = hexCode ? hexCode.trim() : '';
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];

      if (title && customizationTypeId && type && uuid) {
        const customizationSubTypesData = await fetchWrapperService.findOne(
          customizationSubTypeUrl,
          { title: title }
        );
        if (!customizationSubTypesData) {
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
            let imageUrl = '';
            if (type === 'image' && imageFile.length) {
              if (imageFile?.length > fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT) {
                reject(
                  new Error(
                    `You can only ${fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT} image upload here`
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
              type: type,
              customizationTypeId: customizationTypeId,
              title: title,
              hexCode,
              image: imageUrl,
              createdDate: Date.now(),
            };
            const createPattern = {
              url: `${customizationSubTypeUrl}/${uuid}`,
              insertPattern: insertPattern,
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
            reject(new Error('customization type data not found'));
          }
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
      } = sanitizeObject(params);
      title = title ? title.trim() : null;
      type = type ? type.trim() : null;

      if (customizationSubTypeId && title && type) {
        const customizationSubTypeData = await fetchWrapperService.findOne(
          customizationSubTypeUrl,
          { id: customizationSubTypeId }
        );
        if (customizationSubTypeData) {
          const findPattern = {
            id: customizationSubTypeId,
            key: 'title',
            value: title,
          };

          const duplicateData = await fetchWrapperService.findOneWithNotEqual(
            customizationSubTypeUrl,
            findPattern
          );
          if (!duplicateData.length) {
            customizationTypeId = customizationTypeId
              ? customizationTypeId.trim()
              : customizationSubTypeData.customizationTypeId;
            const customizationTypeData = await fetchWrapperService.findOne(customizationTypeUrl, {
              id: customizationTypeId,
            });
            if (customizationTypeData) {
              let uHexCode = '';
              if (type === 'color') {
                uHexCode = hexCode ? hexCode?.trim() : customizationTypeData?.hexCode ?? '';
                if (!uHexCode) {
                  reject(new Error('Hex code not found'));
                  return;
                }
              }

              imageFile = typeof imageFile === 'object' ? [imageFile] : [];
              deletedImage = deletedImage ? deletedImage.trim() : null;

              if (type === 'image' && !deletedImage && !imageFile.length) {
                reject(new Error('Image not found'));
                return;
              }

              let uploadedImage = '';
              if (type === 'image' && imageFile.length) {
                if (imageFile.length > fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT) {
                  reject(
                    new Error(
                      `You can only ${fileSettings.CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT} image upload here`
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
                      uploadedImage = fileNames[0];
                    }
                  })
                  .catch((e) => {
                    reject(new Error('An error occurred during image uploading.'));
                    return;
                  });
              }

              const imageUrl = deletedImage ? '' : customizationSubTypeData?.image ?? '';

              const payload = {
                title: title,
                customizationTypeId,
                type,
                hexCode: uHexCode,
                image: type === 'image' ? (imageFile.length ? uploadedImage : imageUrl) : '',
              };
              const updatePattern = {
                url: `${customizationSubTypeUrl}/${customizationSubTypeId}`,
                payload: payload,
              };
              fetchWrapperService
                ._update(updatePattern)
                .then((response) => {
                  resolve(true);
                  // Whenever a new file is uploaded for a customization sub type, the old file will be deleted.

                  let oldImgrl = deletedImage;
                  if (type !== 'image' && customizationSubTypeData?.image) {
                    oldImgrl = customizationSubTypeData?.image;
                  }

                  if (oldImgrl) {
                    deleteFile(customizationSubTypeUrl, oldImgrl);
                  }
                })
                .catch((e) => {
                  reject(new Error('An error occurred during update customizationSubType.'));
                  // whenever an error occurs for updating a customization sub type image the uploaded file is deleted
                  if (uploadedImage) {
                    deleteFile(customizationSubTypeUrl, uploadedImage);
                  }
                });
            } else {
              reject(new Error('customization type data not found'));
            }
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('customization sub Type not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
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
            reject(new Error('Customization sub type can not delete Because it is products'));
          }
        } else {
          reject(new Error('customization sub Type not found!'));
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
        const variations = product.variations || [];
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
  getAllCustomizationSubTypes,
  insertCustomizationSubType,
  updateCustomizationSubType,
  deleteCustomizationSubType,
};
