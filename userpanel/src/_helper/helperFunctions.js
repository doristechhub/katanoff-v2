import { uid } from "uid";
import {
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  CARAT_RANGE_PRICES,
  GOLD_COLOR,
  GOLD_TYPES,
  DIAMOND_SHAPE,
  METAL_PRICE_PER_GRAM,
  PRICE_MULTIPLIER,
  RING_SIZE,
  SIDE_DIAMOND_PRICE_PER_CARAT,
} from "./constants";

const generateUniqueId = () => {
  const uuid = uid();
  return uuid;
};

const stringReplacedWithUnderScore = (string) => {
  return string?.split(" ")?.join("_");
};
const stringReplacedWithSpace = (string) => {
  return string?.split("_")?.join(" ");
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const getRandomValue = () => {
  return Math.random().toString(36).substring(7);
};

const getVariationsArray = (variaionsOfArray, customizations) => {
  return variaionsOfArray.map((variItem) => {
    const findedCustomizationType = customizations?.customizationType?.find(
      (x) => x.id === variItem?.variationId
    );
    return {
      variationId: variItem?.variationId,
      variationName: findedCustomizationType?.title,
      variationTypes: variItem?.variationTypes?.map((variTypeItem) => {
        const findedCustomizationSubType =
          customizations?.customizationSubType?.find(
            (x) => x.id === variTypeItem?.variationTypeId
          );
        let varitionTypeObj = {
          variationTypeId: variTypeItem?.variationTypeId,
          variationTypeName: findedCustomizationSubType?.title,
          type: findedCustomizationSubType?.type,
        };

        if (findedCustomizationSubType?.type === "color") {
          varitionTypeObj.variationTypeHexCode =
            findedCustomizationSubType?.hexCode;
        }
        if (findedCustomizationSubType?.type === "image") {
          varitionTypeObj.variationTypeImage =
            findedCustomizationSubType?.image;
        }
        return varitionTypeObj;
      }),
    };
  });
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
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    console.error("Invalid input to areArraysEqual", arr1, arr2);
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((item1) =>
    arr2.some(
      (item2) =>
        item1.variationId === item2.variationId &&
        item1.variationTypeId === item2.variationTypeId
    )
  );
};

const areDiamondDetailsEqual = (d1, d2) => {
  if (!d1 && !d2) return true; // both undefined/null
  if (!d1 || !d2) return false; // one is missing
  return (
    d1.caratWeight === d2.caratWeight &&
    d1.clarity === d2.clarity &&
    d1.color === d2.color &&
    d1.shapeId === d2.shapeId &&
    d1.shapeName === d2.shapeName
  );
};

const getUniqueDrawerKey = (product) => {
  return JSON.stringify({
    productId: product.productId,
    variations: product.variations,
    diamondDetail: product.diamondDetail,
  });
};

const getVariComboPriceQty = (arrayOfCombinations, selectedVariations) => {
  if (!Array.isArray(selectedVariations) || !arrayOfCombinations) {
    return { price: 0, quantity: 0 };
  }

  const array1 = selectedVariations.map((item) => ({
    variationId: item.variationId,
    variationTypeId: item.variationTypeId,
  }));

  const findedCombination = arrayOfCombinations?.find((combinationsItem) => {
    const array2 = combinationsItem.combination;
    return areArraysEqual(array1, array2);
  });

  return {
    price: findedCombination?.price || 0,
    quantity: findedCombination?.quantity || 0,
  };
};

const getMinPriceVariCombo = (arrayOfCombinations, key = "price") => {
  if (arrayOfCombinations?.length) {
    const sortedArray = arrayOfCombinations.sort((a, b) => a[key] - b[key]);
    return sortedArray[0];
  }
  return;
};

const getSellingPrice = ({ price, discount = 0, isCustomized = false }) => {
  let cprice = Number(price);
  const cdiscount = Number(discount);
  if (isCustomized) {
    // No discount applied for customized products
    return Number(helperFunctions.toFixedNumber(cprice));
  } else {
    // Apply discount for non-customized products
    cprice = cprice - (cprice * cdiscount) / 100;
    return Number(helperFunctions.toFixedNumber(cprice));
  }
};

const getCurrentUser = () => {
  const currentUserJson = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserJson);
  return currentUser;
};

