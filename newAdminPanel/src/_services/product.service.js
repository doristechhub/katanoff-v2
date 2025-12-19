import { uid } from 'uid';
import {
  customizationUrl,
  fetchWrapperService,
  ordersUrl,
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
  ADD,
  ALLOW_MAX_CARAT_WEIGHT,
  ALLOW_MIN_CARAT_WEIGHT,
  DELETE,
  GOLD_COLOR,
  GOLD_TYPE,
  PRICE_CALCULATION_MODES,
  PRODUCT,
  UPDATE,
  RINGS,
  allowedGenders,
  DEFAULT_QTY,
  DIAMOND_SHAPE,
} from 'src/_helpers/constants';
import { isBoolean } from 'lodash';
import axios from 'axios';
import { customizationTypeService } from './customizationType.service';
import { customizationSubTypeService } from './customizationSubType.service';
import { settingsService } from './settings.service';
import { collectionService } from './collection.service';
import { settingStyleService } from './settingStyle.service';
import { diamondShapeService } from './diamondShape.service';
import { homeService } from './home.service';
import { adminController } from 'src/_controller';
import CustomError from 'src/_helpers/customError';

const productStoragePath = productsUrl;

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

export const validateProductNamePrefix = (productNamePrefix) => {
  if (!['fraction', 'numeric', 'none'].includes(productNamePrefix)) {
    return 'Invalid product name prefix. Must be one of: fraction, numeric, none';
  }
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

export const validateDimensionUnit = (dimensionUnit) => {
  if (dimensionUnit && !['in', 'mm'].includes(dimensionUnit)) {
    return 'Dimension unit must be either "in" (inches) or "mm" (millimeters).';
  }
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

// thumbnail image File settings
const uploadThumbnailImageFileType = fileSettings.THUMBNAIL_IMAGE_FILE_NAME; // thumbnail image

// image File settings
const uploadImageFileType = fileSettings.IMAGE_FILE_NAME; // image

// video File settings
const uploadVideoFileType = fileSettings.VIDEO_FILE_NAME; // video

const validateFiles = ({ files, filesLength, uploadFileType }) => {
  let fileLimit = 0;
  let allowedFileTypes = [];
  let fileSizeLimitInMB = 0;

  // ── THUMBNAIL IMAGE ─────────────────────────────────────
  if (uploadFileType === uploadThumbnailImageFileType) {
    fileLimit = fileSettings.PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT || 1;
    allowedFileTypes = fileSettings.IMAGE_ALLOW_MIME_TYPE;
    fileSizeLimitInMB = fileSettings.MAX_FILE_SIZE_MB; //in MB
  }

  // ── REGULAR IMAGES ──────────────────────────────────────
  else if (uploadFileType === uploadImageFileType) {
    //for image
    fileLimit = fileSettings.PRODUCT_IMAGE_FILE_LIMIT;
    allowedFileTypes = fileSettings.IMAGE_ALLOW_MIME_TYPE;
    fileSizeLimitInMB = fileSettings.MAX_FILE_SIZE_MB; //in MB
  }

  // ── VIDEO ─────────────────────────────
  else if (uploadFileType === uploadVideoFileType) {
    fileLimit = fileSettings.PRODUCT_VIDEO_FILE_LIMIT;
    allowedFileTypes = fileSettings.VIDEO_ALLOW_MIME_TYPE;
    fileSizeLimitInMB = helperFunctions.bytesToMB(fileSettings.VIDEO_ALLOW_FILE_SIZE); // inMB
  } else {
    throw new Error('Invalid uploadFileType provided to validate Files');
  }

  if (!files.length) {
    throw new Error(`At least one file is required.`);
  } else if (filesLength > fileLimit) {
    throw new Error(`You can only upload up to ${fileLimit} files.`);
  }

  const validFileType = isValidFileType(uploadFileType, files);
  if (!validFileType) {
    throw new Error(
      `Invalid file type! Only the following formats are allowed: ${allowedFileTypes.join(', ')}`
    );
  }

  const validFileSize = isValidFileSize(uploadFileType, files);
  if (!validFileSize) {
    throw new Error(`Invalid file size! Each file must be under ${fileSizeLimitInMB} MB.`);
  }
};

// Helper function to handle file uploads with error handling
const handleFileUpload = async ({ path, files, fileType }) => {
  if (files.length === 0) return null; // Skip if no files

  try {
    const uploadedFiles = await uploadFile(path, files);
    return uploadedFiles;
  } catch (error) {
    throw new Error(`${fileType} upload failed. Error: ${error.message}`);
  }
};

/* ===================================================================
   PROCESS mediaMapping FROM ADMIN PANEL – PARAMETERS AS OBJECT
   =================================================================== */
const processMediaMappingFromParams = async ({
  mediaMappingParam = [],
  variCombos = [],
  productId = null,
  existingMediaMapping = [],
}) => {
  // Early return if no media sets
  if (!Array.isArray(mediaMappingParam) || mediaMappingParam.length === 0) {
    throw new Error('At least one media set is required.');
  }

  const filesToUpload = [];
  const errors = [];
  const filesToDelete = new Set();
  const newlyUploadedUrls = new Set();

  const existingMediaMap = new Map();
  existingMediaMapping.forEach((set) => existingMediaMap.set(set.mediaSetId, set));

  const MAX_IMAGES = fileSettings.PRODUCT_IMAGE_FILE_LIMIT || 8;

  const incomingMediaSetIds = new Set(
    mediaMappingParam.map((item) => item.mediaSetId).filter(Boolean)
  );

  // Detect removed media sets → delete all their files
  existingMediaMapping.forEach((existingSet) => {
    if (!incomingMediaSetIds.has(existingSet.mediaSetId)) {
      if (existingSet.thumbnailImage) filesToDelete.add(existingSet.thumbnailImage);
      if (existingSet.video) filesToDelete.add(existingSet.video);
      existingSet.images?.forEach((img) => img.image && filesToDelete.add(img.image));
    }
  });

  // First pass: collect all files in exact upload order
  const uploadOrder = []; // Will store { mediaSetId, type: 'thumb' | 'image' | 'video', index? }

  mediaMappingParam.forEach((item) => {
    const { mediaSetId, name = 'Unnamed Set' } = item;
    const existingSet = existingMediaMap.get(mediaSetId) || {};

    // Thumbnail
    if (item.thumbnailImageFile instanceof File) {
      validateFiles({
        files: [item.thumbnailImageFile],
        filesLength: 1,
        uploadFileType: uploadThumbnailImageFileType,
      });
      filesToUpload.push(item.thumbnailImageFile);
      uploadOrder.push({ mediaSetId, type: 'thumb' });
      if (existingSet.thumbnailImage) filesToDelete.add(existingSet.thumbnailImage);
    }

    // Images (multiple)
    const newImageFiles = Array.isArray(item.imageFiles)
      ? item.imageFiles.filter((f) => f instanceof File)
      : [];

    if (newImageFiles.length > 0) {
      validateFiles({
        files: newImageFiles,
        filesLength: newImageFiles.length,
        uploadFileType: uploadImageFileType,
      });
      newImageFiles.forEach((file) => {
        filesToUpload.push(file);
        uploadOrder.push({ mediaSetId, type: 'image' });
      });
    }

    // Video
    if (item.videoFile instanceof File) {
      validateFiles({
        files: [item.videoFile],
        filesLength: 1,
        uploadFileType: uploadVideoFileType,
      });
      filesToUpload.push(item.videoFile);
      uploadOrder.push({ mediaSetId, type: 'video' });
      if (existingSet.video) filesToDelete.add(existingSet.video);
    } else if (item.deleteUploadedVideo && existingSet.video) {
      filesToDelete.add(existingSet.video);
    }
  });

  // Second pass: validate required fields (after knowing what will be kept)
  mediaMappingParam.forEach((item) => {
    const { mediaSetId, name = '' } = item;
    const existingSet = existingMediaMap.get(mediaSetId) || {};

    // Thumbnail required
    const hasNewThumb = item.thumbnailImageFile instanceof File;
    const hasExistingThumb = !!existingSet.thumbnailImage;
    if (!hasNewThumb && !hasExistingThumb) {
      errors.push(`Media Set "${name}": Thumbnail is required.`);
    }

    // Images: count kept + new
    const deletedUrls = Array.isArray(item.deletedImages) ? item.deletedImages : [];
    deletedUrls.forEach((url) => filesToDelete.add(url));

    const keptImages = (existingSet.images || [])
      .map((i) => i.image)
      .filter((url) => url && !deletedUrls.includes(url)).length;

    const newImages = Array.isArray(item.imageFiles)
      ? item.imageFiles.filter((f) => f instanceof File).length
      : 0;

    const totalImages = keptImages + newImages;
    if (totalImages === 0) {
      errors.push(`Media Set "${name}": At least one image is required.`);
    }
    if (totalImages > MAX_IMAGES) {
      errors.push(
        `Media Set "${name}": Maximum ${MAX_IMAGES} images allowed (you have ${totalImages}).`
      );
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join(' | '));
  }

  // Upload all new files
  let uploadedUrls = [];
  if (filesToUpload.length > 0) {
    try {
      uploadedUrls = await handleFileUpload({
        path: productStoragePath,
        files: filesToUpload,
        fileType: 'product media',
      });
      uploadedUrls.forEach((url) => newlyUploadedUrls.add(url));
    } catch (err) {
      throw new Error(`Media upload failed: ${err.message}`);
    }
  }

  // Third pass: build final mapping using uploadOrder
  let uploadIndex = 0;
  const finalMediaMapping = mediaMappingParam.map((item) => {
    const { mediaSetId, name = '' } = item;
    const existingSet = existingMediaMap.get(mediaSetId) || {};

    let thumbnailImage = '';
    const images = [];
    let video = '';

    // Deleted images for this set (URLs to remove)
    const deletedUrlsSet = Array.isArray(item.deletedImages)
      ? new Set(item.deletedImages)
      : new Set();

    // 1. First, add all kept existing images (in original order)
    const existingImages = existingSet.images || [];
    for (const imgObj of existingImages) {
      const url = imgObj.image;
      if (url && !deletedUrlsSet.has(url)) {
        images.push({ image: url });
      }
    }

    // Then, add all newly uploaded files for this mediaSetId (in upload order)
    for (const entry of uploadOrder) {
      if (entry.mediaSetId !== mediaSetId) continue;

      const url = uploadedUrls[uploadIndex++];

      if (entry.type === 'thumb') {
        thumbnailImage = url;
      } else if (entry.type === 'image') {
        images.push({ image: url });
      } else if (entry.type === 'video') {
        video = url;
      }
    }

    // Use existing thumbnail if no new one
    if (!thumbnailImage && existingSet.thumbnailImage) {
      thumbnailImage = existingSet.thumbnailImage;
    }

    // Use existing video if no new one and not deleted
    if (!video && existingSet.video && !item.deleteUploadedVideo) {
      video = existingSet.video;
    }

    return {
      mediaSetId,
      name,
      thumbnailImage,
      images,
      video: video || '',
    };
  });

  // ── Assign mediaSetId to variation combinations ───────────────────
  const updatedCombos = helperFunctions.applyMediaSetIdByMatching(mediaMappingParam, variCombos);

  return {
    mediaMapping: finalMediaMapping,
    updatedCombos,
    filesToDelete: Array.from(filesToDelete),
    newlyUploadedUrls: Array.from(newlyUploadedUrls),
  };
};

/**
 * Extracts ONLY media URLs from the new mediaMapping field
 * Used for rollback when insert/update fails
 * @param {Array} mediaMapping
 * @returns {string[]} Unique URLs
 */
const extractUrlsFromMediaMapping = (mediaMapping) => {
  const urls = new Set();
  if (!Array.isArray(mediaMapping)) return [];

  mediaMapping.forEach((set) => {
    if (set?.thumbnailImage) urls.add(set.thumbnailImage);
    (set?.images || []).forEach((i) => i?.image && urls.add(i.image));
    if (set?.video) urls.add(set.video);
  });

  return Array.from(urls);
};

const insertProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    let uploadedMediaUrls = [];
    try {
      const uuid = uid();
      let {
        productName,
        productNamePrefix = 'none',
        sku,
        saltSKU,
        discount = 0,
        collectionIds = [],
        settingStyleIds = [],
        categoryId,
        subCategoryIds = [],
        productTypeIds = [],
        gender,
        netWeight = 0,
        grossWeight,
        centerDiamondWeight = 0,
        totalCaratWeight,
        sideDiamondWeight = 0,
        Length,
        width,
        lengthUnit = 'mm',
        widthUnit = 'mm',
        shortDescription,
        description,
        variations = [],
        specifications = [],
        variComboWithQuantity = [],
        active = false,
        isDiamondFilter = false,
        diamondFilters = {},
        priceCalculationMode = PRICE_CALCULATION_MODES.AUTOMATIC,
        // New: mediaMapping from admin
        mediaMapping: mediaMappingParam = [],
      } = sanitizeObject(params);

      // Sanitize and process inputs
      productName = productName ? productName.trim() : null;
      productNamePrefix = productNamePrefix ? productNamePrefix.trim() : 'none';
      sku = sku ? sku.trim() : null;
      saltSKU = saltSKU ? saltSKU.trim() : null;
      discount = !isNaN(discount) ? Number(discount) : 0;
      collectionIds = Array.isArray(collectionIds) ? collectionIds : [];
      settingStyleIds = Array.isArray(settingStyleIds) ? settingStyleIds : [];
      categoryId = categoryId ? categoryId.trim() : null;
      subCategoryIds = Array.isArray(subCategoryIds) ? subCategoryIds : [];
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

      Length =
        !isNaN(Length) && Length !== '' && Length !== null
          ? Math.round(parseFloat(Length) * 100) / 100
          : null;
      width =
        !isNaN(width) && width !== '' && width !== null
          ? Math.round(parseFloat(width) * 100) / 100
          : null;
      lengthUnit = lengthUnit ? lengthUnit.trim() : 'mm';
      widthUnit = widthUnit ? widthUnit.trim() : 'mm';

      shortDescription = shortDescription ? shortDescription.trim() : null;
      description = description ? description.trim() : null;
      variations = Array.isArray(variations) ? variations : [];
      specifications = Array.isArray(specifications) ? specifications : [];
      variComboWithQuantity = Array.isArray(variComboWithQuantity) ? variComboWithQuantity : [];
      // active = JSON.parse(active);
      active = false;
      isDiamondFilter = isBoolean(isDiamondFilter) ? isDiamondFilter : false;
      diamondFilters = typeof diamondFilters === 'object' ? diamondFilters : {};
      priceCalculationMode = priceCalculationMode
        ? priceCalculationMode.trim()
        : PRICE_CALCULATION_MODES.AUTOMATIC;

      // Check if the current admin has permission to insert products, and reject if not
      const currentUser = helperFunctions.getCurrentUser();
      if (!currentUser) {
        return reject(
          new Error('You must be logged in with appropriate permissions to add a product.')
        );
      }
      const payload = {
        adminId: currentUser?.id,
      };
      const permissionData = await adminController.getPermissionsByAdminId(payload);
      const productPermissions = permissionData.find((perm) => perm.pageId === PRODUCT);

      const canInsert = productPermissions?.actions?.some((action) => action.actionId === ADD);

      if (!canInsert) {
        return reject(new Error('You do not have permission to add this product.'));
      }

      // Validate inputs
      if (
        !productName ||
        !sku ||
        !categoryId ||
        // !subCategoryId ||
        // !productTypeIds?.length ||
        !description ||
        !variations.length ||
        !variComboWithQuantity.length ||
        ![true, false].includes(active) ||
        !uuid ||
        !grossWeight ||
        !totalCaratWeight ||
        ![PRICE_CALCULATION_MODES.AUTOMATIC, PRICE_CALCULATION_MODES.MANUAL].includes(
          priceCalculationMode
        )
      ) {
        return reject(new Error('Invalid Data'));
      }

      const pNameErrorMsg = validateProductName(productName);
      if (pNameErrorMsg) {
        reject(new Error(pNameErrorMsg));
        return;
      }

      const productNamePrefixErrorMsg = validateProductNamePrefix(productNamePrefix);
      if (productNamePrefixErrorMsg) {
        reject(new Error(productNamePrefixErrorMsg));
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

      if (subCategoryIds?.length) {
        const hasInvalidValues = subCategoryIds.some((id) => !id);
        if (hasInvalidValues) throw new Error('Invalid value found in subCategoryIds array');
      }

      if (productTypeIds?.length) {
        const hasInvalidValues = productTypeIds.some((id) => !id);
        if (hasInvalidValues) throw new Error('Invalid value found in productTypeIds array');
      }

      if (specifications.length) {
        const isSpecTitleValid = helperFunctions.isValidKeyName(specifications, 'title');
        const isSpecDescValid = helperFunctions.isValidKeyName(specifications, 'description');
        if (!isSpecTitleValid || !isSpecDescValid) {
          return reject(new Error('specifications data not valid'));
        }
      }

      if (netWeight && netWeight <= 0) {
        return reject(new Error('Invalid Net Weight: Must be a positive number'));
      }

      if (grossWeight <= 0) {
        return reject(new Error('Invalid Gross Weight: Must be a positive number'));
      }

      if (centerDiamondWeight && centerDiamondWeight <= 0) {
        return reject(new Error('Invalid Center Diamond Weight: Must be a positive number'));
      }
      if (totalCaratWeight <= 0) {
        return reject(new Error('Invalid Total Carat Weight: Must be a positive number'));
      }

      if (sideDiamondWeight && sideDiamondWeight < 0) {
        return reject(new Error('Invalid Side Diamond Weight: Must be a positive number'));
      }

      const lengthUnitErrorMsg = validateDimensionUnit(lengthUnit);
      if (lengthUnitErrorMsg) {
        return reject(new Error(lengthUnitErrorMsg));
      }

      const widthUnitErrorMsg = validateDimensionUnit(widthUnit);
      if (widthUnitErrorMsg) {
        return reject(new Error(widthUnitErrorMsg));
      }

      if (Length && Length <= 0) {
        return reject(new Error('Invalid Length: Must be a positive number'));
      }
      if (width && width <= 0) {
        return reject(new Error('Invalid Width: Must be a positive number'));
      }

      if (isDiamondFilter) {
        const diamondFilterErrorMsg = validateDiamondFilters(diamondFilters);
        if (diamondFilterErrorMsg) {
          return reject(new Error(diamondFilterErrorMsg));
        }
        if (!netWeight || isNaN(netWeight)) {
          return reject(new Error('Invalid Net Weight: Must be a valid number'));
        }
        // Ensure netWeight has exactly 2 decimal places
        const netWeightString = netWeight.toFixed(2);
        if (!/^\d+\.\d{2}$/.test(netWeightString)) {
          return reject(new Error('Net Weight must have exactly two decimal places'));
        }

        // Ensure sideDiamondWeight has exactly 2 decimal places
        const sideDiamondWeightString = sideDiamondWeight.toFixed(2);
        if (sideDiamondWeight && !/^\d+\.\d{2}$/.test(sideDiamondWeightString)) {
          return reject(new Error('Side Diamond Weight must have exactly two decimal places'));
        }
      }

      const lengthString = Length ? Length?.toFixed(2) : null;
      if (Length && !/^\d+\.\d{2}$/.test(lengthString)) {
        return reject(new Error('Length must have exactly two decimal places'));
      }
      const widthString = width ? width?.toFixed(2) : null;
      if (width && !/^\d+\.\d{2}$/.test(widthString)) {
        return reject(new Error('Width must have exactly two decimal places'));
      }

      const filterParams = {
        productName: productName,
        sku: sku,
      };
      const productFindPattern = {
        url: productsUrl,
        filterParams: filterParams,
      };

      const existing = await fetchWrapperService.findMany(productFindPattern);
      if (existing.length) {
        return reject(new Error('Product name or SKU already exists'));
      }

      // Process mediaMapping from params (files)
      const { mediaMapping, updatedCombos } = await processMediaMappingFromParams({
        mediaMappingParam,
        variCombos: variComboWithQuantityArray,
      });

      if (!mediaMapping?.length) {
        return reject(new Error('Provide Atleast one media'));
      }

      uploadedMediaUrls = extractUrlsFromMediaMapping(mediaMapping);

      const insertPattern = {
        id: uuid,
        productName,
        productNamePrefix,
        sku,
        saltSKU,
        discount,
        collectionIds: collectionIds.map((id) => id?.trim()),
        settingStyleIds: settingStyleIds.map((id) => id?.trim()),
        categoryId,
        subCategoryIds: subCategoryIds.map((id) => id?.trim()),
        productTypeIds: productTypeIds.map((id) => id?.trim()),
        gender,
        netWeight,
        grossWeight,
        totalCaratWeight,
        centerDiamondWeight,
        sideDiamondWeight,
        Length,
        width,
        lengthUnit,
        widthUnit,
        shortDescription,
        description,
        variations: variationsArray,
        variComboWithQuantity: updatedCombos,
        mediaMapping,
        isDiamondFilter,
        diamondFilters: isDiamondFilter ? diamondFilters : null,
        specifications,
        priceCalculationMode,
        active: false,
        createdDate: Date.now(),
        updatedDate: Date.now(),
      };

      const createPattern = { url: `${productsUrl}/${uuid}`, insertPattern };
      await fetchWrapperService.create(createPattern);
      resolve(true);
    } catch (e) {
      if (uploadedMediaUrls?.length) {
        console.warn('Insert failed → deleting uploaded media:', uploadedMediaUrls);
        uploadedMediaUrls.forEach((url) =>
          deleteFile(productStoragePath, url).catch((e) =>
            console.error(`Cleanup failed: ${url}`, e)
          )
        );
      }
      reject(e instanceof Error ? e : new Error('Failed to insert product'));
    }
  });
};

const getAllProductsWithPagging = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productData = await fetchWrapperService.getPaginatdData(productsUrl);
      const customizations = await getAllCustomizations();

      const updatedProductData = productData.map((item) => {
        const { price = 0 } = helperFunctions.getMinPriceVariCombo(item.variComboWithQuantity);

        const variations = helperFunctions.getVariationsArray(item.variations, customizations);
        const enrichedProduct = {
          ...item,
          variations,
        };

        const thumbnailImage = helperFunctions?.getProductThumbnail(enrichedProduct);

        return {
          ...enrichedProduct,
          ...item,
          basePrice: roundOffPrice(price),
          baseSellingPrice: helperFunctions.getSellingPrice(price, item.discount),
          thumbnailImage,
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

const getAllProcessedProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const tempActiveProductData = await getAllActiveProducts();
      const customizations = await getAllCustomizations();
      const collectionData = await collectionService.getAllCollection();
      const settingStyleData = await settingStyleService.getAllSettingStyle();
      const diamondShapeList = await diamondShapeService.getAllDiamondShape();
      const menuData = await homeService.getAllMenuData();

      const activeProductData = tempActiveProductData?.map((product) => {
        const subCategoryIds = product?.subCategoryIds || [];

        return {
          ...product,
          collectionNames: product?.collectionIds?.map(
            (id) => collectionData.find((collection) => collection?.id === id)?.title
          ),
          settingStyleNamesWithImg:
            product?.settingStyleIds?.map((id) =>
              settingStyleData.find((style) => style?.id === id)
            ) || [],

          diamondFilters: product.isDiamondFilter
            ? {
                ...product?.diamondFilters,
                diamondShapes: product?.diamondFilters.diamondShapeIds?.map((shapeId) => {
                  const foundedShape = diamondShapeList?.find((shape) => shape?.id === shapeId);
                  return {
                    title: foundedShape?.title,
                    image: foundedShape?.image,
                    id: foundedShape?.id,
                  };
                }),
              }
            : product?.diamondFilters,
          categoryName:
            menuData.categories.find((category) => category.id === product.categoryId)?.title || '',
          subCategoryNames:
            subCategoryIds
              ?.map((id) => {
                const subCategory = menuData?.subCategories?.find(
                  (subCategory) => subCategory?.id === id
                );
                return subCategory ? subCategory : null;
              })
              .filter(Boolean) || [],

          productTypeNames:
            product.productTypeIds
              ?.map((id) => {
                const productType = menuData?.productTypes?.find(
                  (productType) => productType?.id === id
                );
                return productType ? productType : null;
              })
              .filter(Boolean) || [],

          variations: helperFunctions.getVariationsArray(product.variations, customizations),
        };
      });
      resolve(activeProductData);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the current admin has permission to delete products, and reject if not
      const currentUser = helperFunctions.getCurrentUser();
      if (!currentUser) {
        return reject(
          new Error('You must be logged in with appropriate permissions to delete a product.')
        );
      }
      const payload = {
        adminId: currentUser?.id,
      };
      const permissionData = await adminController.getPermissionsByAdminId(payload);
      const canDelete = permissionData.some(
        (p) => p.pageId === PRODUCT && p.actions.some((a) => a.actionId === DELETE)
      );
      if (!canDelete) {
        return reject(new Error('You do not have permission to delete this product.'));
      }

      // Sanitize and validate productId
      productId = sanitizeValue(productId) ? productId.trim() : null;
      if (!productId) {
        return reject(new Error('Invalid Id'));
      }

      // Fetch product data
      const productData = await fetchWrapperService.findOne(productsUrl, {
        id: productId,
      });
      if (!productData) {
        return reject(new Error('Product does not exist'));
      }

      // Check for showcase banner
      const showCaseBannerData = await fetchWrapperService.findOne(showCaseBannerUrl, {
        productId: productId,
      });
      if (showCaseBannerData) {
        return reject(new Error('Product cannot be deleted because it has a showcase banner'));
      }

      // Check for product slider
      const productSliderData = await fetchWrapperService.findOne(productSliderUrl, {
        productId: productId,
      });
      if (productSliderData) {
        return reject(new Error('Product cannot be deleted because it has a product slider'));
      }

      // Check if product exists in any orders
      const ordersRespData = await fetchWrapperService.getAll(ordersUrl);
      const orders = ordersRespData ? Object.values(ordersRespData) : [];
      const isProductInOrder = orders?.some(
        (order) =>
          order?.products &&
          Array.isArray(order?.products) &&
          order?.products?.some((product) => product?.productId === productId)
      );
      if (isProductInOrder) {
        return reject(
          new Error('Product cannot be deleted because it is associated with an existing order')
        );
      }

      // Collect all file URLs to delete
      const filesToDelete = extractUrlsFromMediaMapping(productData.mediaMapping || []);

      // Delete the product
      await fetchWrapperService._delete(`${productsUrl}/${productId}`);

      // Delete all files concurrently
      if (filesToDelete.length) {
        await Promise.all(
          filesToDelete.map((url) =>
            deleteFile(productStoragePath, url).catch((e) =>
              console.warn(`Failed to delete file ${url}: ${e.message}`)
            )
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

const updateProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    let newlyUploadedUrls = [];
    try {
      let {
        productId,
        productName,
        productNamePrefix,
        sku,
        saltSKU,
        discount,
        collectionIds,
        settingStyleIds,
        categoryId,
        subCategoryIds,
        productTypeIds,
        gender,
        netWeight,
        grossWeight,
        centerDiamondWeight,
        totalCaratWeight,
        sideDiamondWeight,
        Length,
        width,
        lengthUnit,
        widthUnit,
        shortDescription,
        description,
        variations,
        variComboWithQuantity,
        specifications,
        active,
        isDiamondFilter,
        diamondFilters,
        priceCalculationMode,
      } = sanitizeObject(params);

      // Check if the current admin has permission to update products, and reject if not
      const currentUser = helperFunctions.getCurrentUser();
      if (!currentUser)
        return reject(
          new Error('You must be logged in with appropriate permissions to update a product.')
        );

      const permissionData = await adminController.getPermissionsByAdminId({
        adminId: currentUser?.id,
      });
      const productPermissions = permissionData.find((perm) => perm.pageId === PRODUCT);
      const canUpdate = productPermissions?.actions?.some((action) => action.actionId === UPDATE);
      if (!canUpdate)
        return reject(new Error('You do not have permission to update this product.'));

      if (!productId) return reject(new Error('Invalid Id'));

      const productData = await fetchWrapperService.findOne(productsUrl, {
        id: productId,
      });
      if (!productData) return reject(new Error('Product data not found'));

      // Sanitize and fallback to existing data
      productName = productName ? productName.trim() : productData.productName;
      productNamePrefix = productNamePrefix
        ? productNamePrefix.trim()
        : productData?.productNamePrefix || 'none';
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
        !isNaN(centerDiamondWeight) && centerDiamondWeight !== '' && centerDiamondWeight !== null
          ? Math.round(parseFloat(centerDiamondWeight) * 100) / 100
          : 0;
      totalCaratWeight =
        !isNaN(totalCaratWeight) && totalCaratWeight !== '' && totalCaratWeight !== null
          ? Math.round(parseFloat(totalCaratWeight) * 100) / 100
          : productData?.totalCaratWeight;
      sideDiamondWeight =
        !isNaN(sideDiamondWeight) && sideDiamondWeight !== '' && sideDiamondWeight !== null
          ? Math.round(parseFloat(sideDiamondWeight) * 100) / 100
          : 0;
      Length =
        !isNaN(Length) && Length !== '' && Length !== null
          ? Math.round(parseFloat(Length) * 100) / 100
          : null;
      width =
        !isNaN(width) && width !== '' && width !== null
          ? Math.round(parseFloat(width) * 100) / 100
          : null;
      lengthUnit = lengthUnit ? lengthUnit.trim() : productData?.lengthUnit || 'mm';
      widthUnit = widthUnit ? widthUnit.trim() : productData?.widthUnit || 'mm';
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
      subCategoryIds = Array.isArray(subCategoryIds)
        ? subCategoryIds.map((id) => id?.trim())
        : productData.subCategoryIds || [];

      // Validate inputs
      const pNameErrorMsg = validateProductName(productName);
      if (pNameErrorMsg) return reject(new Error(pNameErrorMsg));

      const productNamePrefixErrorMsg = validateProductNamePrefix(productNamePrefix);
      if (productNamePrefixErrorMsg) return reject(new Error(productNamePrefixErrorMsg));

      const shortDescErrorMsg = validateShortDescription(shortDescription);
      if (shortDescErrorMsg) return reject(new Error(shortDescErrorMsg));

      if (netWeight && netWeight <= 0)
        return reject(new Error('Invalid Net Weight: Must be a positive number'));

      if (grossWeight <= 0)
        return reject(new Error('Invalid Gross Weight: Must be a positive number'));
      if (centerDiamondWeight && centerDiamondWeight <= 0)
        return reject(new Error('Invalid Center Diamond Weight: Must be a positive number'));

      if (totalCaratWeight <= 0)
        return reject(new Error('Invalid Total Carat Weight: Must be a positive number'));

      if (sideDiamondWeight && sideDiamondWeight < 0)
        return reject(new Error('Invalid Side Diamond Weight: Must be a positive number'));

      const lengthUnitErrorMsg = validateDimensionUnit(lengthUnit);
      if (lengthUnitErrorMsg) return reject(new Error(lengthUnitErrorMsg));

      const widthUnitErrorMsg = validateDimensionUnit(widthUnit);
      if (widthUnitErrorMsg) return reject(new Error(widthUnitErrorMsg));

      if (Length && Length <= 0)
        return reject(new Error('Invalid Length: Must be a positive number'));
      if (width && width <= 0) return reject(new Error('Invalid Width: Must be a positive number'));

      const lengthString = Length ? Length?.toFixed(2) : null;
      if (Length && !/^\d+\.\d{2}$/.test(lengthString)) {
        return reject(new Error('Length must have exactly two decimal places'));
      }
      const widthString = width ? width?.toFixed(2) : null;
      if (width && !/^\d+\.\d{2}$/.test(widthString)) {
        return reject(new Error('Width must have exactly two decimal places'));
      }

      if (isDiamondFilter) {
        const diamondFilterErrorMsg = validateDiamondFilters(diamondFilters);
        if (diamondFilterErrorMsg) {
          return reject(new Error(diamondFilterErrorMsg));
        }
        if (!netWeight || isNaN(netWeight)) {
          return reject(new Error('Invalid Net Weight: Must be a valid number'));
        }
        const netWeightString = netWeight.toFixed(2);
        if (!/^\d+\.\d{2}$/.test(netWeightString)) {
          return reject(new Error('Net Weight must have exactly two decimal places'));
        }

        const sideDiamondWeightString = sideDiamondWeight.toFixed(2);
        if (sideDiamondWeight && !/^\d+\.\d{2}$/.test(sideDiamondWeightString)) {
          return reject(new Error('Side Diamond Weight must have exactly two decimal places'));
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
        return reject(new Error('Product name or SKU already exists'));
      }

      // Validate arrays
      if (collectionIds?.length) {
        const hasInvalidValues = collectionIds.some((id) => !id);
        if (hasInvalidValues)
          return reject(new Error('Invalid value found in collectionIds array'));
      }
      if (settingStyleIds?.length) {
        const hasInvalidValues = settingStyleIds.some((id) => !id);
        if (hasInvalidValues)
          return reject(new Error('Invalid value found in settingStyleIds array'));
      }

      if (subCategoryIds?.length) {
        const hasInvalidValues = subCategoryIds.some((id) => !id);
        if (hasInvalidValues)
          return reject(new Error('Invalid value found in subCategoryIds array'));
      }

      if (productTypeIds?.length) {
        const hasInvalidValues = productTypeIds.some((id) => !id);
        if (hasInvalidValues)
          return reject(new Error('Invalid value found in productTypeIds array'));
      }
      if (specifications?.length) {
        const isSpecTitleValid = helperFunctions.isValidKeyName(specifications, 'title');
        const isSpecDescValid = helperFunctions.isValidKeyName(specifications, 'description');
        if (!isSpecTitleValid || !isSpecDescValid) {
          return reject(new Error('Specifications data not valid'));
        }
      }

      // Handle variations and combinations
      variations = Array.isArray(variations) ? variations : [];
      const variationsArray =
        variations.length && !isInValidVariationsArray(variations)
          ? getVariationsArray(variations)
          : productData.variations;

      variComboWithQuantity = Array.isArray(variComboWithQuantity) ? variComboWithQuantity : [];
      let variComboWithQuantityArray =
        variComboWithQuantity.length && !isInValidVariComboWithQuantityArray(variComboWithQuantity)
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

      const existingMediaMapping = productData.mediaMapping || [];

      const {
        mediaMapping: newMediaMapping,
        updatedCombos,
        filesToDelete,
        newlyUploadedUrls: NewUrls, // ← Use this for rollback
      } = await processMediaMappingFromParams({
        mediaMappingParam: params.mediaMapping || [],
        variCombos: variComboWithQuantityArray,
        productId,
        existingMediaMapping,
      });

      newlyUploadedUrls = NewUrls;

      // Prepare payload
      const payload = {
        productName,
        productNamePrefix,
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
        subCategoryIds,
        productTypeIds: Array.isArray(productTypeIds)
          ? productTypeIds?.map((id) => id?.trim())
          : productData.productTypeIds,
        gender,
        netWeight,
        grossWeight,
        totalCaratWeight,
        centerDiamondWeight,
        sideDiamondWeight,
        Length,
        width,
        lengthUnit,
        widthUnit,
        shortDescription: shortDescription
          ? shortDescription.trim()
          : productData?.shortDescription || '',
        description: description ? description.trim() : productData.description,
        variations: variationsArray,
        variComboWithQuantity: variComboWithQuantityArray,
        specifications: Array.isArray(specifications) ? specifications : productData.specifications,
        active: [true, false].includes(active) ? active : productData.active,
        priceCalculationMode,
        isDiamondFilter,
        diamondFilters: isDiamondFilter ? diamondFilters : null,
        mediaMapping: newMediaMapping,
        variComboWithQuantity: updatedCombos,
        updatedDate: Date.now(),
      };

      // Update product
      await fetchWrapperService._update({ url: `${productsUrl}/${productId}`, payload });

      // Delete old files
      if (filesToDelete.length) {
        await Promise.all(
          filesToDelete.map((url) =>
            deleteFile(productStoragePath, url).catch((e) => {
              console.warn(`Failed to delete file ${url}: ${e.message}`);
            })
          )
        );
      }

      resolve(true);
    } catch (e) {
      if (newlyUploadedUrls?.length) {
        await Promise.all(
          newlyUploadedUrls.map((url) =>
            deleteFile(productStoragePath, url).catch((e) => {
              console.warn(`Failed to delete file ${url}: ${e.message}`);
            })
          )
        );
      }
      reject(new Error(`Update failed: ${e?.message || e}`));
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
  return `${prefixSaltSku ? `${prefixSaltSku}-` : ''}${styleNo}`;
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

// ---------------------- start export feature ---------------------------------------

/**
 * Helper to chunk an array into smaller arrays
 * @param {Object} params - Parameters
 * @param {Array} params.array - Array to chunk
 * @param {number} params.chunkSize - Size of each chunk
 * @returns {Array<Array>} Array of chunks
 */
const chunkArray = ({ array, chunkSize }) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * Validates SKUs for a list of products
 * @param {Object} params - Parameters
 * @param {Array} params.data - Array of product objects
 * @returns {Array<string>} Array of error messages
 */
const validateSKUs = ({ data }) => {
  const errors = [];
  data.forEach((item, index) => {
    const keysErrors = helperFunctions.checkKeys(
      item,
      [{ key: 'sku', type: 'string' }],
      `product at index ${index}`
    );
    errors.push(...keysErrors);
  });
  return errors;
};

/**
 * Validates product names for a list of products
 * @param {Object} params - Parameters
 * @param {Array} params.data - Array of product objects
 * @returns {Array<string>} Array of error messages
 */
const validateProductNames = ({ data }) => {
  const errors = [];
  data.forEach((item, index) => {
    const keysErrors = helperFunctions.checkKeys(
      item,
      [{ key: 'productName', type: 'string' }],
      `product at index ${index}`
    );
    errors.push(...keysErrors);
  });
  return errors;
};

/**
 * Validates a numeric value to ensure it's positive or non-negative
 * @param {Object} params - Parameters
 * @param {*} params.value - Value to validate
 * @param {string} params.fieldName - Name of the field
 * @param {number} params.index - Index of the product
 * @param {string} params.sku - SKU of the product
 * @param {Object} [params.options] - Additional options
 * @param {number} [params.options.max] - Maximum allowed value
 * @param {boolean} [params.options.allowZero=false] - Allow zero value
 * @returns {string|null} Error message or null if valid
 */
const validatePositiveNumber = ({ value, fieldName, index, sku, options = {} }) => {
  const { max, allowZero = false } = options;
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'string' && /[a-zA-Z]/.test(value)) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} should be a number without units`;
  }

  const numericValue = parseFloat(value);
  if (isNaN(numericValue) || numericValue < 0 || (!allowZero && numericValue <= 0)) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must be a ${allowZero ? 'non-negative' : 'positive'} number`;
  }

  if (max && numericValue > max) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} cannot exceed ${max}`;
  }

  return null;
};

/**
 * Validates weights for a product
 * @param {Object} params - Parameters
 * @param {number} [params.netWeight] - Net weight
 * @param {number} params.grossWeight - Gross weight
 * @param {number} [params.centerDiamondWeight] - Center diamond weight
 * @param {number} params.totalCaratWeight - Total carat weight
 * @param {number} [params.sideDiamondWeight] - Side diamond weight
 * @param {number} params.index - Product index
 * @param {string} params.sku - Product SKU
 * @param {boolean} params.isDiamondFilter - Whether diamond filter is enabled
 * @returns {Array<string>} Array of error messages
 */
const validateWeights = ({
  netWeight,
  grossWeight,
  centerDiamondWeight,
  totalCaratWeight,
  sideDiamondWeight,
  index,
  sku,
  isDiamondFilter,
}) => {
  const errors = [];

  // Validate netWeight (optional, must be positive if provided)
  if (netWeight) {
    const error = validatePositiveNumber({ value: netWeight, fieldName: 'Net Weight', index, sku });
    if (error) errors.push(error);
    if (isDiamondFilter) {
      const netWeightString = safeRoundNumber({ value: netWeight }).toFixed(2);
      if (!/^\d+\.\d{2}$/.test(netWeightString)) {
        errors.push(
          `Product at index ${index} (SKU: ${sku || 'N/A'}): Net Weight must have exactly two decimal places`
        );
      }
    }
  } else if (isDiamondFilter) {
    errors.push(
      `Product at index ${index} (SKU: ${sku || 'N/A'}): Net Weight is required when diamond filter is enabled`
    );
  }

  // Validate grossWeight (required, must be positive)
  const grossWeightError = validatePositiveNumber({
    value: grossWeight,
    fieldName: 'Gross Weight',
    index,
    sku,
  });
  if (grossWeightError) errors.push(grossWeightError);
  if (!grossWeight)
    errors.push(`Product at index ${index} (SKU: ${sku || 'N/A'}): Gross Weight is required`);

  // Validate centerDiamondWeight (optional, must be positive if provided)

  if (centerDiamondWeight) {
    const error = validatePositiveNumber({
      value: centerDiamondWeight,
      fieldName: 'Center Diamond Weight',
      index,
      sku,
    });
    if (error) errors.push(error);
  }

  // Validate totalCaratWeight (required, must be positive)
  const totalCaratWeightError = validatePositiveNumber({
    value: totalCaratWeight,
    fieldName: 'Total Carat Weight',
    index,
    sku,
  });
  if (totalCaratWeightError) errors.push(totalCaratWeightError);
  if (!totalCaratWeight)
    errors.push(`Product at index ${index} (SKU: ${sku || 'N/A'}): Total Carat Weight is required`);

  // Validate sideDiamondWeight (optional, must be non-negative if provided)
  if (sideDiamondWeight) {
    const error = validatePositiveNumber({
      value: sideDiamondWeight,
      fieldName: 'Side Diamond Weight',
      index,
      sku,
      options: { allowZero: true },
    });
    if (error) errors.push(error);
    if (isDiamondFilter) {
      const sideDiamondWeightString = safeRoundNumber({ value: sideDiamondWeight }).toFixed(2);
      if (!/^\d+\.\d{2}$/.test(sideDiamondWeightString)) {
        errors.push(
          `Product at index ${index} (SKU: ${sku || 'N/A'}): Side Diamond Weight must have exactly two decimal places`
        );
      }
    }
  }

  return errors;
};

/**
 * Validates an array of objects
 * @param {Object} params - Parameters
 * @param {Array} params.array - Array to validate
 * @param {Array} params.requiredKeys - Required keys and types
 * @param {string} params.fieldName - Name of the field
 * @param {number} params.index - Product index
 * @param {string} params.sku - Product SKU
 * @param {Object} [params.options] - Additional options
 * @param {number} [params.options.minLength=0] - Minimum array length
 * @returns {Array<string>} Array of error messages
 */
const validateArrayOfObjects = ({ array, requiredKeys, fieldName, index, sku, options = {} }) => {
  const errors = [];
  const { minLength = 0 } = options;

  if (!Array.isArray(array)) {
    errors.push(`Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must be an array`);
    return errors;
  }

  if (array.length < minLength) {
    errors.push(
      `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must have at least ${minLength} item${minLength > 1 ? 's' : ''}`
    );
    return errors;
  }

  array.forEach((item, itemIndex) => {
    const itemErrors = helperFunctions.checkKeys(
      item,
      requiredKeys,
      `Item at index ${itemIndex} in ${fieldName} for Product at index ${index} (SKU: ${sku || 'N/A'})`
    );
    errors.push(...itemErrors);
  });

  return errors;
};

/**
 * Validates image details
 * @param {Object} params - Parameters
 * @param {Array} params.data - Array of image objects
 * @param {string} params.sku - Product SKU
 * @param {number} params.index - Product index
 * @returns {Array<string>} Array of error messages
 */
const validateImagesDetail = ({ data, sku, index }) => {
  const errors = [];
  const imageRequiredKeys = [{ key: 'image', type: 'string' }];
  data.forEach((image, imgIndex) => {
    const imagesErrors = helperFunctions.checkKeys(
      image,
      imageRequiredKeys,
      `Image at index ${imgIndex} in SKU ${sku} for Product at index ${index}`
    );
    errors.push(...imagesErrors);
    if (image?.image && typeof image.image === 'string') {
      if (!/^https:\/\//i.test(image.image)) {
        errors.push(
          `Image at index ${imgIndex} in SKU ${sku} for Product at index ${index}: must be a valid HTTPS URL`
        );
      }
    }
  });
  return errors;
};

/**
 * Validates a media URL (thumbnail / video)
 * @param {Object} params
 * @param {string} params.url - Media URL
 * @param {string} params.label - Label for error message (e.g. "Thumbnail", "Video")
 * @param {boolean} [params.required=true] - Whether URL is mandatory
 * @param {string} params.sku - Product SKU
 * @param {number} params.index - Product index
 * @returns {string|null} Error message or null
 */
const validateMediaUrl = ({ url, label, required = true, sku, index }) => {
  if (!url) {
    return required
      ? `Product at index ${index} (SKU: ${sku || 'N/A'}): ${label} is required`
      : null;
  }

  if (typeof url !== 'string' || !/^https:\/\//i.test(url)) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${label} must be a valid HTTPS URL`;
  }

  return null;
};

/**
 * Validates media mapping generated from Excel (thumbnail, images, video)
 * @param {Object} params - Parameters
 * @param {Array} params.mediaMapping - Parsed media mapping array from Excel
 * @param {string} params.sku - Product SKU
 * @param {number} params.index - Product index
 * @returns {Array<string>} Array of validation error messages (empty if valid)
 */
const validateMediaMappingFromExcel = ({ mediaMapping, sku, index }) => {
  const errors = [];

  if (!Array.isArray(mediaMapping) || !mediaMapping.length) {
    errors.push(
      `Product at index ${index} (SKU: ${sku || 'N/A'}): At least one media set is required`
    );
    return errors;
  }

  mediaMapping.forEach((set, setIndex) => {
    const prefix = `Product at index ${index} (SKU: ${sku || 'N/A'}), Media Set ${setIndex}`;

    if (!set.name) {
      errors.push(`${prefix}: Media set name is required`);
    }

    // Thumbnail (required)
    const thumbError = validateMediaUrl({
      url: set.thumbnailImage,
      label: `Thumbnail for "${set.name || 'Unnamed'}"`,
      required: true,
      sku,
      index,
    });
    if (thumbError) errors.push(thumbError);

    // Images (optional but strict)
    if (Array.isArray(set.images) && set.images.length > 0) {
      errors.push(
        ...validateImagesDetail({
          data: set.images,
          sku,
          index,
        })
      );
    }

    // Video (optional)
    const videoError = validateMediaUrl({
      url: set.video,
      label: `Video for "${set.name || 'Unnamed'}"`,
      required: false,
      sku,
      index,
    });
    if (videoError) errors.push(videoError);
  });

  return errors;
};

/**
 * Trims media URLs safely
 * @param {Array} mediaMapping
 * @returns {Array}
 */
const trimMediaMappingUrls = (mediaMapping = []) => {
  if (!Array.isArray(mediaMapping)) return [];

  return mediaMapping.map((set) => ({
    ...set,
    name: typeof set.name === 'string' ? set.name.trim() : set.name,

    thumbnailImage:
      typeof set.thumbnailImage === 'string' ? set.thumbnailImage.trim() : set.thumbnailImage,

    video: typeof set.video === 'string' ? set.video.trim() : set.video,

    images: Array.isArray(set.images)
      ? set.images.map((img) => ({
          ...img,
          image: typeof img.image === 'string' ? img.image.trim() : img.image,
        }))
      : [],
  }));
};

/**
 * Validates string length
 * @param {Object} params - Parameters
 * @param {string} params.value - String to validate
 * @param {string} params.fieldName - Name of the field
 * @param {number} params.index - Product index
 * @param {string} params.sku - Product SKU
 * @param {number} [params.minLength=1] - Minimum length
 * @param {number} [params.maxLength=Infinity] - Maximum length
 * @returns {string|null} Error message or null if valid
 */
const validateStringLength = ({
  value,
  minLength = 1,
  maxLength = Infinity,
  fieldName,
  index,
  sku,
}) => {
  if (!value || typeof value !== 'string') return null;
  if (value.trim().length < minLength) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must be at least ${minLength} characters long`;
  }
  if (value.trim().length > maxLength) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

/**
 * Validates an enum value
 * @param {Object} params - Parameters
 * @param {*} params.value - Value to validate
 * @param {Array} params.allowedValues - Allowed values
 * @param {string} params.fieldName - Name of the field
 * @param {number} params.index - Product index
 * @param {string} params.sku - Product SKU
 * @returns {string|null} Error message or null if valid
 */
const validateEnumValue = ({ value, allowedValues, fieldName, index, sku }) => {
  if (!allowedValues.includes(value)) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must be one of ${allowedValues.join(', ')}`;
  }
  return null;
};

/**
 * Validates dimension unit
 * @param {Object} params - Parameters
 * @param {string} params.value - Unit value
 * @param {string} params.fieldName - Name of the field
 * @param {number} params.index - Product index
 * @param {string} params.sku - Product SKU
 * @returns {string|null} Error message or null if valid
 */
const validateDimensionUnitForExcel = ({ value, fieldName, index, sku }) => {
  const validUnits = ['mm', 'in'];
  if (!value || !validUnits.includes(value.trim().toLowerCase())) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must be one of ${validUnits.join(', ')}`;
  }
  return null;
};

/**
 * Validates HTML description
 * @param {Object} params - Parameters
 * @param {string} params.description - HTML description
 * @param {number} params.index - Product index
 * @param {string} params.sku - Product SKU
 * @returns {string|null} Error message or null if valid
 */
const validateDescriptionHTML = ({ description, index, sku }) => {
  if (!description) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): Description is required`;
  }
  const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
  if (!htmlTagRegex.test(description)) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): Description must contain valid HTML tags`;
  }
  return null;
};

/**
 * Rounds a number safely to two decimal places
 * @param {Object} params - Parameters
 * @param {*} params.value - Value to round
 * @returns {number} Rounded number or 0 if invalid
 */
const safeRoundNumber = ({ value }) => {
  return !isNaN(value) && value !== '' && value !== null
    ? Math.round(parseFloat(value) * 100) / 100
    : 0;
};

/**
 * Validates an array of IDs for non-empty and valid values
 * @param {Object} params - Parameters
 * @param {Array} params.array - Array of IDs to validate
 * @param {string} params.fieldName - Name of the field for error messaging
 * @param {number} params.index - Product index
 * @param {string} params.sku - Product SKU
 * @param {boolean} [params.allowEmpty=true] - Whether empty arrays are allowed
 * @returns {string|null} Error message or null if valid
 */
const validateArrayIds = ({ array, fieldName, index, sku, allowEmpty = true }) => {
  if (!Array.isArray(array)) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} must be an array`;
  }
  if (!allowEmpty && array.length === 0) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): ${fieldName} cannot be empty`;
  }
  if (array.length && array.some((id) => !id)) {
    return `Product at index ${index} (SKU: ${sku || 'N/A'}): Invalid value found in ${fieldName} array`;
  }
  return null;
};

/**
 * Gets or creates a menu category
 * @param {Object} params - Parameters
 * @param {string} params.name - Category name
 * @param {Map} [params.cache=new Map()] - Cache for categories
 * @returns {Promise<Object>} Category object
 */
const getOrCreateMenuCategory = async ({ name, cache = new Map() }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CustomError(`Missing or empty category name`, 400);
  }
  const trimmedName = name.trim().toLowerCase();
  if (cache.has(trimmedName)) {
    return cache.get(trimmedName);
  }
  // const newCategory = await menuCategoryService.create({ name: trimmedName });
  // cache.set(trimmedName, newCategory);
  // return newCategory;

  throw new CustomError(`Category "${name}" not found`, 400);
};

/**
 * Gets or creates a subcategory
 * @param {Object} params - Parameters
 * @param {string} params.name - Subcategory name
 * @param {string} params.category - Category name
 * @param {string} params.categoryId - Category ID
 * @param {Map} params.subCategories - Subcategories map
 * @param {Map} [params.cache=new Map()] - Cache for subcategories
 * @returns {Promise<Object>} Subcategory object
 */
const getOrCreateSubCategory = async ({
  name,
  category,
  categoryId,
  subCategories,
  cache = new Map(),
}) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CustomError(`Missing or invalid subcategory name`, 400);
  }
  if (!categoryId) {
    throw new CustomError(`Missing categoryId`, 400);
  }
  if (!(subCategories instanceof Map)) {
    throw new CustomError(`subCategories must be a Map`, 400);
  }

  const trimmedName = name.trim().toLowerCase();
  const cacheKey = `${categoryId}:${trimmedName}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  if (subCategories.has(cacheKey)) {
    const subCategory = subCategories.get(cacheKey);
    cache.set(cacheKey, subCategory);
    return subCategory;
  }
  // try {
  //   const newSubCategory = await subCategoryService.create({ name: trimmedName, categoryId });
  //   cache.set(cacheKey, newSubCategory);
  //   return newSubCategory;
  // } catch (error) {
  //   console.error(
  //     `Error creating subcategory "${trimmedName}" for categoryId "${categoryId}":`,
  //     error
  //   );
  //   throw new CustomError(
  //     `Subcategory "${trimmedName}" not found or could not be created for categoryId "${categoryId}"`,
  //     400
  //   );
  // }
  throw new CustomError(`Subcategory "${name}" not found for category "${category}"`, 400);
};

