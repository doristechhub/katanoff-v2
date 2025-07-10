import {
  DISCOUNT_APPLICATION_METHODS,
  DISCOUNT_TYPES,
  discountsUrl,
  fetchWrapperService,
  helperFunctions,
  ONE_TIME,
  SELECTED_CUSTOMERS,
  SIGN_UP_DISCOUNT,
} from "@/_helper";
import moment from "moment";
import { orderService } from "./order.service";

const getAllPromoCodes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService?.getAll(discountsUrl);
      const promoCodeData = respData ? Object.values(respData) : [];
      resolve(promoCodeData);
    } catch (e) {
      reject(e);
    }
  });
};

const validateCoupon = async ({ promoCode, orderValue }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCoupons = await getAllPromoCodes();
      const matchedCoupon = allCoupons.find(
        (coupon) => coupon.promoCode.toUpperCase() === promoCode.toUpperCase()
      );

      if (!matchedCoupon) {
        reject(new Error("Invalid promo code"));
      }
      const userData = helperFunctions?.getCurrentUser();
      const userId = userData?.id;
      const userEmail = userData?.email;

      if (
        matchedCoupon?.name?.toUpperCase() === SIGN_UP_DISCOUNT.toUpperCase() &&
        !userId
      ) {
        throw new Error(
          "You must be logged in to use the Sign Up Discount promo code"
        );
      }

      if (matchedCoupon?.discountType !== DISCOUNT_TYPES?.ORDER_DISCOUNT) {
        throw new Error(
          "This promocode cannot be used. We currently support only Order Discount type promocodes."
        );
      }

      if (
        matchedCoupon?.applicationMethod !== DISCOUNT_APPLICATION_METHODS?.CODE
      ) {
        throw new Error(
          "This promocode cannot be used. We currently support only manual promocodes."
        );
      }

      if (matchedCoupon?.customerEligibility === SELECTED_CUSTOMERS) {
        throw new Error(
          "This promocode cannot be used. We currently support every eligible customers."
        );
      }

      const currentDate = moment();
      const startDate = moment(
        matchedCoupon.dateRange?.beginsAt,
        "MM-DD-YYYY HH:mm"
      );
      const expiryDate = moment(
        matchedCoupon.dateRange?.expiresAt,
        "MM-DD-YYYY HH:mm"
      );

      if (currentDate?.isBefore(startDate)) {
        throw new Error("This Promo code is yet not activated");
      }

      if (expiryDate && currentDate.isAfter(expiryDate)) {
        throw new Error("This Promo code is expired");
      }

      // Check minimum order value
      const minOrderValue = matchedCoupon?.minimumOrderValue || 0;

      if (minOrderValue > 0 && orderValue < minOrderValue) {
        reject(
          new Error(
            `promo code requires a minimum order value of $${minOrderValue}.`
          )
        );
        return;
      }

      if (matchedCoupon.purchaseMode === ONE_TIME) {
        if (!userId) {
          return reject(
            new Error("Please log in to apply this one-time promo code.")
          );
        }
        if (!userEmail) {
          return reject(
            new Error(
              "An email address is required to apply this one-time promo code."
            )
          );
        }
        const orders = await orderService?.getAllOrdersWithoutLogin();

        const existingOrder = orders?.find(
          (order) =>
            order?.shippingAddress?.email?.toUpperCase() ===
              userEmail?.toUpperCase() &&
            order?.promoCode?.toUpperCase() ===
              matchedCoupon?.promoCode?.toUpperCase()
        );

        if (existingOrder) {
          return reject(
            new Error(`This promo code has been already used by ${userEmail}`)
          );
        }
        matchedCoupon.appliedEmail = userEmail;
      }
      resolve(matchedCoupon);
    } catch (error) {
      reject(error);
    }
  });
};

export const couponService = {
  getAllPromoCodes,
  validateCoupon,
};