// const getStatusCustomBadge = (status) => {
//   const statusMap = {
//     pending: "#DDA14D",
//     confirmed: "green",
//     shipped: "#58a4bd",
//     delivered: "yellow",
//     cancelled: "red",
//     success: "#73A37F",
//     failed: "red",
//     refunded: "yellow",
//     pending_refund: "orange",
//     failed_refund: "red",
//     cancelled_refund: "red",
//     refund_initialization_failed: "red",
//     approved: "green",
//     rejected: "red",
//     received: "green",
//   };

//   return statusMap[status] || "yellow";
// };

const getStatusCustomBadge = (status) => {
  const statusMap = {
    pending: "#F4A261", // Warm orange for "waiting" states
    confirmed: "#2A9D8F", // Teal for positive confirmation
    shipped: "#4A90E2", // Blue for in-progress transit
    delivered: "#219653", // Green for successful completion
    cancelled: "#E63946", // Red for cancellation
    success: "#26A65B", // Bright green for general success
    failed: "#D00000", // Dark red for errors
    refunded: "#F4C430", // Yellow for refund completion
    pending_refund: "#E76F51", // Coral for refund in progress
    failed_refund: "#9B2226", // Deep red for refund failure
    cancelled_refund: "#A61D24", // Slightly different red for refund cancellation
    refund_initialization_failed: "#85182A", // Darker red for refund init failure
    approved: "#009B77", // Emerald green for approvals
    rejected: "#BF0603", // Strong red for rejections
    received: "#006D77", // Deep teal for received items
  };

  return statusMap[status] || "#F4C430"; // Default to yellow for unknown statuses
};

const getStatusColor = (status) => {
  const grayFilter =
    "invert(35%) sepia(6%) saturate(336%) hue-rotate(174deg) brightness(95%) contrast(90%)";
  switch (status?.toLowerCase()) {
    case "rejected":
      return {
        colorClass: "text-red-600",
        // filter:
        //   "invert(42%) sepia(93%) saturate(1352%) hue-rotate(340deg) brightness(95%) contrast(90%)",
        filter: grayFilter,
      };
    case "approved":
      return {
        colorClass: "text-green-600",
        // filter:
        //   "invert(35%) sepia(85%) saturate(1350%) hue-rotate(85deg) brightness(95%) contrast(90%)",
        filter: grayFilter,
      };
    case "received":
      return {
        colorClass: "text-blue-600",
        // filter:
        //   "invert(35%) sepia(85%) saturate(2000%) hue-rotate(190deg) brightness(95%) contrast(90%)",
        filter: grayFilter,
      };
    default:
      return {
        colorClass: "text-gray-600",
        // filter: "none",
        filter: grayFilter,
      };
  }
};
const getLightShadeOfColor = (hexCode) => {
  // Function to calculate light shade
  const calculateLightShade = (hex, percent) => {
    const r = parseInt(hex?.substring(1, 3), 16);
    const g = parseInt(hex?.substring(3, 5), 16);
    const b = parseInt(hex?.substring(5, 7), 16);

    const newR = Math.min(255, r + (255 - r) * percent);
    const newG = Math.min(255, g + (255 - g) * percent);
    const newB = Math.min(255, b + (255 - b) * percent);

    return `rgb(${newR | 0}, ${newG | 0}, ${newB | 0})`;
  };

  // Calculate light shade with 20% lightness
  const lightShade = calculateLightShade(hexCode, 0.8);
  return lightShade;
};

const removeLastSegment = (url) => {
  const segments = url.split("/");
  const desiredSubstring = segments.slice(0, segments.length - 1).join("/");
  return desiredSubstring;
};

const sortByField = (array, key = "createdDate") => {
  return array.sort((a, b) => b[key] - a[key]);
};

const getDateFromDayAfter = (dayAfter) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + dayAfter);
  return tomorrow.toISOString().split("T")[0];
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const toFixedNumber = (amount) => {
  amount = amount ? amount : 0;
  return Number(amount).toFixed(2);
};