/**
 * Gets or creates a product type
 * @param {Object} params - Parameters
 * @param {string} params.name - Product type name
 * @param {string} params.category - Category name
 * @param {Array<string>} params.subCategorys - Subcategory names
 * @param {string} params.categoryId - Category ID
 * @param {Array<string>} params.subCategoryIds - Subcategory IDs
 * @param {Map} params.productTypes - Product types map
 * @param {Map} [params.cache=new Map()] - Cache for product types
 * @returns {Promise<Object>} Product type object
 */
const getOrCreateProductType = async ({
  name,
  category,
  subCategorys,
  categoryId,
  subCategoryIds,
  productTypes,
  cache = new Map(),
}) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CustomError(`Missing or invalid product type name`, 400);
  }
  if (!categoryId) {
    throw new CustomError(`Missing categoryId`, 400);
  }
  if (!Array.isArray(subCategoryIds) || subCategoryIds.length === 0) {
    throw new CustomError(`subCategoryIds must be a non-empty array`, 400);
  }
  if (!(productTypes instanceof Map)) {
    throw new CustomError(`productTypes must be a Map`, 400);
  }

  const trimmedName = name.trim().toLowerCase();
  for (const subCategoryId of subCategoryIds) {
    const cacheKey = `${categoryId}:${subCategoryId}:${trimmedName}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    if (productTypes.has(cacheKey)) {
      const productType = productTypes.get(cacheKey);
      cache.set(cacheKey, productType);
      return productType;
    }
  }
  // try {
  //   const newSubCategory = await subCategoryService.create({ name: trimmedName, categoryId });
  //   cache.set(cacheKey, newSubCategory);
  //   return newSubCategory;
  // } catch (error) {
  //   console.error(
  //     `Error creating subcategory "${trimmedName}" for categoryId "${categoryId}":`,
  //     error
  //   );
  //   throw new CustomError(
  //     `Subcategory "${trimmedName}" not found or could not be created for categoryId "${categoryId}"`,
  //     400
  //   );
  // }
  // Throw error if no product type is found for any subCategoryId
  throw new CustomError(
    `Product type "${name}" not found for category "${category}" and any of its subcategories "${subCategorys.join(', ')}"`,
    400
  );
};

/**
 * Gets or creates a collection
 * @param {Object} params - Parameters
 * @param {string} params.name - Collection name
 * @param {Map} [params.cache=new Map()] - Cache for collections
 * @returns {Promise<Object>} Collection object
 */
const getOrCreateCollection = async ({ name, cache = new Map() }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CustomError(`Missing or empty collection name`, 400);
  }
  const trimmedName = name.trim().toLowerCase();
  if (cache.has(trimmedName)) {
    return cache.get(trimmedName);
  }
  throw new CustomError(`Collection "${name}" not found`, 400);

  // try {
  //   const newCollection = await collectionService.create({ name: trimmedName });
  //   cache.set(trimmedName, newCollection);
  //   return newCollection;
  // } catch (error) {
  //   console.error(`Error creating collection "${trimmedName}":`, error);
  //   throw new CustomError(`Collection "${trimmedName}" not found or could not be created`, 400);
  // }
};

/**
 * Gets or creates a setting style
 * @param {Object} params - Parameters
 * @param {string} params.name - Setting style name
 * @param {Map} [params.cache=new Map()] - Cache for setting styles
 * @returns {Promise<Object>} Setting style object
 */
const getOrCreateSettingStyle = async ({ name, cache = new Map() }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CustomError(`Missing or empty setting style name`, 400);
  }
  const trimmedName = name.trim().toLowerCase();
  if (cache.has(trimmedName)) {
    return cache.get(trimmedName);
  }
  throw new CustomError(`Setting style "${name}" not found`, 400);

  // try {
  //   const newSettingStyle = await settingStyleService.create({ name: trimmedName });
  //   cache.set(trimmedName, newSettingStyle);
  //   return newSettingStyle;
  // } catch (error) {
  //   console.error(`Error creating setting style "${trimmedName}":`, error);
  //   throw new CustomError(`Setting style "${trimmedName}" not found or could not be created`, 400);
  // }
};

/**
 * Gets or creates a customization type
 * @param {Object} params - Parameters
 * @param {string} params.name - Customization type name
 * @param {Map} [params.cache=new Map()] - Cache for customization types
 * @returns {Promise<Object>} Customization type object
 */
const getOrCreateCustomizationType = async ({ name, cache = new Map() }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CustomError(`Missing or empty customization type name`, 400);
  }
  const trimmedName = name.trim().toLowerCase();
  if (cache.has(trimmedName)) {
    return cache.get(trimmedName);
  }
  throw new CustomError(`Customization type "${name}" not found`, 400);
};

/**
 * Gets or creates a customization subtype
 * @param {Object} params - Parameters
 * @param {string} params.name - Customization subtype name
 * @param {Object} params.customizationType - Customization type object
 * @param {Map} [params.cache=new Map()] - Cache for customization subtypes
 * @returns {Promise<Object>} Customization subtype object
 */
const getOrCreateCustomizationSubType = async ({ name, customizationType, cache = new Map() }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new CustomError(`Missing or invalid customization subtype name`, 400);
  }
  if (!customizationType) {
    throw new CustomError(`Missing customizationType`, 400);
  }
  const trimmedName = name.trim().toLowerCase();
  const cacheKey = `${customizationType?.id}:${trimmedName}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  throw new CustomError(
    `Customization subtype "${name}" not found for customization type "${customizationType?.title}"`,
    400
  );
};

