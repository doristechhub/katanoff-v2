import { uid } from 'uid';
import {
  customizationSubTypeUrl,
  customizationUrl,
  fetchWrapperService,
  prefixSaltSku,
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
import { helperFunctions, roundOffPrice } from '../_helpers/helperFunctions';
import {
  ALLOW_MAX_CARAT_WEIGHT,
  ALLOW_MIN_CARAT_WEIGHT,
  GOLD_COLOR,
  GOLD_TYPE,
  PRICE_CALCULATION_MODES,
} from 'src/_helpers/constants';
import { isBoolean } from 'lodash';
import axios from 'axios';
import { customizationTypeService } from './customizationType.service';
import { customizationSubTypeService } from './customizationSubType.service';
import { menuCategoryService } from './menuCategory.service';
import { settingsService } from './settings.service';

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

const getVariationsArray = (variationsOfArray) => {
  return variationsOfArray.map((variation, index) => {
    return {
      variationId: variation.variationId,
      position: variation?.position ? variation.position : index + 1,
      variationTypes: variation.variationTypes.map((variationType, typeIndex) => {
        return {
          variationTypeId: variationType.variationTypeId,
          position: variationType?.position ? variationType.position : typeIndex + 1,
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
        roseGoldThumbnailImageFile,
        roseGoldImageFiles,
        roseGoldVideoFile,
        yellowGoldThumbnailImageFile,
        yellowGoldImageFiles,
        yellowGoldVideoFile,
        whiteGoldThumbnailImageFile,
        whiteGoldImageFiles,
        whiteGoldVideoFile,
        sku,
        saltSKU,
        discount,
        collectionIds,
        settingStyleIds,
        categoryId,
        subCategoryId,
        productTypeIds,
        gender,
        netWeight,
        grossWeight,
        centerDiamondWeight,
        totalCaratWeight,
        sideDiamondWeight,
        shortDescription,
        description,
        variations,
        specifications,
        variComboWithQuantity,
        active,
        isDiamondFilter,
        diamondFilters,
        priceCalculationMode,
      } = sanitizeObject(params);

      // Sanitize and process inputs
      productName = productName ? productName.trim() : null;
      roseGoldThumbnailImageFile =
        typeof roseGoldThumbnailImageFile === 'object' ? [roseGoldThumbnailImageFile] : [];
      roseGoldImageFiles = Array.isArray(roseGoldImageFiles) ? roseGoldImageFiles : [];
      roseGoldVideoFile = typeof roseGoldVideoFile === 'object' ? [roseGoldVideoFile] : [];
      yellowGoldThumbnailImageFile =
        typeof yellowGoldThumbnailImageFile === 'object' ? [yellowGoldThumbnailImageFile] : [];
      yellowGoldImageFiles = Array.isArray(yellowGoldImageFiles) ? yellowGoldImageFiles : [];
      yellowGoldVideoFile = typeof yellowGoldVideoFile === 'object' ? [yellowGoldVideoFile] : [];
      whiteGoldThumbnailImageFile =
        typeof whiteGoldThumbnailImageFile === 'object' ? [whiteGoldThumbnailImageFile] : [];
      whiteGoldImageFiles = Array.isArray(whiteGoldImageFiles) ? whiteGoldImageFiles : [];
      whiteGoldVideoFile = typeof whiteGoldVideoFile === 'object' ? [whiteGoldVideoFile] : [];
      sku = sku ? sku.trim() : null;
      saltSKU = saltSKU ? saltSKU.trim() : null;
      discount = !isNaN(discount) ? Number(discount) : 0;
      collectionIds = Array.isArray(collectionIds) ? collectionIds : [];
      settingStyleIds = Array.isArray(settingStyleIds) ? settingStyleIds : [];
      categoryId = categoryId ? categoryId.trim() : null;
      subCategoryId = subCategoryId ? subCategoryId.trim() : null;
      productTypeIds = Array.isArray(productTypeIds) ? productTypeIds : [];
      gender = gender ? gender.trim() : null;

      // Process netWeight: Parse, round to 2 decimal places, and store as number
      netWeight =
        !isNaN(netWeight) && netWeight !== '' && netWeight !== null
          ? Math.round(parseFloat(netWeight) * 100) / 100
          : 0;
      grossWeight =
        !isNaN(grossWeight) && grossWeight !== '' && grossWeight !== null
          ? Math.round(parseFloat(grossWeight) * 100) / 100
          : 0;
      centerDiamondWeight =
        !isNaN(centerDiamondWeight) && centerDiamondWeight !== '' && centerDiamondWeight !== null
          ? Math.round(parseFloat(centerDiamondWeight) * 100) / 100
          : 0;
      totalCaratWeight =
        !isNaN(totalCaratWeight) && totalCaratWeight !== '' && totalCaratWeight !== null
          ? Math.round(parseFloat(totalCaratWeight) * 100) / 100
          : 0;

      // Process sideDiamondWeight: Parse, round to 2 decimal places, and store as number
      sideDiamondWeight =
        !isNaN(sideDiamondWeight) && sideDiamondWeight !== '' && sideDiamondWeight !== null
          ? Math.round(parseFloat(sideDiamondWeight) * 100) / 100
          : 0;

      shortDescription = shortDescription ? shortDescription.trim() : null;
      description = description ? description.trim() : null;
      variations = Array.isArray(variations) ? variations : [];
      specifications = Array.isArray(specifications) ? specifications : [];
      variComboWithQuantity = Array.isArray(variComboWithQuantity) ? variComboWithQuantity : [];
      active = JSON.parse(active);
      isDiamondFilter = isBoolean(isDiamondFilter) ? isDiamondFilter : false;
      diamondFilters = typeof diamondFilters === 'object' ? diamondFilters : {};
      priceCalculationMode = priceCalculationMode
        ? priceCalculationMode.trim()
        : PRICE_CALCULATION_MODES.AUTOMATIC;

      // Validate inputs
      if (
        productName &&
        roseGoldThumbnailImageFile.length &&
        yellowGoldThumbnailImageFile.length &&
        whiteGoldThumbnailImageFile.length &&
        sku &&
        categoryId &&
        // subCategoryId &&
        // productTypeIds?.length &&
        description &&
        variations.length &&
        variComboWithQuantity.length &&
        [true, false].includes(active) &&
        uuid &&
        grossWeight &&
        totalCaratWeight &&
        [PRICE_CALCULATION_MODES.AUTOMATIC, PRICE_CALCULATION_MODES.MANUAL].includes(
          priceCalculationMode
        )
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

        let variComboWithQuantityArray = getVariComboWithQuantityArray(variComboWithQuantity);

        // Apply automatic price calculations if enabled
        if (priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC) {
          const customizationSubTypesList = await customizationSubTypeService.getAllSubTypes();
          const priceMultiplier = await settingsService.fetchPriceMultiplier();
          variComboWithQuantityArray = helperFunctions.calculateAutomaticPrices({
            combinations: variComboWithQuantityArray,
            customizationSubTypesList,
            grossWeight,
            totalCaratWeight,
            priceMultiplier,
          });
        }

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

        if (netWeight && netWeight <= 0) {
          reject(new Error('Invalid Net Weight: Must be a positive number'));
          return;
        }

        if (grossWeight <= 0) {
          reject(new Error('Invalid Gross Weight: Must be a positive number'));
          return;
        }

        if (centerDiamondWeight && centerDiamondWeight <= 0) {
          reject(new Error('Invalid Center Diamond Weight: Must be a positive number'));
          return;
        }
        if (totalCaratWeight <= 0) {
          reject(new Error('Invalid Total Carat Weight: Must be a positive number'));
          return;
        }

        if (sideDiamondWeight && sideDiamondWeight <= 0) {
          reject(new Error('Invalid Side Diamond Weight: Must be a positive number'));
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

          if (!sideDiamondWeight || isNaN(sideDiamondWeight)) {
            reject(new Error('Invalid Side Diamond Weight: Must be a valid number'));
            return;
          }
          // Ensure sideDiamondWeight has exactly 2 decimal places
          const sideDiamondWeightString = sideDiamondWeight.toFixed(2);
          if (!/^\d+\.\d{2}$/.test(sideDiamondWeightString)) {
            reject(new Error('Side Diamond Weight must have exactly two decimal places'));
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
          if (!roseGoldThumbnailImageFile.length) {
            reject(new Error(`It's necessary to have a Rose Gold thumbnail image`));
            return;
          } else if (
            roseGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
          ) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} Rose Gold thumbnail image`
              )
            );
            return;
          } else if (!yellowGoldThumbnailImageFile.length) {
            reject(new Error(`It's necessary to have a Yellow Gold thumbnail image`));
            return;
          } else if (
            yellowGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
          ) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} Yellow Gold thumbnail image`
              )
            );
            return;
          } else if (!whiteGoldThumbnailImageFile.length) {
            reject(new Error(`It's necessary to have a White Gold thumbnail image`));
            return;
          } else if (
            whiteGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
          ) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} White Gold thumbnail image`
              )
            );
            return;
          } else if (roseGoldImageFiles.length > fileSettings.PRODUCT_IMAGE_FILE_LIMIT) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} Rose Gold images`
              )
            );
            return;
          } else if (yellowGoldImageFiles.length > fileSettings.PRODUCT_IMAGE_FILE_LIMIT) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} Yellow Gold images`
              )
            );
            return;
          } else if (whiteGoldImageFiles.length > fileSettings.PRODUCT_IMAGE_FILE_LIMIT) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} White Gold images`
              )
            );
            return;
          } else if (
            roseGoldVideoFile.length &&
            roseGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT
          ) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} Rose Gold video`
              )
            );
            return;
          } else if (
            yellowGoldVideoFile.length &&
            yellowGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT
          ) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} Yellow Gold video`
              )
            );
            return;
          } else if (
            whiteGoldVideoFile.length &&
            whiteGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT
          ) {
            reject(
              new Error(
                `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} White Gold video`
              )
            );
            return;
          } else {
            const roseGoldThumbnailValidFileType = isValidFileType(
              fileSettings.IMAGE_FILE_NAME,
              roseGoldThumbnailImageFile
            );
            const roseGoldImagesValidFileType = isValidFileType(
              fileSettings.IMAGE_FILE_NAME,
              roseGoldImageFiles
            );
            const yellowGoldThumbnailValidFileType = isValidFileType(
              fileSettings.IMAGE_FILE_NAME,
              yellowGoldThumbnailImageFile
            );
            const yellowGoldImagesValidFileType = isValidFileType(
              fileSettings.IMAGE_FILE_NAME,
              yellowGoldImageFiles
            );
            const whiteGoldThumbnailValidFileType = isValidFileType(
              fileSettings.IMAGE_FILE_NAME,
              whiteGoldThumbnailImageFile
            );
            const whiteGoldImagesValidFileType = isValidFileType(
              fileSettings.IMAGE_FILE_NAME,
              whiteGoldImageFiles
            );
            if (
              !roseGoldThumbnailValidFileType ||
              !roseGoldImagesValidFileType ||
              !yellowGoldThumbnailValidFileType ||
              !yellowGoldImagesValidFileType ||
              !whiteGoldThumbnailValidFileType ||
              !whiteGoldImagesValidFileType
            ) {
              reject(new Error('Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)'));
              return;
            }

            const roseGoldThumbnailValidFileSize = isValidFileSize(
              fileSettings.IMAGE_FILE_NAME,
              roseGoldThumbnailImageFile
            );
            const roseGoldImagesValidFileSize = isValidFileSize(
              fileSettings.IMAGE_FILE_NAME,
              roseGoldImageFiles
            );
            const yellowGoldThumbnailValidFileSize = isValidFileSize(
              fileSettings.IMAGE_FILE_NAME,
              yellowGoldThumbnailImageFile
            );
            const yellowGoldImagesValidFileSize = isValidFileSize(
              fileSettings.IMAGE_FILE_NAME,
              yellowGoldImageFiles
            );
            const whiteGoldThumbnailValidFileSize = isValidFileSize(
              fileSettings.IMAGE_FILE_NAME,
              whiteGoldThumbnailImageFile
            );
            const whiteGoldImagesValidFileSize = isValidFileSize(
              fileSettings.IMAGE_FILE_NAME,
              whiteGoldImageFiles
            );
            if (
              !roseGoldThumbnailValidFileSize ||
              !roseGoldImagesValidFileSize ||
              !yellowGoldThumbnailValidFileSize ||
              !yellowGoldImagesValidFileSize ||
              !whiteGoldThumbnailValidFileSize ||
              !whiteGoldImagesValidFileSize
            ) {
              reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
              return;
            }

            if (roseGoldVideoFile.length) {
              const roseGoldVideoValidFileType = isValidFileType(
                fileSettings.VIDEO_FILE_NAME,
                roseGoldVideoFile
              );
              if (!roseGoldVideoValidFileType) {
                reject(
                  new Error(
                    'Invalid file! (Only MP4, WEBM, OGG files are allowed for Rose Gold video!)'
                  )
                );
                return;
              }
              const roseGoldVideoValidFileSize = isValidFileSize(
                fileSettings.VIDEO_FILE_NAME,
                roseGoldVideoFile
              );
              if (!roseGoldVideoValidFileSize) {
                reject(
                  new Error('Invalid File Size! (Only 100 MB are allowed for Rose Gold video!)')
                );
                return;
              }
            }

            if (yellowGoldVideoFile.length) {
              const yellowGoldVideoValidFileType = isValidFileType(
                fileSettings.VIDEO_FILE_NAME,
                yellowGoldVideoFile
              );
              if (!yellowGoldVideoValidFileType) {
                reject(
                  new Error(
                    'Invalid file! (Only MP4, WEBM, OGG files are allowed for Yellow Gold video!)'
                  )
                );
                return;
              }
              const yellowGoldVideoValidFileSize = isValidFileSize(
                fileSettings.VIDEO_FILE_NAME,
                yellowGoldVideoFile
              );
              if (!yellowGoldVideoValidFileSize) {
                reject(
                  new Error('Invalid File Size! (Only 100 MB are allowed for Yellow Gold video!)')
                );
                return;
              }
            }

            if (whiteGoldVideoFile.length) {
              const whiteGoldVideoValidFileType = isValidFileType(
                fileSettings.VIDEO_FILE_NAME,
                whiteGoldVideoFile
              );
              if (!whiteGoldVideoValidFileType) {
                reject(
                  new Error(
                    'Invalid file! (Only MP4, WEBM, OGG files are allowed for White Gold video!)'
                  )
                );
                return;
              }
              const whiteGoldVideoValidFileSize = isValidFileSize(
                fileSettings.VIDEO_FILE_NAME,
                whiteGoldVideoFile
              );
              if (!whiteGoldVideoValidFileSize) {
                reject(
                  new Error('Invalid File Size! (Only 100 MB are allowed for White Gold video!)')
                );
                return;
              }
            }

            // Create filesPayload as a flat array
            const filesPayload = [
              ...roseGoldThumbnailImageFile,
              ...roseGoldImageFiles,
              ...roseGoldVideoFile,
              ...yellowGoldThumbnailImageFile,
              ...yellowGoldImageFiles,
              ...yellowGoldVideoFile,
              ...whiteGoldThumbnailImageFile,
              ...whiteGoldImageFiles,
              ...whiteGoldVideoFile,
            ];

            // Create a mapping of categories to their start and end indices in filesPayload
            const categoryIndices = {};
            let currentIndex = 0;

            const addCategoryIndices = (category, fileArray) => {
              if (fileArray.length) {
                categoryIndices[category] = {
                  start: currentIndex,
                  end: currentIndex + fileArray.length,
                  length: fileArray.length,
                };
                currentIndex += fileArray.length;
              } else {
                categoryIndices[category] = { start: currentIndex, end: currentIndex, length: 0 };
              }
            };

            addCategoryIndices('roseGoldThumbnailImage', roseGoldThumbnailImageFile);
            addCategoryIndices('roseGoldImages', roseGoldImageFiles);
            addCategoryIndices('roseGoldVideo', roseGoldVideoFile);
            addCategoryIndices('yellowGoldThumbnailImage', yellowGoldThumbnailImageFile);
            addCategoryIndices('yellowGoldImages', yellowGoldImageFiles);
            addCategoryIndices('yellowGoldVideo', yellowGoldVideoFile);
            addCategoryIndices('whiteGoldThumbnailImage', whiteGoldThumbnailImageFile);
            addCategoryIndices('whiteGoldImages', whiteGoldImageFiles);
            addCategoryIndices('whiteGoldVideo', whiteGoldVideoFile);

            // Calculate expected total number of files
            const expectedFileCount = currentIndex;

            await uploadFile(productsUrl, filesPayload)
              .then((fileNames) => {
                // Validate the number of returned URLs
                if (fileNames.length !== expectedFileCount) {
                  reject(
                    new Error(
                      `Upload mismatch: Expected ${expectedFileCount} files, but received ${fileNames.length}`
                    )
                  );
                  return;
                }

                // Initialize variables for URLs
                let roseGoldThumbnailImage = '';
                let roseGoldImages = [];
                let roseGoldVideo = '';
                let yellowGoldThumbnailImage = '';
                let yellowGoldImages = [];
                let yellowGoldVideo = '';
                let whiteGoldThumbnailImage = '';
                let whiteGoldImages = [];
                let whiteGoldVideo = '';

                // Assign URLs using category indices
                const assignUrls = (category, isSingle = false) => {
                  const { start, length } = categoryIndices[category];
                  if (length > 0) {
                    const urls = fileNames.slice(start, start + length);
                    return isSingle ? urls[0] : urls.map((url) => ({ image: url }));
                  }
                  return isSingle ? '' : [];
                };

                roseGoldThumbnailImage = assignUrls('roseGoldThumbnailImage', true);
                roseGoldImages = assignUrls('roseGoldImages');
                roseGoldVideo = assignUrls('roseGoldVideo', true);
                yellowGoldThumbnailImage = assignUrls('yellowGoldThumbnailImage', true);
                yellowGoldImages = assignUrls('yellowGoldImages');
                yellowGoldVideo = assignUrls('yellowGoldVideo', true);
                whiteGoldThumbnailImage = assignUrls('whiteGoldThumbnailImage', true);
                whiteGoldImages = assignUrls('whiteGoldImages');
                whiteGoldVideo = assignUrls('whiteGoldVideo', true);

                // Validate required files
                if (!roseGoldThumbnailImage) {
                  reject(new Error('Rose Gold thumbnail image upload failed'));
                  return;
                }
                if (!yellowGoldThumbnailImage) {
                  reject(new Error('Yellow Gold thumbnail image upload failed'));
                  return;
                }
                if (!whiteGoldThumbnailImage) {
                  reject(new Error('White Gold thumbnail image upload failed'));
                  return;
                }

                // Proceed with creating the insertPattern
                const insertPattern = {
                  id: uuid,
                  productName,
                  roseGoldThumbnailImage,
                  roseGoldImages,
                  roseGoldVideo,
                  yellowGoldThumbnailImage,
                  yellowGoldImages,
                  yellowGoldVideo,
                  whiteGoldThumbnailImage,
                  whiteGoldImages,
                  whiteGoldVideo,
                  sku,
                  saltSKU,
                  discount,
                  collectionIds: collectionIds.map((id) => id?.trim()),
                  settingStyleIds: settingStyleIds.map((id) => id?.trim()),
                  categoryId,
                  subCategoryId,
                  productTypeIds: productTypeIds.map((id) => id?.trim()),
                  gender,
                  netWeight,
                  grossWeight,
                  totalCaratWeight,
                  centerDiamondWeight,
                  sideDiamondWeight,
                  shortDescription,
                  description,
                  variations: variationsArray,
                  variComboWithQuantity: variComboWithQuantityArray,
                  isDiamondFilter,
                  diamondFilters: isDiamondFilter ? diamondFilters : null,
                  specifications,
                  priceCalculationMode,
                  active,
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
                  insertPattern,
                };

                fetchWrapperService
                  .create(createPattern)
                  .then((response) => {
                    resolve(true);
                  })
                  .catch((e) => {
                    reject(new Error('An error occurred during product creation.'));
                    if (fileNames && fileNames.length) {
                      fileNames.forEach((url) => deleteFile(productsUrl, url));
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
          basePrice: roundOffPrice(price),
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
      // Sanitize and validate productId
      productId = sanitizeValue(productId) ? productId.trim() : null;
      if (!productId) {
        reject(new Error('Invalid Id'));
        return;
      }

      // Fetch product data
      const productData = await fetchWrapperService.findOne(productsUrl, {
        id: productId,
      });
      if (!productData) {
        reject(new Error('Product does not exist'));
        return;
      }

      // Check for showcase banner
      const showCaseBannerData = await fetchWrapperService.findOne(showCaseBannerUrl, {
        productId: productId,
      });
      if (showCaseBannerData) {
        reject(new Error('Product cannot be deleted because it has a showcase banner'));
        return;
      }

      // Check for product slider
      const productSliderData = await fetchWrapperService.findOne(productSliderUrl, {
        productId: productId,
      });
      if (productSliderData) {
        reject(new Error('Product cannot be deleted because it has a product slider'));
        return;
      }

      // Collect all file URLs to delete
      const filesToDelete = [];
      if (productData?.roseGoldThumbnailImage) {
        filesToDelete.push(productData.roseGoldThumbnailImage);
      }
      if (productData?.roseGoldImages?.length) {
        filesToDelete.push(...productData.roseGoldImages.map((item) => item.image));
      }
      if (productData?.roseGoldVideo) {
        filesToDelete.push(productData.roseGoldVideo);
      }
      if (productData?.yellowGoldThumbnailImage) {
        filesToDelete.push(productData.yellowGoldThumbnailImage);
      }
      if (productData?.yellowGoldImages?.length) {
        filesToDelete.push(...productData.yellowGoldImages.map((item) => item.image));
      }
      if (productData?.yellowGoldVideo) {
        filesToDelete.push(productData.yellowGoldVideo);
      }
      if (productData?.whiteGoldThumbnailImage) {
        filesToDelete.push(productData.whiteGoldThumbnailImage);
      }
      if (productData?.whiteGoldImages?.length) {
        filesToDelete.push(...productData.whiteGoldImages.map((item) => item.image));
      }
      if (productData?.whiteGoldVideo) {
        filesToDelete.push(productData.whiteGoldVideo);
      }

      // Delete the product
      await fetchWrapperService._delete(`${productsUrl}/${productId}`);

      // Delete all files concurrently
      if (filesToDelete.length) {
        await Promise.all(
          filesToDelete.map((url) =>
            deleteFile(productsUrl, url).catch((e) => {
              console.warn(`Failed to delete file ${url}: ${e.message}`);
              // Continue with other deletions even if one fails
            })
          )
        );
      }

      resolve(true);
    } catch (e) {
      reject(new Error(`Failed to delete product: ${e?.message}`));
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

const updateRoseGoldMedia = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        productId,
        roseGoldThumbnailImageFile,
        roseGoldImageFiles,
        roseGoldVideoFile,
        deletedRoseGoldImages,
        deletedRoseGoldVideo,
      } = sanitizeObject(params);

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          // Sanitize file inputs
          roseGoldThumbnailImageFile =
            typeof roseGoldThumbnailImageFile === 'object' ? [roseGoldThumbnailImageFile] : [];
          roseGoldImageFiles = Array.isArray(roseGoldImageFiles) ? roseGoldImageFiles : [];
          roseGoldVideoFile = typeof roseGoldVideoFile === 'object' ? [roseGoldVideoFile] : [];
          deletedRoseGoldImages = Array.isArray(deletedRoseGoldImages) ? deletedRoseGoldImages : [];
          deletedRoseGoldVideo = deletedRoseGoldVideo ? deletedRoseGoldVideo.trim() : null;

          // Handle image deletions
          let tempRoseGoldImages = productData.roseGoldImages || [];
          if (deletedRoseGoldImages.length) {
            deletedRoseGoldImages.forEach((url) => {
              const index = tempRoseGoldImages.findIndex((item) => url === item.image);
              if (index !== -1) {
                tempRoseGoldImages.splice(index, 1);
              }
            });
          }

          // Validate and upload files
          let uploadedRoseGoldThumbnailImage = null;
          let uploadedRoseGoldImages = [];
          let uploadedRoseGoldVideo = null;

          const filesPayload = [
            ...roseGoldThumbnailImageFile,
            ...roseGoldImageFiles,
            ...roseGoldVideoFile,
          ];

          // Create index mapping for file categories
          const categoryIndices = {};
          let currentIndex = 0;

          const addCategoryIndices = (category, fileArray) => {
            if (fileArray.length) {
              categoryIndices[category] = {
                start: currentIndex,
                end: currentIndex + fileArray.length,
                length: fileArray.length,
              };
              currentIndex += fileArray.length;
            } else {
              categoryIndices[category] = { start: currentIndex, end: currentIndex, length: 0 };
            }
          };

          addCategoryIndices('roseGoldThumbnailImage', roseGoldThumbnailImageFile);
          addCategoryIndices('roseGoldImages', roseGoldImageFiles);
          addCategoryIndices('roseGoldVideo', roseGoldVideoFile);

          const expectedFileCount = currentIndex;

          // Validate file counts and types
          if (filesPayload.length) {
            if (
              roseGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} Rose Gold thumbnail image`
                )
              );
              return;
            }
            if (
              tempRoseGoldImages.length + roseGoldImageFiles.length >
              fileSettings.PRODUCT_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} Rose Gold images`
                )
              );
              return;
            }
            if (roseGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} Rose Gold video`
                )
              );
              return;
            }

            // Validate file types and sizes
            const fileCategories = [
              {
                files: roseGoldThumbnailImageFile,
                type: 'IMAGE_FILE_NAME',
                name: 'Rose Gold thumbnail image',
              },
              { files: roseGoldImageFiles, type: 'IMAGE_FILE_NAME', name: 'Rose Gold images' },
              { files: roseGoldVideoFile, type: 'VIDEO_FILE_NAME', name: 'Rose Gold video' },
            ];

            for (const { files, type, name } of fileCategories) {
              if (files.length) {
                const validFileType = isValidFileType(fileSettings[type], files);
                if (!validFileType) {
                  reject(
                    new Error(
                      `Invalid file for ${name}! (Only ${type === 'IMAGE_FILE_NAME' ? 'JPG, JPEG, PNG, WEBP' : 'MP4, WEBM, OGG'} files are allowed!)`
                    )
                  );
                  return;
                }
                const validFileSize = isValidFileSize(fileSettings[type], files);
                if (!validFileSize) {
                  reject(
                    new Error(
                      `Invalid file size for ${name}! (Only ${type === 'IMAGE_FILE_NAME' ? '5 MB' : '100 MB'} are allowed!)`
                    )
                  );
                  return;
                }
              }
            }

            // Upload files
            await uploadFile(productsUrl, filesPayload)
              .then((fileNames) => {
                if (fileNames.length !== expectedFileCount) {
                  throw new Error(
                    `Upload mismatch: Expected ${expectedFileCount} files, received ${fileNames.length}`
                  );
                }

                const assignUrls = (category, isSingle = false) => {
                  const { start, length } = categoryIndices[category];
                  if (length > 0) {
                    const urls = fileNames.slice(start, start + length);
                    return isSingle ? urls[0] : urls.map((url) => ({ image: url }));
                  }
                  return isSingle ? null : [];
                };

                uploadedRoseGoldThumbnailImage = assignUrls('roseGoldThumbnailImage', true);
                uploadedRoseGoldImages = assignUrls('roseGoldImages');
                uploadedRoseGoldVideo = assignUrls('roseGoldVideo', true);
              })
              .catch((e) => {
                reject(new Error(`File upload failed: ${e.message}`));
                return;
              });
          }

          // Combine existing and new images
          const roseGoldImagesArray = [...tempRoseGoldImages, ...uploadedRoseGoldImages];

          // Validate required images
          if (!uploadedRoseGoldThumbnailImage && !productData.roseGoldThumbnailImage) {
            reject(new Error('Rose Gold thumbnail image is required'));
            return;
          }
          // Prepare payload
          const payload = {
            roseGoldThumbnailImage:
              uploadedRoseGoldThumbnailImage || productData.roseGoldThumbnailImage,
            roseGoldImages: roseGoldImagesArray,
            roseGoldVideo: roseGoldVideoFile.length
              ? uploadedRoseGoldVideo
              : deletedRoseGoldVideo
                ? ''
                : productData.roseGoldVideo || '',
            updatedDate: Date.now(),
          };

          // Update product
          const updatePattern = {
            url: `${productsUrl}/${productId}`,
            payload: payload,
          };

          await fetchWrapperService
            ._update(updatePattern)
            .then(async () => {
              // Delete old files
              const filesToDelete = [
                ...deletedRoseGoldImages,
                deletedRoseGoldVideo || '',
                uploadedRoseGoldThumbnailImage ? productData.roseGoldThumbnailImage : '',
              ].filter(Boolean);

              if (filesToDelete.length) {
                await Promise.all(
                  filesToDelete.map((url) =>
                    deleteFile(productsUrl, url).catch((e) => {
                      console.warn(`Failed to delete file ${url}: ${e.message}`);
                    })
                  )
                );
              }

              resolve(true);
            })
            .catch(async (e) => {
              // Clean up uploaded files on failure
              const uploadedFiles = [
                uploadedRoseGoldThumbnailImage,
                ...uploadedRoseGoldImages.map((img) => img.image),
                uploadedRoseGoldVideo,
              ].filter(Boolean);

              if (uploadedFiles.length) {
                await Promise.all(
                  uploadedFiles.map((url) =>
                    deleteFile(productsUrl, url).catch((e) => {
                      console.warn(`Failed to delete file ${url}: ${e.message}`);
                    })
                  )
                );
              }

              reject(new Error(`Failed to update product: ${e.message}`));
            });
        } else {
          reject(new Error('Product data not found'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(new Error(`Update failed: ${e?.message}`));
    }
  });
};

const updateYellowGoldMedia = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        productId,
        yellowGoldThumbnailImageFile,
        yellowGoldImageFiles,
        yellowGoldVideoFile,
        deletedYellowGoldImages,
        deletedYellowGoldVideo,
      } = sanitizeObject(params);

      if (!productId) {
        reject(new Error('Invalid Id'));
        return;
      }

      const productData = await fetchWrapperService.findOne(productsUrl, {
        id: productId,
      });
      if (!productData) {
        reject(new Error('Product data not found'));
        return;
      }

      // Sanitize file inputs
      yellowGoldThumbnailImageFile =
        typeof yellowGoldThumbnailImageFile === 'object' && yellowGoldThumbnailImageFile
          ? [yellowGoldThumbnailImageFile]
          : [];
      yellowGoldImageFiles = Array.isArray(yellowGoldImageFiles) ? yellowGoldImageFiles : [];
      yellowGoldVideoFile =
        typeof yellowGoldVideoFile === 'object' && yellowGoldVideoFile ? [yellowGoldVideoFile] : [];
      deletedYellowGoldImages = Array.isArray(deletedYellowGoldImages)
        ? deletedYellowGoldImages
        : [];
      deletedYellowGoldVideo = deletedYellowGoldVideo ? deletedYellowGoldVideo.trim() : null;

      // Handle image deletions
      let tempYellowGoldImages = productData.yellowGoldImages || [];
      if (deletedYellowGoldImages.length) {
        deletedYellowGoldImages.forEach((url) => {
          const index = tempYellowGoldImages.findIndex((item) => item?.image === url);
          if (index !== -1) {
            tempYellowGoldImages.splice(index, 1);
          }
        });
      }

      // Validate and upload files
      let uploadedYellowGoldThumbnailImage = null;
      let uploadedYellowGoldImages = [];
      let uploadedYellowGoldVideo = null;

      const filesPayload = [
        ...yellowGoldThumbnailImageFile,
        ...yellowGoldImageFiles,
        ...yellowGoldVideoFile,
      ];

      // Create index mapping for file categories
      const categoryIndices = {};
      let currentIndex = 0;

      const addCategoryIndices = (category, fileArray) => {
        categoryIndices[category] = {
          start: currentIndex,
          end: currentIndex + fileArray.length,
          length: fileArray.length,
        };
        currentIndex += fileArray.length;
      };

      addCategoryIndices('yellowGoldThumbnailImage', yellowGoldThumbnailImageFile);
      addCategoryIndices('yellowGoldImages', yellowGoldImageFiles);
      addCategoryIndices('yellowGoldVideo', yellowGoldVideoFile);

      const expectedFileCount = currentIndex;

      // Validate file counts and types
      if (filesPayload.length) {
        if (yellowGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT) {
          reject(
            new Error(
              `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} Yellow Gold thumbnail image`
            )
          );
          return;
        }
        if (
          tempYellowGoldImages.length + yellowGoldImageFiles.length >
          fileSettings.PRODUCT_IMAGE_FILE_LIMIT
        ) {
          reject(
            new Error(
              `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} Yellow Gold images`
            )
          );
          return;
        }
        if (yellowGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
          reject(
            new Error(
              `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} Yellow Gold video`
            )
          );
          return;
        }

        // Validate file types and sizes
        const fileCategories = [
          {
            files: yellowGoldThumbnailImageFile,
            type: 'IMAGE_FILE_NAME',
            name: 'Yellow Gold thumbnail image',
          },
          { files: yellowGoldImageFiles, type: 'IMAGE_FILE_NAME', name: 'Yellow Gold images' },
          { files: yellowGoldVideoFile, type: 'VIDEO_FILE_NAME', name: 'Yellow Gold video' },
        ];

        for (const { files, type, name } of fileCategories) {
          if (files.length) {
            const validFileType = isValidFileType(fileSettings[type], files);
            if (!validFileType) {
              reject(
                new Error(
                  `Invalid file for ${name}! (Only ${
                    type === 'IMAGE_FILE_NAME' ? 'JPG, JPEG, PNG, WEBP' : 'MP4, WEBM, OGG'
                  } files are allowed!)`
                )
              );
              return;
            }
            const validFileSize = isValidFileSize(fileSettings[type], files);
            if (!validFileSize) {
              reject(
                new Error(
                  `Invalid file size for ${name}! (Only ${
                    type === 'IMAGE_FILE_NAME' ? '5 MB' : '100 MB'
                  } are allowed!)`
                )
              );
              return;
            }
          }
        }

        // Upload files
        const fileNames = await uploadFile(productsUrl, filesPayload).catch((e) => {
          reject(new Error(`File upload failed: ${e.message}`));
          return null;
        });

        if (!fileNames) return;

        if (fileNames.length !== expectedFileCount) {
          reject(
            new Error(
              `Upload mismatch: Expected ${expectedFileCount} files, received ${fileNames.length}`
            )
          );
          return;
        }

        const assignUrls = (category, isSingle = false) => {
          const { start, length } = categoryIndices[category];
          if (length > 0) {
            const urls = fileNames.slice(start, start + length);
            return isSingle ? urls[0] : urls.map((url) => ({ image: url }));
          }
          return isSingle ? null : [];
        };

        uploadedYellowGoldThumbnailImage = assignUrls('yellowGoldThumbnailImage', true);
        uploadedYellowGoldImages = assignUrls('yellowGoldImages');
        uploadedYellowGoldVideo = assignUrls('yellowGoldVideo', true);
      }

      // Combine existing and new images
      const yellowGoldImagesArray = [...tempYellowGoldImages, ...uploadedYellowGoldImages];

      // Validate required thumbnail
      if (!uploadedYellowGoldThumbnailImage && !productData.yellowGoldThumbnailImage) {
        reject(new Error('Yellow Gold thumbnail image is required'));
        return;
      }

      // Prepare payload
      const payload = {
        yellowGoldThumbnailImage:
          uploadedYellowGoldThumbnailImage || productData.yellowGoldThumbnailImage,
        yellowGoldImages: yellowGoldImagesArray,
        yellowGoldVideo: yellowGoldVideoFile.length
          ? uploadedYellowGoldVideo
          : deletedYellowGoldVideo
            ? ''
            : productData.yellowGoldVideo || '',
        updatedDate: Date.now(),
      };

      // Update product
      const updatePattern = {
        url: `${productsUrl}/${productId}`,
        payload: payload,
      };

      await fetchWrapperService._update(updatePattern).then(async () => {
        // Delete old files
        const filesToDelete = [
          ...deletedYellowGoldImages,
          deletedYellowGoldVideo || '',
          uploadedYellowGoldThumbnailImage && productData.yellowGoldThumbnailImage
            ? productData.yellowGoldThumbnailImage
            : '',
        ].filter(Boolean);

        if (filesToDelete.length) {
          await Promise.all(
            filesToDelete.map((url) =>
              deleteFile(productsUrl, url).catch((e) => {
                console.warn(`Failed to delete file ${url}: ${e.message}`);
              })
            )
          );
        }

        resolve(true);
      });
    } catch (e) {
      // Clean up uploaded files on failure
      const uploadedFiles = [
        uploadedYellowGoldThumbnailImage,
        ...uploadedYellowGoldImages.map((img) => img.image),
        uploadedYellowGoldVideo,
      ].filter(Boolean);

      if (uploadedFiles.length) {
        await Promise.all(
          uploadedFiles.map((url) =>
            deleteFile(productsUrl, url).catch((e) => {
              console.warn(`Failed to delete file ${url}: ${e.message}`);
            })
          )
        );
      }

      reject(new Error(`Failed to update Yellow Gold media: ${e.message}`));
    }
  });
};

const updateWhiteGoldMedia = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        productId,
        whiteGoldThumbnailImageFile,
        whiteGoldImageFiles,
        whiteGoldVideoFile,
        deletedWhiteGoldImages,
        deletedWhiteGoldVideo,
      } = sanitizeObject(params);

      if (!productId) {
        reject(new Error('Invalid Id'));
        return;
      }

      const productData = await fetchWrapperService.findOne(productsUrl, {
        id: productId,
      });
      if (!productData) {
        reject(new Error('Product data not found'));
        return;
      }

      // Sanitize file inputs
      whiteGoldThumbnailImageFile =
        typeof whiteGoldThumbnailImageFile === 'object' && whiteGoldThumbnailImageFile
          ? [whiteGoldThumbnailImageFile]
          : [];
      whiteGoldImageFiles = Array.isArray(whiteGoldImageFiles) ? whiteGoldImageFiles : [];
      whiteGoldVideoFile =
        typeof whiteGoldVideoFile === 'object' && whiteGoldVideoFile ? [whiteGoldVideoFile] : [];
      deletedWhiteGoldImages = Array.isArray(deletedWhiteGoldImages) ? deletedWhiteGoldImages : [];
      deletedWhiteGoldVideo = deletedWhiteGoldVideo ? deletedWhiteGoldVideo.trim() : null;

      // Handle image deletions
      let tempWhiteGoldImages = productData.whiteGoldImages || [];
      if (deletedWhiteGoldImages.length) {
        deletedWhiteGoldImages.forEach((url) => {
          const index = tempWhiteGoldImages.findIndex((item) => item?.image === url);
          if (index !== -1) {
            tempWhiteGoldImages.splice(index, 1);
          }
        });
      }

      // Validate and upload files
      let uploadedWhiteGoldThumbnailImage = null;
      let uploadedWhiteGoldImages = [];
      let uploadedWhiteGoldVideo = null;

      const filesPayload = [
        ...whiteGoldThumbnailImageFile,
        ...whiteGoldImageFiles,
        ...whiteGoldVideoFile,
      ];

      // Create index mapping for file categories
      const categoryIndices = {};
      let currentIndex = 0;

      const addCategoryIndices = (category, fileArray) => {
        categoryIndices[category] = {
          start: currentIndex,
          end: currentIndex + fileArray.length,
          length: fileArray.length,
        };
        currentIndex += fileArray.length;
      };

      addCategoryIndices('whiteGoldThumbnailImage', whiteGoldThumbnailImageFile);
      addCategoryIndices('whiteGoldImages', whiteGoldImageFiles);
      addCategoryIndices('whiteGoldVideo', whiteGoldVideoFile);

      const expectedFileCount = currentIndex;

      // Validate file counts and types
      if (filesPayload.length) {
        if (whiteGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT) {
          reject(
            new Error(
              `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} White Gold thumbnail image`
            )
          );
          return;
        }
        if (
          tempWhiteGoldImages.length + whiteGoldImageFiles.length >
          fileSettings.PRODUCT_IMAGE_FILE_LIMIT
        ) {
          reject(
            new Error(
              `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} White Gold images`
            )
          );
          return;
        }
        if (whiteGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
          reject(
            new Error(
              `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} White Gold video`
            )
          );
          return;
        }

        // Validate file types and sizes
        const fileCategories = [
          {
            files: whiteGoldThumbnailImageFile,
            type: 'IMAGE_FILE_NAME',
            name: 'White Gold thumbnail image',
          },
          { files: whiteGoldImageFiles, type: 'IMAGE_FILE_NAME', name: 'White Gold images' },
          { files: whiteGoldVideoFile, type: 'VIDEO_FILE_NAME', name: 'White Gold video' },
        ];

        for (const { files, type, name } of fileCategories) {
          if (files.length) {
            const validFileType = isValidFileType(fileSettings[type], files);
            if (!validFileType) {
              reject(
                new Error(
                  `Invalid file for ${name}! (Only ${
                    type === 'IMAGE_FILE_NAME' ? 'JPG, JPEG, PNG, WEBP' : 'MP4, WEBM, OGG'
                  } files are allowed!)`
                )
              );
              return;
            }
            const validFileSize = isValidFileSize(fileSettings[type], files);
            if (!validFileSize) {
              reject(
                new Error(
                  `Invalid file size for ${name}! (Only ${
                    type === 'IMAGE_FILE_NAME' ? '5 MB' : '100 MB'
                  } are allowed!)`
                )
              );
              return;
            }
          }
        }

        // Upload files
        const fileNames = await uploadFile(productsUrl, filesPayload).catch((e) => {
          reject(new Error(`File upload failed: ${e.message}`));
          return null;
        });

        if (!fileNames) return;

        if (fileNames.length !== expectedFileCount) {
          reject(
            new Error(
              `Upload mismatch: Expected ${expectedFileCount} files, received ${fileNames.length}`
            )
          );
          return;
        }

        const assignUrls = (category, isSingle = false) => {
          const { start, length } = categoryIndices[category];
          if (length > 0) {
            const urls = fileNames.slice(start, start + length);
            return isSingle ? urls[0] : urls.map((url) => ({ image: url }));
          }
          return isSingle ? null : [];
        };

        uploadedWhiteGoldThumbnailImage = assignUrls('whiteGoldThumbnailImage', true);
        uploadedWhiteGoldImages = assignUrls('whiteGoldImages');
        uploadedWhiteGoldVideo = assignUrls('whiteGoldVideo', true);
      }

      // Combine existing and new images
      const whiteGoldImagesArray = [...tempWhiteGoldImages, ...uploadedWhiteGoldImages];

      // Validate required thumbnail
      if (!uploadedWhiteGoldThumbnailImage && !productData.whiteGoldThumbnailImage) {
        reject(new Error('White Gold thumbnail image is required'));
        return;
      }

      // Prepare payload
      const payload = {
        whiteGoldThumbnailImage:
          uploadedWhiteGoldThumbnailImage || productData.whiteGoldThumbnailImage,
        whiteGoldImages: whiteGoldImagesArray,
        whiteGoldVideo: whiteGoldVideoFile.length
          ? uploadedWhiteGoldVideo
          : deletedWhiteGoldVideo
            ? ''
            : productData.whiteGoldVideo || '',
        updatedDate: Date.now(),
      };

      // Update product
      const updatePattern = {
        url: `${productsUrl}/${productId}`,
        payload: payload,
      };

      await fetchWrapperService._update(updatePattern).then(async () => {
        // Delete old files
        const filesToDelete = [
          ...deletedWhiteGoldImages,
          deletedWhiteGoldVideo || '',
          uploadedWhiteGoldThumbnailImage && productData.whiteGoldThumbnailImage
            ? productData.whiteGoldThumbnailImage
            : '',
        ].filter(Boolean);

        if (filesToDelete.length) {
          await Promise.all(
            filesToDelete.map((url) =>
              deleteFile(productsUrl, url).catch((e) => {
                console.warn(`Failed to delete file ${url}: ${e.message}`);
              })
            )
          );
        }

        resolve(true);
      });
    } catch (e) {
      // Clean up uploaded files on failure
      const uploadedFiles = [
        uploadedWhiteGoldThumbnailImage,
        ...uploadedWhiteGoldImages.map((img) => img.image),
        uploadedWhiteGoldVideo,
      ].filter(Boolean);

      if (uploadedFiles.length) {
        await Promise.all(
          uploadedFiles.map((url) =>
            deleteFile(productsUrl, url).catch((e) => {
              console.warn(`Failed to delete file ${url}: ${e.message}`);
            })
          )
        );
      }

      reject(new Error(`Failed to update White Gold media: ${e.message}`));
    }
  });
};

const updateProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        productId,
        productName,
        roseGoldThumbnailImageFile,
        roseGoldImageFiles,
        roseGoldVideoFile,
        yellowGoldThumbnailImageFile,
        yellowGoldImageFiles,
        yellowGoldVideoFile,
        whiteGoldThumbnailImageFile,
        whiteGoldImageFiles,
        whiteGoldVideoFile,
        sku,
        saltSKU,
        discount,
        collectionIds,
        settingStyleIds,
        categoryId,
        subCategoryId,
        productTypeIds,
        gender,
        netWeight,
        grossWeight,
        centerDiamondWeight,
        totalCaratWeight,
        sideDiamondWeight,
        shortDescription,
        description,
        variations,
        variComboWithQuantity,
        specifications,
        deletedRoseGoldImages,
        deletedRoseGoldVideo,
        deletedYellowGoldImages,
        deletedYellowGoldVideo,
        deletedWhiteGoldImages,
        deletedWhiteGoldVideo,
        active,
        isDiamondFilter,
        diamondFilters,
        priceCalculationMode,
      } = sanitizeObject(params);

      if (productId) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          // Sanitize and fallback to existing data
          productName = productName ? productName.trim() : productData.productName;
          sku = sku ? sku.trim() : productData.sku;
          saltSKU = saltSKU ? saltSKU.trim() : productData.saltSKU;
          discount = !isNaN(discount) ? Number(discount) : productData.discount;
          netWeight =
            !isNaN(netWeight) && netWeight !== '' && netWeight !== null
              ? Math.round(parseFloat(netWeight) * 100) / 100
              : 0;
          grossWeight =
            !isNaN(grossWeight) && grossWeight !== '' && grossWeight !== null
              ? Math.round(parseFloat(grossWeight) * 100) / 100
              : productData?.grossWeight;
          centerDiamondWeight =
            !isNaN(centerDiamondWeight) &&
            centerDiamondWeight !== '' &&
            centerDiamondWeight !== null
              ? Math.round(parseFloat(centerDiamondWeight) * 100) / 100
              : 0;
          totalCaratWeight =
            !isNaN(totalCaratWeight) && totalCaratWeight !== '' && totalCaratWeight !== null
              ? Math.round(parseFloat(totalCaratWeight) * 100) / 100
              : productData?.totalCaratWeight;
          sideDiamondWeight =
            !isNaN(sideDiamondWeight) && sideDiamondWeight !== '' && sideDiamondWeight !== null
              ? Math.round(parseFloat(sideDiamondWeight) * 100) / 100
              : productData.sideDiamondWeight || 0;
          isDiamondFilter = isBoolean(isDiamondFilter)
            ? isDiamondFilter
            : productData.isDiamondFilter || false;
          diamondFilters =
            typeof diamondFilters === 'object' ? diamondFilters : productData.diamondFilters || {};
          priceCalculationMode = [
            PRICE_CALCULATION_MODES.AUTOMATIC,
            PRICE_CALCULATION_MODES.MANUAL,
          ].includes(priceCalculationMode)
            ? priceCalculationMode
            : productData.priceCalculationMode;

          // Validate inputs
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

          if (netWeight && netWeight <= 0) {
            reject(new Error('Invalid Net Weight: Must be a positive number'));
            return;
          }

          if (grossWeight <= 0) {
            reject(new Error('Invalid Gross Weight: Must be a positive number'));
            return;
          }
          if (centerDiamondWeight && centerDiamondWeight <= 0) {
            reject(new Error('Invalid Center Diamond Weight: Must be a positive number'));
            return;
          }

          if (totalCaratWeight <= 0) {
            reject(new Error('Invalid Total Carat Weight: Must be a positive number'));
            return;
          }

          if (sideDiamondWeight && sideDiamondWeight <= 0) {
            reject(new Error('Invalid Side Diamond Weight: Must be a positive number'));
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
            const netWeightString = netWeight.toFixed(2);
            if (!/^\d+\.\d{2}$/.test(netWeightString)) {
              reject(new Error('Net Weight must have exactly two decimal places'));
              return;
            }
            if (!sideDiamondWeight || isNaN(sideDiamondWeight)) {
              reject(new Error('Invalid Side Diamond Weight: Must be a valid number'));
              return;
            }
            const sideDiamondWeightString = sideDiamondWeight.toFixed(2);
            if (!/^\d+\.\d{2}$/.test(sideDiamondWeightString)) {
              reject(new Error('Side Diamond Weight must have exactly two decimal places'));
              return;
            }
          }

          // Check for duplicate productName or sku
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
          if (duplicateData.length) {
            reject(new Error('Product name or SKU already exists'));
            return;
          }

          // Validate arrays
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
              reject(new Error('Specifications data not valid'));
              return;
            }
          }

          // Sanitize file inputs
          roseGoldThumbnailImageFile =
            typeof roseGoldThumbnailImageFile === 'object' ? [roseGoldThumbnailImageFile] : [];
          roseGoldImageFiles = Array.isArray(roseGoldImageFiles) ? roseGoldImageFiles : [];
          roseGoldVideoFile = typeof roseGoldVideoFile === 'object' ? [roseGoldVideoFile] : [];
          yellowGoldThumbnailImageFile =
            typeof yellowGoldThumbnailImageFile === 'object' ? [yellowGoldThumbnailImageFile] : [];
          yellowGoldImageFiles = Array.isArray(yellowGoldImageFiles) ? yellowGoldImageFiles : [];
          yellowGoldVideoFile =
            typeof yellowGoldVideoFile === 'object' ? [yellowGoldVideoFile] : [];
          whiteGoldThumbnailImageFile =
            typeof whiteGoldThumbnailImageFile === 'object' ? [whiteGoldThumbnailImageFile] : [];
          whiteGoldImageFiles = Array.isArray(whiteGoldImageFiles) ? whiteGoldImageFiles : [];
          whiteGoldVideoFile = typeof whiteGoldVideoFile === 'object' ? [whiteGoldVideoFile] : [];
          deletedRoseGoldImages = Array.isArray(deletedRoseGoldImages) ? deletedRoseGoldImages : [];
          deletedRoseGoldVideo = deletedRoseGoldVideo ? deletedRoseGoldVideo.trim() : null;
          deletedYellowGoldImages = Array.isArray(deletedYellowGoldImages)
            ? deletedYellowGoldImages
            : [];
          deletedYellowGoldVideo = deletedYellowGoldVideo ? deletedYellowGoldVideo.trim() : null;
          deletedWhiteGoldImages = Array.isArray(deletedWhiteGoldImages)
            ? deletedWhiteGoldImages
            : [];
          deletedWhiteGoldVideo = deletedWhiteGoldVideo ? deletedWhiteGoldVideo.trim() : null;

          // Handle image deletions
          let tempRoseGoldImages = productData.roseGoldImages || [];
          if (deletedRoseGoldImages.length) {
            deletedRoseGoldImages.forEach((url) => {
              const index = tempRoseGoldImages.findIndex((item) => url === item.image);
              if (index !== -1) {
                tempRoseGoldImages.splice(index, 1);
              }
            });
          }

          let tempYellowGoldImages = productData.yellowGoldImages || [];
          if (deletedYellowGoldImages.length) {
            deletedYellowGoldImages.forEach((url) => {
              const index = tempYellowGoldImages.findIndex((item) => url === item.image);
              if (index !== -1) {
                tempYellowGoldImages.splice(index, 1);
              }
            });
          }

          let tempWhiteGoldImages = productData.whiteGoldImages || [];
          if (deletedWhiteGoldImages.length) {
            deletedWhiteGoldImages.forEach((url) => {
              const index = tempWhiteGoldImages.findIndex((item) => url === item.image);
              if (index !== -1) {
                tempWhiteGoldImages.splice(index, 1);
              }
            });
          }

          // Validate and upload files
          let uploadedRoseGoldThumbnailImage = null;
          let uploadedRoseGoldImages = [];
          let uploadedRoseGoldVideo = null;
          let uploadedYellowGoldThumbnailImage = null;
          let uploadedYellowGoldImages = [];
          let uploadedYellowGoldVideo = null;
          let uploadedWhiteGoldThumbnailImage = null;
          let uploadedWhiteGoldImages = [];
          let uploadedWhiteGoldVideo = null;

          const filesPayload = [
            ...roseGoldThumbnailImageFile,
            ...roseGoldImageFiles,
            ...roseGoldVideoFile,
            ...yellowGoldThumbnailImageFile,
            ...yellowGoldImageFiles,
            ...yellowGoldVideoFile,
            ...whiteGoldThumbnailImageFile,
            ...whiteGoldImageFiles,
            ...whiteGoldVideoFile,
          ];

          // Create index mapping for file categories
          const categoryIndices = {};
          let currentIndex = 0;

          const addCategoryIndices = (category, fileArray) => {
            if (fileArray.length) {
              categoryIndices[category] = {
                start: currentIndex,
                end: currentIndex + fileArray.length,
                length: fileArray.length,
              };
              currentIndex += fileArray.length;
            } else {
              categoryIndices[category] = { start: currentIndex, end: currentIndex, length: 0 };
            }
          };

          addCategoryIndices('roseGoldThumbnailImage', roseGoldThumbnailImageFile);
          addCategoryIndices('roseGoldImages', roseGoldImageFiles);
          addCategoryIndices('roseGoldVideo', roseGoldVideoFile);
          addCategoryIndices('yellowGoldThumbnailImage', yellowGoldThumbnailImageFile);
          addCategoryIndices('yellowGoldImages', yellowGoldImageFiles);
          addCategoryIndices('yellowGoldVideo', yellowGoldVideoFile);
          addCategoryIndices('whiteGoldThumbnailImage', whiteGoldThumbnailImageFile);
          addCategoryIndices('whiteGoldImages', whiteGoldImageFiles);
          addCategoryIndices('whiteGoldVideo', whiteGoldVideoFile);

          const expectedFileCount = currentIndex;

          // Validate file counts and types
          if (filesPayload.length) {
            if (
              roseGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} Rose Gold thumbnail image`
                )
              );
              return;
            }
            if (
              tempRoseGoldImages.length + roseGoldImageFiles.length >
              fileSettings.PRODUCT_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} Rose Gold images`
                )
              );
              return;
            }
            if (roseGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} Rose Gold video`
                )
              );
              return;
            }
            if (
              yellowGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} Yellow Gold thumbnail image`
                )
              );
              return;
            }
            if (
              tempYellowGoldImages.length + yellowGoldImageFiles.length >
              fileSettings.PRODUCT_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} Yellow Gold images`
                )
              );
              return;
            }
            if (yellowGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} Yellow Gold video`
                )
              );
              return;
            }
            if (
              whiteGoldThumbnailImageFile.length > fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT} White Gold thumbnail image`
                )
              );
              return;
            }
            if (
              tempWhiteGoldImages.length + whiteGoldImageFiles.length >
              fileSettings.PRODUCT_IMAGE_FILE_LIMIT
            ) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_IMAGE_FILE_LIMIT} White Gold images`
                )
              );
              return;
            }
            if (whiteGoldVideoFile.length > fileSettings.PRODUCT_VIDEO_FILE_LIMIT) {
              reject(
                new Error(
                  `You can only upload ${fileSettings.PRODUCT_VIDEO_FILE_LIMIT} White Gold video`
                )
              );
              return;
            }

            // Validate file types and sizes
            const fileCategories = [
              {
                files: roseGoldThumbnailImageFile,
                type: 'IMAGE_FILE_NAME',
                name: 'Rose Gold thumbnail image',
              },
              { files: roseGoldImageFiles, type: 'IMAGE_FILE_NAME', name: 'Rose Gold images' },
              { files: roseGoldVideoFile, type: 'VIDEO_FILE_NAME', name: 'Rose Gold video' },
              {
                files: yellowGoldThumbnailImageFile,
                type: 'IMAGE_FILE_NAME',
                name: 'Yellow Gold thumbnail image',
              },
              { files: yellowGoldImageFiles, type: 'IMAGE_FILE_NAME', name: 'Yellow Gold images' },
              { files: yellowGoldVideoFile, type: 'VIDEO_FILE_NAME', name: 'Yellow Gold video' },
              {
                files: whiteGoldThumbnailImageFile,
                type: 'IMAGE_FILE_NAME',
                name: 'White Gold thumbnail image',
              },
              { files: whiteGoldImageFiles, type: 'IMAGE_FILE_NAME', name: 'White Gold images' },
              { files: whiteGoldVideoFile, type: 'VIDEO_FILE_NAME', name: 'White Gold video' },
            ];

            for (const { files, type, name } of fileCategories) {
              if (files.length) {
                const validFileType = isValidFileType(fileSettings[type], files);
                if (!validFileType) {
                  reject(
                    new Error(
                      `Invalid file for ${name}! (Only ${type === 'IMAGE_FILE_NAME' ? 'JPG, JPEG, PNG, WEBP' : 'MP4, WEBM, OGG'} files are allowed!)`
                    )
                  );
                  return;
                }
                const validFileSize = isValidFileSize(fileSettings[type], files);
                if (!validFileSize) {
                  reject(
                    new Error(
                      `Invalid file size for ${name}! (Only ${type === 'IMAGE_FILE_NAME' ? '5 MB' : '100 MB'} are allowed!)`
                    )
                  );
                  return;
                }
              }
            }

            // Upload files
            await uploadFile(productsUrl, filesPayload)
              .then((fileNames) => {
                if (fileNames.length !== expectedFileCount) {
                  throw new Error(
                    `Upload mismatch: Expected ${expectedFileCount} files, received ${fileNames.length}`
                  );
                }

                const assignUrls = (category, isSingle = false) => {
                  const { start, length } = categoryIndices[category];
                  if (length > 0) {
                    const urls = fileNames.slice(start, start + length);
                    return isSingle ? urls[0] : urls.map((url) => ({ image: url }));
                  }
                  return isSingle ? null : [];
                };

                uploadedRoseGoldThumbnailImage = assignUrls('roseGoldThumbnailImage', true);
                uploadedRoseGoldImages = assignUrls('roseGoldImages');
                uploadedRoseGoldVideo = assignUrls('roseGoldVideo', true);
                uploadedYellowGoldThumbnailImage = assignUrls('yellowGoldThumbnailImage', true);
                uploadedYellowGoldImages = assignUrls('yellowGoldImages');
                uploadedYellowGoldVideo = assignUrls('yellowGoldVideo', true);
                uploadedWhiteGoldThumbnailImage = assignUrls('whiteGoldThumbnailImage', true);
                uploadedWhiteGoldImages = assignUrls('whiteGoldImages');
                uploadedWhiteGoldVideo = assignUrls('whiteGoldVideo', true);
              })
              .catch((e) => {
                reject(new Error(`File upload failed: ${e.message}`));
                return;
              });
          }

          // Combine existing and new images
          const roseGoldImagesArray = [...tempRoseGoldImages, ...uploadedRoseGoldImages];
          const yellowGoldImagesArray = [...tempYellowGoldImages, ...uploadedYellowGoldImages];
          const whiteGoldImagesArray = [...tempWhiteGoldImages, ...uploadedWhiteGoldImages];

          // Validate required images
          if (!uploadedRoseGoldThumbnailImage && !productData.roseGoldThumbnailImage) {
            reject(new Error('Rose Gold thumbnail image is required'));
            return;
          }
          if (!uploadedYellowGoldThumbnailImage && !productData.yellowGoldThumbnailImage) {
            reject(new Error('Yellow Gold thumbnail image is required'));
            return;
          }
          if (!uploadedWhiteGoldThumbnailImage && !productData.whiteGoldThumbnailImage) {
            reject(new Error('White Gold thumbnail image is required'));
            return;
          }

          // Handle variations and combinations
          variations = Array.isArray(variations) ? variations : [];
          const variationsArray =
            variations.length && !isInValidVariationsArray(variations)
              ? getVariationsArray(variations)
              : productData.variations;

          variComboWithQuantity = Array.isArray(variComboWithQuantity) ? variComboWithQuantity : [];
          let variComboWithQuantityArray =
            variComboWithQuantity.length &&
            !isInValidVariComboWithQuantityArray(variComboWithQuantity)
              ? getVariComboWithQuantityArray(variComboWithQuantity)
              : productData.variComboWithQuantity;

          // Apply automatic price calculations if enabled
          if (priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC) {
            const customizationSubTypesList = await customizationSubTypeService.getAllSubTypes();
            const priceMultiplier = await settingsService.fetchPriceMultiplier();
            variComboWithQuantityArray = helperFunctions.calculateAutomaticPrices({
              combinations: variComboWithQuantityArray,
              customizationSubTypesList,
              grossWeight,
              totalCaratWeight,
              priceMultiplier,
            });
          }

          // Prepare payload
          const payload = {
            productName,
            roseGoldThumbnailImage:
              uploadedRoseGoldThumbnailImage || productData.roseGoldThumbnailImage,
            roseGoldImages: roseGoldImagesArray,
            roseGoldVideo: roseGoldVideoFile.length
              ? uploadedRoseGoldVideo
              : deletedRoseGoldVideo
                ? ''
                : productData.roseGoldVideo || '',
            yellowGoldThumbnailImage:
              uploadedYellowGoldThumbnailImage || productData.yellowGoldThumbnailImage,
            yellowGoldImages: yellowGoldImagesArray,
            yellowGoldVideo: yellowGoldVideoFile.length
              ? uploadedYellowGoldVideo
              : deletedYellowGoldVideo
                ? ''
                : productData.yellowGoldVideo || '',
            whiteGoldThumbnailImage:
              uploadedWhiteGoldThumbnailImage || productData.whiteGoldThumbnailImage,
            whiteGoldImages: whiteGoldImagesArray,
            whiteGoldVideo: whiteGoldVideoFile.length
              ? uploadedWhiteGoldVideo
              : deletedWhiteGoldVideo
                ? ''
                : productData.whiteGoldVideo || '',
            sku,
            saltSKU,
            discount,
            collectionIds: Array.isArray(collectionIds)
              ? collectionIds?.map((id) => id?.trim())
              : productData.collectionIds,
            settingStyleIds: Array.isArray(settingStyleIds)
              ? settingStyleIds?.map((id) => id?.trim())
              : productData.settingStyleIds,
            categoryId: categoryId ? categoryId.trim() : productData.categoryId,
            subCategoryId: subCategoryId || '',
            productTypeIds: Array.isArray(productTypeIds)
              ? productTypeIds?.map((id) => id?.trim())
              : productData.productTypeIds,
            gender,
            netWeight,
            grossWeight,
            totalCaratWeight,
            centerDiamondWeight,
            sideDiamondWeight,
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
            priceCalculationMode,
            isDiamondFilter,
            diamondFilters: isDiamondFilter ? diamondFilters : null,
            updatedDate: Date.now(),
          };
          // Update product
          const updatePattern = {
            url: `${productsUrl}/${productId}`,
            payload: payload,
          };

          await fetchWrapperService
            ._update(updatePattern)
            .then(async () => {
              // Delete old files
              const filesToDelete = [
                ...deletedRoseGoldImages,
                deletedRoseGoldVideo || '',
                ...deletedYellowGoldImages,
                deletedYellowGoldVideo || '',
                ...deletedWhiteGoldImages,
                deletedWhiteGoldVideo || '',
                uploadedRoseGoldThumbnailImage ? productData.roseGoldThumbnailImage : '',
                uploadedYellowGoldThumbnailImage ? productData.yellowGoldThumbnailImage : '',
                uploadedWhiteGoldThumbnailImage ? productData.whiteGoldThumbnailImage : '',
              ].filter(Boolean);

              if (filesToDelete.length) {
                await Promise.all(
                  filesToDelete.map((url) =>
                    deleteFile(productsUrl, url).catch((e) => {
                      console.warn(`Failed to delete file ${url}: ${e.message}`);
                    })
                  )
                );
              }

              resolve(true);
            })
            .catch(async (e) => {
              // Clean up uploaded files on failure
              const uploadedFiles = [
                uploadedRoseGoldThumbnailImage,
                ...uploadedRoseGoldImages.map((img) => img.image),
                uploadedRoseGoldVideo,
                uploadedYellowGoldThumbnailImage,
                ...uploadedYellowGoldImages.map((img) => img.image),
                uploadedYellowGoldVideo,
                uploadedWhiteGoldThumbnailImage,
                ...uploadedWhiteGoldImages.map((img) => img.image),
                uploadedWhiteGoldVideo,
              ].filter(Boolean);

              if (uploadedFiles.length) {
                await Promise.all(
                  uploadedFiles.map((url) =>
                    deleteFile(productsUrl, url).catch((e) => {
                      console.warn(`Failed to delete file ${url}: ${e.message}`);
                    })
                  )
                );
              }

              reject(new Error(`Failed to update product: ${e.message}`));
            });
        } else {
          reject(new Error('Product data not found'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(new Error(`Update failed: ${e?.message}`));
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
  // const randomNumber = helperFunctions.getRandomNumberLimitedDigits();
  // const lastDigits = saltSKU ? saltSKU?.split('-')?.pop() : randomNumber;
  // return `${prefixSaltSku}-${styleNo}-${lastDigits}`;
  return `${prefixSaltSku}-${styleNo}`;
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

  if (!goldType || !goldColor) return variations;

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

  // if (category === 'RING') {
  //   variations.push(
  //     createVariation({
  //       matchedType: sizeType,
  //       matchedSubTypes: matchSubTypes(SIZE_TYPE_SUB_TYPES_LIST.map((x) => x?.title)),
  //     })
  //   );
  // }

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

/**
 * Updates the price of a single product's variation combinations based on provided parameters.
 *
 * @param {Object} params - Input parameters for updating product prices.
 * @param {Object} params.product - Product object with variation combinations and price calculation mode.
 * @param {number} params.priceMultiplier - Multiplier to adjust the final price (must be positive).
 * @param {Array<Object>} [params.allSubTypes=[]] - Array of subtype objects with price and unit info.
 * @returns {Promise<Object|null>} Updated product object or null if inputs are invalid.
 *
 * @description
 * - Validates inputs: checks for valid product, positive priceMultiplier, and non-empty variation combinations.
 * - Returns unchanged product if price calculation mode is not 'automatic'.
 * - Fetches subtypes from customizationSubTypeUrl if not provided.
 * - Updates variation combinations with new prices and units from matched subtypes.
 * - Calculates updated price using calculateNonCustomizedProductPrice helper.
 * - Updates product in database and returns updated product object.
 * - Logs errors for invalid inputs or failed subtype fetch.
 */
const updateSingleProductPrice = async ({ product, priceMultiplier, allSubTypes = [] }) => {
  // Validate input parameters
  if (
    !product ||
    !Number.isFinite(priceMultiplier) ||
    priceMultiplier <= 0 ||
    !Array.isArray(product.variComboWithQuantity) ||
    !product.variComboWithQuantity.length
  ) {
    console.error(
      "Invalid inputs: 'product' must have valid 'variComboWithQuantity', 'priceMultiplier' must be a positive number."
    );
    return product;
  }

  // Return unchanged product if price calculation mode is not automatic
  if (product.priceCalculationMode !== 'automatic') {
    console.log('Price calculation mode is not automatic, returning unchanged product.');
    return product;
  }

  // Fetch subtypes if not provided
  let subTypes = allSubTypes;
  if (!subTypes.length) {
    try {
      subTypes = await customizationSubTypeService.getAllSubTypes();
    } catch (error) {
      throw new Error(`Failed to fetch subtypes: ${error.message}`);
    }
  }

  // Update variation combinations with new prices and units
  const updatedVariCombos = product.variComboWithQuantity.map((combo) => {
    const updatedVariations = combo.combination.map((variation) => {
      const matchedSubType = subTypes.find((subType) => subType.id === variation.variationTypeId);
      return {
        ...variation,
        price: matchedSubType?.price ?? 0,
        unit: matchedSubType?.unit ?? '',
      };
    });

    // Calculate updated price for the combination
    const updatedPrice = helperFunctions.calculateNonCustomizedProductPrice({
      grossWeight: product.grossWeight || 0,
      totalCaratWeight: product.totalCaratWeight || 0,
      variations: updatedVariations,
      priceMultiplier,
    });

    return { ...combo, price: updatedPrice, combination: updatedVariations };
  });

  // Update product in the database
  await fetchWrapperService._update({
    url: `${productsUrl}/${product.id}`,
    payload: { variComboWithQuantity: updatedVariCombos },
  });

  // Return updated product
  return { ...product, variComboWithQuantity: updatedVariCombos };
};

export const productService = {
  insertProduct,
  getAllProductsWithPagging,
  getAllActiveProducts,
  deleteProduct,
  getSingleProduct,
  activeDeactiveProduct,
  updateRoseGoldMedia,
  updateYellowGoldMedia,
  updateWhiteGoldMedia,
  updateProduct,
  searchProducts,
  updateProductQtyForReturn,
  processBulkProductsWithApi,
  updateSingleProductPrice,
};
