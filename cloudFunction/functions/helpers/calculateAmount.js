const { DISCOUNT_DETAIL_TYPES } = require("./common");

const roundOffPrice = (price) => {
  const decimal = price - Math.floor(price);
  return decimal >= 0.5 ? Math.ceil(price) : Math.floor(price);
};

const getSellingPrice = ({ price, discount = 0, isCustomized = false }) => {
  let cprice = Number(price);
  const cdiscount = Number(discount);
  if (isCustomized) {
    // No discount applied for customized products
    return roundOffPrice(Number(cprice.toFixed(2)));
  } else {
    // Apply discount for non-customized products
    cprice = cprice - (cprice * cdiscount) / 100;
    return roundOffPrice(Number(cprice.toFixed(2)));
  }
};

const calculateOrderDiscount = ({ matchedDiscount, subTotal }) => {
  let orderDiscount = 0;

  if (
    matchedDiscount?.discountDetails?.type === DISCOUNT_DETAIL_TYPES?.PERCENTAGE
  ) {
    orderDiscount = (subTotal * matchedDiscount.discountDetails.amount) / 100;
  } else if (
    matchedDiscount?.discountDetails?.type === DISCOUNT_DETAIL_TYPES?.FIXED
  ) {
    orderDiscount = Math.min(matchedDiscount.discountDetails.amount, subTotal);
  }

  return orderDiscount;
};

const calculateSubTotal = (list) => {
  const total = list.reduce((accumulator, object) => {
    return accumulator + object.quantityWiseSellingPrice;
  }, 0);

  return +Number(total).toFixed(2);
};

// Function to get the price per carat based on carat weight
const getCaratWeightPricePerCarat = ({
  caratWeight,
  customizeProductSettingsData,
}) => {
  const range = customizeProductSettingsData?.caratRanges?.find(
    (r) => caratWeight >= r.minCarat && caratWeight <= r.maxCarat
  );
  return range?.pricePerCarat || 0;
};

// Function to get the price per carat based on clarity
const getClarityPricePerCarat = ({ clarity, customizeProductSettingsData }) => {
  const match = customizeProductSettingsData?.diamondClarities?.find((c) =>
    c.compatibleOptions?.includes(clarity)
  );
  return match?.pricePerCarat || 0;
};

// Function to get the price per carat based on color
const getColorPricePerCarat = ({ color, customizeProductSettingsData }) => {
  const match = customizeProductSettingsData?.diamondColors?.find((c) =>
    c.compatibleOptions?.includes(color)
  );
  return match?.pricePerCarat || 0;
};

// Calculate the price of the center diamond
const calculateCenterDiamondPrice = ({
  caratWeight,
  clarity,
  color,
  customizeProductSettingsData,
}) => {
  const caratWeightPricePerCarat = getCaratWeightPricePerCarat({
    caratWeight,
    customizeProductSettingsData,
  });
  const clarityPricePerCarat = getClarityPricePerCarat({
    clarity,
    customizeProductSettingsData,
  });
  const colorPricePerCarat = getColorPricePerCarat({
    color,
    customizeProductSettingsData,
  });

  const calculatedPricePerCarat =
    caratWeightPricePerCarat + clarityPricePerCarat + colorPricePerCarat;
  const centerDiamondPrice = calculatedPricePerCarat * caratWeight;
  return centerDiamondPrice;
};

// Calculate the metal price
const calculateMetalPrice = ({ netWeight, customizeProductSettingsData }) => {
  return netWeight * (customizeProductSettingsData?.metalPricePerGram || 0);
};

// Calculate the side diamond price
const calculateSideDiamondPrice = ({
  sideDiamondWeight = 0,
  customizeProductSettingsData,
}) => {
  return (
    sideDiamondWeight *
    (customizeProductSettingsData?.sideDiamondPricePerCarat || 0)
  );
};