// Preload all data into caches
const preloadAllData = async () => {
  const caches = {
    categories: new Map(),
    subCategories: new Map(),
    productTypes: new Map(),
    collections: new Map(),
    settingStyles: new Map(),
    customizationTypes: new Map(),
    customizationSubTypes: new Map(),
  };

  try {
    // Fetch categories, subCategories, and productTypes
    const menuData = await homeService.getAllMenuData();

    menuData.categories.forEach((category) => {
      caches.categories.set(category.title.toLowerCase(), category);
    });
    menuData.subCategories.forEach((subCategory) => {
      const cacheKey = `${subCategory.categoryId}:${subCategory.title.toLowerCase()}`;
      caches.subCategories.set(cacheKey, subCategory);
    });
    menuData.productTypes.forEach((productType) => {
      const cacheKey = `${productType.categoryId}:${productType.subCategoryId}:${productType.title.toLowerCase()}`;
      caches.productTypes.set(cacheKey, productType);
    });

    // Fetch collections
    const collections = await collectionService.getAllCollection();
    collections.forEach((collection) => {
      caches.collections.set(collection.title.toLowerCase(), collection);
    });

    // Fetch setting styles
    const settingStyles = await settingStyleService.getAllSettingStyle();
    settingStyles.forEach((settingStyle) => {
      caches.settingStyles.set(settingStyle.title.toLowerCase(), settingStyle);
    });

    // Fetch customization data
    const { customizationType, customizationSubType } = await getAllCustomizations();
    customizationType.forEach((type) => {
      caches.customizationTypes.set(type.title.toLowerCase(), type);
    });
    customizationSubType.forEach((subType) => {
      const cacheKey = `${subType.customizationTypeId}:${subType.title.toLowerCase()}`;
      caches.customizationSubTypes.set(cacheKey, subType);
    });

    return caches;
  } catch (error) {
    console.error('Error preloading data:', error);
    throw new CustomError('Failed to preload data', 500);
  }
};

