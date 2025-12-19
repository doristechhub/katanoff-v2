import moment from 'moment';
import { authenticationService } from '../_services';
import navConfig from 'src/layouts/dashboard/config-navigation';
import { DATE_FORMAT, DEFAULT_QTY, DIAMOND_SHAPE, GOLD_COLOR, UNIT_TYPES } from './constants';

const getCurrentUser = () => {
  const currentUserJson = localStorage.getItem('adminCurrentUser');
  const currentUser = JSON.parse(currentUserJson);
  return currentUser;
};

const getVariationsArray = (variaionsOfArray, customizations) => {
  return variaionsOfArray.map((variItem) => {
    return {
      variationId: variItem.variationId,
      variationName: customizations.customizationType.find((x) => x.id === variItem.variationId)
        ?.title,
      variationTypes: variItem.variationTypes.map((variTypeItem) => {
        const findedCustomizationType = customizations.customizationSubType.find(
          (x) => x.id === variTypeItem.variationTypeId
        );
        return {
          variationTypeId: variTypeItem.variationTypeId,
          variationTypeName: findedCustomizationType?.title,
        };
      }),
    };
  });
};

const getRandomValue = () => {
  return Math.random().toString(36).substring(7);
};

function sortArrays(arr1, arr2) {
  const sortFunc = (a, b) => {
    if (a.variationId < b.variationId) return -1;
    if (a.variationId > b.variationId) return 1;
    if (a.variationTypeId < b.variationTypeId) return -1;
    if (a.variationTypeId > b.variationTypeId) return 1;
    return 0;
  };

  arr1.sort(sortFunc);
  arr2.sort(sortFunc);
}

const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  sortArrays(arr1, arr2);

  for (let i = 0; i < arr1.length; i++) {
    if (
      arr1[i].variationId !== arr2[i].variationId ||
      arr1[i].variationTypeId !== arr2[i].variationTypeId
    ) {
      return false;
    }
  }

  return true;
};

const getPriceQty = (arrayOfCombinations, selectedVariations) => {
  const array1 = selectedVariations.map((item) => {
    return {
      variationId: item.variationId,
      variationTypeId: item.variationTypeId,
    };
  });
  const findedCombination = arrayOfCombinations?.find((combinationsItem) => {
    const array2 = combinationsItem.combination;
    return areArraysEqual(array1, array2);
  });
  return {
    price: findedCombination?.price ? findedCombination?.price : 0,
    quantity: findedCombination?.quantity ? findedCombination?.quantity : 0,
  };
};

const getMinPriceVariCombo = (arrayOfCombinations, key = 'price') => {
  if (arrayOfCombinations?.length) {
    const sortedArray = arrayOfCombinations.sort((a, b) => a[key] - b[key]);
    return sortedArray[0];
  }
  return;
};

export const roundOffPrice = (price) => {
  const decimal = price - Math.floor(price);
  return decimal >= 0.5 ? Math.ceil(price) : Math.floor(price);
};

const getSellingPrice = (price, discount = 0) => {
  const cprice = Number(price);
  const cdiscount = Number(discount);
  const sellingPrice = cprice - (cprice * cdiscount) / 100;
  const finalPrice = Number(helperFunctions.toFixedNumber(sellingPrice));
  return roundOffPrice(finalPrice);
};

const getStatusBg = (status) => {
  const statusMap = {
    failed: 'error',
    rejected: 'pink',
    delivered: 'info',
    cancelled: 'error',
    success: 'success',
    pending: 'warning',
    refunded: 'default',
    approved: 'success',
    received: 'default',
    confirmed: 'success',
    shipped: 'secondary',
    failed_refund: 'pink',
    pending_refund: 'info',
    cancelled_refund: 'error',
    refund_initialization_failed: 'secondary',
  };

  return statusMap[status] || 'info';
};

const getWeeksRange = () => {
  const today = new Date();
  const currentDate = moment();
  const oneWeekAgo = currentDate.subtract(1, 'weeks');
  const formattedDate = oneWeekAgo.format('YYYY-MM-DD'); // formatted date for patch value
  const patchedStartDate = new Date(formattedDate);

  const patchedEndDate = today;
  return { startDate: patchedStartDate, endDate: patchedEndDate };
};