/**
 * Calculates the total price of a customized product based on center diamond and product details.
 *
 * **Pricing Formula**:
 * - `totalBasePrice = centerDiamondPrice + metalPrice + sideDiamondPrice + 50% markup`
 * - `finalPrice = totalBasePrice * priceMultiplier`
 *
 * **Components**:
 * - `centerDiamondPrice`: Determined by carat weight, clarity, and color, using predefined ranges in `ALLOWED_DIA_COLORS`, `ALLOWED_DIA_CLARITIES`, and `CARAT_RANGE_PRICES`.
 * - `metalPrice`: Calculated as `netWeight * METAL_PRICE_PER_GRAM`.
 * - `sideDiamondPrice`: Calculated as `sideDiamondWeight * SIDE_DIAMOND_PRICE_PER_CARAT`.
 * - **Markup**: Adds 50% to the sum of `centerDiamondPrice`, `metalPrice`, and `sideDiamondPrice`.
 * - **Price Multiplier**: Applies `customProductPriceMultiplier` (default: 1) to account for additional costs (e.g., labor, design).
 * - **Final Adjustment**: Uses `formatPriceTo9Ending` to floor the price and adjust it to end in `9` for retail pricing.
 *
 * @param {Object} params - Input parameters for price calculation.
 * @param {Object} params.centerDiamondDetail - Details of the center diamond.
 * @param {number} params.centerDiamondDetail.caratWeight - Carat weight of the center diamond (must be > 0).
 * @param {string} params.centerDiamondDetail.clarity - Clarity grade of the center diamond (e.g., "VVS1").
 * @param {string} params.centerDiamondDetail.color - Color grade of the center diamond (e.g., "D").
 * @param {Object} params.productDetail - Product specifications.
 * @param {number} params.productDetail.netWeight - Net weight of the product in grams (must be > 0).
 * @param {number} [params.productDetail.sideDiamondWeight=0] - Total carat weight of side diamonds (must be ≥ 0).
 * @param {Object} [params.customizeProductSettingsData={}] - Configuration settings, including price multiplier and rates.
 * @returns {number} The final price, adjusted to end in `9`, or `0` if inputs are invalid.
 *
 * @example
 * const params = {
 *   centerDiamondDetail: { caratWeight: 1.5, clarity: "VVS1", color: "D" },
 *   productDetail: { netWeight: 5, sideDiamondWeight: 0.2 },
 *   customizeProductSettingsData: { customProductPriceMultiplier: 1.2 }
 * };
 * calculateCustomizedProductPrice(params); // Returns price ending in 9 (e.g., 2599)
 *
 * @throws {Error} Throws an error and returns `0` if inputs are invalid (e.g., missing or non-positive weights, missing clarity/color).
 */
const calculateCustomizedProductPrice = ({
  centerDiamondDetail = {},
  productDetail = {},
  customizeProductSettingsData = {},
}) => {
  // Validate center diamond details
  if (
    !centerDiamondDetail ||
    !Number.isFinite(centerDiamondDetail?.caratWeight) ||
    centerDiamondDetail?.caratWeight <= 0 ||
    !centerDiamondDetail?.clarity ||
    !centerDiamondDetail?.color
  ) {
    throw new Error(
      "Invalid or missing center diamond details. 'caratWeight' must be a positive number, and 'clarity' and 'color' must be provided."
    );
  }

  // Validate product details
  if (
    !productDetail ||
    !Number.isFinite(productDetail?.netWeight) ||
    productDetail?.netWeight <= 0 ||
    (productDetail?.sideDiamondWeight &&
      !Number.isFinite(productDetail?.sideDiamondWeight)) ||
    productDetail?.sideDiamondWeight < 0
  ) {
    throw new Error(
      "Invalid or missing product details. 'netWeight' and 'sideDiamondWeight' must be numbers, with 'netWeight' positive."
    );
  }

  // Calculate center diamond price based on carat weight, clarity, and color
  const centerDiamondPrice = calculateCenterDiamondPrice({
    caratWeight: centerDiamondDetail?.caratWeight,
    clarity: centerDiamondDetail?.clarity,
    color: centerDiamondDetail?.color,
    customizeProductSettingsData: customizeProductSettingsData,
  });

  // Calculate metal price based on net weight
  const metalPrice = calculateMetalPrice({
    netWeight: productDetail?.netWeight,
    customizeProductSettingsData: customizeProductSettingsData,
  });

  // Calculate side diamond price based on side diamond weight
  const sideDiamondPrice = calculateSideDiamondPrice({
    sideDiamondWeight: productDetail?.sideDiamondWeight,
    customizeProductSettingsData: customizeProductSettingsData,
  });

  // Apply 50% markup to the sum of center diamond, metal, and side diamond prices
  const fiftyPercentMarkup =
    (centerDiamondPrice + metalPrice + sideDiamondPrice) / 2;

  // Calculate total base price
  const totalBasePrice =
    centerDiamondPrice + metalPrice + sideDiamondPrice + fiftyPercentMarkup;

  const multiplier =
    customizeProductSettingsData?.customProductPriceMultiplier || 1;
  const multipliedPrice = totalBasePrice * multiplier;
  if (multipliedPrice <= 0) {
    console.log("Invalid: multipliedPrice must be positive.");
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

module.exports = {
  getSellingPrice,
  roundOffPrice,
  calculateOrderDiscount,
  calculateSubTotal,
  calculateCustomizedProductPrice,
};