const createVariation = ({ matchedType, matchedSubTypes }) => ({
  variationId: matchedType.id,
  variationName: matchedType.title,
  variationTypes: matchedSubTypes.map((subType) => ({
    variationTypeId: subType.id,
    variationTypeName: subType.title,
  })),
});

const generateVariationCombinations = ({ variations }) => {
  if (!variations || !variations.length) {
    return [];
  }

  // Generate Cartesian product of variationTypes
  const combinations = variations.reduce((acc, variation) => {
    const types = variation.variationTypes.map((type) => ({
      variationId: variation.variationId,
      variationTypeId: type.variationTypeId,
    }));
    if (!acc.length) {
      return types.map((type) => [type]);
    }
    return acc.flatMap((combo) => types.map((type) => [...combo, type]));
  }, []);

  // Map combinations to variComboWithQuantity format
  return combinations.map((combination) => {
    let price = 0;

    return {
      combination,
      price,
      quantity: DEFAULT_QTY, // Default quantity, adjust if specific logic is provided
    };
  });
};

const downloadFileAsBlob = async (fileUrl) => {
  try {
    const response = await axios.get(fileUrl, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};

const uploadMediaToFirebase = async ({ media, folder, type, prefix = '' }) => {
  try {
    if (!media) return type === 'imageArray' ? [] : '';

    if (type === 'imageArray') {
      return await Promise.all(
        media.map(async (item, index) => {
          const url = typeof item === 'object' ? item.image : item;
          const blob = await downloadFileAsBlob(url);
          if (blob) {
            const file = new File([blob], `${prefix}_image_${Date.now()}_${index}.png`, {
              type: 'image/png',
            });
            const urls = await uploadFile(folder, [file]);
            return { image: urls[0] };
          }
          return typeof item === 'object' ? item : { image: url };
        })
      );
    } else {
      const blob = await downloadFileAsBlob(media);
      if (blob) {
        const ext = type === 'video' ? 'mp4' : 'png';
        const mime = type === 'video' ? 'video/mp4' : 'image/png';
        const file = new File([blob], `${prefix}_${type}_${Date.now()}.${ext}`, { type: mime });
        const urls = await uploadFile(folder, [file]);
        return urls[0];
      }
      return media || '';
    }
  } catch (error) {
    console.error(`Error uploading ${type} to Firebase:`, error);
    return type === 'imageArray' ? media : media || '';
  }
};

/**
 * Adds or updates a single product
 * @param {Object} params - Parameters
 * @param {Object} params.product - Product data
 * @param {Array} params.existingProducts - Existing products
 * @param {Array} params.customizationSubTypesList - List of customization subtypes
 * @param {number} params.priceMultiplier - Price multiplier
 * @returns {Promise<Object>} Product insert/update pattern
 */
const addUpdateProduct = async ({
  product,
  existingProducts,
  customizationSubTypesList,
  priceMultiplier,
  index = 0,
}) => {
  let newlyUploadedUrls = [];
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let {
        productName,
        sku,
        discount,
        collectionIds,
        settingStyleIds,
        categoryId,
        subCategoryIds,
        productTypeIds,
        gender,
        netWeight,
        grossWeight,
        centerDiamondWeight,
        totalCaratWeight,
        sideDiamondWeight,
        Length,
        width,
        lengthUnit,
        widthUnit,
        shortDescription,
        description,
        variations,
        specifications,
        variComboWithQuantity,
        isDiamondFilter = false,
        diamondFilters,
        priceCalculationMode,
        // NEW: Use these columns from Excel
        thumbnail: thumbnailColumn,
        images: imagesColumn,
        video: videoColumn,
      } = sanitizeObject(product);
      // Sanitize inputs
      productName = productName ? productName.trim() : null;
      sku = sku ? sku.trim() : null;
      discount = !isNaN(discount) ? Number(discount) : 0;
      collectionIds = Array.isArray(collectionIds) ? collectionIds : [];
      settingStyleIds = Array.isArray(settingStyleIds) ? settingStyleIds : [];
      categoryId = categoryId ? categoryId.trim() : null;
      subCategoryIds = Array.isArray(subCategoryIds) ? subCategoryIds : [];
      productTypeIds = Array.isArray(productTypeIds) ? productTypeIds : [];
      gender = gender ? gender.trim() : null;
      netWeight = safeRoundNumber({ value: netWeight });
      grossWeight = safeRoundNumber({ value: grossWeight });
      centerDiamondWeight = safeRoundNumber({ value: centerDiamondWeight });
      totalCaratWeight = safeRoundNumber({ value: totalCaratWeight });
      sideDiamondWeight = safeRoundNumber({ value: sideDiamondWeight });
      Length = Length ? safeRoundNumber({ value: Length }) : null;
      width = width ? safeRoundNumber({ value: width }) : null;
      lengthUnit = lengthUnit ? lengthUnit.trim() : 'mm';
      widthUnit = widthUnit ? widthUnit.trim() : 'mm';
      shortDescription = shortDescription ? shortDescription.trim() : null;
      description = description ? description.trim() : null;
      variations = Array.isArray(variations) ? variations : [];
      specifications = Array.isArray(specifications) ? specifications : [];
      variComboWithQuantity = Array.isArray(variComboWithQuantity) ? variComboWithQuantity : [];
      isDiamondFilter = isBoolean(isDiamondFilter) ? isDiamondFilter : false;
      diamondFilters = typeof diamondFilters === 'object' ? diamondFilters : {};
      priceCalculationMode = priceCalculationMode
        ? priceCalculationMode.trim()
        : PRICE_CALCULATION_MODES.AUTOMATIC;

      // Validate required fields
      const requiredFields = {
        productName,
        sku,
        categoryId,
        description,
        variations,
        variComboWithQuantity,
        priceCalculationMode,
        thumbnailColumn,
        imagesColumn,
      };
      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) =>
          ['variations', 'variComboWithQuantity'].includes(key) ? !value.length : !value
        )
        .map(([key]) => key);
      if (
        missingFields.length ||
        ![PRICE_CALCULATION_MODES.AUTOMATIC, PRICE_CALCULATION_MODES.MANUAL].includes(
          priceCalculationMode
        )
      ) {
        reject(
          new Error(`Invalid Data: Missing or invalid required fields: ${missingFields.join(', ')}`)
        );
        return;
      }

      // Validate array IDs
      const arrayIdValidations = [
        { array: collectionIds, fieldName: 'collectionIds' },
        { array: settingStyleIds, fieldName: 'settingStyleIds' },
        { array: subCategoryIds, fieldName: 'subCategoryIds' },
        { array: productTypeIds, fieldName: 'productTypeIds' },
      ];
      const arrayIdErrors = arrayIdValidations
        .map(({ array, fieldName }) =>
          validateArrayIds({ array, fieldName, index, sku, allowEmpty: true })
        )
        .filter(Boolean);
      if (arrayIdErrors.length) {
        reject(new Error(arrayIdErrors.join('; ')));
        return;
      }

      // Validate weights
      const weightErrors = validateWeights({
        netWeight,
        grossWeight,
        centerDiamondWeight,
        totalCaratWeight,
        sideDiamondWeight,
        index,
        sku,
        isDiamondFilter,
      });
      if (weightErrors.length) {
        reject(new Error(weightErrors.join('; ')));
        return;
      }

      // Validate dimensions
      const dimensionErrors = [
        validateDimensionUnitForExcel({
          value: lengthUnit,
          fieldName: 'Length unit',
          index,
          sku,
        }),
        validateDimensionUnitForExcel({ value: widthUnit, fieldName: 'Width unit', index, sku }),
        validatePositiveNumber({ value: Length, fieldName: 'Length', index, sku }),
        validatePositiveNumber({ value: width, fieldName: 'Width', index, sku }),
      ].filter(Boolean);

      if (dimensionErrors.length) {
        reject(new Error(dimensionErrors.join('; ')));
        return;
      }

      if (Length) {
        const lengthString = Length.toFixed(2);
        if (!/^\d+\.\d{2}$/.test(lengthString)) {
          reject(new Error('Length must have exactly two decimal places'));
          return;
        }
      }

      if (width) {
        const widthString = width.toFixed(2);
        if (!/^\d+\.\d{2}$/.test(widthString)) {
          reject(new Error('Width must have exactly two decimal places'));
          return;
        }
      }

      // Additional validations
      const additionalErrors = [];
      const pNameErrorMsg = validateProductName(productName);
      if (pNameErrorMsg) additionalErrors.push(pNameErrorMsg);

      const shortDescErrorMsg = validateShortDescription(shortDescription);
      if (shortDescErrorMsg) additionalErrors.push(shortDescErrorMsg);

      if (isInValidVariationsArray(variations)) {
        additionalErrors.push('Variations data not valid');
      }

      if (isInValidVariComboWithQuantityArray(variComboWithQuantity)) {
        additionalErrors.push('Combination data not valid');
      }

      if (additionalErrors.length) {
        reject(new Error(additionalErrors.join('; ')));
        return;
      }

      // Validate specifications
      const specificationsError = validateArrayOfObjects({
        array: specifications,
        requiredKeys: [
          { key: 'title', type: 'string' },
          { key: 'description', type: 'string' },
        ],
        fieldName: 'Specifications',
        index,
        sku,
      });
      if (specificationsError.length) mergeErrorArr.push(...specificationsError);

      // === Parse media from Excel columns ===
      let parsedMediaSets = helperFunctions.generateMediaMappingForExcel({
        thumbnail: thumbnailColumn,
        images: imagesColumn,
        video: videoColumn,
        variations,
      });

      parsedMediaSets = trimMediaMappingUrls(parsedMediaSets);

      // === Validate from Excel ===
      const mediaErrors = validateMediaMappingFromExcel({
        mediaMapping: parsedMediaSets,
        sku,
        index,
      });

      if (mediaErrors.length) {
        return reject(new Error(mediaErrors.join('; ')));
      }

      if (!parsedMediaSets || parsedMediaSets.length === 0) {
        return reject(
          new Error(
            `Product at index ${index} (SKU: ${sku}): At least one media set with thumbnail is required`
          )
        );
      }

      //  === Check for duplicate SKU ===
      const existingProduct = existingProducts.find(
        (p) => p?.sku?.toUpperCase() === sku?.toUpperCase()
      );
      if (existingProduct) {
        return reject(new Error(`Product with SKU "${sku}" already exists`));
      }

      // === Upload all media files ===
      const folder = productStoragePath;
      const uploadedMediaMapping = await Promise.all(
        parsedMediaSets.map(async (set) => {
          const { mediaSetId, name = 'Unnamed', thumbnailImage, images = [], video } = set;

          let uploadedThumbnail = '';
          if (thumbnailImage) {
            uploadedThumbnail = await uploadMediaToFirebase({
              media: thumbnailImage,
              folder,
              type: 'thumbnail',
              prefix: name.replace(/[^a-zA-Z0-9]/g, '_'),
            });

            if (uploadedThumbnail) newlyUploadedUrls.push(uploadedThumbnail);
          }

          const uploadedImages =
            images.length > 0
              ? await uploadMediaToFirebase({
                  media: images.map((i) => i.image),
                  folder,
                  type: 'imageArray',
                  prefix: name.replace(/[^a-zA-Z0-9]/g, '_'),
                })
              : [];
          uploadedImages.forEach((img) => img.image && newlyUploadedUrls.push(img.image));

          let uploadedVideo = '';
          if (video) {
            uploadedVideo = await uploadMediaToFirebase({
              media: video,
              folder,
              type: 'video',
              prefix: name.replace(/[^a-zA-Z0-9]/g, '_'),
            });
            if (uploadedVideo) newlyUploadedUrls.push(uploadedVideo);
          }

          return {
            mediaSetId,
            name,
            thumbnailImage: uploadedThumbnail || '',
            images: uploadedImages,
            video: uploadedVideo || '',
          };
        })
      );

      // === Process variations & combinations ===
      const variationsArray = getVariationsArray(variations);

      let variComboWithQuantityArray = getVariComboWithQuantityArray(variComboWithQuantity);

      // Apply automatic pricing
      if (priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC) {
        variComboWithQuantityArray = helperFunctions.calculateAutomaticPrices({
          combinations: variComboWithQuantityArray,
          customizationSubTypesList,
          grossWeight,
          totalCaratWeight,
          priceMultiplier,
        });
      }

      // === Match media sets to combos using name (e.g., "Round + Rose Gold") ===
      // Then generate deterministic mediaSetId using only Shape + Color variationTypeIds
      const diamondShapeVariation = variations.find((v) => v.variationName === DIAMOND_SHAPE.title);
      const goldColorVariation = variations.find((v) => v.variationName === GOLD_COLOR.title);

      const finalMediaMapping = [];
      const finalUpdatedCombos = variComboWithQuantityArray.map((combo) => {
        // Extract Shape and Color from this combo
        let shapeTypeId = null;
        let colorTypeId = null;

        combo.combination.forEach((item) => {
          if (item.variationId === diamondShapeVariation.variationId) {
            shapeTypeId = item.variationTypeId;
          } else if (item.variationId === goldColorVariation.variationId) {
            colorTypeId = item.variationTypeId;
          }
        });

        if (!shapeTypeId || !colorTypeId) {
          // Skip or handle incomplete combo
          return { ...combo, mediaSetId: null };
        }

        // Generate deterministic mediaSetId using only Shape + Color
        const mediaSetId = helperFunctions.generateMediaSetId([
          { variationTypeId: shapeTypeId },
          { variationTypeId: colorTypeId },
        ]);

        // Find matching uploaded media set by name
        const matchedMediaSet = uploadedMediaMapping.find(
          (set) => set.mediaSetId.includes(shapeTypeId) && set.mediaSetId.includes(colorTypeId)
        );

        // Add to final mediaMapping if not already added
        if (matchedMediaSet && !finalMediaMapping.some((m) => m.mediaSetId === mediaSetId)) {
          finalMediaMapping.push({
            mediaSetId,
            name: matchedMediaSet.name,
            thumbnailImage: matchedMediaSet.thumbnailImage,
            images: matchedMediaSet.images,
            video: matchedMediaSet.video || '',
          });
        }

        return {
          ...combo,
          mediaSetId,
        };
      });

      const saltSKU = generateSaltSKU({ styleNo: sku });

      const insertPattern = {
        id: uuid,
        productName,
        sku,
        saltSKU,
        discount,
        collectionIds: collectionIds.map((id) => id?.trim()),
        settingStyleIds: settingStyleIds.map((id) => id?.trim()),
        categoryId,
        subCategoryIds: subCategoryIds.map((id) => id?.trim()),
        productTypeIds: productTypeIds.map((id) => id?.trim()),
        gender,
        netWeight,
        grossWeight,
        totalCaratWeight,
        centerDiamondWeight,
        sideDiamondWeight,
        Length,
        width,
        lengthUnit,
        widthUnit,
        shortDescription,
        description,
        variations: variationsArray,
        variComboWithQuantity: finalUpdatedCombos,
        mediaMapping: finalMediaMapping,
        isDiamondFilter,
        diamondFilters: isDiamondFilter ? diamondFilters : null,
        specifications,
        priceCalculationMode,
        active: false,
        salesTaxPercentage: 0,
        shippingCharge: 0,
        totalReviews: 0,
        starRating: 0,
        totalStar: 0,
        createdDate: Date.now(),
        updatedDate: Date.now(),
      };

      resolve({ insertPattern, url: `${productsUrl}/${uuid}`, newlyUploadedUrls });
    } catch (e) {
      // Cleanup all uploaded files if any error occurs
      if (newlyUploadedUrls.length > 0) {
        console.warn(`Product failed → deleting ${newlyUploadedUrls.length} uploaded files`);
        await Promise.all(
          newlyUploadedUrls.map((url) =>
            deleteFile(productStoragePath, url).catch((err) =>
              console.error(`Cleanup failed: ${url}`, err)
            )
          )
        );
      }
      reject(e);
    }
  });
};

