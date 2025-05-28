import { uid } from 'uid';
import {
  settingStyleUrl,
  fetchWrapperService,
  sanitizeObject,
  isValidFileType,
  isValidFileSize,
  uploadFile,
  deleteFile,
} from '../_helpers';
import { productService } from './product.service';
import fileSettings from 'src/_utils/fileSettings';

const getAllSettingStyle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(settingStyleUrl);
      const settingStyleData = respData ? Object.values(respData) : [];
      resolve(settingStyleData);
    } catch (e) {
      reject(e);
    }
  });
};

const insertSettingStyle = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title, imageFile } = sanitizeObject(params);
      title = title ? title.trim() : null;
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];

      if (title && uuid) {
        const settingStyleData = await fetchWrapperService.findOne(settingStyleUrl, {
          title: title,
        });
        if (!settingStyleData) {
          let imageUrl = '';
          if (imageFile.length) {
            if (imageFile?.length > fileSettings.SETTING_STYLE_IMAGE_FILE_LIMIT) {
              reject(
                new Error(
                  `You can only ${fileSettings.SETTING_STYLE_IMAGE_FILE_LIMIT} image upload here`
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
            await uploadFile(settingStyleUrl, filesPayload)
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
            url: `${settingStyleUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during settingStyle creation.'));
              // whenever an error occurs for creating a setting style the file is deleted
              if (imageUrl) {
                deleteFile(settingStyleUrl, imageUrl);
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

const updateSettingStyle = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { settingStyleId, title, imageFile, deletedImage } = sanitizeObject(params);
      title = title ? title.trim() : null;
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];
      deletedImage = deletedImage ? deletedImage.trim() : null;

      if (settingStyleId && title) {
        const settingStyleData = await fetchWrapperService.findOne(settingStyleUrl, {
          id: settingStyleId,
        });
        if (settingStyleData) {
          const findPattern = {
            id: settingStyleId,
            key: 'title',
            value: title,
          };

          const duplicateData = await fetchWrapperService.findOneWithNotEqual(
            settingStyleUrl,
            findPattern
          );
          if (!duplicateData.length) {
            let uploadedImage = '';
            if (imageFile.length) {
              if (imageFile.length > fileSettings.SETTING_STYLE_IMAGE_FILE_LIMIT) {
                reject(
                  new Error(
                    `You can only ${fileSettings.SETTING_STYLE_IMAGE_FILE_LIMIT} image upload here`
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
              await uploadFile(settingStyleUrl, filesPayload)
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
            const imageUrl = deletedImage ? '' : settingStyleData?.image ?? '';
            const payload = {
              title: title,
              image: imageFile.length ? uploadedImage : imageUrl,
            };
            const updatePattern = {
              url: `${settingStyleUrl}/${settingStyleId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
                // Whenever a new file is uploaded for a setting style, the old file will be deleted.

                if (deletedImage) {
                  deleteFile(settingStyleUrl, deletedImage);
                }
              })
              .catch((e) => {
                reject(new Error('An error occurred during update settingStyle.'));
                // whenever an error occurs for updating a setting style image the uploaded file is deleted
                if (uploadedImage) {
                  deleteFile(settingStyleUrl, uploadedImage);
                }
              });
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('settingStyle not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteSettingStyle = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { settingStyleId } = sanitizeObject(params);
      if (settingStyleId) {
        const settingStyleData = await fetchWrapperService.findOne(settingStyleUrl, {
          id: settingStyleId,
        });
        if (settingStyleData) {
          const productData = await getAllProductsBySettingStyleId(settingStyleId);
          if (!productData?.length) {
            await fetchWrapperService._delete(`${settingStyleUrl}/${settingStyleId}`);
            if (settingStyleData?.image) {
              deleteFile(settingStyleUrl, settingStyleData?.image);
            }
            resolve(true);
          } else {
            reject(new Error('settingStyle can not delete Because it has products'));
          }
        } else {
          reject(new Error('setting style not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductsBySettingStyleId = (settingStyleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productData = await productService.getAllProductsWithPagging();
      const foundProducts = productData.filter((product) =>
        product?.settingStyleIds?.some((id) => id === settingStyleId)
      );
      resolve(foundProducts);
    } catch (e) {
      reject(e);
    }
  });
};

export const settingStyleService = {
  getAllSettingStyle,
  insertSettingStyle,
  updateSettingStyle,
  deleteSettingStyle,
};
