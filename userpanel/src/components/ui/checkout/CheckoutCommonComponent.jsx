"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FIXED,
  helperFunctions,
  LENGTH,
  messageType,
  PERCENTAGE,
  RING_SIZE,
} from "@/_helper";
import { CustomImg, ProgressiveImg } from "../../dynamiComponents";
import { fetchCart } from "@/_actions/cart.action";
import { setIsNewYorkState } from "@/store/slices/checkoutSlice";
import { setCouponCode, setCouponMessage } from "@/store/slices/couponSlice";
import { usePathname } from "next/navigation";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import DiamondDetailDrawer from "../customize/DiamondDetailDrawer";
import { paymentOptions } from "@/_utils/paymentOptions";
import effect from "@/assets/icons/effect.png";
import { PrimaryButton } from "../button";
import couponCodeRight from "@/assets/icons/couponCodeRight.svg";
import couponCodeWrong from "@/assets/icons/couponCodeWrong.svg";
import { applyCouponCode, removeCouponCode } from "@/_actions/coupon.action";
const salesTaxPerc = 0.08;

const CheckoutCommonComponent = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { openDiamondDetailDrawer } = useSelector(({ common }) => common);
  const pathname = usePathname();
  const { cartList } = useSelector(({ cart }) => cart);
  const { isNewYorkState, selectedShippingCharge } = useSelector(
    ({ checkout }) => checkout
  );
  const { couponCode, appliedCode, couponMessage, userEmail } = useSelector(
    ({ coupon }) => coupon
  );

  useEffect(() => {
    if (!cartList.length) {
      dispatch(fetchCart());
    }
  }, [cartList.length, dispatch]);

  const getCouponDiscountValue = () => {
    if (!appliedCode || !appliedCode.discountDetails) return 0;
    const { type, amount } = appliedCode.discountDetails;
    const subtotal = getSubTotal();
    if (type === PERCENTAGE) {
      return ((amount / 100) * subtotal).toFixed(2);
    } else if (type === FIXED) {
      return Math.min(amount, subtotal).toFixed(2);
    }
    return 0;
  };

  useEffect(() => {
    const address = localStorage.getItem("address");
    const getParsedAddress = address ? JSON.parse(address) : null;

    const newYorkState = getParsedAddress?.stateCode?.toLowerCase() === "ny";

    if (newYorkState !== isNewYorkState) {
      dispatch(setIsNewYorkState(newYorkState));
    }
  }, [dispatch, isNewYorkState]);

  const getSubTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item?.quantityWiseSellingPrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  const getSalesTaxAmount = useCallback(() => {
    if (isNewYorkState) {
      const subTotal = Number(getSubTotal(cartList));
      const discountValue = Number(getCouponDiscountValue()) || 0;

      return (subTotal - discountValue) * salesTaxPerc;
    }
    return 0;
  }, [cartList, getSubTotal, getCouponDiscountValue, isNewYorkState]);

  useEffect(() => {
    const contentElement = cartContentRef.current;
    if (!contentElement) return;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const scrollAmount = event.deltaY;
      const maxScroll =
        contentElement?.scrollHeight - contentElement?.clientHeight;
      const currentScroll = contentElement?.scrollTop + scrollAmount;

      contentElement.scrollTop = Math.max(
        0,
        Math.min(currentScroll, maxScroll)
      );
    };

    contentElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      contentElement.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const renderTotalAmount = useMemo(() => {
    const subTotal = Number(getSubTotal(cartList));
    const subTotalWithSalesTax = isNewYorkState
      ? subTotal + subTotal * salesTaxPerc // 8%
      : subTotal;
    return subTotal < 199
      ? subTotalWithSalesTax + Number(selectedShippingCharge)
      : subTotalWithSalesTax;
  }, [cartList, getSubTotal, isNewYorkState, selectedShippingCharge]);

  const cartContentRef = useRef(null);

  const calculateNextStep = useMemo(() => {
    return <span className="text-lg font-normal">Calculated at next step</span>;
  }, []);

  const getGrandTotal = useCallback(() => {
    const subTotal = Number(getSubTotal());

    const discountedSubTotal = subTotal - getCouponDiscountValue();

    const taxedAmount = isNewYorkState
      ? discountedSubTotal + discountedSubTotal * salesTaxPerc
      : discountedSubTotal;

    const shippingCharge = subTotal < 199 ? Number(selectedShippingCharge) : 0;

    const grandTotal = taxedAmount + shippingCharge;

    return grandTotal.toFixed(2);
  }, [
    getSubTotal,
    getCouponDiscountValue,
    isNewYorkState,
    selectedShippingCharge,
  ]);

  return (
    <>
      <div className="hidden lg:block ">
        <div className=" flex flex-col gap-6 pt-8 lg:pt-12 h-fit">
          <div className="border border-grayborder rounded-md">
            <div className="flex mx-auto justify-center py-4">
              <p className="text-lg lg:text-xl font-bold"> Order Summary</p>
            </div>
            <section
              className=" px-2 xs:px-6 flex-1 overflow-y-auto max-h-[65vh] custom-scrollbar relative"
              ref={cartContentRef}
            >
              {cartList?.map((cartItem) => (
                <div
                  className="py-6  border-b border-grayborder last:border-b-0"
                  key={cartItem?.id}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex md:w-32 md:h-32 mx-auto">
                      <div className="absolute -top-2 -left-2 bg-baseblack text-white text-sm lg:text-base font-semibold rounded-full px-2">
                        {cartItem?.quantity}
                      </div>

                      <ProgressiveImg
                        src={cartItem?.productImage}
                        alt={cartItem?.productName}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <p className="text-base font-semibold">
                        {cartItem?.productName}
                      </p>

                      <p className="text-baseblack flex flex-wrap text-sm xs:text-[15px]">
                        {helperFunctions?.displayVariationsLabel(
                          cartItem?.variations
                        )}
                      </p>

                      {[RING_SIZE, LENGTH].map((variationName) => {
                        const { name, type, exists } =
                          helperFunctions?.getVariationDisplay(
                            cartItem?.variations,
                            variationName
                          );
                        return exists ? (
                          <div
                            key={variationName}
                            className="flex items-center gap-2 pt-2 sm:pt-0"
                          >
                            <p className="text-sm items-center md:text-base font-medium text-baseblack">
                              {name}: {type}
                            </p>
                          </div>
                        ) : null;
                      })}
                      <p className="text-sm font-semibold xs:text-base w-fit">
                        $
                        {cartItem?.productSellingPrice?.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                        {` × ${cartItem?.quantity}`}
                      </p>

                      <div className="hidden xl:block">
                        <DiamondDetailDrawer
                          cartItem={cartItem}
                          isCheckoutPage={true}
                          openDiamondDetailDrawer={openDiamondDetailDrawer}
                          dispatch={dispatch}
                          setOpenDiamondDetailDrawer={
                            setOpenDiamondDetailDrawer
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="xl:hidden">
                    <DiamondDetailDrawer
                      cartItem={cartItem}
                      isCheckoutPage={true}
                      openDiamondDetailDrawer={openDiamondDetailDrawer}
                      dispatch={dispatch}
                      setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                    />
                  </div>
                </div>
              ))}
              {cartList?.length > 3 && (
                <div className="sticky bottom-0 w-full h-24 pointer-events-none">
                  <CustomImg
                    src={effect}
                    alt="Effect"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </section>
            <section className="px-2 xs:px-10 pt-6">
              {pathname === "/checkout" && (
                <>
                  <p className="text-lg text-baseblack flex justify-between font-semibold pt-4">
                    Promo Code
                  </p>
                  <div className="flex justify-between pt-1 text-baseblack gap-2">
                    <input
                      type="text"
                      placeholder="Enter Promo Code"
                      className="w-full bg-transparent border border-grayborder px-4 py-2 focus:outline-none"
                      value={couponCode}
                      onChange={(e) => {
                        dispatch(setCouponCode(e.target.value));
                        dispatch(setCouponMessage({ message: "", type: "" }));
                      }}
                      disabled={!!appliedCode}
                    />
                    {appliedCode ? (
                      <PrimaryButton
                        onClick={() => dispatch(removeCouponCode())}
                      >
                        Remove
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={() =>
                          dispatch(
                            applyCouponCode(
                              couponCode,
                              getSubTotal(),
                              userEmail
                            )
                          )
                        }
                      >
                        Apply
                      </PrimaryButton>
                    )}
                  </div>

                  {appliedCode &&
                    couponMessage?.type === messageType?.SUCCESS && (
                      <div className="flex items-center gap-1 pt-2 text-[#32BA7C] text-md">
                        <CustomImg
                          srcAttr={couponCodeRight}
                          altAttr="Promocode Applied"
                          className="w-5 h-5"
                        />
                        {couponMessage?.message}
                      </div>
                    )}
                  {couponMessage?.message &&
                    couponMessage?.type === messageType?.ERROR && (
                      <div className="flex items-center gap-1 pt-2 text-[#EE5A5A] text-md">
                        <CustomImg
                          srcAttr={couponCodeWrong}
                          altAttr="Promocode Applied"
                          className="w-5 h-5"
                        />
                        <p>{couponMessage?.message}</p>
                      </div>
                    )}
                </>
              )}
              <p className="text-lg text-baseblack flex justify-between font-semibold pt-4">
                Subtotal: <span>${getSubTotal()}</span>
              </p>
              {appliedCode ? (
                <div className="flex justify-between pt-4 text-baseblack">
                  <p className="text-lg text-baseblack flex justify-between font-semibold">
                    Discount
                  </p>
                  <span className="text-lg text-baseblack font-medium">
                    -${getCouponDiscountValue()}
                  </span>
                </div>
              ) : null}
              {pathname === "/checkout" ? (
                <p className="text-lg text-baseblack flex justify-between font-semibold pt-4">
                  Sales Tax {calculateNextStep}
                </p>
              ) : (
                <div className="flex justify-between pt-4 text-baseblack">
                  <p className="text-lg text-baseblack flex flex-col justify-between font-semibold  max-w-[75%]">
                    Sales Tax (8%)
                    <br />
                    <span className="text-xs font-normal text-gray-500 leading-snug">
                      *Sales tax will be applied to orders shipped to addresses
                      within New York State.
                    </span>
                  </p>
                  <span className="text-lg text-baseblack font-medium">
                    ${helperFunctions.toFixedNumber(getSalesTaxAmount())}
                  </span>
                </div>
              )}
              {pathname === "/checkout" ? (
                <p className="text-lg text-baseblack flex justify-between font-semibold pt-4">
                  Shipping {calculateNextStep}
                </p>
              ) : (
                <div className="flex justify-between pt-4 text-baseblack">
                  <p className="text-lg text-baseblack  font-semibold  max-w-[75%]">
                    Shipping
                  </p>
                  <span className="text-lg text-baseblack font-medium">
                    {selectedShippingCharge > 0
                      ? "$" + selectedShippingCharge
                      : "Free"}
                  </span>
                </div>
              )}
              <p className="my-4 border-t-2 border-grayborder" />
              <p className="text-lg text-baseblack flex justify-between font-semibold pt-2">
                Grand Total: <span>${getGrandTotal()}</span>
              </p>

              <div className="py-6">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="flex-grow h-px bg-gray-300" />
                  <p className="text-sm md:text-base font-medium text-baseblack uppercase whitespace-nowrap">
                    We Accept Payment
                  </p>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                <div className="flex items-center gap-3">
                  <p className="font-medium text-base text-gray-500">
                    Pay With:
                  </p>
                  <div className="flex gap-3 xl:gap-6 flex-wrap">
                    {paymentOptions?.map((option, index) => (
                      <CustomImg
                        key={index}
                        srcAttr={option?.img}
                        titleAttr={option?.titleAttr}
                        altAttr={option?.altAttr}
                        alt={option}
                        className="object-contain w-8 h-10 xs:w-10 xs:h-10"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center bg-primary text-white px-4 py-3 font-semibold"
        >
          <div className="flex justify-between w-full">
            <span>Order Summary</span>
            <span className="px-1">${getSubTotal()}</span>
          </div>
          {isOpen ? (
            <HiChevronUp className="w-5 h-5" />
          ) : (
            <HiChevronDown className="w-5 h-5" />
          )}
        </button>

        {isOpen && (
          <div className="shadow-inner border border-t-0 border-gray-200">
            <section className="px-4 xs:px-6 max-h-[50vh] overflow-y-auto">
              {cartList?.map((cartItem) => (
                <div
                  key={`cart-item-${cartItem?.id}`}
                  className="py-6 border-b border-grayborder last:border-b-0"
                >
                  <div className="flex flex-row  gap-4">
                    <div className="relative  w-28 h-28">
                      <div className="absolute -top-2 -left-2 bg-baseblack text-white text-sm lg:text-base font-semibold px-2 py-0.5 rounded-full">
                        {cartItem?.quantity}
                      </div>

                      <ProgressiveImg
                        src={cartItem?.productImage}
                        alt={cartItem?.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <p className="text-base font-semibold">
                        {cartItem?.productName}
                      </p>
                      <p className="text-baseblack flex flex-wrap text-sm xs:text-[15px]">
                        {helperFunctions?.displayVariationsLabel(
                          cartItem?.variations
                        )}
                      </p>
                      {[RING_SIZE, LENGTH].map((variationName) => {
                        const { name, type, exists } =
                          helperFunctions?.getVariationDisplay(
                            cartItem?.variations,
                            variationName
                          );
                        return exists ? (
                          <div
                            key={variationName}
                            className="flex items-center gap-2 pt-2 sm:pt-0"
                          >
                            <p className="text-sm items-center md:text-base font-medium text-baseblack">
                              {name}: {type}
                            </p>
                          </div>
                        ) : null;
                      })}

                      <p className="text-sm font-semibold xs:text-base w-fit mt-1">
                        $
                        {cartItem?.productSellingPrice?.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                        {` × ${cartItem?.quantity}`}
                      </p>

                      <div className="hidden xs:block">
                        <DiamondDetailDrawer
                          cartItem={cartItem}
                          isCheckoutPage={true}
                          openDiamondDetailDrawer={openDiamondDetailDrawer}
                          dispatch={dispatch}
                          setOpenDiamondDetailDrawer={
                            setOpenDiamondDetailDrawer
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="xs:hidden">
                    <DiamondDetailDrawer
                      cartItem={cartItem}
                      isCheckoutPage={true}
                      openDiamondDetailDrawer={openDiamondDetailDrawer}
                      dispatch={dispatch}
                      setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                    />
                  </div>
                </div>
              ))}
              {cartList?.length > 3 && (
                <div className="sticky bottom-0 w-full h-24 pointer-events-none">
                  <CustomImg
                    src={effect}
                    alt="Effect"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </section>

            {/* Your summary section */}
            <section className="px-4 lg:px-2 pt-4 pb-4">
              {pathname === "/checkout" && (
                <>
                  <p className="text-lg text-baseblack flex justify-between font-semibold pt-4">
                    Promo Code
                  </p>
                  <div className="flex justify-between pt-1 text-baseblack gap-2">
                    <input
                      type="text"
                      placeholder="Enter Promo Code"
                      className="w-full bg-transparent border border-grayborder px-4 py-2 focus:outline-none"
                      value={couponCode}
                      onChange={(e) => {
                        dispatch(setCouponCode(e.target.value));
                        dispatch(setCouponMessage({ message: "", type: "" }));
                      }}
                      disabled={!!appliedCode}
                    />
                    {appliedCode ? (
                      <PrimaryButton
                        onClick={() => dispatch(removeCouponCode())}
                      >
                        Remove
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={() =>
                          dispatch(
                            applyCouponCode(
                              couponCode,
                              getSubTotal(),
                              userEmail
                            )
                          )
                        }
                      >
                        Apply
                      </PrimaryButton>
                    )}
                  </div>

                  {appliedCode &&
                    couponMessage?.type === messageType?.SUCCESS && (
                      <div className="flex items-center gap-1 pt-2 text-[#32BA7C] text-md">
                        <CustomImg
                          srcAttr={couponCodeRight}
                          altAttr="Promocode Applied"
                          className="w-5 h-5"
                        />
                        {couponMessage?.message}
                      </div>
                    )}
                  {couponMessage?.message &&
                    couponMessage?.type === messageType?.ERROR && (
                      <div className="flex items-center gap-1 pt-2 text-[#EE5A5A] text-md">
                        <CustomImg
                          srcAttr={couponCodeWrong}
                          altAttr="Promocode Applied"
                          className="w-5 h-5"
                        />
                        <p>{couponMessage?.message}</p>
                      </div>
                    )}
                </>
              )}
              <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Subtotal: <span>${getSubTotal()}</span>
              </p>
              {appliedCode ? (
                <div className="flex justify-between pt-4 text-baseblack">
                  <p className="text-lg text-baseblack flex justify-between font-semibold">
                    Discount
                  </p>
                  <span className="text-lg text-baseblack font-medium">
                    -${getCouponDiscountValue()}
                  </span>
                </div>
              ) : null}
              {pathname === "/checkout" ? (
                <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                  Sales Tax {calculateNextStep}
                </p>
              ) : (
                <div className="flex justify-between pt-4 text-baseblack">
                  <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex flex-col justify-between font-semibold  max-w-[75%]">
                    Sales Tax (8%)
                    <br />
                    <span className="text-xs font-normal text-gray-500 leading-snug">
                      *Sales tax will be applied to orders shipped to addresses
                      within New York State.
                    </span>
                  </p>
                  <span className="text-lg 2xl:text-xl text-baseblack font-medium">
                    ${helperFunctions.toFixedNumber(getSalesTaxAmount())}
                  </span>
                </div>
              )}
              {pathname === "/checkout" ? (
                <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                  Shipping {calculateNextStep}
                </p>
              ) : (
                <div className="flex justify-between pt-4 text-baseblack">
                  <p className="text-base lg:text-lg 2xl:text-xl text-baseblack  font-semibold  max-w-[75%]">
                    Shipping
                  </p>
                  <span className="text-base lg:text-lg 2xl:text-xl text-baseblack font-medium">
                    ${selectedShippingCharge}
                  </span>
                </div>
              )}

              <p className="my-4 border-t border-grayborder" />

              <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Grand Total: <span>${getGrandTotal()}</span>
              </p>

              <div className="py-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex-grow h-px bg-gray-300" />
                  <p className="text-sm md:text-lg font-medium text-baseblack uppercase whitespace-nowrap">
                    We Accept Payment
                  </p>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                <div className="flex items-center gap-3 lg:pt-2">
                  <p className="font-medium text-base lg:text-lg text-gray-500">
                    Pay With:
                  </p>
                  <div className="flex gap-3 xl:gap-6 flex-wrap">
                    {paymentOptions?.map((option, index) => (
                      <CustomImg
                        key={`payment-${index}`}
                        srcAttr={option?.img}
                        titleAttr={option?.titleAttr}
                        altAttr={option?.altAttr}
                        alt={option}
                        className="object-contain w-8 h-10 xs:w-10 xs:h-10 md:h-12 md:w-12"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutCommonComponent;