const calculatePreviousDates = () => {
  const currentDate = moment();

  // Calculate 1 week ago
  const oneWeekAgo = currentDate.clone().subtract(1, 'weeks');

  // Calculate 1 month ago
  const oneMonthAgo = currentDate.clone().subtract(1, 'months');

  // Calculate 3 months ago
  const threeMonthsAgo = currentDate.clone().subtract(3, 'months');

  // Calculate 6 months ago
  const sixMonthsAgo = currentDate.clone().subtract(6, 'months');

  // Calculate 1 year ago
  const oneYearAgo = currentDate.clone().subtract(1, 'years');

  return {
    oneWeekAgo,
    oneMonthAgo,
    threeMonthsAgo,
    sixMonthsAgo,
    oneYearAgo,
  };
};

const formatAndDisplayDate = (date) => {
  return date.format('MM-DD-YYYY');
};

const { oneWeekAgo, oneMonthAgo, threeMonthsAgo, sixMonthsAgo, oneYearAgo } =
  calculatePreviousDates();

const getTypeWiseDate = (type) => {
  switch (type) {
    case '1W':
      return helperFunctions.formatAndDisplayDate(oneWeekAgo);
    case '1M':
      return helperFunctions.formatAndDisplayDate(oneMonthAgo);
    case '3M':
      return helperFunctions.formatAndDisplayDate(threeMonthsAgo);
    case '6M':
      return helperFunctions.formatAndDisplayDate(sixMonthsAgo);
    case '1Y':
      return helperFunctions.formatAndDisplayDate(oneYearAgo);
    default:
      return helperFunctions.formatAndDisplayDate(oneWeekAgo);
  }
};

const formatAmount = (amount) => {
  amount = Number(amount);
  if (amount) {
    return `$ ${amount.toFixed(2)}`;
  }
  return 'N/A';
};

const toFixedNumber = (amount) => {
  amount = amount ? amount : 0;
  return Number(amount).toFixed(2);
};

const removeLastSegment = (url) => {
  const segments = url.split('/');
  const desiredSubstring = segments.slice(0, segments.length - 1).join('/');
  return desiredSubstring;
};

const isValidKeyName = (arrayOfObjects, keyName) =>
  arrayOfObjects.every((object) => object.hasOwnProperty(keyName));

const sortByField = (array, key = 'createdDate') => {
  return array.sort((a, b) => b[key] - a[key]);
};

const getAllPagesList = () => {
  return navConfig?.map((item) => ({
    pageId: item.pageId,
    actions: item?.actions,
    title: item.title,
  }));
};

const checkUserPermission = (userPermissions, pageId) => {
  return userPermissions?.find((permission) => permission.pageId === pageId);
};

const permissionWiseRedirect = (adminWisePermisisons) => {
  if (adminWisePermisisons?.length) {
    const pagesList = helperFunctions.getAllPagesList();
    const dashboardPermission = adminWisePermisisons.find(
      (permission) => permission.pageId === 'dashboard'
    );

    if (dashboardPermission) {
      const dashboardPage = navConfig.find((page) => page.pageId === 'dashboard');
      if (dashboardPage) {
        return dashboardPage.path;
      }
    }

    const matchedPermission = adminWisePermisisons.find((permission) =>
      pagesList.find((page) => page.pageId === permission.pageId)
    );
    if (matchedPermission) {
      const matchedPage = navConfig.find((page) => page.pageId === matchedPermission.pageId);
      if (matchedPage) {
        return matchedPage.path;
      } else {
        authenticationService.logOut();
        return;
      }
    } else {
      authenticationService.logOut();
      return;
    }
  } else {
    return false;
  }
};

const isValidNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

const calculateServiceFee = (list) => {
  const total = list?.reduce((accumulator, object) => {
    return accumulator + object.unitAmount;
  }, 0);
  return Number(total) * 0.035; //3.5%
};

export const currentYear = new Date().getFullYear();

export const lastFiveYears = () => {
  const last5Years = [{ label: 'All', value: 0 }];
  for (let i = currentYear; i > currentYear - 5; i--) {
    last5Years.push({ label: i, value: i });
  }
  return last5Years;
};

