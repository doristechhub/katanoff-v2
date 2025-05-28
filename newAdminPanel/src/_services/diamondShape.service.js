import { uid } from 'uid';
import {
  diamondShapeUrl,
  fetchWrapperService,
  sanitizeObject,
  isValidFileType,
  isValidFileSize,
  uploadFile,
  deleteFile,
} from '../_helpers';
import { productService } from './product.service';
import fileSettings from 'src/_utils/fileSettings';

const getAllDiamondShape = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(diamondShapeUrl);
      const diamondShapeData = respData ? Object.values(respData) : [];
      resolve(diamondShapeData);
    } catch (e) {
      reject(e);
    }
  });
};

const insertDiamondShape = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title, imageFile } = sanitizeObject(params);
      title = title ? title.trim() : null;
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];

      if (title && uuid) {
        const diamondShapeData = await fetchWrapperService.findOne(diamondShapeUrl, {
          title: title,
        });
        if (!diamondShapeData) {
          let imageUrl = '';
          if (imageFile.length) {
            if (imageFile?.length > fileSettings.DIAMOND_SHAPE_IMAGE_FILE_LIMIT) {
              reject(
                new Error(
                  `You can only ${fileSettings.DIAMOND_SHAPE_IMAGE_FILE_LIMIT} image upload here`
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
            await uploadFile(diamondShapeUrl, filesPayload)
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
            title: title,
            image: imageUrl,
            createdDate: Date.now(),
          };
          const createPattern = {
            url: `${diamondShapeUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during diamondShape creation.'));
              // whenever an error occurs for creating a diamond shape the file is deleted
              if (imageUrl) {
                deleteFile(diamondShapeUrl, imageUrl);
              }
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

const updateDiamondShape = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { diamondShapeId, title, imageFile, deletedImage } = sanitizeObject(params);
      title = title ? title.trim() : null;
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];
      deletedImage = deletedImage ? deletedImage.trim() : null;

      if (diamondShapeId && title) {
        const diamondShapeData = await fetchWrapperService.findOne(diamondShapeUrl, {
          id: diamondShapeId,
        });
        if (diamondShapeData) {
          const findPattern = {
            id: diamondShapeId,
            key: 'title',
            value: title,
          };

          const duplicateData = await fetchWrapperService.findOneWithNotEqual(
            diamondShapeUrl,
            findPattern
          );
          if (!duplicateData.length) {
            let uploadedImage = '';
            if (imageFile.length) {
              if (imageFile.length > fileSettings.DIAMOND_SHAPE_IMAGE_FILE_LIMIT) {
                reject(
                  new Error(
                    `You can only ${fileSettings.DIAMOND_SHAPE_IMAGE_FILE_LIMIT} image upload here`
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
              await uploadFile(diamondShapeUrl, filesPayload)
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
            const imageUrl = deletedImage ? '' : diamondShapeData?.image ?? '';
            const payload = {
              title: title,
              image: imageFile.length ? uploadedImage : imageUrl,
            };
            const updatePattern = {
              url: `${diamondShapeUrl}/${diamondShapeId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
                // Whenever a new file is uploaded for a diamond shape, the old file will be deleted.

                if (deletedImage) {
                  deleteFile(diamondShapeUrl, deletedImage);
                }
              })
              .catch((e) => {
                reject(new Error('An error occurred during update diamondShape.'));
                // whenever an error occurs for updating a diamond shape image the uploaded file is deleted
                if (uploadedImage) {
                  deleteFile(diamondShapeUrl, uploadedImage);
                }
              });
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('diamondShape not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteDiamondShape = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { diamondShapeId } = sanitizeObject(params);
      if (diamondShapeId) {
        const diamondShapeData = await fetchWrapperService.findOne(diamondShapeUrl, {
          id: diamondShapeId,
        });
        if (diamondShapeData) {
          const productData = await getAllProductsByDiamondShapeId(diamondShapeId);
          if (!productData?.length) {
            await fetchWrapperService._delete(`${diamondShapeUrl}/${diamondShapeId}`);
            if (diamondShapeData?.image) {
              deleteFile(diamondShapeUrl, diamondShapeData?.image);
            }
            resolve(true);
          } else {
            reject(new Error('diamondShape can not delete Because it has products'));
          }
        } else {
          reject(new Error('diamond shape not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductsByDiamondShapeId = (diamondShapeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productData = await productService.getAllProductsWithPagging();
      const foundProducts = productData.filter((product) =>
        product?.diamondFilters?.diamondShapeIds?.some((id) => id === diamondShapeId)
      );
      resolve(foundProducts);
    } catch (e) {
      reject(e);
    }
  });
};

export const diamondShapeService = {
  getAllDiamondShape,
  insertDiamondShape,
  updateDiamondShape,
  deleteDiamondShape,
};
