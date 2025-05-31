const getCurrentDate = () => {
  return Date.now();
};

const getNonCustomizedProducts = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }
  return products.filter((product) => !product?.diamondDetail);
};

const ALLOWED_DIA_COLORS = [
  {
    title: "D - Colorless",
    value: "D",
    pricePerCarat: 50,
  },
  {
    title: "E - Colorless",
    value: "E",
    pricePerCarat: 25,
  },
  {
    title: "F - Colorless",
    value: "F",
    pricePerCarat: 0,
  },
];

const ALLOWED_DIA_CLARITIES = [
  {
    title: "Very, Very Slightly Included (VVS1)",
    value: "VVS1",
    pricePerCarat: 50,
  },
  {
    title: "Very, Very Slightly Included (VVS2)",
    value: "VVS2",
    pricePerCarat: 25,
  },
  {
    title: "Very Slightly Included (VS1)",
    value: "VS1",
    pricePerCarat: 15,
  },
  {
    title: "Very Slightly Included (VS2)",
    value: "VS2",
    pricePerCarat: 0,
  },
];

const CARAT_RANGE_PRICES = [
  {
    carats: [1.5, 2, 2.5, 3, 3.5, 4],
    pricePerCarat: 175,
  },
  {
    carats: [4.5, 5, 5.5, 6, 6.5, 7],
    pricePerCarat: 195,
  },
];

const METAL_PRICE_PER_GRAM = 75;
const SIDE_DIAMOND_PRICE_PER_CARAT = 150;
const PRICE_MULTIPLIER = 3;

const MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT = 5;

module.exports = {
  getCurrentDate,
  getNonCustomizedProducts,
  ALLOWED_DIA_COLORS,
  ALLOWED_DIA_CLARITIES,
  CARAT_RANGE_PRICES,
  METAL_PRICE_PER_GRAM,
  SIDE_DIAMOND_PRICE_PER_CARAT,
  PRICE_MULTIPLIER,
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
};
