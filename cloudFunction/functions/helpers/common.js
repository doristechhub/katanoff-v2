const getCurrentDate = () => {
  return Date.now();
};

const getNonCustomizedProducts = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }
  return products.filter((product) => !product?.diamondDetail);
};

const formatPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, "");
  const display = `+1 ${digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`;
  const link = `+1${digits}`;
  return { display, link };
};


const MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT = 5;
const NEW_YORK = "New York";

const DISCOUNT_TYPES = {
  ORDER_DISCOUNT: "Order Discount",
};

const DISCOUNT_DETAIL_TYPES = {
  PERCENTAGE: "Percentage",
  FIXED: "Fixed",
};

const DISCOUNT_PURCHASE_MODES = {
  ONE_TIME: "One-Time",
};

const DISCOUNT_CUSTOMER_ELIGIBILITY = {
  SELECTED_CUSTOMERS: "Selected Customers",
};

const DISCOUNT_APPLICATION_METHODS = {
  CODE: "Code",
  AUTOMATIC: "Automatic",
};

const SIGN_UP_DISCOUNT = "Sign Up Discount";

module.exports = {
  getCurrentDate,
  formatPhoneNumber,
  getNonCustomizedProducts,
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
  NEW_YORK,
  DISCOUNT_TYPES,
  DISCOUNT_DETAIL_TYPES,
  DISCOUNT_PURCHASE_MODES,
  DISCOUNT_CUSTOMER_ELIGIBILITY,
  DISCOUNT_APPLICATION_METHODS,
  SIGN_UP_DISCOUNT,
};