const getSubTotal = (list) => {
  const total = list.reduce((accumulator, object) => {
    return accumulator + object.quantityWiseSellingPrice;
  }, 0);

  return Number(total);
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

const isValidKeyName = (arrayOfObjects, keyName) =>
  arrayOfObjects.every((object) => object.hasOwnProperty(keyName));

const calculateRefundAmount = (list) => {
  const total = list?.reduce((accumulator, object) => {
    return accumulator + object.unitAmount;
  }, 0);

  return Number(total);
};

const getNameInitials = (firstName, lastName) => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase();
  const lastInitial = lastName?.charAt(0)?.toUpperCase();
  return firstInitial + lastInitial;
};

const getVideoType = (videoUrl) => {
  const url = new URL(videoUrl);
  const fileExtension = url.pathname.split(".").pop();
  return `video/${fileExtension}`;
};

const getCustomProduct = () => {
  const customProductJson = localStorage.getItem("customProduct");
  const customProduct = JSON.parse(customProductJson);
  return customProduct;
};

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const capitalizeCamelCase = (status) => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getVariationValue = (selectedVariations, key) => {
  if (!selectedVariations?.length) null;
  const variation = selectedVariations?.find(
    (v) => v.variationName?.trim().toLowerCase() === key.trim().toLowerCase()
  );
  return variation ? variation?.variationTypeName : null;
};

export const displayVariationsLabel = (variations) => {
  if (!Array.isArray(variations)) return "";

  const desiredOrder = [GOLD_TYPES, GOLD_COLOR, DIAMOND_SHAPE];
  const variationMap = {};
  const remaining = [];

  variations.forEach((item) => {
    const { variationName, variationTypeName } = item;

    if (variationName === RING_SIZE) return;

    if (desiredOrder.includes(variationName)) {
      variationMap[variationName] = variationTypeName;
    } else if (variationTypeName) {
      remaining.push(variationTypeName);
    }
  });

  const orderedValues = desiredOrder
    .map((key) => variationMap[key])
    .filter(Boolean);

  return [...orderedValues, ...remaining].join(", ");
};

export const getVariationDisplay = (variations, variationName) => {
  const variation = variations?.find((v) => v?.variationName === variationName);
  return {
    name: variation?.variationName || "N/A",
    type: variation?.variationTypeName || "N/A",
    exists: !!variation,
  };
};

const shouldHideCartPopup = (pathname) => {
  return (
    pathname === "/checkout" ||
    pathname === "/shipping" ||
    pathname.startsWith("/payment")
  );
};

const updateGoldColorInUrl = (newGoldColor) => {
  const url = new URL(window.location);
  const formattedColor = stringReplacedWithUnderScore(newGoldColor);
  url.searchParams.set("goldColor", formattedColor);
  window.history.replaceState(null, "", url.toString());
};

// Function to get the price per carat based on carat weight
const getCaratWeightPricePerCarat = (caratWeight) => {
  const range = CARAT_RANGE_PRICES?.find((range) =>
    range?.carats?.includes(caratWeight)
  );
  return range ? range?.pricePerCarat : 0;
};

// Function to get the price per carat based on clarity
const getClarityPricePerCarat = (clarity) => {
  const clarityData = ALLOWED_DIA_CLARITIES?.find(
    (item) => item?.value === clarity
  );
  return clarityData ? clarityData?.pricePerCarat : 0;
};

// Function to get the price per carat based on color
const getColorPricePerCarat = (color) => {
  const colorData = ALLOWED_DIA_COLORS?.find((item) => item?.value === color);
  return colorData ? colorData.pricePerCarat : 0;
};

// Calculate the price of the center diamond
const calculateCenterDiamondPrice = ({ caratWeight, clarity, color }) => {
  const caratWeightPricePerCarat = getCaratWeightPricePerCarat(caratWeight);
  const clarityPricePerCarat = getClarityPricePerCarat(clarity);
  const colorPricePerCarat = getColorPricePerCarat(color);

  const calculatedPricePerCarat =
    caratWeightPricePerCarat + clarityPricePerCarat + colorPricePerCarat;
  const centerDiamondPrice = calculatedPricePerCarat * caratWeight;
  return centerDiamondPrice;
};

// Calculate the metal price
const calculateMetalPrice = ({ netWeight }) => {
  const goldWithLabor = netWeight * METAL_PRICE_PER_GRAM;
  return goldWithLabor;
};

