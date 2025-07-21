import { FIXED, messageType, ONE_TIME, PERCENTAGE } from "@/_helper";
import { couponService } from "@/_services";
import {
  setAppliedPromoDetail,
  setCouponCode,
  setCouponMessage,
  setDiscountAmount,
  setPromoCodeLoading,
} from "@/store/slices/couponSlice";

export const verifyCouponCode = ({ promoCode, orderValue }) => {
  return async (dispatch) => {
    try {
      const trimmedCode = promoCode?.trim();
      if (!trimmedCode) {
        dispatch(
          setCouponMessage({
            message: "Please enter a Promo code",
            type: messageType.ERROR,
          })
        );
        return;
      }
      if (orderValue < 0) {
        dispatch(
          setCouponMessage({
            message: "Invalid order value",
            type: messageType.ERROR,
          })
        );
        return;
      }
      dispatch(setPromoCodeLoading(true));

      const matchedCoupon = await couponService?.validateCoupon({
        promoCode: trimmedCode,
        orderValue,
      });

      let discount = 0;

      if (matchedCoupon.discountDetails) {
        const { type, amount } = matchedCoupon.discountDetails;
        if (type === PERCENTAGE) {
          discount = (amount / 100) * orderValue;
        } else if (type === FIXED) {
          discount = Math.min(amount, orderValue);
        }
      }
      const formattedDiscount = parseFloat(discount.toFixed(2));
      dispatch(setDiscountAmount(formattedDiscount));
      dispatch(setAppliedPromoDetail(matchedCoupon));
      dispatch(
        setCouponMessage({
          message:
            matchedCoupon.purchaseMode === ONE_TIME
              ? `Promo ${matchedCoupon?.promoCode} applied successfully with ${matchedCoupon?.purchaseMode} use for ${matchedCoupon.appliedEmail}`
              : `Promo ${matchedCoupon?.promoCode} Applied Successfully!`,
          type: messageType.SUCCESS,
        })
      );
      return matchedCoupon;
    } catch (error) {
      dispatch(setAppliedPromoDetail(null));
      dispatch(
        setCouponMessage({
          message: error.message || "Invalid Promo code",
          type: messageType.ERROR,
        })
      );
      return;
    } finally {
      dispatch(setPromoCodeLoading(false));
    }
  };
};

export const removeCouponCode = () => {
  return (dispatch) => {
    localStorage.removeItem("appliedCoupon");
    dispatch(setCouponCode(""));
    dispatch(setAppliedPromoDetail(null));
    dispatch(setCouponMessage({ message: "", type: "" }));
    dispatch(setDiscountAmount(0));
  };
};
