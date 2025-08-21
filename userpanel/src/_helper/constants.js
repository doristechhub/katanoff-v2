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
export const METAL_TYPES = "Metal Type";
export const METAL_COLOR = "Metal Color";

export const RING_SIZE = "Ring Size";
export const LENGTH = "Length";
export const WIDTH = "Width";
export const DIAMOND_SHAPE = "Diamond Shape";
export const DIAMOND_QUALITY = "Diamond Quality";
export const SETTING_STYLE = "Setting Style";
export const TOP_SELLING_PRODUCTS = "Top Selling Products";
export const FLASH_DEALS = "Flash Deals";
export const CUSTOM = "Custom";
export const WEDDING = "Wedding";
export const WEDDING_RINGS = "Wedding Rings";
export const ENGAGEMENT_RINGS = "Engagement Rings";
export const Start_WITH_SETTING = "Start With Setting";
export const SIX = '6'
export const SIX_WITH_DECIMAL = '6.00'

export const DIAMOND_WEIGHT = "Diamond Weight"
export const DIAMOND_CLARITY = "Diamond Clarity"
export const DIAMOND_COLOR = "Diamond Color"
export const DIAMOND_SHAPE_KEY = "diamondShape"
export const DIAMOND_WEIGHT_KEY = "diamondWeight"
export const DIAMOND_CLARITY_KEY = "diamondClarity"
export const DIAMOND_COLOR_KEY = "diamondColor"

export const allowedVariationListForThreeSteps = [GOLD_COLOR, RING_SIZE, GOLD_TYPES, LENGTH];

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
export const CARD = "card";
// Object map for gold color to thumbnail field
export const GOLD_COLOR_MAP = {
  "rose gold": "roseGoldThumbnailImage",
  "yellow gold": "yellowGoldThumbnailImage",
  "white gold": "whiteGoldThumbnailImage",
};

// For Coupons
export const FIXED = "Fixed";
export const PERCENTAGE = "Percentage";
export const ONE_TIME = "One-Time";
export const SELECTED_CUSTOMERS = "Selected Customers";
export const DISCOUNT_TYPES = {
  ORDER_DISCOUNT: "Order Discount",
};
export const DISCOUNT_APPLICATION_METHODS = {
  CODE: "Code",
  AUTOMATIC: "Automatic",
};
export const SIGN_UP_DISCOUNT = "Sign Up Discount";
export const SHINE10 = "SHINE10";

// Diamond Shapes
export const ROUND = "Round";
export const OVAL = "Oval";
export const PRINCESS = "Princess";
export const EMERALD = "Emerald";
export const HEART = "Heart";
export const CUSHION = "Cushion";
export const MARQUISE = "Marquise";
export const ASSCHER = "Asscher";
export const RADIANT = "Radiant";
export const PEAR = "Pear";

export const SALES_TAX_PERCENTAGE = 0.08875;
export const SALES_TAX_PERCENTAGE_VALUE = "8.875%";
export const SALES_TAX_NOTE =
  "* Sales tax will be applied to addresses within New York State.";
export const ESTIMATE_AMOUNT_NOTE =
  "* Estimated Amount is provisional. After review of the returned products, the estimated amount may vary.";

// Dynamic Collections Home Page
export const TWO_GRID = "two_grid";
export const THREE_GRID = "three_grid";
export const SLIDER_GRID = "slider_grid";
export const COLLECTION_TYPES = [TWO_GRID, THREE_GRID, SLIDER_GRID];

export const CURRENT_YEAR = new Date().getFullYear();

export const NEW_YORK_CODE = "NY";