const capitalWords = (str) => {
  if (!str || typeof str !== 'string') return;

  const words = str?.split(' ');

  for (let i = 0; i < words?.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words?.join(' ');
};

const stringReplacedWithUnderScore = (string) => {
  return string?.split(' ')?.join('_');
};
const stringReplacedWithSpace = (string) => {
  return string?.split('_')?.join(' ');
};
const getRandomNumberLimitedDigits = () => {
  const min = 10; // Minimum 2-digit number
  const max = 99999; // Maximum 5-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formatMeasurement = (value) => {
  return value?.replace(/(\d+\.?\d*)([A-Za-z]+)/, '$1 $2')?.toLowerCase();
};

const formatDecimalNumber = (value) => {
  // Ensure the input is a valid number
  const num = parseFloat(value);

  if (isNaN(num)) return ''; // Return an empty string for invalid input

  return num % 1 === 0 ? num.toString() : num.toFixed(2);
};

const capitalizeTitle = (title) => title?.charAt(0).toUpperCase() + title?.slice(1).toLowerCase();

const getDiamondDetailArray = (diamondDetail) => {
  if (!diamondDetail || typeof diamondDetail !== 'object') {
    return [];
  }

  // Define property mappings
  const propertyMappings = [
    {
      key: 'shapeId',
      label: 'Shape',
      value: diamondDetail?.shapeName || 'N/A',
    },
    {
      key: 'caratWeight',
      label: 'Carat Weight',
      value: diamondDetail.caratWeight ? `${diamondDetail.caratWeight} ct` : 'N/A',
    },
    {
      key: 'clarity',
      label: 'Clarity',
      value: diamondDetail.clarity || 'N/A',
    },
    {
      key: 'color',
      label: 'Color',
      value: diamondDetail.color || 'N/A',
    },
  ];

  // Filter out properties that are not present in diamondDetail (except shapeId, which uses shapeName)
  return propertyMappings.filter(
    (prop) => prop.key === 'shapeId' || diamondDetail[prop.key] !== undefined
  );
};

const isReturnValid = (timestamp) => {
  // Validate timestamp format
  if (isNaN(timestamp)) {
    // "Invalid timestamp format. Please provide a valid timestamp."
    return false;
  }

  const today = new Date(); // Get today's date and time
  today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

  const returnWindow = new Date(timestamp);
  returnWindow.setDate(returnWindow.getDate() + 15); // Add 15 days
  returnWindow.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

  return today <= returnWindow;
};

const capitalizeCamelCase = (status) => {
  if (!status) return '-';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const generateCombinations = (arrayOfVariation) => {
  const variationNames = arrayOfVariation.map((item) =>
    item.variationTypes.map((type) => ({
      variationName: item.variationName,
      variationTypeName: type.variationTypeName,
      variationId: item.variationId,
      variationTypeId: type.variationTypeId,
    }))
  );

  const result = [];
  const temp = [];

  const combine = (arr, index) => {
    if (index === variationNames.length) {
      result.push({
        id: helperFunctions.getRandomValue(),
        combination: [...temp],
        price: 0,
        quantity: DEFAULT_QTY,
      });
      return;
    }

    for (let i = 0; i < arr[index].length; i++) {
      temp.push({
        id: helperFunctions.getRandomValue(),
        variationId: arr[index][i].variationId,
        variationName: arr[index][i].variationName,
        variationTypeId: arr[index][i].variationTypeId,
        variationTypeName: arr[index][i].variationTypeName,
      });
      combine(arr, index + 1);
      temp.pop();
    }
  };

  combine(variationNames, 0);
  return result;
};

const getCombinationDetail = ({ variations, customizations }) => {
  const newVariation = getVariationsArray(variations, customizations);
  return generateCombinations(newVariation);
};

const getArrayWithoutIds = (arrayWithIds) =>
  arrayWithIds?.map((obj) => {
    const { id, ...rest } = obj;
    return rest;
  });

const getCombiDetailWithPriceAndQty = ({ arrayOfCombinations, oldCombinations }) => {
  if (!oldCombinations) {
    return arrayOfCombinations; // Return original combinations if no previous data
  }
  return arrayOfCombinations.map((mainItem) => {
    const array1 = getArrayWithoutIds(mainItem.combination);
    const findedCombination = oldCombinations?.find((tempMainCombiItem) => {
      const array2 = getArrayWithoutIds(tempMainCombiItem?.combination);
      return areArraysEqual(array1, array2);
    });
    return {
      ...mainItem,
      price: findedCombination ? findedCombination?.price : 0,
      quantity: findedCombination ? findedCombination?.quantity : DEFAULT_QTY,
    };
  });
};

const parseDateTime = (dateTimeStr) => {
  if (!dateTimeStr || !moment(dateTimeStr, DATE_FORMAT, true).isValid()) {
    return { date: null, time: null };
  }
  const momentObj = moment(dateTimeStr, DATE_FORMAT);
  return {
    date: momentObj.toDate(),
    time: momentObj.toDate(),
  };
};

const calcReturnPayment = (products, orderDetail) => {
  if (!products?.length || !orderDetail) return {};
  const subTotal = products.reduce(
    (sum, product) => sum + product.productPrice * product.returnQuantity,
    0
  );

  // Calculate proportional discount based on product array amount relative to order subtotal
  const orderSubTotal = Number(orderDetail.subTotal) || 0;
  const orderDiscount = orderDetail.discount || 0;
  const discount = orderDiscount > 0 ? (subTotal / orderSubTotal) * orderDiscount : 0;

  // Calculate sales tax based on (subtotal - discount)
  const orderSalesTaxPercentage = orderDetail.salesTaxPercentage || 0;
  const taxableAmount = subTotal - discount;
  const salesTax = taxableAmount * (orderSalesTaxPercentage / 100);

  // Calculate service fees (3.5% of subtotal - discount + salesTax) if payment method is Stripe
  // const serviceFeeBase = taxableAmount + salesTax;
  // const serviceFees = orderDetail.paymentMethod === 'stripe' ? serviceFeeBase * 0.035 : 0;

  const returnRequestAmount = subTotal - discount + salesTax;

  return {
    subTotal: Number(subTotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    salesTax: Number(salesTax.toFixed(2)),
    // serviceFees: Number(serviceFees.toFixed(2)),
    returnRequestAmount: Number(returnRequestAmount.toFixed(2)),
  };
};

const splitTaxAmongProducts = ({
  quantityWiseProductPrice,
  subTotal,
  discountAmount,
  totalTaxAmount,
}) => {
  if (!subTotal || subTotal <= 0 || quantityWiseProductPrice <= 0 || totalTaxAmount <= 0) {
    return 0;
  }

  // Step 1: Calculate per-product discount
  const proportion = quantityWiseProductPrice / subTotal;
  const productDiscount = proportion * discountAmount;

  // Step 2: Get discounted product price
  const discountedProductPrice = quantityWiseProductPrice - productDiscount;

  // Step 3: Calculate total discounted subtotal (used for proportional tax)
  const discountedSubTotal = subTotal - discountAmount;

  if (!discountedSubTotal || discountedSubTotal <= 0) return 0;

  // Step 4: Apply tax proportionally on discounted product amount
  const taxProportion = discountedProductPrice / discountedSubTotal;
  const productTax = taxProportion * totalTaxAmount;

  return parseFloat(productTax.toFixed(2));
};

const splitDiscountAmongProducts = ({ quantityWiseProductPrice, subTotal, discountAmount }) => {
  if (!subTotal || subTotal <= 0 || quantityWiseProductPrice <= 0) return 0;

  const proportion = quantityWiseProductPrice / subTotal;
  const productDiscount = proportion * discountAmount;
  return parseFloat(productDiscount.toFixed(2));
};

/**
 * Calculates prices for combinations in automatic price calculation mode.
 * @param {Object} params - Parameters for price calculation
 * @param {Array} params.combinations - Array of combination objects
 * @param {Array} params.customizationSubTypesList - List of customization subtypes
 * @param {number} params.grossWeight - Gross weight of the product
 * @param {number} params.totalCaratWeight - Total carat weight of the product
 * @param {number} params.priceMultiplier - Price multiplier from settings
 * @returns {Array} Updated combinations with recalculated prices
 */
const calculateAutomaticPrices = ({
  combinations,
  customizationSubTypesList,
  grossWeight,
  totalCaratWeight,
  priceMultiplier,
}) => {
  return combinations.map((item) => {
    const recalculatedPrice = calculateNonCustomizedProductPrice({
      grossWeight,
      totalCaratWeight,
      variations: item.combination.map((combo) => {
        const subType = customizationSubTypesList?.find(
          (type) => type?.id === combo.variationTypeId
        );
        return {
          ...combo,
          price: subType?.price ?? 0,
          unit: subType?.unit ?? '',
        };
      }),
      priceMultiplier,
    });

    return {
      ...item,
      price: recalculatedPrice,
    };
  });
};

/**
 * Calculates the final selling price of a non-customized product based on weight, carat weight, and variation pricing.
 *
 * @param {Object} params - Calculation parameters.
 * @param {number} params.grossWeight - Gross product weight in grams (must be > 0).
 * @param {number} params.totalCaratWeight - Total gemstone/diamond carat weight (must be ≥ 0).
 * @param {Array<Object>} params.variations - Variation list, each with:
 *        @param {number} price - Price per unit.
 *        @param {string} unit  - Unit type (`UNIT_TYPES.CARAT` or `UNIT_TYPES.GRAM`).
 * @param {number} [params.priceMultiplier=1] - Additional multiplier for labor, design, or margins.
 *
 * @returns {number} Final price, adjusted for markup and ending in 9, or `0` if inputs are invalid.
 *
 * @description
 * Steps:
 *  1. **Validate inputs** — Rejects if weights are invalid or variations list is empty.
 *  2. **Compute variation cost**:
 *     - `CARAT`: price × totalCaratWeight
 *     - `GRAM` : price × grossWeight
 *  3. **Apply markup** — Adds a fixed 50% markup to the total.
 *  4. **Apply multiplier** — Multiplies by `priceMultiplier`.
 *  5. **Format price** — Takes a price, floors it, and adjusts to end in 9:
 *       - If the last digit is 0, subtracts 1 (e.g., 1200 → 1199).
 *       - If the last digit is not 9, replaces it with 9 (e.g., 1234 → 1239).
 *       - If already 9, no change.
 *  6. **Return** — Price after adjustments, or `0` if invalid.
 */

const calculateNonCustomizedProductPrice = ({
  grossWeight,
  totalCaratWeight,
  variations,
  priceMultiplier = 1,
}) => {
  // Validate inputs
  if (
    !Number.isFinite(grossWeight) ||
    grossWeight <= 0 ||
    !Number.isFinite(totalCaratWeight) ||
    totalCaratWeight < 0 ||
    !Array.isArray(variations) ||
    !variations.length
  ) {
    console.log(
      "Invalid inputs: 'grossWeight' must be positive, 'totalCaratWeight' must be non-negative, and 'variations' must be a non-empty array."
    );
    return 0;
  }

  let totalPrice = 0;

  // Calculate price based on variations
  variations.forEach((variation) => {
    const variationPrice = Number(variation.price) || 0;
    const variationUnit = variation.unit;

    if (variationPrice > 0) {
      if (variationUnit === UNIT_TYPES.CARAT && totalCaratWeight > 0) {
        totalPrice += variationPrice * totalCaratWeight;
      } else if (variationUnit === UNIT_TYPES.GRAM && grossWeight > 0) {
        totalPrice += variationPrice * grossWeight;
      }
    }
  });

  // Apply 50% markup to the total price
  const fiftyPercentMarkup = totalPrice / 2;
  const totalBasePrice = totalPrice + fiftyPercentMarkup;
  const multipliedPrice = totalBasePrice * priceMultiplier;
  if (multipliedPrice <= 0) {
    console.log('Invalid: multipliedPrice must be positive.');
    return 0;
  }

  // Apply PRICE_MULTIPLIER and round to 2 decimal places
  // const finalPrice = Number(multipliedPrice.toFixed(2));

  // Case: 1
  // Apply priceMultiplier, take floor, and adjust to end in 99
  // const finalPrice = formatPriceTo99Ending(multipliedPrice);

  // Case: 2
  // Apply priceMultiplier, take floor, and adjust to end in 99
  // const finalPrice = formatPriceSmart99(multipliedPrice);

  // Case: 3
  // Apply priceMultiplier, take floor, and adjust to end in 9
  const finalPrice = formatPriceTo9Ending(multipliedPrice);

  return finalPrice;
};

const formatPriceTo99Ending = (multipliedPrice = 1) => {
  let finalPrice = Math.floor(multipliedPrice);
  const lastTwoDigits = finalPrice % 100;
  if (lastTwoDigits === 0) {
    finalPrice = finalPrice - 1;
  } else if (lastTwoDigits !== 99) {
    finalPrice = finalPrice - lastTwoDigits + 99;
  }
  return finalPrice;
};

const formatPriceSmart99 = (multipliedPrice = 1) => {
  let finalPrice = Math.floor(multipliedPrice);
  const lastTwoDigits = finalPrice % 100;
  if (lastTwoDigits <= 50) {
    finalPrice = Math.floor(finalPrice / 100) * 100 - 1;
  } else {
    finalPrice = Math.floor(finalPrice / 100) * 100 + 99;
  }

  return finalPrice;
};

const formatPriceTo9Ending = (multipliedPrice = 1) => {
  let finalPrice = Math.floor(multipliedPrice);
  const lastDigit = finalPrice % 10;
  if (lastDigit === 0) {
    finalPrice = finalPrice - 1;
  } else if (lastDigit !== 9) {
    finalPrice = finalPrice - lastDigit + 9;
  }
  return finalPrice;
};

const alertseverity = (type) => {
  const severity = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
  };
  return severity[type] || severity.INFO;
};

const convertValueByType = (value, type) => {
  switch (type) {
    case 'number':
      return value ? Number(value) : 0; // Convert to number or default to 0
    case 'string':
      return value?.toString().trim() || ''; // Convert to string and trim
    case 'boolean':
      return value === 'true' || value === true; // Convert to boolean
    default:
      return value; // Return as-is for unknown types
  }
};

const splitAndTrim = (input, options = {}) => {
  const { toObjects = false, keyName = 'value' } = options;

  // Handle undefined, null, or empty input
  if (!input) return [];

  // Split, trim, and filter out empty strings
  const items = input
    .split(',')
    .map((item) => item?.trim())
    .filter((item) => item);

  // Return array of objects if toObjects is true
  if (toObjects) {
    return items.map((item) => ({
      [keyName]: item,
    }));
  }

  // Return array of strings by default
  return items;
};

const checkKeys = (object, keys, parent) => {
  const errors = [];
  keys.forEach(({ key, type, allowedValues }) => {
    if (!object.hasOwnProperty(key) || object[key] === '' || object[key] === ' ') {
      errors.push(`Missing or empty key '${key}' in ${parent}`);
    } else if (type === 'string' && typeof object[key] !== 'string') {
      errors.push(`Key '${key}' in ${parent} should be a string`);
    } else if (type === 'number' && (typeof object[key] !== 'number' || isNaN(object[key]))) {
      errors.push(`Key '${key}' in ${parent} should be a number`);
    } else if (type === 'array' && !Array.isArray(object[key])) {
      errors.push(`Key '${key}' in ${parent} should be an array`);
    } else if (type === 'boolean' && typeof object[key] !== 'boolean') {
      errors.push(`Key '${key}' in ${parent} should be a boolean`);
    } else if (allowedValues && !allowedValues.includes(object[key])) {
      if (key === 'diaItem') {
        errors.push(`Invalid diaItem '${object[key]}' in ${parent}`);
      } else {
        errors.push(`Key '${key}' in ${parent} should be one of ${allowedValues.join(', ')}`);
      }
    }
  });
  return errors;
};

const findDuplicates = (array, key) => {
  if (!array?.length || !key) return [];
  const uniqueItems = new Set();
  const duplicateKeys = new Set();
  array.forEach((element) => {
    const keyValue = element[key];
    if (uniqueItems.has(keyValue)) {
      duplicateKeys.add(keyValue);
    } else {
      uniqueItems.add(keyValue);
    }
  });
  return Array.from(duplicateKeys);
};

/* ===================================================================
   MEDIA SET ID GENERATOR – RECOMMENDED FINAL VERSION
   Format: 14k_yellow_round_483920  (sorted IDs + 6-digit random)
   =================================================================== */
const generateMediaSetId = (combination = []) => {
  if (!Array.isArray(combination) || combination.length === 0) {
    return `default_${Math.floor(100000 + Math.random() * 900000)}`;
  }

  const idPart = combination
    .map((item) => item.variationTypeId)
    .filter(Boolean)
    .join('_')
    .toLowerCase();

  const random6 = Math.floor(100000 + Math.random() * 900000);
  // return `${idPart}_${random6}`;
  return `${idPart}`;
};

const bytesToMB = (bytes) => {
  if (!bytes) return 0;
  const mb = bytes / (1024 * 1024);
  return mb;
};

// Assign mediaSetId to each combo using matchingCombinations
const applyMediaSetIdByMatching = (mediaMappingParam = [], variCombos = []) => {
  return variCombos.map((combo) => {
    let matchedMediaSetId = '';

    // Loop through each media set
    for (const media of mediaMappingParam) {
      const { mediaSetId, matchingCombinations = [] } = media;

      // Try to match with ANY matchingCombination of this mediaSet
      for (const matchObj of matchingCombinations) {
        const matchArr = matchObj.combination || [];

        // Compare using your areArraysEqual helper
        // Must clone arrays to avoid in-place sorting mutation issues
        const comboClone = [...combo.combination];
        const matchClone = [...matchArr];

        if (areArraysEqual(comboClone, matchClone)) {
          matchedMediaSetId = mediaSetId;
          break;
        }
      }

      if (matchedMediaSetId) break; // stop if we found match
    }

    return {
      ...combo,
      mediaSetId: matchedMediaSetId || '', // empty if no match found
    };
  });
};

const getThumbnailForSelectedVariations = (product = {}, variationArray = []) => {
  if (!product?.mediaMapping || !product?.variComboWithQuantity || !variationArray?.length) {
    return null;
  }
  const selectedTypeIds = variationArray.map((v) => v.variationTypeId);

  const matchedCombo = product.variComboWithQuantity.find((combo) => {
    const comboTypeIds = combo.combination.map((c) => c.variationTypeId);

    return selectedTypeIds.every((id) => comboTypeIds.includes(id));
  });

  if (!matchedCombo?.mediaSetId) return null;

  const media = product.mediaMapping.find((m) => m.mediaSetId === matchedCombo.mediaSetId);

  return media?.thumbnailImage || null;
};

const getGoldColorWiseMedia = (product = {}) => {
  const result = {
    yellow: { thumbnail: null, images: [] },
    white: { thumbnail: null, images: [] },
    rose: { thumbnail: null, images: [] },
  };

  if (!product?.variations || !product?.variComboWithQuantity || !product?.mediaMapping) {
    return result;
  }
  const goldColorVariation = product.variations.find(
    (v) => v?.variationName?.toLowerCase() === 'gold color'
  );

  if (!goldColorVariation?.variationTypes?.length) return result;

  const colorKeyMap = {
    'yellow gold': 'yellow',
    'white gold': 'white',
    'rose gold': 'rose',
  };

  goldColorVariation.variationTypes.forEach((type) => {
    const colorKey = colorKeyMap[type?.variationTypeName?.toLowerCase()];
    if (!colorKey) return;

    const matchedCombo = product.variComboWithQuantity.find((combo) =>
      combo?.combination?.some((c) => c?.variationTypeId === type.variationTypeId)
    );

    if (!matchedCombo?.mediaSetId) return;

    const media = product.mediaMapping.find((m) => m?.mediaSetId === matchedCombo.mediaSetId);

    if (!media) return;

    result[colorKey] = {
      thumbnail: media.thumbnailImage || null,
      images: media.images || [],
    };
  });

  return result;
};

const getProductThumbnail = (product) => {
  const { yellow, rose, white } = getGoldColorWiseMedia(product);
  return (
    yellow?.thumbnail ||
    rose?.thumbnail ||
    white?.thumbnail ||
    product?.mediaMapping?.[0]?.thumbnailImage ||
    null
  );
};

/**
 * Parses a multi-line media string into an array of { namePart, urlPart }
 * Handles comma-separated URLs in Images column.
 */
const parseMediaLines = (text) => {
  if (!text || typeof text !== 'string') return [];

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .flatMap((line) => {
      const separatorIndex = line.indexOf(': ');
      if (separatorIndex === -1) return [];

      const namePart = line.substring(0, separatorIndex).trim();
      const urlPartRaw = line.substring(separatorIndex + 2).trim();

      // Split comma-separated URLs (for Images column)
      const urlParts = urlPartRaw
        .split(', ')
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      // Return one entry per URL, all sharing the same namePart
      return urlParts.map((urlPart) => ({ namePart, urlPart }));
    });
};

const generateMediaMappingForExcel = ({ thumbnail, images, video, variations }) => {
  const thumbnailLines = parseMediaLines(thumbnail); // [{ namePart, urlPart }]
  const imageLines = parseMediaLines(images);
  const videoLines = parseMediaLines(video);

  // Required variations for mediaSetId generation
  const diamondShapeVariation = variations.find((v) => v.variationName === DIAMOND_SHAPE.title);
  const goldColorVariation = variations.find((v) => v.variationName === GOLD_COLOR.title);

  if (!diamondShapeVariation || !goldColorVariation) {
    console.warn(
      'Missing Diamond Shape or Gold Color variation – no media sets will be generated.'
    );
    return []; // Cannot generate any mediaSetId → return empty
  }

  // Helper: get variationTypeId by exact or partial name match (case-insensitive)
  const getVariationTypeId = (variationTitle, typeName) => {
    const variation = variations.find((v) => v.variationName === variationTitle);
    if (!variation) return null;
    const matched = variation.variationTypes.find(
      (t) => t.variationTypeName.trim().toLowerCase() === typeName.trim().toLowerCase()
    );
    return matched ? matched.variationTypeId : null;
  };

  // Group images by namePart
  const imagesByName = imageLines.reduce((acc, { namePart, urlPart }) => {
    const key = namePart || 'Default';
    if (!acc[key]) acc[key] = [];
    acc[key].push({ image: urlPart });
    return acc;
  }, {});

  const validMediaMapping = [];

  // Process each thumbnail → try to generate mediaSetId
  thumbnailLines.forEach(({ namePart, urlPart: thumbnailImage }) => {
    const name = namePart || 'Default';

    if (!namePart) return; // Skip if no name (can't match)

    const parts = namePart
      .split(/[\+\&\|,]/)
      .map((p) => p.trim())
      .filter(Boolean);

    let shapeId = null;
    let colorId = null;

    // Try direct match first
    for (const part of parts) {
      const s = getVariationTypeId(DIAMOND_SHAPE.title, part);
      const c = getVariationTypeId(GOLD_COLOR.title, part);
      if (s) shapeId = s;
      if (c) colorId = c;
    }

    // Fallback: assume order → first = shape, second = color
    if (!shapeId && parts[0]) {
      shapeId = getVariationTypeId(DIAMOND_SHAPE.title, parts[0]);
    }
    if (!colorId && parts[1]) {
      colorId = getVariationTypeId(GOLD_COLOR.title, parts[1]);
    }

    // Only proceed if BOTH IDs are found
    if (shapeId && colorId) {
      const mediaSetId = helperFunctions.generateMediaSetId([
        { variationTypeId: shapeId },
        { variationTypeId: colorId },
      ]);

      validMediaMapping.push({
        mediaSetId,
        name,
        thumbnailImage,
        images: imagesByName[name] || [],
        video: '',
      });
    }
    // Else: silently skip – no mediaSetId → not included
  });

  // Attach videos only to valid existing sets
  videoLines.forEach(({ namePart, urlPart }) => {
    if (!namePart) return;

    const name = namePart;
    const targetSet = validMediaMapping.find((set) => set.name === name);

    if (targetSet) {
      targetSet.video = urlPart;
    }
    // Do NOT create new set for video-only → we only allow sets with valid mediaSetId + thumbnail/images
  });

  // Final result: only sets with valid mediaSetId (and at least thumbnail or images)
  return validMediaMapping.filter((set) => {
    return set.thumbnailImage || (set.images && set.images.length > 0);
  });
};

export const helperFunctions = {
  getCurrentUser,
  getVariationsArray,
  getRandomValue,
  getStatusBg,
  getWeeksRange,
  calculatePreviousDates,
  formatAndDisplayDate,
  getTypeWiseDate,
  lastFiveYears,
  getPriceQty,
  formatAmount,
  areArraysEqual,
  removeLastSegment,
  isValidKeyName,
  sortByField,
  getAllPagesList,
  checkUserPermission,
  permissionWiseRedirect,
  isValidNumber,
  toFixedNumber,
  capitalWords,
  calcReturnPayment,
  calculateServiceFee,
  getSellingPrice,
  getMinPriceVariCombo,
  stringReplacedWithUnderScore,
  stringReplacedWithSpace,
  getRandomNumberLimitedDigits,
  formatMeasurement,
  formatDecimalNumber,
  capitalizeTitle,
  getDiamondDetailArray,
  isReturnValid,
  capitalizeCamelCase,
  generateCombinations,
  getCombinationDetail,
  getCombiDetailWithPriceAndQty,
  parseDateTime,
  splitTaxAmongProducts,
  splitDiscountAmongProducts,
  calculateNonCustomizedProductPrice,
  calculateAutomaticPrices,
  alertseverity,
  convertValueByType,
  splitAndTrim,
  checkKeys,
  findDuplicates,
  generateMediaSetId,
  bytesToMB,
  applyMediaSetIdByMatching,
  getThumbnailForSelectedVariations,
  getGoldColorWiseMedia,
  getProductThumbnail,
  generateMediaMappingForExcel,
};