// Calculate the side diamond price
const calculateSideDiamondPrice = ({ sideDiamondWeight }) => {
  const sideDiamondPrice = sideDiamondWeight * SIDE_DIAMOND_PRICE_PER_CARAT;
  return sideDiamondPrice;
};

/**
 * Calculates the total price of a customized product based on center diamond details and product specifications.
 *
 * Pricing formula:
 *   totalBasePrice = centerDiamondPrice + metalPrice + sideDiamondPrice + (centerDiamondPrice + metalPrice + sideDiamondPrice) / 2
 *   finalPrice = totalBasePrice * PRICE_MULTIPLIER
 *
 * - centerDiamondPrice is determined by carat weight, clarity, and color from ALLOWED_DIA_COLORS, ALLOWED_DIA_CLARITIES, and CARAT_RANGE_PRICES.
 * - metalPrice includes metal cost (netWeight * METAL_PRICE_PER_GRAM).
 * - sideDiamondPrice includes side diamond cost (sideDiamondWeight * SIDE_DIAMOND_PRICE_PER_CARAT).
 * - A 50% markup is added to the sum of centerDiamondPrice, metalPrice, and sideDiamondPrice.
 * - PRICE_MULTIPLIER accounts for additional charges (e.g., labor, design complexity).
 *
 * @param {Object} params - The input parameters for the calculation.
 * @param {Object} params.centerDiamondDetail - Details of the center diamond.
 * @param {number} params.centerDiamondDetail.caratWeight - Carat weight of the center diamond.
 * @param {string} params.centerDiamondDetail.clarity - Clarity of the center diamond (e.g., "VVS1").
 * @param {string} params.centerDiamondDetail.color - Color grade of the center diamond (e.g., "D").
 * @param {Object} params.productDetail - Details of the product.
 * @param {number} params.productDetail.netWeight - Net weight of the product in grams.
 * @param {number} params.productDetail.sideDiamondWeight - Total carat weight of side diamonds.
 * @returns {number} The final customized product price, rounded to 2 decimal places.
 * @throws {Error} If inputs are invalid or missing required properties.
 */
const calculateCustomizedProductPrice = ({
  centerDiamondDetail = {},
  productDetail = {},
}) => {
  // Validate center diamond details
  if (
    !centerDiamondDetail ||
    !Number.isFinite(centerDiamondDetail?.caratWeight) ||
    centerDiamondDetail?.caratWeight <= 0 ||
    !centerDiamondDetail?.clarity ||
    !centerDiamondDetail?.color
  ) {
    console.log(
      "Invalid or missing center diamond details. 'caratWeight' must be a positive number, and 'clarity' and 'color' must be provided."
    );
    return 0;
  }

  // Validate product details
  if (
    !productDetail ||
    !Number.isFinite(productDetail?.netWeight) ||
    productDetail?.netWeight <= 0 ||
    !Number.isFinite(productDetail?.sideDiamondWeight) ||
    productDetail?.sideDiamondWeight < 0
  ) {
    console.log(
      "Invalid or missing product details. 'netWeight' and 'sideDiamondWeight' must be numbers, with 'netWeight' positive."
    );
    return 0;
  }

  // Calculate center diamond price based on carat weight, clarity, and color
  const centerDiamondPrice = calculateCenterDiamondPrice(centerDiamondDetail);

  // Calculate metal price based on net weight
  const metalPrice = calculateMetalPrice(productDetail);

  // Calculate side diamond price based on side diamond weight
  const sideDiamondPrice = calculateSideDiamondPrice(productDetail);

  // Apply 50% markup to the sum of center diamond, metal, and side diamond prices
  const fiftyPercentMarkup =
    (centerDiamondPrice + metalPrice + sideDiamondPrice) / 2;

  // Calculate total base price
  const totalBasePrice =
    centerDiamondPrice + metalPrice + sideDiamondPrice + fiftyPercentMarkup;

  // Apply PRICE_MULTIPLIER and round to 2 decimal places
  const finalPrice = Number((totalBasePrice * PRICE_MULTIPLIER).toFixed(2));

  return finalPrice;
};

