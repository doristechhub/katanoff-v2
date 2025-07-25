import { ALLOWED_DIA_CLARITIES, ALLOWED_DIA_COLORS } from 'src/_helpers/constants';
import {
  customProductsSettingsUrl,
  fetchWrapperService,
  priceMultiplierUrl,
  sanitizeObject,
} from '../_helpers';
import { customizationSubTypeService } from './customizationSubType.service';
import { productService } from './product.service';
import { uid } from 'uid';

const fetchPriceMultiplier = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(priceMultiplierUrl);
      const fetchPriceMultiplier = respData ? respData?.priceMultiplier : null;
      resolve(fetchPriceMultiplier);
    } catch (e) {
      reject(e);
    }
  });
};

const upsertPriceMultiplier = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { priceMultiplier } = sanitizeObject(params);

      priceMultiplier =
        !isNaN(priceMultiplier) && priceMultiplier !== '' && priceMultiplier !== null
          ? Math.round(parseFloat(priceMultiplier) * 100) / 100
          : 0;
      if (priceMultiplier <= 0) {
        reject(new Error('Price multiplier must be a positive number'));
        return;
      }

      const payload = {
        priceMultiplier,
      };

      // Check if price multiplier exists
      const existingMultiplier = await fetchPriceMultiplier().catch(() => null);
      const exists = existingMultiplier !== null;

      const config = {
        url: priceMultiplierUrl,
        payload,
      };

      if (exists) {
        // Update existing price multiplier
        await fetchWrapperService
          ._update(config)
          .then(async () => {
            const allSubTypes = await customizationSubTypeService.getAllSubTypes();
            const allProducts = await productService.getAllProductsWithPagging();

            for (const product of allProducts) {
              await productService.updateSingleProductPrice({
                product,
                priceMultiplier,
                allSubTypes,
              });
            }

            resolve(priceMultiplier);
          })
          .catch(() => {
            reject(new Error('An error occurred during price multiplier update.'));
          });
      } else {
        // Create new price multiplier
        await fetchWrapperService
          .create({ url: priceMultiplierUrl, insertPattern: payload })
          .then(() => {
            resolve(priceMultiplier);
          })
          .catch(() => {
            reject(new Error('An error occurred during price multiplier creation.'));
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const fetchCustomizedSettings = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(customProductsSettingsUrl);
      const customizedSettings = respData ? respData : null;
      resolve(customizedSettings);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Utility function to validate and round a numeric value
 * @param {any} value - Input value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @param {boolean} allowZero - Whether zero is allowed
 * @returns {number} Rounded value
 * @throws {Error} If validation fails
 */
const validateAndRoundNumber = (value, fieldName, allowZero = true) => {
  const num = parseFloat(value);
  if (isNaN(num) || value === '' || value === null) {
    return 0;
  }
  if ((allowZero && num < 0) || (!allowZero && num <= 0)) {
    throw new Error(`${fieldName} must be a ${allowZero ? 'non-negative' : 'positive'} number`);
  }
  return Math.round(num * 100) / 100;
};

/**
 * Utility function to validate an array for duplicates and minimum length
 * @param {Array} array - Array to validate
 * @param {string} arrayName - Name of the array for error messages
 * @param {string} idField - Field to check for duplicates (e.g., 'id')
 * @returns {Set} Set of IDs to track duplicates
 * @throws {Error} If duplicates or invalid array found
 */
const validateArrayNoDuplicates = (array, arrayName, idField = 'id') => {
  const idSet = new Set();
  for (const item of array) {
    if (!item[idField]) item[idField] = uid();
    if (idSet.has(item[idField])) {
      throw new Error(`Duplicate ${arrayName} ${idField} detected`);
    }
    idSet.add(item[idField]);
  }
  return idSet;
};

/**
 * Utility function to validate compatible options
 * @param {Array} compatibleOptions - Array of compatible options
 * @param {string} parentName - Name of the parent entity (e.g., 'diamond color')
 * @param {string} optionType - Type of options (e.g., 'color')
 * @param {Set} globalOptions - Set to track global duplicates
 * @param {Array<string>} allowedValues - Allowed values for compatible options
 * @throws {Error} If validation fails
 */
const validateCompatibleOptions = (
  compatibleOptions,
  parentName,
  optionType,
  globalOptions,
  allowedValues
) => {
  if (!Array.isArray(compatibleOptions)) {
    throw new Error(`Each ${parentName} must have an array of compatible ${optionType}s`);
  }
  if (compatibleOptions.length === 0) {
    throw new Error(`Each ${parentName} must have at least one compatible ${optionType}`);
  }
  const localOptions = new Set(compatibleOptions);
  if (localOptions.size !== compatibleOptions.length) {
    throw new Error(`Duplicate compatible ${optionType} options detected within a ${parentName}`);
  }
  for (const option of compatibleOptions) {
    if (!allowedValues.includes(option)) {
      throw new Error(
        `Invalid ${optionType} option '${option}' in ${parentName}. Allowed values are: ${allowedValues.join(', ')}`
      );
    }
    if (globalOptions.has(option)) {
      throw new Error(
        `Duplicate compatible ${optionType} option '${option}' detected across ${parentName}s`
      );
    }
    globalOptions.add(option);
  }
};

/**
 * Utility function to validate carat ranges
 * @param {Array} caratRanges - Array of carat range objects
 * @returns {Set} Set of range keys to track duplicates
 */
const validateCaratRanges = (caratRanges) => {
  const rangeSet = new Set();
  for (const range of caratRanges) {
    if (!range.id) range.id = uid();
    range.minCarat = validateAndRoundNumber(range.minCarat, 'Minimum carat');
    range.maxCarat = validateAndRoundNumber(range.maxCarat, 'Maximum carat');
    range.pricePerCarat = validateAndRoundNumber(
      range.pricePerCarat,
      'Carat range price per carat'
    );

    if (range.minCarat >= range.maxCarat) {
      throw new Error('Minimum carat must be less than maximum carat');
    }

    const rangeKey = `${range.minCarat}-${range.maxCarat}`;
    if (rangeSet.has(rangeKey)) {
      throw new Error('Duplicate carat range error');
    }
    rangeSet.add(rangeKey);

    for (const existingRange of caratRanges) {
      if (existingRange.id === range.id) continue;
      const existingMin = parseFloat(existingRange.minCarat);
      const existingMax = parseFloat(existingRange.maxCarat);
      if (
        (range.minCarat >= existingMin && range.minCarat <= existingMax) ||
        (range.maxCarat >= existingMin && range.maxCarat <= existingMax) ||
        (range.minCarat <= existingMin && range.maxCarat >= existingMax)
      ) {
        throw new Error('Overlapping carat ranges detected');
      }
    }
  }
  return rangeSet;
};

/**
 * Main function to upsert customized settings
 * @param {Object} params - Input parameters
 * @returns {Promise<Object>} Customized settings payload
 */
const upsertCustomizedSettings = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Sanitize and destructure params
      const {
        customProductPriceMultiplier: inputCustomMultiplier,
        sideDiamondPricePerCarat: inputSideDiamondPrice,
        metalPricePerGram: inputMetalPrice,
        diamondColors: inputDiamondColors,
        diamondClarities: inputDiamondClarities,
        caratRanges: inputCaratRanges,
      } = sanitizeObject(params);

      // Validate numeric fields
      const customProductPriceMultiplier = validateAndRoundNumber(
        inputCustomMultiplier,
        'Custom product price multiplier',
        false
      );
      const sideDiamondPricePerCarat = validateAndRoundNumber(
        inputSideDiamondPrice,
        'Side diamond range price per carat'
      );
      const metalPricePerGram = validateAndRoundNumber(inputMetalPrice, 'Metal price per gram');

      // Derive allowed values from constants
      const allowedColorValues = ALLOWED_DIA_COLORS.map((color) => color.value);
      const allowedClarityValues = ALLOWED_DIA_CLARITIES.map((clarity) => clarity.value);

      // Validate diamondColors
      const diamondColors = Array.isArray(inputDiamondColors) ? inputDiamondColors : [];
      validateArrayNoDuplicates(diamondColors, 'diamond color');
      const globalColorCompatibleOptions = new Set();
      for (const color of diamondColors) {
        validateCompatibleOptions(
          color.compatibleOptions,
          'diamond color',
          'color',
          globalColorCompatibleOptions,
          allowedColorValues
        );
        color.pricePerCarat = validateAndRoundNumber(
          color.pricePerCarat,
          'Diamond color price per carat'
        );
      }

      // Validate diamondClarities
      const diamondClarities = Array.isArray(inputDiamondClarities) ? inputDiamondClarities : [];
      validateArrayNoDuplicates(diamondClarities, 'diamond clarity');
      const globalClarityCompatibleOptions = new Set();
      for (const clarity of diamondClarities) {
        validateCompatibleOptions(
          clarity.compatibleOptions,
          'diamond clarity',
          'clarity',
          globalClarityCompatibleOptions,
          allowedClarityValues
        );
        clarity.pricePerCarat = validateAndRoundNumber(
          clarity.pricePerCarat,
          'Diamond clarity range price per carat'
        );
      }

      // Validate caratRanges
      const caratRanges = Array.isArray(inputCaratRanges) ? inputCaratRanges : [];
      validateCaratRanges(caratRanges);

      // Construct payload
      const payload = {
        customProductPriceMultiplier,
        sideDiamondPricePerCarat,
        metalPricePerGram,
        diamondColors,
        diamondClarities,
        caratRanges,
      };

      // Check if customized settings exist
      const existingSettings = await fetchCustomizedSettings().catch(() => null);
      const exists = existingSettings !== null;

      const config = {
        url: customProductsSettingsUrl,
        payload,
      };

      if (exists) {
        // Update existing customized settings
        await fetchWrapperService
          ._update(config)
          .then(async () => {
            resolve(payload);
          })
          .catch(() => {
            reject(new Error('An error occurred during customized settings update.'));
          });
      } else {
        // Create new customized settings
        await fetchWrapperService
          .create({ url: customProductsSettingsUrl, insertPattern: payload })
          .then(() => {
            resolve(payload);
          })
          .catch(() => {
            reject(new Error('An error occurred during customized settings creation.'));
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const settingsService = {
  fetchPriceMultiplier,
  upsertPriceMultiplier,
  fetchCustomizedSettings,
  upsertCustomizedSettings,
};
