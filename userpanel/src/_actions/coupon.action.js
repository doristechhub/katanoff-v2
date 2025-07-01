import { messageType, ONE_TIME } from "@/_helper";
import { couponService } from "@/_services";
import {
  setAppliedPromoDetail,
  setCouponAppliedMail,
  setCouponCode,
  setCouponMessage,
  setPromoCodeLoading,
} from "@/store/slices/couponSlice";

export const applyCouponCode = (code, orderValue, userEmail) => {
  return async (dispatch) => {
    try {
      const trimmedCode = code?.trim();
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

      const matchedCoupon = await couponService?.validateCouponCode(
        trimmedCode,
        orderValue,
        userEmail
      );

      dispatch(setAppliedPromoDetail(matchedCoupon));
      if (matchedCoupon?.purchaseMode === ONE_TIME) {
        dispatch(setCouponAppliedMail(matchedCoupon?.appliedEmail));
      }
      dispatch(
        setCouponMessage({
          message:
            matchedCoupon.purchaseMode === ONE_TIME
              ? `Promo ${matchedCoupon?.promoCode} applied successfully with ${matchedCoupon?.purchaseMode} use for ${matchedCoupon.appliedEmail}`
              : `Promo ${matchedCoupon?.promoCode} Applied Successfully!`,
          type: messageType.SUCCESS,
        })
      );
    } catch (error) {
      dispatch(setAppliedPromoDetail(null));
      dispatch(
        setCouponMessage({
          message: error.message || "Invalid Promo code",
          type: messageType.ERROR,
        })
      );
    } finally {
      dispatch(setPromoCodeLoading(false));
    }
  };
};

export const removeCouponCode = () => {
  return (dispatch) => {
    dispatch(setCouponCode(""));
    dispatch(setAppliedPromoDetail(null));
    dispatch(setCouponMessage({ message: "", type: "" }));
  };
};
