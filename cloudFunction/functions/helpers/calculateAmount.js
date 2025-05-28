const {
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  CLARITY_COLOR_PRICES,
  PRICE_MULTIPLIER,
  METAL_PRICES,
} = require("./common");

const getSellingPrice = ({ price, discount = 0, isCustomized = false }) => {
  let cprice = Number(price);
  const cdiscount = Number(discount);
  if (isCustomized) {
    // No discount applied for customized products
    return Number(cprice.toFixed(2));
  } else {
    // Apply discount for non-customized products
    cprice = cprice - (cprice * cdiscount) / 100;
    return Number(cprice.toFixed(2));
  }
};

const calculateSubTotal = (list) => {
  const total = list.reduce((accumulator, object) => {
    return accumulator + object.quantityWiseSellingPrice;
  }, 0);

  return +Number(total).toFixed(2);
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
  const metalVariation = variations.find((variation) => {
    const variationType = variation?.variationTypeName?.toUpperCase();
    return variationType && METAL_PRICES.hasOwnProperty(variationType);
  });

  if (!metalVariation) {
    const allowedMetals = Object.keys(METAL_PRICES).join(", ");
    throw new Error(
      `No valid metal type found in variations. Supported types: ${allowedMetals}`
    );
  }

  // Get metal price
  const metalType = metalVariation.variationTypeName.toUpperCase();
  const metalPricePerGram = METAL_PRICES[metalType];

  // Calculate and return final price
  const rawPrice = metalPricePerGram * netWeight * PRICE_MULTIPLIER;
  return Number(rawPrice.toFixed(2));
};

module.exports = {
  getSellingPrice,
  calculateSubTotal,
  calculateDiamondPrice,
  calculateCustomProductPrice,
};
