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
  // Apply PRICE_MULTIPLIER and round to 2 decimal places
  const finalPrice = Number((totalBasePrice * multiplier).toFixed(2));

  return finalPrice;
};

module.exports = {
  getSellingPrice,
  roundOffPrice,
  calculateOrderDiscount,
  calculateSubTotal,
  calculateCustomizedProductPrice,
};
