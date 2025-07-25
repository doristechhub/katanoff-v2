const {
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  CARAT_RANGE_PRICES,
  PRICE_MULTIPLIER,
  METAL_PRICE_PER_GRAM,
  SIDE_DIAMOND_PRICE_PER_CARAT,
  DISCOUNT_DETAIL_TYPES,
} = require("./common");

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
    throw new Error(
      "Invalid or missing center diamond details. 'caratWeight' must be a positive number, and 'clarity' and 'color' must be provided."
    );
  }

  // Validate product details
  if (
    !productDetail ||
    !Number.isFinite(productDetail?.netWeight) ||
    productDetail?.netWeight <= 0 ||
    !Number.isFinite(productDetail?.sideDiamondWeight) ||
    productDetail?.sideDiamondWeight < 0
  ) {
    throw new Error(
      "Invalid or missing product details. 'netWeight' and 'sideDiamondWeight' must be numbers, with 'netWeight' positive."
    );
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

module.exports = {
  getSellingPrice,
  roundOffPrice,
  calculateOrderDiscount,
  calculateSubTotal,
  calculateCustomizedProductPrice,
};