const setCustomProductInLocalStorage = (cartItem) => {
  if (!cartItem?.diamondDetail) return;

  const customProduct = {
    productId: cartItem.productId,
    selectedVariations: cartItem.variations.map((v) => ({
      variationId: v.variationId,
      variationTypeId: v.variationTypeId,
      variationName: v.variationName,
      variationTypeName: v.variationTypeName,
    })),
    diamondDetails: {
      shape: {
        title: cartItem.diamondDetail.shapeName,
        image: cartItem.productImage,
        id: cartItem.diamondDetail.shapeId,
      },
      clarity: {
        title: "",
        value: cartItem.diamondDetail.clarity,
      },
      color: {
        title: "",
        value: cartItem.diamondDetail.color,
      },
      caratWeight: cartItem.diamondDetail.caratWeight,
    },
  };

  localStorage.setItem("customProduct", JSON.stringify(customProduct));
};

const splitDiscountAmongProducts = ({
  quantityWiseProductPrice,
  subTotal,
  discountAmount,
}) => {
  if (!subTotal || subTotal <= 0 || quantityWiseProductPrice <= 0) return 0;

  const proportion = quantityWiseProductPrice / subTotal;
  const productDiscount = proportion * discountAmount;

  return parseFloat(productDiscount.toFixed(2));
};

const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
const formatCurrencyWithDollar = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "$0.00";
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const splitTaxAmongProducts = ({
  quantityWiseProductPrice,
  subTotal,
  discountAmount,
  totalTaxAmount,
}) => {
  if (
    !subTotal ||
    subTotal <= 0 ||
    quantityWiseProductPrice <= 0 ||
    totalTaxAmount <= 0
  ) {
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

const calcReturnPayment = (products, orderDetail) => {
  if (!products?.length || !orderDetail) return {};
  const subTotal = products.reduce(
    (sum, product) => sum + product.productPrice * product.returnQuantity,
    0
  );

  // Calculate proportional discount based on product array amount relative to order subtotal
  const orderSubTotal = Number(orderDetail.subTotal);
  const orderDiscount = orderDetail.discount || 0;
  const discount =
    orderDiscount > 0 ? (subTotal / orderSubTotal) * orderDiscount : 0;

  // Calculate sales tax based on (subtotal - discount)
  const orderSalesTaxPercentage = orderDetail.salesTaxPercentage || 0;
  const taxableAmount = subTotal - discount;
  const salesTax = taxableAmount * (orderSalesTaxPercentage / 100);

  // Calculate service fees (3.5% of subtotal - discount + salesTax) if payment method is Stripe
  // const serviceFeeBase = taxableAmount + salesTax;
  // const serviceFees =
  //   orderDetail.paymentMethod === "stripe" ? serviceFeeBase * 0.035 : 0;

  const returnRequestAmount = subTotal - discount + salesTax;

  return {
    subTotal: Number(subTotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    salesTax: Number(salesTax.toFixed(2)),
    // serviceFees: Number(serviceFees.toFixed(2)),
    returnRequestAmount: Number(returnRequestAmount.toFixed(2)),
  };
};

export const helperFunctions = {
  debounce,
  generateUniqueId,
  stringReplacedWithUnderScore,
  stringReplacedWithSpace,
  getRandomValue,
  getVariationsArray,
  getCurrentUser,
  getStatusCustomBadge,
  removeLastSegment,
  sortByField,
  getLightShadeOfColor,
  getDateFromDayAfter,
  getTodayDate,
  toFixedNumber,
  getSubTotal,
  isReturnValid,
  areArraysEqual,
  isValidKeyName,
  calculateRefundAmount,
  calcReturnPayment,
  getMinPriceVariCombo,
  getVariComboPriceQty,
  getSellingPrice,
  getNameInitials,
  getVideoType,
  getCustomProduct,
  areDiamondDetailsEqual,
  getUniqueDrawerKey,
  getStatusColor,
  formatDate,
  capitalizeCamelCase,
  getVariationValue,
  displayVariationsLabel,
  getVariationDisplay,
  shouldHideCartPopup,
  updateGoldColorInUrl,
  calculateCustomizedProductPrice,
  calculateMetalPrice,
  calculateSideDiamondPrice,
  setCustomProductInLocalStorage,
  splitDiscountAmongProducts,
  formatCurrency,
  splitTaxAmongProducts,
  formatCurrencyWithDollar,
};
