import moment from 'moment';
import { authenticationService } from '../_services';
import navConfig from 'src/layouts/dashboard/config-navigation';

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

const calculateRefundAmount = (list) => {
  const total = list?.reduce((accumulator, object) => {
    return accumulator + object.unitAmount;
  }, 0);
  const serviceFee = Number(total) * 0.035; //3.5%
  return Number(total) - serviceFee;
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
      key: 'price',
      label: 'Diamond Price',
      value: diamondDetail.price ? `$${diamondDetail.price.toFixed(2)}` : 'N/A',
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
  if (!status) return 'N/A';
  return status.charAt(0).toUpperCase() + status.slice(1);
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
  calculateRefundAmount,
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
};
