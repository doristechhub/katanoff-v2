import { uid } from 'uid';
import { brandSliderUrl, fetchWrapperService, sanitizeObject } from '../_helpers';
import fileSettings from '../_utils/fileSettings';
import { deleteFile, uploadFile } from '../_helpers/fileUploads';
import { isValidFileSize, isValidFileType } from '../_helpers/fileValidation';

const insertBrandSlider = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { imageFile } = sanitizeObject(params);
      imageFile = imageFile ? imageFile : null;

      if (imageFile && uuid) {
        const validFileType = isValidFileType(fileSettings.IMAGE_FILE_NAME, [imageFile]);
        if (validFileType) {
          const validFileSize = isValidFileSize(fileSettings.IMAGE_FILE_NAME, [imageFile]);
          if (validFileSize) {
            const filesPayload = [imageFile];
            await uploadFile(brandSliderUrl, filesPayload)
              .then((fileNames) => {
                const insertPattern = {
                  id: uuid,
                  image: fileNames[0],
                  createdDate: Date.now(),
                  updatedDate: Date.now(),
                };
                const createPattern = {
                  url: `${brandSliderUrl}/${uuid}`,
                  insertPattern: insertPattern,
                };
                fetchWrapperService
                  .create(createPattern)
                  .then((response) => {
                    resolve(true);
                  })
                  .catch((e) => {
                    reject(new Error('An error occurred during brand slider creation.'));
                    // whenever an error occurs for creating a product the file is deleted
                    if (fileNames && fileNames.length) {
                      fileNames.map((url) => deleteFile(brandSliderUrl, url));
                    }
                  });
              })
              .catch((e) => {
                reject(new Error('An error occurred during brand slider image uploading.'));
              });
          } else {
            reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
          }
        } else {
          reject(new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllBrandSlider = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(brandSliderUrl);
      const brandSliderData = respData ? Object.values(respData) : [];
      resolve(brandSliderData);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteBrandSlider = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { brandSliderId } = sanitizeObject(params);
      if (brandSliderId) {
        const brandSliderData = await fetchWrapperService.findOne(brandSliderUrl, {
          id: brandSliderId,
        });
        if (brandSliderData) {
          await fetchWrapperService._delete(`${brandSliderUrl}/${brandSliderId}`);
          if (brandSliderData.image) {
            deleteFile(brandSliderUrl, brandSliderData.image);
          }
          resolve(true);
        } else {
          reject(new Error('brand slider does not exist'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const brandSliderService = {
  insertBrandSlider,
  getAllBrandSlider,
  deleteBrandSlider,
};