/**
 * Adds or updates multiple products
 * @param {Object} params - Parameters
 * @param {Array} params.productsList - List of products
 * @returns {Promise<string>} Success message or throws error
 */
const addUpdateManyProducts = async ({ productsList }) => {
  return new Promise(async (resolve, reject) => {
    const allUploadedUrls = new Set();
    try {
      if (!Array.isArray(productsList) || !productsList.length) {
        throw new CustomError('Invalid Data: No products provided', 400);
      }

      if (productsList?.length > 10) {
        throw new CustomError(
          'Too Many Products: Cannot process more than 10 products at a time',
          400
        );
      }

      // Validate SKUs and product names
      const skuErrors = validateSKUs({ data: productsList });
      if (skuErrors.length) {
        throw new CustomError('SKU validation errors', 400, skuErrors);
      }

      const duplicateSKUs = helperFunctions.findDuplicates(productsList, 'sku');
      if (duplicateSKUs.length) {
        throw new CustomError('Some products have duplicate SKUs', 400, duplicateSKUs);
      }

      const productNameErrors = validateProductNames({ data: productsList });
      if (productNameErrors.length) {
        throw new CustomError('Product Name validation errors', 400, productNameErrors);
      }

      const duplicateProductNames = helperFunctions.findDuplicates(productsList, 'productName');
      if (duplicateProductNames.length) {
        throw new CustomError(
          'Some products have duplicate product names',
          400,
          duplicateProductNames
        );
      }

      const mergeErrorArr = [];

      // Process products in chunks
      const CHUNK_SIZE = 100;
      const productChunks = chunkArray({ array: productsList, chunkSize: CHUNK_SIZE });

      for (let chunkIndex = 0; chunkIndex < productChunks.length; chunkIndex++) {
        const chunk = productChunks[chunkIndex];
        const chunkOffset = chunkIndex * CHUNK_SIZE;

        chunk.forEach((product, index) => {
          const absoluteIndex = chunkOffset + index;
          const {
            productName,
            sku,
            categoryName,
            description,
            variations,
            grossWeight,
            totalCaratWeight,
            netWeight,
            centerDiamondWeight,
            sideDiamondWeight,
            Length,
            lengthUnit,
            width,
            widthUnit,
            priceCalculationMode,
            specifications,
            subCategoryNames,
            productTypeNames,
            collectionNames,
            settingsStyleNames,
            gender,
            discount,
            shortDescription,
            isDiamondFilter,
          } = product;

          const finalLengthUnit = lengthUnit || 'mm';
          const finalWidthUnit = widthUnit || 'mm';
          const finalPriceCalculationMode =
            priceCalculationMode || PRICE_CALCULATION_MODES.AUTOMATIC;

          // Validate strings
          const stringValidations = [
            { value: productName, fieldName: 'Product name', minLength: 1, maxLength: 255 },
            {
              value: shortDescription,
              fieldName: 'Short description',
              minLength: 1,
              maxLength: 250,
            },
          ];
          stringValidations.forEach(({ value, fieldName, minLength, maxLength }) => {
            const error = validateStringLength({
              value,
              fieldName,
              index: absoluteIndex,
              sku,
              minLength,
              maxLength,
            });
            if (error) mergeErrorArr.push(error);
          });

          const pNameErrorMsg = validateProductName(productName);
          if (pNameErrorMsg)
            mergeErrorArr.push(
              `Product at index ${absoluteIndex} (SKU: ${sku || 'N/A'}): ${pNameErrorMsg}`
            );

          const shortDescErrorMsg = validateShortDescription(shortDescription);
          if (shortDescErrorMsg)
            mergeErrorArr.push(
              `Product at index ${absoluteIndex} (SKU: ${sku || 'N/A'}): ${shortDescErrorMsg}`
            );

          // Validate required fields
          if (!sku) mergeErrorArr.push(`Product at index ${absoluteIndex}: SKU is required`);
          if (!categoryName)
            mergeErrorArr.push(`Product at index ${absoluteIndex}: Category name is required`);

          // Validate array IDs
          const arrayIdValidations = [
            { array: subCategoryNames || [], fieldName: 'Sub category names', allowEmpty: true },
            { array: productTypeNames || [], fieldName: 'Product type names', allowEmpty: true },
            { array: collectionNames || [], fieldName: 'Collection names', allowEmpty: true },
            {
              array: settingsStyleNames || [],
              fieldName: 'Settings style names',
              allowEmpty: true,
            },
          ];

          arrayIdValidations.forEach(({ array, fieldName, allowEmpty }) => {
            const error = validateArrayIds({
              array,
              fieldName,
              index: absoluteIndex,
              sku,
              allowEmpty,
            });
            if (error) mergeErrorArr.push(error);
          });

          // Validate variations
          const variationsError = validateArrayOfObjects({
            array: variations,
            requiredKeys: [
              { key: 'variationName', type: 'string' },
              { key: 'variationTypes', type: 'array' },
            ],
            fieldName: 'Variations',
            index: absoluteIndex,
            sku,
            options: { minLength: 1 },
          });
          if (variationsError.length) mergeErrorArr.push(...variationsError);

          variations?.forEach((variation, variationIndex) => {
            if (Array.isArray(variation.variationTypes)) {
              const variationTypeErrors = validateArrayOfObjects({
                array: variation.variationTypes,
                requiredKeys: [{ key: 'variationTypeName', type: 'string' }],
                fieldName: `Variation Types for ${variation.variationName}`,
                index: variationIndex,
                sku,
                options: { minLength: 1 },
              });
              if (variationTypeErrors.length) mergeErrorArr.push(...variationTypeErrors);
            }
          });

          // Validate description
          const descriptionError = validateDescriptionHTML({
            description,
            index: absoluteIndex,
            sku,
          });
          if (descriptionError) mergeErrorArr.push(descriptionError);

          // Validate discount
          const discountError = validatePositiveNumber({
            value: discount,
            fieldName: 'Discount',
            index: absoluteIndex,
            sku,
            options: { max: 100 },
          });
          if (discountError) mergeErrorArr.push(discountError);

          // Validate weights
          const weightErrors = validateWeights({
            netWeight,
            grossWeight,
            centerDiamondWeight,
            totalCaratWeight,
            sideDiamondWeight,
            index: absoluteIndex,
            sku,
            isDiamondFilter,
          });
          mergeErrorArr.push(...weightErrors);

          // Validate dimensions
          const dimensionErrors = [
            validatePositiveNumber({
              value: Length,
              fieldName: 'Length',
              index: absoluteIndex,
              sku,
            }),
            validatePositiveNumber({ value: width, fieldName: 'Width', index: absoluteIndex, sku }),
            validateDimensionUnitForExcel({
              value: finalLengthUnit,
              fieldName: 'Length unit',
              index: absoluteIndex,
              sku,
            }),
            validateDimensionUnitForExcel({
              value: finalWidthUnit,
              fieldName: 'Width unit',
              index: absoluteIndex,
              sku,
            }),
          ].filter(Boolean);

          mergeErrorArr.push(...dimensionErrors);

          if (Length) {
            const lengthString = safeRoundNumber({ value: Length }).toFixed(2);
            if (!/^\d+\.\d{2}$/.test(lengthString)) {
              mergeErrorArr.push(
                `Product at index ${absoluteIndex} (SKU: ${sku || 'N/A'}): Length must have exactly two decimal places`
              );
            }
          }

          if (width) {
            const widthString = safeRoundNumber({ value: width }).toFixed(2);
            if (!/^\d+\.\d{2}$/.test(widthString)) {
              mergeErrorArr.push(
                `Product at index ${absoluteIndex} (SKU: ${sku || 'N/A'}): Width must have exactly two decimal places`
              );
            }
          }

          // Validate price calculation mode
          const priceCalcError = validateEnumValue({
            value: finalPriceCalculationMode,
            allowedValues: [PRICE_CALCULATION_MODES.AUTOMATIC, PRICE_CALCULATION_MODES.MANUAL],
            fieldName: 'Price calculation mode',
            index: absoluteIndex,
            sku,
          });
          if (priceCalcError) mergeErrorArr.push(priceCalcError);

          // Validate gender
          if (gender) {
            const genderError = validateEnumValue({
              value: gender,
              allowedValues: allowedGenders,
              fieldName: 'Gender',
              index: absoluteIndex,
              sku,
            });
            if (genderError) mergeErrorArr.push(genderError);
          }

          // Validate specifications
          const specificationsError = validateArrayOfObjects({
            array: specifications,
            requiredKeys: [
              { key: 'title', type: 'string' },
              { key: 'description', type: 'string' },
            ],
            fieldName: 'Specifications',
            index: absoluteIndex,
            sku,
          });
          if (specificationsError.length) mergeErrorArr.push(...specificationsError);

          // Validate ring size for RING category
          if (subCategoryNames?.includes(RINGS)) {
            const ringSizeVariation = variations.find((v) => v.variationName === 'Ring Size');
            if (!ringSizeVariation || !ringSizeVariation.variationTypes?.length) {
              mergeErrorArr.push(
                `Product at index ${absoluteIndex} (SKU: ${sku || 'N/A'}): Ring Size variation is required for ${RINGS} category`
              );
            }
          }
        });
      }

      if (mergeErrorArr.length) {
        throw new CustomError('Validation errors', 400, mergeErrorArr);
      }

      // Preload data
      const caches = await preloadAllData();

      // Fetch price multiplier
      const priceMultiplier = await settingsService.fetchPriceMultiplier();
      if (!Number.isFinite(priceMultiplier) || priceMultiplier <= 0) {
        throw new CustomError('Invalid priceMultiplier fetched from settings', 400);
      }

      // Map products
      const mappedProductsList = await Promise.all(
        productsList.map(async (product, index) => {
          const sku = product?.sku;
          try {
            const category = await getOrCreateMenuCategory({
              name: product.categoryName,
              cache: caches.categories,
            });
            if (!category?.id) {
              throw new CustomError(`Invalid category "${product.categoryName}"`, 400);
            }
            const categoryId = category.id;

            const subCategoryIds = await Promise.all(
              (product.subCategoryNames || []).map(async (name) => {
                const subCategory = await getOrCreateSubCategory({
                  name,
                  category: product.categoryName,
                  categoryId,
                  subCategories: caches.subCategories,
                  cache: caches.subCategories,
                });
                return subCategory.id;
              })
            );

            const productTypeIds = await Promise.all(
              (product.productTypeNames || []).map(async (name) => {
                const productTypeIdsForName = await Promise.all(
                  subCategoryIds.map(async (subCategoryId) => {
                    const productType = await getOrCreateProductType({
                      name,
                      category: product.categoryName,
                      subCategorys: product.subCategoryNames,
                      categoryId,
                      subCategoryIds,
                      productTypes: caches.productTypes,
                      cache: caches.productTypes,
                    });
                    return productType.id;
                  })
                );
                return productTypeIdsForName;
              })
            ).then((ids) => ids.flat().filter((id) => id));

            const collectionIds = await Promise.all(
              (product.collectionNames || []).map(async (name) => {
                const collection = await getOrCreateCollection({ name, cache: caches.collections });
                return collection.id;
              })
            );

            const settingStyleIds = await Promise.all(
              (product.settingStyleNames || []).map(async (name) => {
                const settingStyle = await getOrCreateSettingStyle({
                  name,
                  cache: caches.settingStyles,
                });
                return settingStyle.id;
              })
            );

            let hasDiamondShape = false;
            let hasGoldColor = false;

            const variationsArray = await Promise.all(
              (product.variations || []).map(async (variation) => {
                const matchedType = await getOrCreateCustomizationType({
                  name: variation.variationName,
                  cache: caches.customizationTypes,
                });

                if (matchedType?.title === DIAMOND_SHAPE.title) {
                  hasDiamondShape = true;
                }

                if (matchedType?.title === GOLD_COLOR.title) {
                  hasGoldColor = true;
                }

                const matchedSubTypes = await Promise.all(
                  (variation.variationTypes || []).map(async (type) => {
                    return getOrCreateCustomizationSubType({
                      name: type.variationTypeName,
                      customizationType: matchedType,
                      cache: caches.customizationSubTypes,
                    });
                  })
                );
                return createVariation({ matchedType, matchedSubTypes });
              })
            );

            if (!hasDiamondShape || !hasGoldColor) {
              return reject(
                new Error(
                  `Product at index ${index} (SKU: ${sku}): Must have Diamond Shape and Gold Color variations`
                )
              );
            }

            const variComboWithQuantity = generateVariationCombinations({
              variations: variationsArray,
            });

            return {
              ...product,
              categoryId,
              subCategoryIds,
              productTypeIds,
              collectionIds,
              settingStyleIds,
              sku,
              variations: variationsArray,
              variComboWithQuantity,
            };
          } catch (error) {
            throw new CustomError(`Product at index ${index} (SKU: ${sku}): ${error.message}`, 400);
          }
        })
      );

      // Process products
      const existingProducts = await getAllProductsWithPagging();
      // === Process each product individually ===
      const productPromises = mappedProductsList.map(async (product, idx) => {
        try {
          const result = await addUpdateProduct({
            product,
            existingProducts,
            customizationSubTypesList: Array.from(caches.customizationSubTypes.values()),
            priceMultiplier,
            index: idx,
          });
          // Collect all uploaded URLs from this product
          if (result.newlyUploadedUrls?.length) {
            result.newlyUploadedUrls.forEach((url) => allUploadedUrls.add(url));
          }
          return result;
        } catch (error) {
          return {
            error: error.message,
            product: { sku: product.sku || 'N/A', index: idx },
          };
        }
      });

      const results = await Promise.all(productPromises);

      const validPatterns = results.filter((pattern) => pattern && !pattern.error);
      const invalidPatterns = results.filter((pattern) => pattern && pattern.error);

      if (!invalidPatterns.length && validPatterns.length) {
        await fetchWrapperService.createMany(validPatterns);
      }

      if (invalidPatterns.length) {
        const updatedInvalidPatternArr = invalidPatterns.map((x) => ({
          ...x,
          product: { sku: x.product.sku || 'N/A', index: x.product.index },
        }));
        mergeErrorArr.push(
          ...updatedInvalidPatternArr.map(
            (p) =>
              `${p.error.includes('Product at index') ? p.error : `Product at index ${p.product.index} (SKU: ${p.product.sku}): ${p.error}`}`
          )
        );
      }

      if (mergeErrorArr.length) {
        // === Final rollback on any error ===
        if (allUploadedUrls.size > 0) {
          console.warn(`Import failed → rolling back ${allUploadedUrls.size} media files`);
          await Promise.all(
            Array.from(allUploadedUrls).map((url) =>
              deleteFile(productStoragePath, url).catch((err) =>
                console.warn(`Final rollback failed for ${url}:`, err)
              )
            )
          );
        }
        throw new CustomError('Some products failed to create/update', 400, mergeErrorArr);
      }

      resolve('All items created/updated successfully');
    } catch (e) {
      // === Final rollback on any error ===
      if (allUploadedUrls.size > 0) {
        console.warn(`Import failed → rolling back ${allUploadedUrls.size} media files`);
        await Promise.all(
          Array.from(allUploadedUrls).map((url) =>
            deleteFile(productStoragePath, url).catch((err) =>
              console.warn(`Final rollback failed for ${url}:`, err)
            )
          )
        );
      }

      if (e instanceof CustomError && Array.isArray(e.details)) {
        reject(e); // Already has detailed errors
      } else {
        reject(e instanceof Error ? e : new Error(`Import failed: ${e?.message || e}`));
      }
    }
  });
};

