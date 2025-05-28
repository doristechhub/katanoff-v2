import { uid } from "uid";
import {
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  CLARITY_COLOR_PRICES,
  METAL_PRICES,
  PRICE_MULTIPLIER,
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
    d1.price === d2.price &&
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
  switch (status?.toLowerCase()) {
    case "rejected":
      return {
        colorClass: "text-red-600",
        filter:
          "invert(42%) sepia(93%) saturate(1352%) hue-rotate(340deg) brightness(95%) contrast(90%)",
      };
    case "approved":
      return {
        colorClass: "text-green-600",
        filter:
          "invert(35%) sepia(85%) saturate(1350%) hue-rotate(85deg) brightness(95%) contrast(90%)",
      };
    case "received":
      return {
        colorClass: "text-blue-600",
        filter:
          "invert(35%) sepia(85%) saturate(2000%) hue-rotate(190deg) brightness(95%) contrast(90%)",
      };
    default:
      return {
        colorClass: "text-gray-600",
        filter: "none",
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
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return firstInitial + lastInitial;
};

const getVideoType = (videoUrl) => {
  const url = new URL(videoUrl);
  const fileExtension = url.pathname.split(".").pop();
  return `video/${fileExtension}`;
};

/**
 * Calculates the estimated price of a diamond based on its carat weight, clarity, and color.
 *
 * Pricing formula:
 *   price = basePricePerCarat * caratWeight * PRICE_MULTIPLIER
 *
 * - basePricePerCarat is retrieved from the CLARITY_COLOR_PRICES map using the provided clarity and color.
 * - PRICE_MULTIPLIER accounts for market adjustments, shape premiums, and other modifiers.
 *
 * @param {Object} params - Parameters for diamond pricing.
 * @param {number} params.caratWeight - Carat weight of the diamond (must be a positive number).
 * @param {string} params.clarity - Clarity grade (must match one of the allowed values).
 * @param {string} params.color - Color grade (must match one of the allowed values).
 * @returns {number} Estimated price of the diamond, rounded to 2 decimal places.
 * @throws {Error} If any parameter is invalid or pricing data is unavailable.
 */
const calculateDiamondPrice = ({ caratWeight, clarity, color }) => {
  // Validate carat weight
  if (!Number.isFinite(caratWeight) || caratWeight <= 0) {
    throw new Error(
      "Invalid or missing 'caratWeight'. Must be a positive number."
    );
  }

  // Validate clarity
  const isValidClarity = ALLOWED_DIA_CLARITIES.some((c) => c.value === clarity);
  if (!clarity || typeof clarity !== "string" || !isValidClarity) {
    const allowedClarityValues = ALLOWED_DIA_CLARITIES.map((c) => c.value).join(
      ", "
    );
    throw new Error(
      `Invalid 'clarity'. Allowed values are: ${allowedClarityValues}`
    );
  }

  // Validate color
  const isValidColor = ALLOWED_DIA_COLORS.some((c) => c.value === color);
  if (!color || typeof color !== "string" || !isValidColor) {
    const allowedColorValues = ALLOWED_DIA_COLORS.map((c) => c.value).join(
      ", "
    );
    throw new Error(
      `Invalid 'color'. Allowed values are: ${allowedColorValues}`
    );
  }

  // Get base price per carat for the specified clarity and color
  const clarityPrices = CLARITY_COLOR_PRICES[clarity];
  if (!clarityPrices) {
    throw new Error(`Price data not found for clarity: '${clarity}'`);
  }

  const basePricePerCarat = clarityPrices[color];
  if (!basePricePerCarat) {
    throw new Error(
      `Price data not found for combination: '${clarity}' - '${color}'`
    );
  }

  // Apply the pricing formula
  const price = basePricePerCarat * caratWeight * PRICE_MULTIPLIER;

  // Return price rounded to 2 decimal places
  return Number(price.toFixed(2));
};

/**
 * Calculates the total price of a customized product based on its net weight and selected metal variation.
 *
 * Pricing formula:
 *   price = metalPricePerGram * netWeight * PRICE_MULTIPLIER
 *
 * - The metal price is determined by the variation with a valid metal type.
 * - PRICE_MULTIPLIER can account for making charges, design complexity, etc.
 *
 * @param {number} netWeight - Net weight of the product in grams.
 * @param {Array<Object>} variations - Array of variation objects containing variationTypeName.
 * @returns {number} The final customized product price, rounded to 2 decimal places.
 * @throws {Error} If inputs are invalid or no valid metal variation is found.
 */
const calculateCustomProductPrice = ({ netWeight, variations }) => {
  // Validate product and net weight
  if (!Number.isFinite(netWeight) || netWeight <= 0) {
    throw new Error(
      "Invalid or missing product data. 'netWeight' must be a positive number."
    );
  }

  // Validate variations array
  if (!Array.isArray(variations) || variations.length === 0) {
    throw new Error("Variations must be a non-empty array.");
  }

  // Identify valid metal type variation
  const metalVariation = variations?.find((variation) => {
    const variationType = variation?.variationTypeName?.toUpperCase();
    return variationType && METAL_PRICES?.hasOwnProperty(variationType);
  });

  if (!metalVariation) {
    const allowedMetals = Object?.keys(METAL_PRICES)?.join(", ");
    return;
    // throw new Error(
    //   `No valid metal type found in variations. Supported types: ${allowedMetals}`
    // );
  }

  // Get metal price
  const metalType = metalVariation?.variationTypeName?.toUpperCase();
  const metalPricePerGram = METAL_PRICES[metalType];

  // Calculate and return final price
  const rawPrice = metalPricePerGram * netWeight * PRICE_MULTIPLIER;
  return Number(rawPrice.toFixed(2));
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

export const helperFunctions = {
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
  getMinPriceVariCombo,
  getVariComboPriceQty,
  getSellingPrice,
  getNameInitials,
  getVideoType,
  calculateDiamondPrice,
  calculateCustomProductPrice,
  getCustomProduct,
  areDiamondDetailsEqual,
  getUniqueDrawerKey,
  getStatusColor,
  formatDate,
  capitalizeCamelCase,
};
