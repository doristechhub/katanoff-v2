import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LoadingPrimaryButton, PrimaryButton } from "../button";
import { CustomImg } from "@/components/dynamiComponents";
import { applyCouponCode, removeCouponCode } from "@/_actions/coupon.action";
import { setCouponCode, setCouponMessage } from "@/store/slices/couponSlice";
import { helperFunctions, messageType } from "@/_helper";
import couponCodeRight from "@/assets/icons/couponCodeRight.svg";
import couponCodeWrong from "@/assets/icons/couponCodeWrong.svg";
import { useMemo } from "react";
import { setIsHovered } from "@/store/slices/commonSlice";

export default function CheckoutCommonSummary({
  isMobile = false,
  getSubTotal,
  getCouponDiscountValue,
  getSalesTaxAmount,
  selectedShippingCharge,
  getGrandTotal,
  paymentOptions,
}) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {
    promoCodeLoading,
    couponCode,
    appliedPromoDetail,
    couponMessage,
    userEmail,
  } = useSelector(({ coupon }) => coupon);
  const { isHovered } = useSelector(({ common }) => common);

  const calculateNextStep = useMemo(() => {
    return <span className="text-lg font-normal">Calculated at next step</span>;
  }, []);

  const handleApplyCoupon = () => {
    dispatch(
      applyCouponCode({
        promoCode: couponCode,
        orderValue: getSubTotal(),
        userEmail,
      })
    );
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCouponCode());
  };

  return (
    <section
      className={`${isMobile ? "px-4 pt-4 pb-4" : "px-2 xs:px-10 pt-6"}`}
    >
      {pathname === "/checkout" && (
        <>
          <p className="text-lg text-baseblack justify-between   font-semibold pt-4">
            Promo Code
          </p>
          <div className="flex justify-between pt-1 gap-2">
            <input
              type="text"
              placeholder="Enter Promo Code"
              className="w-full bg-transparent border border-grayborder px-4 py-2 focus:outline-none"
              value={couponCode}
              onChange={(e) => {
                dispatch(setCouponCode(e.target.value));
                dispatch(setCouponMessage({ message: "", type: "" }));
              }}
              disabled={!!appliedPromoDetail}
            />

            <div
              className="uppercase  w-fit"
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
            >
              <LoadingPrimaryButton
                className="w-full uppercase"
                loading={promoCodeLoading}
                loaderType={isHovered ? "" : "white"}
                onClick={
                  appliedPromoDetail ? handleRemoveCoupon : handleApplyCoupon
                }
              >
                {appliedPromoDetail ? "Remove" : "Apply"}
              </LoadingPrimaryButton>
            </div>
          </div>

          {appliedPromoDetail &&
            couponMessage?.type === messageType.SUCCESS && (
              <div className="flex items-center gap-1 pt-2 text-[#32BA7C] text-md">
                <CustomImg
                  srcAttr={couponCodeRight}
                  altAttr="Promocode Applied"
                  className="w-5 h-5"
                />
                {couponMessage?.message}
              </div>
            )}
          {couponMessage?.type === messageType.ERROR && (
            <div className="flex items-center gap-1 pt-2 text-[#EE5A5A] text-md">
              <CustomImg
                srcAttr={couponCodeWrong}
                altAttr="Promocode Error"
                className="w-5 h-5"
              />
              <p>{couponMessage?.message}</p>
            </div>
          )}
        </>
      )}

      <p className="text-lg text-baseblack flex justify-between font-semibold pt-4">
        Subtotal:{" "}
        <span>{helperFunctions?.formatCurrencyWithDollar(getSubTotal())}</span>
      </p>

      {appliedPromoDetail && (
        <div className="flex justify-between pt-4 text-baseblack">
          <p className="text-lg font-semibold">Discount</p>
          <span className="text-lg font-medium">
            -
            {helperFunctions?.formatCurrencyWithDollar(
              getCouponDiscountValue()
            )}
          </span>
        </div>
      )}

      {pathname === "/checkout" ? (
        <p className="text-lg font-semibold pt-4 flex justify-between text-baseblack">
          Sales Tax {calculateNextStep}
        </p>
      ) : (
        <div className="flex justify-between pt-4 text-baseblack">
          <p className="text-lg font-semibold max-w-[75%]">
            Sales Tax (8%)
            <br />
            <span className="text-xs text-gray-500 font-normal leading-snug">
              *Applies to New York addresses only.
            </span>
          </p>
          <span className="text-lg font-medium">
            {helperFunctions?.formatCurrencyWithDollar(getSalesTaxAmount())}
          </span>
        </div>
      )}

      {pathname === "/checkout" ? (
        <p className="text-lg font-semibold flex justify-between pt-4 text-baseblack">
          Shipping {calculateNextStep}
        </p>
      ) : (
        <div className="flex justify-between pt-4 text-baseblack">
          <p className="text-lg font-semibold max-w-[75%]">Shipping</p>
          <span className="text-lg font-medium">
            {selectedShippingCharge > 0 ? "$" + selectedShippingCharge : "Free"}
          </span>
        </div>
      )}

      <p className="my-4 border-t border-grayborder" />

      <p className="text-lg flex font-semibold pt-2 justify-between  text-baseblack">
        Grand Total:{" "}
        <span>
          {helperFunctions?.formatCurrencyWithDollar(getGrandTotal())}
        </span>
      </p>

      <div className="py-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex-grow h-px bg-gray-300" />
          <p className="text-sm md:text-base font-medium uppercase">
            We Accept Payment
          </p>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <div className="flex items-center gap-3">
          <p className="font-medium text-gray-500">Pay With:</p>
          <div className="flex gap-3 xl:gap-6 flex-wrap">
            {paymentOptions?.map((option, index) => (
              <CustomImg
                key={index}
                srcAttr={option?.img}
                titleAttr={option?.titleAttr}
                altAttr={option?.altAttr}
                className="object-contain w-8 h-10 xs:w-10 xs:h-10"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
