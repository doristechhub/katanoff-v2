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
    title: "J - Near Colorless",
    value: "J",
  },
  {
    title: "I - Near Colorless",
    value: "I",
  },
  {
    title: "H - Near Colorless",
    value: "H",
  },
  {
    title: "G - Near Colorless",
    value: "G",
  },
  {
    title: "F - Colorless",
    value: "F",
  },
  {
    title: "E - Colorless",
    value: "E",
  },
  {
    title: "D - Colorless",
    value: "D",
  },
];

const ALLOWED_DIA_CLARITIES = [
  {
    title: "Slightly Included (SI2)",
    value: "SI2",
  },
  {
    title: "Slightly Included (SI1)",
    value: "SI1",
  },
  {
    title: "Very Slightly Included (VS2)",
    value: "VS2",
  },
  {
    title: "Very Slightly Included (VS1)",
    value: "VS1",
  },
  {
    title: "Very, Very Slightly Included (VVS2)",
    value: "VVS2",
  },
  {
    title: "Very, Very Slightly Included (VVS1)",
    value: "VVS1",
  },
  {
    title: "Internally Flawless (IF)",
    value: "IF",
  },
  {
    title: "Flawless (FL)",
    value: "FL",
  },
];

const METAL_PRICES = {
  "10K": 45, // Example price for 10k gold
  "14K": 60, // Example price for 14k gold
};
const PRICE_MULTIPLIER = 1.264;

const CLARITY_COLOR_PRICES = {
  SI2: { J: 3000, I: 3200, H: 3400, G: 3600, F: 3800, E: 4000, D: 4200 },
  SI1: { J: 3500, I: 3700, H: 3900, G: 4100, F: 4300, E: 4500, D: 4700 },
  VS2: { J: 4000, I: 4200, H: 4400, G: 4600, F: 4800, E: 5000, D: 5200 },
  VS1: { J: 4500, I: 4700, H: 4900, G: 5100, F: 5300, E: 5500, D: 5700 },
  VVS2: { J: 5000, I: 5200, H: 5400, G: 5600, F: 5800, E: 6000, D: 6200 },
  VVS1: { J: 5500, I: 5700, H: 5900, G: 6100, F: 6300, E: 6500, D: 6700 },
  IF: { J: 6000, I: 6200, H: 6400, G: 6600, F: 6800, E: 7000, D: 7200 },
  FL: { J: 6500, I: 6700, H: 6900, G: 7100, F: 7300, E: 7500, D: 7700 },
};

const MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT = 5;

module.exports = {
  getCurrentDate,
  getNonCustomizedProducts,
  ALLOWED_DIA_COLORS,
  ALLOWED_DIA_CLARITIES,
  METAL_PRICES,
  PRICE_MULTIPLIER,
  CLARITY_COLOR_PRICES,
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
};
