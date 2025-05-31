export const timeSlots = [
  { label: "Select a time slot", value: "" },
  { label: "10:00", value: "10:00" },
  { label: "10:30", value: "10:30" },
  { label: "11:00", value: "11:00" },
  { label: "11:30", value: "11:30" },
  { label: "12:00", value: "12:00" },
  { label: "12:30", value: "12:30" },
  { label: "13:00", value: "13:00" },
  { label: "13:30", value: "13:30" },
  { label: "14:00", value: "14:00" },
  { label: "14:30", value: "14:30" },
  { label: "15:00", value: "15:00" },
  { label: "15:30", value: "15:30" },
  { label: "16:00", value: "16:00" },
  { label: "16:30", value: "16:30" },
  { label: "17:00", value: "17:00" },
  { label: "17:30", value: "17:30" },
  { label: "18:00", value: "18:00" },
];

export const headerLinks = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/orderHistory", label: "Orders History" },
  { to: "/returnHistory", label: "Returns History" },
];

export const GOLD_TYPES = "Gold Type";
export const GOLD_COLOR = "Gold Color";

export const TOP_SELLING_PRODUCTS = "Top Selling Products";
export const FLASH_DEALS = "Flash Deals";
export const CUSTOM = "Custom";
export const WEDDING = "Wedding";
export const WEDDING_RINGS = "Wedding Rings";
export const ENGAGEMENT_RINGS = "Engagement Rings";
export const Start_WITH_SETTING = "Start With Setting";

export const ALLOWED_DIA_COLORS = [
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

export const ALLOWED_DIA_CLARITIES = [
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

export const CARAT_RANGE_PRICES = [
  {
    carats: [1.5, 2, 2.5, 3, 3.5, 4],
    pricePerCarat: 175,
  },
  {
    carats: [4.5, 5, 5.5, 6, 6.5, 7],
    pricePerCarat: 195,
  },
];

export const METAL_PRICE_PER_GRAM = 75;
export const SIDE_DIAMOND_PRICE_PER_CARAT = 150;
export const PRICE_MULTIPLIER = 3;

export const sortByList = [
  { value: "date_new_to_old", title: "New to Old" },
  { value: "date_old_to_new", title: "Old to New" },
  { value: "price_high_to_low", title: "High to Low" },
  { value: "price_low_to_high", title: "Low to High" },
  { value: "alphabetically_a_to_z", title: "A-Z" },
  { value: "alphabetically_z_to_a", title: "Z-A" },
];

export const messageType = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING",
};

export const CATEGORIES = "categories";
export const RING = "Ring";

export const MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT = 5;
export const ENGAGEMENT = "Engagement";

export const PAYPAL = "paypal";
export const STRIPE = "stripe";

// Object map for gold color to thumbnail field
export const GOLD_COLOR_MAP = {
  "rose gold": "roseGoldThumbnailImage",
  "yellow gold": "yellowGoldThumbnailImage",
  "white gold": "whiteGoldThumbnailImage",
};
