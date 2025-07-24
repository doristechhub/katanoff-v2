import moment from 'moment';
import { authenticationService } from '../_services';
import navConfig from 'src/layouts/dashboard/config-navigation';
import { DATE_FORMAT, DEFAULT_QTY, UNIT_TYPES } from './constants';

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

const getSellingPrice = (price, discount = 0) => {
  const cprice = Number(price);
  const cdiscount = Number(discount);
  const sellingPrice = cprice - (cprice * cdiscount) / 100;
  return Number(helperFunctions.toFixedNumber(sellingPrice));
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
 * Calculates the total price of a non-customized product based on gross weight, total carat weight, and variations.
 *
 * @param {Object} params - Input parameters for price calculation.
 * @param {number} params.grossWeight - Product gross weight in grams (must be positive).
 * @param {number} params.totalCaratWeight - Total carat weight of product (must be non-negative).
 * @param {Array<Object>} params.variations - Array of variation objects with price and unit properties.
 * @param {number} [params.priceMultiplier=1] - Multiplier for additional charges (e.g., labor, design).
 * @returns {number} Final product price, rounded to 2 decimal places, or 0 if inputs are invalid.
 *
 * @description
 * - Computes variation price based on unit type:
 *   - 'carat': price per carat * totalCaratWeight.
 *   - 'gram': price per gram * grossWeight.
 * - Adds 50% markup to the sum of variation prices.
 * - Applies priceMultiplier to the total base price.
 * - Returns 0 and logs error for invalid inputs.
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

  // Apply PRICE_MULTIPLIER and round to 2 decimal places
  const finalPrice = Number((totalBasePrice * priceMultiplier).toFixed(2));

  return finalPrice;
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
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
  debounce
};