// ------------------------- end export feature ----------------------------------------

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
  try {
    // Validate input parameters
    if (
      !product ||
      !Number.isFinite(priceMultiplier) ||
      priceMultiplier <= 0 ||
      !Array.isArray(product.variComboWithQuantity) ||
      !product.variComboWithQuantity.length
    ) {
      throw new Error(
        "Invalid inputs: 'product' must have valid 'variComboWithQuantity', 'priceMultiplier' must be a positive number."
      );
      // console.error(
      //   "Invalid inputs: 'product' must have valid 'variComboWithQuantity', 'priceMultiplier' must be a positive number."
      // );
      // return product;
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
  } catch (error) {
    throw new Error(error?.message);
  }
};

const getProductsByIds = (productIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(productIds) || !productIds.length) {
        resolve([]);
        return;
      }

      const productsByIds = await fetchWrapperService.getItemsByIds({
        url: productsUrl,
        itemIds: productIds,
      });

      resolve(productsByIds);
    } catch (e) {
      reject(e);
    }
  });
};

export const productService = {
  insertProduct,
  getAllProductsWithPagging,
  getAllActiveProducts,
  deleteProduct,
  getSingleProduct,
  activeDeactiveProduct,
  updateProduct,
  searchProducts,
  updateProductQtyForReturn,
  updateSingleProductPrice,
  getProductsByIds,
  getAllProcessedProducts,
  addUpdateManyProducts,
};
