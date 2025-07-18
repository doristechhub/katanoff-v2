const uid = require("uid");
const { amsDbInstance } = require("../firebase");
const {
  getCurrentDate,
  DISCOUNT_PURCHASE_MODES,
  DISCOUNT_CUSTOMER_ELIGIBILITY,
  DISCOUNT_TYPES,
  DISCOUNT_APPLICATION_METHODS,
  SIGN_UP_DISCOUNT,
} = require("../helpers/common");
const moment = require("moment");

const discountUrl = process.env.DISCOUNT_URL;
const exportFunction = {};

exportFunction.getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const discountRef = amsDbInstance.ref(`${discountUrl}`);
      const snapshot = await discountRef.once("value");
      const discountList = snapshot.exists()
        ? Object.values(snapshot.val())
        : [];
      resolve(discountList);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.create = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid.uid();
      params.id = uuid;
      params.createdDate = getCurrentDate();
      params.updatedDate = getCurrentDate();
      const discountRef = amsDbInstance.ref(`${discountUrl}/${params.id}`);
      await discountRef.set(params);
      resolve(params);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findOne = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { discountId } = findPattern;
      const discountRef = amsDbInstance.ref(`${discountUrl}/${discountId}`);
      const snapshot = await discountRef.once("value");
      const discountData = snapshot.exists() ? snapshot.val() : null;
      resolve(discountData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findByPromoCode = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { promoCode } = findPattern;
      const discountRef = amsDbInstance.ref(`${discountUrl}`);
      const snapshot = await discountRef
        .orderByChild("promoCode")
        .equalTo(promoCode)
        .once("value");
      const discountData = snapshot.exists()
        ? Object.values(snapshot.val())
        : [];
      const foundData = discountData.length ? discountData[0] : null;
      resolve(foundData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.getEligibleUsers = (discountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discountRef = amsDbInstance.ref(`${discountUrl}/${discountId}`);
      const snapshot = await discountRef.once("value");
      const discountData = snapshot.exists() ? snapshot.val() : null;
      if (
        !discountData ||
        discountData.customerEligibility !== "Selected Customers"
      ) {
        resolve([]);
      } else {
        // Assume eligibleUsers is an array field in the discount record
        const eligibleUsers = discountData.eligibleUsers || [];
        resolve(eligibleUsers);
      }
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.deleteOne = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { discountId } = findPattern;
      await amsDbInstance.ref(`${discountUrl}/${discountId}`).remove();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findOneAndUpdate = (findPattern, updatePattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { discountId } = findPattern;
      updatePattern.updatedDate = getCurrentDate();
      await amsDbInstance
        .ref(`${discountUrl}/${discountId}`)
        .update(updatePattern);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.validatePromoCode = async ({
  promoCode,
  subTotal = 0,
  orderService,
  userData,
}) => {
  try {
    const discounts = await exportFunction.getAll();
    const foundDiscount = discounts?.find(
      (discount) =>
        discount?.promoCode?.toUpperCase() === promoCode?.toUpperCase()
    );

    if (!foundDiscount) {
      return { valid: false, message: "Invalid promo code" };
    }
    const userId = userData?.id;
    const userEmail = userData?.email;
    // Check if the promo code is "Sign Up Discount" and verify user is logged in
    if (
      foundDiscount?.name?.toUpperCase() === SIGN_UP_DISCOUNT.toUpperCase() &&
      !userId
    ) {
      return {
        valid: false,
        message: "You must be logged in to use the Sign Up Discount promo code",
      };
    }

    if (foundDiscount?.discountType !== DISCOUNT_TYPES?.ORDER_DISCOUNT) {
      return {
        valid: false,
        message:
          "This promocode cannot be used. We currently support only Order Discount type promocodes.",
      };
    }

    if (
      foundDiscount?.applicationMethod !== DISCOUNT_APPLICATION_METHODS?.CODE
    ) {
      return {
        valid: false,
        message:
          "This promocode cannot be used. We currently support only manual promocodes.",
      };
    }

    if (
      foundDiscount?.customerEligibility ===
      DISCOUNT_CUSTOMER_ELIGIBILITY?.SELECTED_CUSTOMERS
    ) {
      return {
        valid: false,
        message:
          "This promocode cannot be used. We currently support every eligible customers.",
      };
    }

    const currentDate = moment();
    const startDate = moment(
      foundDiscount?.dateRange?.beginsAt,
      "MM-DD-YYYY HH:mm"
    );
    const expiryDate = foundDiscount?.dateRange?.expiresAt
      ? moment(foundDiscount?.dateRange?.expiresAt, "MM-DD-YYYY HH:mm")
      : null;

    // Check date validity
    if (currentDate.isBefore(startDate)) {
      return { valid: false, message: "Promo code is not yet active" };
    }
    if (expiryDate && currentDate.isAfter(expiryDate)) {
      return { valid: false, message: "Promo code has expired" };
    }

    // Check customer eligibility (uncomment and complete if needed)
    /*
    if (
      foundDiscount?.customerEligibility === DISCOUNT_CUSTOMER_ELIGIBILITY.SELECTED_CUSTOMERS
    ) {
      const eligibleUsers = await discountService.getEligibleUsers(foundDiscount.id);
      if (!eligibleUsers.includes(userId)) {
        return {
          valid: false,
          message: "Promo code not applicable for this user",
        };
      }
    }
    */

    // Check minimum order value
    const minOrderValue = foundDiscount?.minimumOrderValue || 0;
    if (minOrderValue > 0 && subTotal < minOrderValue) {
      return {
        valid: false,
        message: `Promo code requires a minimum order value of $${minOrderValue}.`,
      };
    }

    // Check purchase mode
    if (foundDiscount?.purchaseMode === DISCOUNT_PURCHASE_MODES.ONE_TIME) {
      if (!userId) {
        return {
          valid: false,
          message: "Please log in to apply this one-time promo code.",
        };
      }
      if (!userEmail) {
        return {
          valid: false,
          message:
            "An email address is required to apply this one-time promo code.",
        };
      }

      const orders = await orderService.getOrdersByPromoCode(
        foundDiscount?.promoCode
      );

      const existingOrder = orders?.find(
        (order) =>
          order?.shippingAddress?.email?.toUpperCase() ===
          userEmail?.toUpperCase() &&
          order?.promoCode?.toUpperCase() === promoCode?.toUpperCase()
      );

      if (existingOrder) {
        return {
          valid: false,
          message: `This promo code has been already used by ${userEmail}`,
        };
      }
    }

    return { valid: true, foundDiscount };
  } catch (error) {
    console.error("Error validating promo code:", error);
    return {
      valid: false,
      message:
        error?.message || "An error occurred while validating the promo code",
    };
  }
};

module.exports = exportFunction;
