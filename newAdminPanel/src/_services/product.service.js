import { uid } from 'uid';
import {
  customizationUrl,
  fetchWrapperService,
  menuUrl,
  productSliderUrl,
  productsUrl,
  sanitizeObject,
  sanitizeValue,
  sapphireTreeProductListApiUrl,
  sapphireTreeSecretKey,
  showCaseBannerUrl,
} from '../_helpers';
import fileSettings from '../_utils/fileSettings';
import { deleteFile, uploadFile } from '../_helpers/fileUploads';
import { isValidFileSize, isValidFileType } from '../_helpers/fileValidation';
import { helperFunctions } from '../_helpers/helperFunctions';
import {
  ALLOW_MAX_CARAT_WEIGHT,
  ALLOW_MIN_CARAT_WEIGHT,
  ALLOWED_DIA_CERTIFICATES,
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  ALLOWED_DIA_CUTS,
  ALLOWED_DIA_FLUORESCENCE,
  ALLOWED_DIA_POLISH,
  ALLOWED_DIA_SYMMETRIES,
  ALLOWED_DIA_TYPES,
  ALLOWED_SHAPES,
  GOLD_COLOR,
  GOLD_TYPE,
  SIZE_TYPE,
  SIZE_TYPE_SUB_TYPES_LIST,
} from 'src/_helpers/constants';
import { isBoolean } from 'lodash';
import axios from 'axios';
import { customizationTypeService } from './customizationType.service';
import { customizationSubTypeService } from './customizationSubType.service';
import { menuCategoryService } from './menuCategory.service';

export const validateProductName = (productName) => {
  // Check if the length is higher than 60 characters
  if (productName.length > 60) {
    return 'Product name should not exceed 60 characters.';
  }

  // Check if the product name contains only allowed characters (letters, numbers, spaces, hyphens, and dots)
  if (!/^[a-zA-Z0-9\s\-.]*$/.test(productName)) {
    return 'Product name can only contain letters (a-z, A-Z), numbers (0-9), spaces, hyphens (-), and dots (.).';
  }

  // If the product name is valid, return null
  return null;
};

export const validateShortDescription = (description) => {
  // Check if the length is higher than 60 characters
  if (description && description.length > 250) {
    return 'Short Description should not exceed 250 characters.';
  }

  // If the short description is valid, return null
  return null;
};

const isInValidVariationsArray = (arrayOfVariations) => {
  const isValidVariId = helperFunctions.isValidKeyName(arrayOfVariations, 'variationId');
  const isValidVariTypes = helperFunctions.isValidKeyName(arrayOfVariations, 'variationTypes');
  const variationTypesArray = arrayOfVariations[0]?.varitationTypes || [];
  const isValidVariTypesId = helperFunctions.isValidKeyName(variationTypesArray, 'variationTypeId');
  return !isValidVariId || !isValidVariTypes || !isValidVariTypesId;
};

const getVariationsArray = (variaionsOfArray) => {
  return variaionsOfArray.map((variation) => {
    return {
      variationId: variation.variationId,
      variationTypes: variation.variationTypes.map((variationType) => {
        return {
          variationTypeId: variationType.variationTypeId,
        };
      }),
    };
  });
};

const isInValidVariComboWithQuantityArray = (arrayOfVariCombinations) => {
  const isValidCombination = helperFunctions.isValidKeyName(arrayOfVariCombinations, 'combination');
  const combinationArray = arrayOfVariCombinations[0]?.combination || [];
  const isValidVariId = helperFunctions.isValidKeyName(combinationArray, 'variationId');
  const isValidVariTypeId = helperFunctions.isValidKeyName(combinationArray, 'variationTypeId');
  const isValidPrice = helperFunctions.isValidKeyName(arrayOfVariCombinations, 'price');
  const isValidQuantity = helperFunctions.isValidKeyName(arrayOfVariCombinations, 'quantity');
  return (
    !isValidCombination || !isValidVariId || !isValidVariTypeId || !isValidPrice || !isValidQuantity
  );
};

const getVariComboWithQuantityArray = (arrayOfVariCombinations) => {
  return arrayOfVariCombinations.map((variCombiItem) => {
    return {
      combination: variCombiItem.combination.map((combiItem) => {
        return {
          variationId: combiItem.variationId,
          variationTypeId: combiItem.variationTypeId,
        };
      }),
      price: variCombiItem.price,
      quantity: variCombiItem.quantity,
    };
  });
};

const validateDiamondFilters = (diamondFilters) => {
  let { diamondShapeIds, caratWeightRange } = diamondFilters;

  // Ensure arrays are initialized properly
  diamondShapeIds = Array.isArray(diamondShapeIds) ? diamondShapeIds : [];

  // Validate diamondShapeIds
  if (!diamondShapeIds?.length || diamondShapeIds?.some((id) => !id)) {
    return 'Invalid Diamond Shapes';
  }
  // Validate caratWeightRange
  if (
    caratWeightRange?.min < ALLOW_MIN_CARAT_WEIGHT ||
    caratWeightRange?.max > ALLOW_MAX_CARAT_WEIGHT ||
    caratWeightRange?.min > caratWeightRange?.max
  ) {
    return 'Invalid Carat Weight Range';
  }

  // All validations passed
  return null;
};

const insertProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let {
        productName,
        imageFiles,
        thumbnailImageFile,
        videoFile,
        sku,
        saltSKU,
        discount,
        collectionIds,
        settingStyleIds,
        categoryId,
        subCategoryId,
        productTypeIds,
        netWeight,
        shortDescription,
        description,
        variations,
        specifications,
        variComboWithQuantity,
        active,
        isDiamondFilter,
        diamondFilters,
      } = sanitizeObject(params);

      // Sanitize and process inputs
      productName = productName ? productName.trim() : null;
      imageFiles = Array.isArray(imageFiles) ? imageFiles : [];
      thumbnailImageFile = typeof thumbnailImageFile === 'object' ? [thumbnailImageFile] : [];
      videoFile = typeof videoFile === 'object' ? [videoFile] : [];
      sku = sku ? sku.trim() : null;
      saltSKU = saltSKU ? saltSKU.trim() : null;
      discount = !isNaN(discount) ? Number(discount) : 0;
      collectionIds = Array.isArray(collectionIds) ? collectionIds : [];
      settingStyleIds = Array.isArray(settingStyleIds) ? settingStyleIds : [];
      categoryId = categoryId ? categoryId.trim() : null;
      subCategoryId = subCategoryId ? subCategoryId.trim() : null;
      productTypeIds = Array.isArray(productTypeIds) ? productTypeIds : [];

      // Process netWeight: Parse, round to 2 decimal places, and store as number
      netWeight =
        !isNaN(netWeight) && netWeight !== '' && netWeight !== null
          ? Math.round(parseFloat(netWeight) * 100) / 100
          : 0;

      shortDescription = shortDescription ? shortDescription.trim() : null;
      description = description ? description.trim() : null;
      variations = Array.isArray(variations) ? variations : [];
      specifications = Array.isArray(specifications) ? specifications : [];
      variComboWithQuantity = Array.isArray(variComboWithQuantity) ? variComboWithQuantity : [];
      active = JSON.parse(active);
      isDiamondFilter = isBoolean(isDiamondFilter) ? isDiamondFilter : false;
      diamondFilters = typeof diamondFilters === 'object' ? diamondFilters : {};

      // Validate inputs
      if (
        productName &&
        imageFiles.length &&
        thumbnailImageFile.length &&
        sku &&
        categoryId &&
        // subCategoryId &&
        // productTypeIds?.length &&
        description &&
        variations.length &&
        variComboWithQuantity.length &&
        [true, false].includes(active) &&
        uuid
      ) {
        const pNameErrorMsg = validateProductName(productName);
        if (pNameErrorMsg) {
          reject(new Error(pNameErrorMsg));
          return;
        }

        const shortDescErrorMsg = validateShortDescription(shortDescription);
        if (shortDescErrorMsg) {
          reject(new Error(shortDescErrorMsg));
          return;
        }

        if (isInValidVariationsArray(variations)) {
          reject(new Error('variations data not valid'));
          return;
        }

        const variationsArray = getVariationsArray(variations);

        if (isInValidVariComboWithQuantityArray(variComboWithQuantity)) {
          reject(new Error('combination data not valid'));
          return;
        }

        const variComboWithQuantityArray = getVariComboWithQuantityArray(variComboWithQuantity);

        if (collectionIds?.length) {
          const hasInvalidValues = collectionIds.some((id) => !id);
          if (hasInvalidValues) throw new Error('Invalid value found in collectionIds array');
        }
        if (settingStyleIds?.length) {
          const hasInvalidValues = settingStyleIds.some((id) => !id);
          if (hasInvalidValues) throw new Error('Invalid value found in settingStyleIds array');
        }
        if (productTypeIds?.length) {
          const hasInvalidValues = productTypeIds.some((id) => !id);
          if (hasInvalidValues) throw new Error('Invalid value found in productTypeIds array');
        }

        if (specifications.length) {
          const isSpecTitleValid = helperFunctions.isValidKeyName(specifications, 'title');
          const isSpecDescValid = helperFunctions.isValidKeyName(specifications, 'description');
          if (!isSpecTitleValid || !isSpecDescValid) {
            reject(new Error('specifications data not valid'));
            return;
          }
        }

        // Validate netWeight for isDiamondFilter
        if (isDiamondFilter) {
          const diamondFilterErrorMsg = validateDiamondFilters(diamondFilters);
          if (diamondFilterErrorMsg) {
            reject(new Error(diamondFilterErrorMsg));
            return;
          }
          if (!netWeight || isNaN(netWeight)) {
            reject(new Error('Invalid Net Weight: Must be a valid number'));
            return;
          }
          // Ensure netWeight has exactly 2 decimal places
          const netWeightString = netWeight.toFixed(2);
          if (!/^\d+\.\d{2}$/.test(netWeightString)) {
            reject(new Error('Net Weight must have exactly two decimal places'));
            return;
          }
        }

        const filterParams = {
          productName: productName,
          sku: sku,
        };
        const productFindPattern = {
          url: productsUrl,
          filterParams: filterParams,
        };
        const productData = await fetchWrapperService.findMany(productFindPattern);

        if (!productData.length) {
          if (!imageFiles.length) {
            reject(new Error(`It's necessary to have a image`));
            return;
          } else if (imageFiles.length > fileSettings.PRODUCT_IMAGE_FILE_LIMIT) {
            reject(
              new Error(`You can only ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} image upload here`)
            );
            return;
          } else if (!thumbnailImageFile.length) {
            reject(new Error(`It's necessary to have a thumbnail image`));
            return;
          } else if (thumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT) {
            reject(
              new Error(
                `You can only ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} thumbnail image upload here`
              )
            );
            return;
          } else if (videoFile.length && videoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
            reject(
              new Error(`You can only ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} video upload here`)
            );
            return;
          } else {
            const imageValidFileType = isValidFileType(fileSettings.IMAGE_FILE_NAME, imageFiles);
            const thumbnailImageValidFileType = isValidFileType(
              fileSettings.IMAGE_FILE_NAME,
              thumbnailImageFile
            );
            if (!imageValidFileType || !thumbnailImageValidFileType) {
              reject(new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)'));
              return;
            }

            const imageValidFileSize = isValidFileSize(fileSettings.IMAGE_FILE_NAME, imageFiles);
            const thumbnailImageValidFileSize = isValidFileSize(
              fileSettings.IMAGE_FILE_NAME,
              thumbnailImageFile
            );
            if (!imageValidFileSize || !thumbnailImageValidFileSize) {
              reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
              return;
            }

            if (videoFile.length) {
              const videoValidFileType = isValidFileType(fileSettings.VIDEO_FILE_NAME, videoFile);
              if (!videoValidFileType) {
                reject(new Error('Invalid file! (Only MP4, WEBM, OGG files are allowed!)'));
                return;
              }

              const videoValidFileSize = isValidFileSize(fileSettings.VIDEO_FILE_NAME, videoFile);
              if (!videoValidFileSize) {
                reject(new Error('Invalid File Size! (Only 100 MB are allowed!)'));
                return;
              }
            }

            const filesPayload = [...thumbnailImageFile, ...imageFiles, ...videoFile];
            await uploadFile(productsUrl, filesPayload)
              .then((fileNames) => {
                let videoUrl = '';
                if (videoFile.length) {
                  videoUrl = fileNames.pop();
                }
                const thumbnailImage = fileNames.shift();
                const imagesArray = fileNames.map((url) => {
                  return { image: url };
                });
                const insertPattern = {
                  id: uuid,
                  productName: productName,
                  images: imagesArray,
                  thumbnailImage,
                  video: videoUrl,
                  sku,
                  saltSKU,
                  discount,
                  collectionIds: collectionIds.map((id) => id?.trim()),
                  settingStyleIds: settingStyleIds.map((id) => id?.trim()),
                  categoryId,
                  subCategoryId,
                  productTypeIds: productTypeIds.map((id) => id?.trim()),
                  netWeight, // Stored as a number, rounded to 2 decimal places
                  shortDescription,
                  description,
                  variations: variationsArray,
                  variComboWithQuantity: variComboWithQuantityArray,
                  isDiamondFilter: isDiamondFilter,
                  diamondFilters: isDiamondFilter ? diamondFilters : null,
                  specifications,
                  active: active,
                  salesTaxPercentage: 0,
                  shippingCharge: 0,
                  totalReviews: 0,
                  starRating: 0,
                  totalStar: 0,
                  createdDate: Date.now(),
                  updatedDate: Date.now(),
                };
                const createPattern = {
                  url: `${productsUrl}/${uuid}`,
                  insertPattern: insertPattern,
                };
                fetchWrapperService
                  .create(createPattern)
                  .then((response) => {
                    resolve(true);
                  })
                  .catch((e) => {
                    reject(new Error('An error occurred during product creation.'));
                    // Whenever an error occurs for creating a product, the files are deleted
                    if (fileNames && fileNames.length) {
                      fileNames.map((url) => deleteFile(productsUrl, url));
                    }
                  });
              })
              .catch((e) => {
                reject(new Error('An error occurred during product image uploading.'));
              });
          }
        } else {
          reject(new Error('Product name or sku already exists'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductsWithPagging = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productData = await fetchWrapperService.getPaginatdData(productsUrl);
      const updatedProductData = productData.map((item) => {
        const { price = 0 } = helperFunctions.getMinPriceVariCombo(item.variComboWithQuantity);
        return {
          ...item,
          basePrice: price,
          baseSellingPrice: helperFunctions.getSellingPrice(price, item.discount),
        };
      });
      resolve(updatedProductData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllActiveProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: productsUrl,
        key: 'active',
        value: true,
      };
      const activeProductData = await fetchWrapperService.find(findPattern);
      resolve(activeProductData);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      productId = sanitizeValue(productId) ? productId.trim() : null;

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          const showCaseBannerData = await fetchWrapperService.findOne(showCaseBannerUrl, {
            productId: productId,
          });
          if (showCaseBannerData) {
            reject(new Error('product can not delete Because it has show case banner'));
            return;
          }
          const productSliderData = await fetchWrapperService.findOne(productSliderUrl, {
            productId: productId,
          });
          if (productSliderData) {
            reject(new Error('product can not delete Because it has product slider'));
            return;
          }

          await fetchWrapperService._delete(`${productsUrl}/${productId}`);
          if (productData.images && productData.images.length) {
            productData.images.map((item) => deleteFile(productsUrl, item.image));
          }
          if (productData?.video) {
            deleteFile(productsUrl, productData?.video);
          }
          if (productData?.thumbnailImage) {
            deleteFile(productsUrl, productData?.thumbnailImage);
          }
          resolve(true);
        } else {
          reject(new Error('Product does not exist'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getSingleProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      productId = sanitizeValue(productId) ? productId.trim() : null;

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          resolve(productData);
        } else {
          reject(new Error('Product does not exist'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductPhotos = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productId, imageFiles, deletedImages } = sanitizeObject(params);
      imageFiles = Array.isArray(imageFiles) ? imageFiles : [];
      deletedImages = Array.isArray(deletedImages) ? deletedImages : [];

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          let tempPhotoArray = [];
          tempPhotoArray = productData.images || [];

          if (deletedImages.length) {
            // eslint-disable-next-line array-callback-return
            deletedImages.map((url) => {
              const findedIndex = tempPhotoArray.findIndex((item) => {
                return url === item.image;
              });
              if (findedIndex !== -1) {
                tempPhotoArray.splice(findedIndex, 1);
              }
            });
          }
          let uploadedImages = [];
          if (imageFiles.length) {
            if (
              tempPhotoArray.length + imageFiles.length <=
              fileSettings.PRODUCT_IMAGE_FILE_LIMIT
            ) {
              const validFileType = isValidFileType(fileSettings.IMAGE_FILE_NAME, imageFiles);
              if (validFileType) {
                const validFileSize = isValidFileSize(fileSettings.IMAGE_FILE_NAME, imageFiles);
                if (validFileSize) {
                  const filesPayload = [...imageFiles];
                  await uploadFile(productsUrl, filesPayload)
                    .then((fileNames) => {
                      uploadedImages = fileNames.map((url) => {
                        return {
                          image: url,
                        };
                      });
                    })
                    .catch((e) => {
                      reject(new Error('An error occurred during product image uploading.'));
                    });
                } else {
                  reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
                }
              } else {
                reject(new Error('Invalid file! (Only JPG, JPEG PNG, WEBP files are allowed!)'));
              }
            } else {
              reject(
                new Error(`You can only ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} image upload here`)
              );
            }
          }

          const imagesArray = [...tempPhotoArray, ...uploadedImages];
          if (imagesArray.length) {
            const payload = {
              images: imagesArray,
              updatedDate: Date.now(),
            };
            const updatePattern = {
              url: `${productsUrl}/${productId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                // Whenever a new file is uploaded for a product, the old file will be deleted.
                if (deletedImages.length) {
                  deletedImages.map((url) => deleteFile(productsUrl, url));
                }
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update product photos.'));
                // whenever an error occurs for updating a product photos the file is deleted
                if (uploadedImages && uploadedImages.length) {
                  uploadedImages.map((element) => deleteFile(productsUrl, element.image));
                }
              });
          } else {
            reject(new Error('At least one image is required'));
          }
        } else {
          reject(new Error('Product does not exists'));
        }
      } else {
        reject(new Error('productId is required'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductThumbnailPhoto = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productId, thumbnailImageFile, deletedThumbnailImage } = sanitizeObject(params);
      thumbnailImageFile = typeof thumbnailImageFile === 'object' ? [thumbnailImageFile] : [];
      deletedThumbnailImage = deletedThumbnailImage ? deletedThumbnailImage.trim() : null;

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          let uploadedThumbnailImage = '';
          if (
            thumbnailImageFile.length &&
            thumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
          ) {
            reject(
              new Error(
                `You can only ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} thumbnail upload here`
              )
            );
            return;
          }
          if (thumbnailImageFile.length) {
            const validFileType = isValidFileType(fileSettings.IMAGE_FILE_NAME, thumbnailImageFile);
            if (!validFileType) {
              reject(new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)'));
              return;
            }
            const validFileSize = isValidFileSize(fileSettings.IMAGE_FILE_NAME, thumbnailImageFile);
            if (!validFileSize) {
              reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
              return;
            }

            const filesPayload = [...thumbnailImageFile];
            await uploadFile(productsUrl, filesPayload)
              .then((fileNames) => {
                uploadedThumbnailImage = fileNames[0];
              })
              .catch((e) => {
                reject(new Error('An error occurred during product thumbnail image uploading.'));
              });
          }

          const thumbnailImageUrl = thumbnailImageFile.length
            ? uploadedThumbnailImage
            : productData?.thumbnailImage;

          const payload = {
            thumbnailImage: thumbnailImageUrl,
            updatedDate: Date.now(),
          };
          const updatePattern = {
            url: `${productsUrl}/${productId}`,
            payload: payload,
          };
          fetchWrapperService
            ._update(updatePattern)
            .then((response) => {
              // Whenever a new file is uploaded for a product, the old file will be deleted.
              if (uploadedThumbnailImage) {
                deleteFile(productsUrl, productData?.thumbnailImage);
              }
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during update product thumbnail image.'));
              // whenever an error occurs for updating a product product thumbnail image the uploaded file is deleted
              if (uploadedThumbnailImage) {
                deleteFile(productsUrl, uploadedThumbnailImage);
              }
            });
        } else {
          reject(new Error('Product does not exists'));
        }
      } else {
        reject(new Error('productId is required'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductVideo = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productId, videoFile, deletedVideo } = sanitizeObject(params);

      videoFile = typeof videoFile === 'object' ? [videoFile] : [];
      deletedVideo = deletedVideo ? deletedVideo.trim() : null;

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          let uploadedVideo = '';
          if (videoFile.length && videoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
            reject(
              new Error(`You can only ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} video upload here`)
            );
            return;
          }
          if (videoFile.length) {
            const videoValidFileType = isValidFileType(fileSettings.VIDEO_FILE_NAME, videoFile);
            if (!videoValidFileType) {
              reject(new Error('Invalid file! (Only MP4, WEBM, OGG files are allowed!)'));
              return;
            }

            const videoValidFileSize = isValidFileSize(fileSettings.VIDEO_FILE_NAME, videoFile);
            if (!videoValidFileSize) {
              reject(new Error('Invalid File Size! (Only 100 MB are allowed!)'));
              return;
            }

            const filesPayload = [...videoFile];
            await uploadFile(productsUrl, filesPayload)
              .then((fileNames) => {
                uploadedVideo = fileNames[0];
              })
              .catch((e) => {
                reject(new Error('An error occurred during product video uploading.'));
              });
          }

          const videoUrl = deletedVideo ? '' : productData?.video ?? '';

          const payload = {
            video: videoFile.length ? uploadedVideo : videoUrl,
            updatedDate: Date.now(),
          };
          const updatePattern = {
            url: `${productsUrl}/${productId}`,
            payload: payload,
          };
          fetchWrapperService
            ._update(updatePattern)
            .then((response) => {
              // Whenever a new file is uploaded for a product, the old file will be deleted.
              if (deletedVideo) {
                deleteFile(productsUrl, deletedVideo);
              }
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during update product video.'));
              // whenever an error occurs for updating a product video the uploaded file is deleted
              if (uploadedVideo) {
                deleteFile(productsUrl, uploadedVideo);
              }
            });
        } else {
          reject(new Error('Product does not exists'));
        }
      } else {
        reject(new Error('productId is required'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const activeDeactiveProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productId, active } = sanitizeObject(params);
      if (productId) {
        active = JSON.parse(active);
        if (active === true || active === false) {
          const productData = await fetchWrapperService.findOne(productsUrl, {
            id: productId,
          });
          if (productData) {
            if (productData.active === active) {
              reject(new Error(`Product already ${active ? 'activated!' : 'deactivated!'}`));
            } else {
              if (active === false) {
                const showCaseBannerData = await fetchWrapperService.findOne(showCaseBannerUrl, {
                  productId: productId,
                });
                if (showCaseBannerData) {
                  reject(new Error('product can not deactivate Because it has show case banner'));
                  return;
                }

                const productSliderData = await fetchWrapperService.findOne(productSliderUrl, {
                  productId: productId,
                });
                if (productSliderData) {
                  reject(new Error('product can not deactivate Because it has product slider'));
                  return;
                }
              }
              const payload = {
                active: active,
              };
              const updatePattern = {
                url: `${productsUrl}/${productId}`,
                payload: payload,
              };
              fetchWrapperService
                ._update(updatePattern)
                .then(() => {
                  resolve(true);
                })
                .catch((e) => {
                  reject(new Error('An error occurred during update product status.'));
                });
            }
          } else {
            reject(new Error('Product does not exist'));
          }
        } else {
          reject(new Error('Invalid status'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        productId,
        productName,
        thumbnailImageFile,
        imageFiles,
        videoFile,
        sku,
        saltSKU,
        discount,
        collectionIds,
        settingStyleIds,
        categoryId,
        subCategoryId,
        productTypeIds,
        netWeight,
        shortDescription,
        description,
        variations,
        variComboWithQuantity,
        specifications,
        deletedImages,
        deletedVideo,
        active,
        isDiamondFilter,
        diamondFilters,
      } = sanitizeObject(params);

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          productName = productName ? productName.trim() : productData.productName;
          sku = sku ? sku.trim() : productData.sku;
          saltSKU = saltSKU ? saltSKU.trim() : productData.saltSKU;
          discount = !isNaN(discount) ? Number(discount) : productData.discount;

          // Process netWeight: Parse, kneel to 2 decimal places, and store as number
          netWeight =
            !isNaN(netWeight) && netWeight !== '' && netWeight !== null
              ? Math.round(parseFloat(netWeight) * 100) / 100
              : 0;

          isDiamondFilter = isBoolean(isDiamondFilter) ? isDiamondFilter : false;
          diamondFilters =
            typeof diamondFilters === 'object' ? diamondFilters : productData?.diamondFilters || {};

          const pNameErrorMsg = validateProductName(productName);
          if (pNameErrorMsg) {
            reject(new Error(pNameErrorMsg));
            return;
          }

          const shortDescErrorMsg = validateShortDescription(shortDescription);
          if (shortDescErrorMsg) {
            reject(new Error(shortDescErrorMsg));
            return;
          }

          if (isDiamondFilter) {
            const diamondFilterErrorMsg = validateDiamondFilters(diamondFilters);
            if (diamondFilterErrorMsg) {
              reject(new Error(diamondFilterErrorMsg));
              return;
            }
            if (!netWeight || isNaN(netWeight)) {
              reject(new Error('Invalid Net Weight: Must be a valid number'));
              return;
            }
            // Ensure netWeight has exactly 2 decimal places
            const netWeightString = netWeight.toFixed(2);
            if (!/^\d+\.\d{2}$/.test(netWeightString)) {
              reject(new Error('Net Weight must have exactly two decimal places'));
              return;
            }
          }

          const filterParams = {
            productName: productName,
            sku: sku,
          };
          const findPattern = {
            url: productsUrl,
            id: productId,
            filterParams: filterParams,
          };
          const duplicateData = await fetchWrapperService.findManyWithNotEqual(findPattern);
          if (!duplicateData.length) {
            if (collectionIds?.length) {
              const hasInvalidValues = collectionIds.some((id) => !id);
              if (hasInvalidValues) throw new Error('Invalid value found in collectionIds array');
            }
            if (settingStyleIds?.length) {
              const hasInvalidValues = settingStyleIds.some((id) => !id);
              if (hasInvalidValues) throw new Error('Invalid value found in settingStyleIds array');
            }
            if (productTypeIds?.length) {
              const hasInvalidValues = productTypeIds.some((id) => !id);
              if (hasInvalidValues) throw new Error('Invalid value found in productTypeIds array');
            }
            if (specifications?.length) {
              const isSpecTitleValid = helperFunctions.isValidKeyName(specifications, 'title');
              const isSpecDescValid = helperFunctions.isValidKeyName(specifications, 'description');
              if (!isSpecTitleValid || !isSpecDescValid) {
                reject(new Error('specifications data not valid'));
                return;
              }
            }

            imageFiles = Array.isArray(imageFiles) ? imageFiles : [];
            deletedImages = Array.isArray(deletedImages) ? deletedImages : [];
            videoFile = typeof videoFile === 'object' ? [videoFile] : [];
            deletedVideo = deletedVideo ? deletedVideo.trim() : null;
            thumbnailImageFile = typeof thumbnailImageFile === 'object' ? [thumbnailImageFile] : [];

            let tempPhotoArray = [];
            tempPhotoArray = productData.images || [];

            if (deletedImages.length) {
              // eslint-disable-next-line array-callback-return
              deletedImages.map((url) => {
                const findedIndex = tempPhotoArray.findIndex((item) => {
                  return url === item.image;
                });
                if (findedIndex !== -1) {
                  tempPhotoArray.splice(findedIndex, 1);
                }
              });
            }
            let uploadedImages = [];
            let uploadedVideo = '';
            let uploadedThumbnailImage = '';
            if (thumbnailImageFile?.length || imageFiles.length || videoFile.length) {
              if (
                thumbnailImageFile.length &&
                thumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
              ) {
                reject(
                  new Error(
                    `You can only ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} thumbnail image upload here`
                  )
                );
                return;
              } else if (
                imageFiles.length &&
                tempPhotoArray.length + imageFiles.length > fileSettings.PRODUCT_IMAGE_FILE_LIMIT
              ) {
                reject(
                  new Error(
                    `You can only ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} image upload here`
                  )
                );
                return;
              } else if (
                videoFile.length &&
                videoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT
              ) {
                reject(
                  new Error(
                    `You can only ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} video upload here`
                  )
                );
                return;
              } else {
                if (thumbnailImageFile.length) {
                  const validFileType = isValidFileType(
                    fileSettings.IMAGE_FILE_NAME,
                    thumbnailImageFile
                  );
                  if (!validFileType) {
                    reject(
                      new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)')
                    );
                    return;
                  }
                  const validFileSize = isValidFileSize(
                    fileSettings.IMAGE_FILE_NAME,
                    thumbnailImageFile
                  );
                  if (!validFileSize) {
                    reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
                    return;
                  }
                }
                if (imageFiles.length) {
                  const validFileType = isValidFileType(fileSettings.IMAGE_FILE_NAME, imageFiles);
                  if (!validFileType) {
                    reject(
                      new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)')
                    );
                    return;
                  }
                  const validFileSize = isValidFileSize(fileSettings.IMAGE_FILE_NAME, imageFiles);
                  if (!validFileSize) {
                    reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
                    return;
                  }
                }
                if (videoFile.length) {
                  const videoValidFileType = isValidFileType(
                    fileSettings.VIDEO_FILE_NAME,
                    videoFile
                  );
                  if (!videoValidFileType) {
                    reject(new Error('Invalid file! (Only MP4, WEBM, OGG files are allowed!)'));
                    return;
                  }

                  const videoValidFileSize = isValidFileSize(
                    fileSettings.VIDEO_FILE_NAME,
                    videoFile
                  );
                  if (!videoValidFileSize) {
                    reject(new Error('Invalid File Size! (Only 100 MB are allowed!)'));
                    return;
                  }
                }
                const filesPayload = [...thumbnailImageFile, ...imageFiles, ...videoFile];
                await uploadFile(productsUrl, filesPayload)
                  .then((fileNames) => {
                    if (thumbnailImageFile.length) {
                      uploadedThumbnailImage = fileNames.shift();
                    }
                    if (videoFile.length) {
                      uploadedVideo = fileNames.pop();
                    }
                    if (imageFiles.length) {
                      uploadedImages = fileNames.map((url) => {
                        return { image: url };
                      });
                    }
                  })
                  .catch((e) => {
                    reject(new Error('An error occurred during product image or video uploading.'));
                  });
              }
            }

            const imagesArray = [...tempPhotoArray, ...uploadedImages];
            if (!imagesArray.length) {
              reject(new Error('At least one image is required'));
              if (uploadedVideo) {
                deleteFile(productsUrl, uploadedVideo);
              }
              return;
            }

            variations = Array.isArray(variations) ? variations : [];
            const variationsArray =
              variations.length && !isInValidVariationsArray(variations)
                ? getVariationsArray(variations)
                : productData.variations;

            variComboWithQuantity = Array.isArray(variComboWithQuantity)
              ? variComboWithQuantity
              : [];
            const variComboWithQuantityArray =
              variComboWithQuantity.length &&
              !isInValidVariComboWithQuantityArray(variComboWithQuantity)
                ? getVariComboWithQuantityArray(variComboWithQuantity)
                : productData.variComboWithQuantity;

            const videoUrl = deletedVideo ? '' : productData?.video ?? '';
            const thumbnailImageUrl = uploadedThumbnailImage || productData?.thumbnailImage;
            const payload = {
              productName,
              thumbnailImage: thumbnailImageUrl,
              images: imagesArray,
              video: videoFile.length ? uploadedVideo : videoUrl,
              sku,
              saltSKU,
              discount: discount,
              collectionIds: Array.isArray(collectionIds)
                ? collectionIds?.map((id) => id?.trim())
                : productData.collectionIds,
              settingStyleIds: Array.isArray(settingStyleIds)
                ? settingStyleIds?.map((id) => id?.trim())
                : productData.settingStyleIds,
              categoryId: categoryId ? categoryId.trim() : productData.categoryId,
              // subCategoryId: subCategoryId ? subCategoryId.trim() : productData.subCategoryId,
              subCategoryId,
              productTypeIds: Array.isArray(productTypeIds)
                ? productTypeIds?.map((id) => id?.trim())
                : productData.productTypeIds,
              netWeight, // Stored as a number, rounded to 2 decimal places
              shortDescription: shortDescription
                ? shortDescription.trim()
                : productData?.shortDescription || '',
              description: description ? description.trim() : productData.description,
              variations: variationsArray,
              variComboWithQuantity: variComboWithQuantityArray,
              specifications: Array.isArray(specifications)
                ? specifications
                : productData.specifications,
              active: [true, false].includes(active) ? active : productData.active,
              diamondFilters: isDiamondFilter ? diamondFilters : null,
              isDiamondFilter: isDiamondFilter,
              updatedDate: Date.now(),
            };

            const updatePattern = {
              url: `${productsUrl}/${productId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                // Whenever a new file is uploaded for a product, the old file will be deleted.
                if (deletedImages.length) {
                  deletedImages.map((url) => deleteFile(productsUrl, url));
                }
                if (deletedVideo) {
                  deleteFile(productsUrl, deletedVideo);
                }
                if (uploadedThumbnailImage) {
                  deleteFile(productsUrl, productData?.thumbnailImage);
                }
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update product.'));
                // whenever an error occurs for updating a product the file is deleted
                if (uploadedImages && uploadedImages.length) {
                  uploadedImages.map((element) => deleteFile(productsUrl, element.image));
                }
                if (uploadedVideo) {
                  deleteFile(productsUrl, uploadedVideo);
                }
                if (uploadedThumbnailImage) {
                  deleteFile(productsUrl, uploadedThumbnailImage);
                }
              });
          } else {
            reject(new Error('productName or sku already exists'));
          }
        } else {
          reject(new Error('product data not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const searchProducts = (searchTerm) => {
  return new Promise(async (resolve, reject) => {
    try {
      const activeProductsData = await productService.getAllActiveProducts();
      const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search regex

      const filteredProducts = activeProductsData.filter((product) => {
        // Include additional fields for searching in the future
        return (
          searchRegex.test(product.productName) || searchRegex.test(product.sku)
          // Add more fields here for future expansion
        );
      });

      resolve(filteredProducts);
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductQtyForReturn = async (products) => {
  return new Promise(async (resolve, reject) => {
    try {
      const activeProductsList = await getAllActiveProducts();
      for (let i = 0; i < products.length; i++) {
        const productItem = products[i];
        const findedProduct = activeProductsList.find(
          (product) => product.id === productItem.productId
        );
        if (findedProduct) {
          const tempCombiArray = [...findedProduct.variComboWithQuantity];
          const index = tempCombiArray.findIndex((combination) =>
            helperFunctions.areArraysEqual(combination.combination, productItem.variations)
          );

          if (index !== -1) {
            tempCombiArray[index].quantity += productItem.returnQuantity;
          }
          //execute update query
          const payload = {
            variComboWithQuantity: tempCombiArray,
          };
          const updatePattern = {
            url: `${productsUrl}/${findedProduct.id}`,
            payload: payload,
          };
          fetchWrapperService
            ._update(updatePattern)
            .then((response) => {
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during update product.'));
            });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const generateSaltSKU = ({ styleNo, saltSKU }) => {
  const randomNumber = helperFunctions.getRandomNumberLimitedDigits();
  const lastDigits = saltSKU ? saltSKU?.split('-')?.pop() : randomNumber;
  return `UJ-${styleNo}-${lastDigits}`;
};

const generateSpecification = (item) => {
  const { length, width, depth, totalDiaWt, grossWt, category } = item || {};
  const formattedLength = helperFunctions?.formatMeasurement(length);
  const formattedWidth = helperFunctions?.formatMeasurement(width);
  const formattedDepth = helperFunctions?.formatMeasurement(depth);
  const formattedTotalDiaWt = helperFunctions?.formatDecimalNumber(totalDiaWt);
  const formattedGrossWt = helperFunctions?.formatDecimalNumber(grossWt);

  const dimensionText =
    category.toUpperCase() === 'RING'
      ? `${formattedLength} × ${formattedDepth}`
      : `${formattedLength} × ${formattedWidth} × ${formattedDepth}`;
  return [
    { title: 'Gemstones', description: item?.gemStones?.join(', ') || null },
    { title: 'Metal', description: item?.metal?.join(', ') || null },
    { title: 'Dimensions', description: dimensionText },
    { title: 'Total Diamond Weight', description: `${formattedTotalDiaWt} CTW` },
    { title: 'Gross Weight', description: `${formattedGrossWt} g` },
  ].filter((entry) => entry.description !== undefined && entry.description !== null); // Remove empty values
};

const getAllCustomizations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const customizationData = await fetchWrapperService.getAll(customizationUrl);
      const customizationType = customizationData.customizationType
        ? Object.values(customizationData.customizationType)
        : [];
      const customizationSubType = customizationData.customizationSubType
        ? Object.values(customizationData.customizationSubType)
        : [];
      resolve({ customizationType, customizationSubType });
    } catch (e) {
      reject(e);
    }
  });
};

const downloadFileAsBlob = async (fileUrl) => {
  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' });
    return response.data; // Blob object
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};

const findCustomizationByName = (list, name) =>
  list?.find(
    (customization) => customization.title === name || customization.customizationTypeName === name
  );

const createVariation = ({ matchedType, matchedSubTypes }) => ({
  variationId: matchedType.id,
  variationName: matchedType.title,
  variationTypes: matchedSubTypes.map((subType) => ({
    variationTypeId: subType.id,
    variationTypeName: subType.title,
  })),
});

const setProductVariation = async ({ productItem, customizationTypeList }) => {
  const { metal, metalColor, category, length, width } = productItem || {};
  const variations = [];

  const goldType = findCustomizationByName(customizationTypeList, GOLD_TYPE.title);
  const goldColor = findCustomizationByName(customizationTypeList, GOLD_COLOR.title);
  const sizeType = findCustomizationByName(customizationTypeList, SIZE_TYPE.title);

  if (!goldType || !goldColor || !sizeType) return variations;

  const customizationSubTypes = await customizationSubTypeService.getAllCustomizationSubTypes();

  const createNewSubTypes = (items, type) =>
    items
      ?.filter(
        (item) =>
          !customizationSubTypes.some(
            (subType) => subType.title.toUpperCase() === item.toUpperCase()
          )
      )
      ?.map((item) => ({ title: item, type }));

  const newGoldTypeSubTypes = createNewSubTypes(metal, 'default');
  const newGoldColorSubTypes = createNewSubTypes(metalColor, 'color');
  let newSizeSubtypes = [];

  if (['BRACELET', 'CHAIN', 'EARRING', 'PENDENT'].includes(category)) {
    const sizeTitle = category === 'PENDENT' ? `${length} * ${width}` : length;
    if (
      !customizationSubTypes.some(
        (subType) => subType.title.toUpperCase() === sizeTitle.toUpperCase()
      )
    ) {
      newSizeSubtypes = [{ title: sizeTitle, type: 'default' }];
    }
  }

  const insertSubTypes = async (subTypes, typeId) => {
    if (subTypes?.length) {
      await customizationTypeService.checkAndInsertCustomizationSubTypes(subTypes, typeId);
    }
  };

  await Promise.all([
    insertSubTypes(newGoldTypeSubTypes, goldType.id),
    insertSubTypes(newGoldColorSubTypes, goldColor.id),
    insertSubTypes(newSizeSubtypes, sizeType.id),
  ]);

  const latestSubTypes = await customizationSubTypeService.getAllCustomizationSubTypes();

  const matchSubTypes = (items) =>
    items?.map(
      (item) =>
        latestSubTypes.find((subType) => subType.title.toUpperCase() === item.toUpperCase()) || null
    );

  variations.push(
    createVariation({ matchedType: goldType, matchedSubTypes: matchSubTypes(metal) })
  );
  variations.push(
    createVariation({ matchedType: goldColor, matchedSubTypes: matchSubTypes(metalColor) })
  );

  if (category === 'RING') {
    variations.push(
      createVariation({
        matchedType: sizeType,
        matchedSubTypes: matchSubTypes(SIZE_TYPE_SUB_TYPES_LIST.map((x) => x?.title)),
      })
    );
  }

  if (['BRACELET', 'CHAIN', 'EARRING', 'PENDENT'].includes(category)) {
    const sizeTitle = category === 'PENDENT' ? `${length} * ${width}` : length;
    const matchedSizeSubType =
      latestSubTypes.find((subType) => subType.title.toUpperCase() === sizeTitle.toUpperCase()) ||
      null;
    if (matchedSizeSubType) {
      variations.push(
        createVariation({ matchedType: sizeType, matchedSubTypes: matchSubTypes([sizeTitle]) })
      );
    }
  }

  return variations;
};

const generateVariComboWithQty = (variationsArray, prices) => {
  const variComboWithQty = [];

  const generateCombinations = (index, currentCombo) => {
    if (index === variationsArray.length) {
      const priceKey = currentCombo.find((item) =>
        prices.some((price) => price[item.variationTypeName])
      )?.variationTypeName;
      let price = prices.find((price) => price[priceKey])?.[priceKey] || '';

      // Remove any non-numeric characters from price
      price = price.replace(/[^0-9.]/g, '');

      variComboWithQty.push({
        combination: [...currentCombo],
        price,
        quantity: '', // Placeholder for quantity
      });
      return;
    }

    const { variationId, variationTypes } = variationsArray[index];
    variationTypes.forEach(({ variationTypeId, variationTypeName }) => {
      generateCombinations(index + 1, [
        ...currentCombo,
        { variationId, variationTypeId, variationTypeName },
      ]);
    });
  };

  generateCombinations(0, []);

  return variComboWithQty;
};

const getOrCreateMenuCategory = async (categoryTitle) => {
  const menuCategoriesList = await menuCategoryService.getAllMenuCategory();
  let matchedCategory = menuCategoriesList.find(
    (cItem) => cItem.title?.toLowerCase() === categoryTitle?.toLowerCase()
  );

  if (!matchedCategory) {
    const categoriesResp = await menuCategoryService.insertMenuCategory({
      title: helperFunctions.capitalizeTitle(categoryTitle),
    });
    matchedCategory = categoriesResp;
  }

  return matchedCategory?.id;
};

const processBulkProductsWithApi = async () => {
  try {
    const response = await axios.get(sapphireTreeProductListApiUrl, {
      headers: {
        secretKey: sapphireTreeSecretKey, // Replace with the actual secret key
        authorization: '',
      },
    });

    const { customizationType } = await getAllCustomizations();

    const products = await Promise.all(
      response?.data?.data?.map(async (item) => {
        const uuid = uid();
        const productName = !validateProductName(item.title) ? item.title : '';
        const saltSKU = generateSaltSKU({ styleNo: item.styleNo, saltSKU: '' }); // when productUpdate then saltSKU pass in params
        const shortDescription = !validateShortDescription(item.description)
          ? item.description
          : item.description.substring(0, 250);
        const specifications = generateSpecification(item);
        const imageFolder = `${productsUrl}/compressed/images`;
        const videoFolder = `${productsUrl}/compressed/videos`;
        const uploadedImageUrls = [];
        const uploadedVideoUrl = '';
        // // 🔹 Upload Images to Firebase
        // const uploadedImageUrls = await Promise.all(
        //   item.compressedImages.map(async (img) => {
        //     const imageBlob = await downloadFileAsBlob(img.image);
        //     if (imageBlob) {
        //       const file = new File([imageBlob], `image_${Date.now()}.png`, { type: 'image/png' });
        //       const urls = await uploadFile(imageFolder, [file]);
        //       return { image: urls[0] }; // Store new Firebase URL
        //     }
        //     return { image: img.image }; // Fallback to original if upload fails
        //   })
        // );

        // // 🔹 Upload Video to Firebase
        // let uploadedVideoUrl = '';
        // if (item.compressedVideo) {
        //   const videoBlob = await downloadFileAsBlob(item.compressedVideo);
        //   if (videoBlob) {
        //     const file = new File([videoBlob], `video_${Date.now()}.mp4`, { type: 'video/mp4' });
        //     const videoUrls = await uploadFile(videoFolder, [file]);
        //     uploadedVideoUrl = videoUrls[0]; // Store new Firebase video URL
        //   } else {
        //     uploadedVideoUrl = item.compressedVideo; // Fallback to original if upload fails
        //   }
        // }

        const generatedVariations = await setProductVariation({
          productItem: item,
          customizationTypeList: customizationType,
        });

        const generatedVariComboWithQty = generateVariComboWithQty(
          generatedVariations,
          item?.prices
        );

        const categoryId = await getOrCreateMenuCategory(item?.category);

        return {
          id: uuid,
          productName,
          images: uploadedImageUrls, // Extract image URLs
          video: uploadedVideoUrl, // Use empty string if no video
          // images: item?.compressedImages.map((img) => ({ image: img.image })) || [], // Extract image URLs
          // video: item?.compressedVideo || '', // Use empty string if no video
          sku: item.styleNo,
          saltSKU,
          shortDescription,
          categoryId,
          // subCategoryId: "",
          // productTypeIds: [],
          description: `<p>${item.description}</p>`,
          variations: generatedVariations, // Assuming variations need to be generated separately
          variComboWithQuantity: generatedVariComboWithQty,
          isDiamondFilter: false,
          // diamondFilters,
          specifications,
          collectionIds: [],
          settingStyleIds: [],
          discount: 0,
          active: false,
          salesTaxPercentage: 0,
          shippingCharge: 0,
          totalReviews: 0,
          starRating: 0,
          totalStar: 0,
          createdDate: Date.now(),
          updatedDate: Date.now(),
        };
      })
    );
    return products;
  } catch (error) {
    throw error;
  }
};

export const productService = {
  insertProduct,
  getAllProductsWithPagging,
  getAllActiveProducts,
  deleteProduct,
  getSingleProduct,
  updateProductPhotos,
  updateProductThumbnailPhoto,
  activeDeactiveProduct,
  updateProduct,
  searchProducts,
  updateProductQtyForReturn,
  updateProductVideo,
  processBulkProductsWithApi,
};
