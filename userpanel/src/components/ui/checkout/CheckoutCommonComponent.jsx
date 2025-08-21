"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  helperFunctions,
  LENGTH,
  NEW_YORK_CODE,
  RING_SIZE,
  SALES_TAX_PERCENTAGE,
} from "@/_helper";
import { CustomImg, ProgressiveImg } from "../../dynamiComponents";
import { fetchCart } from "@/_actions/cart.action";
import { setIsNewYorkState } from "@/store/slices/checkoutSlice";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import DiamondDetailDrawer from "../customize/DiamondDetailDrawer";
import { paymentOptions } from "@/_utils/paymentOptions";
import CheckoutCommonSummary from "./CheckoutCommonSummary";
import { usePathname } from "next/navigation";
const salesTaxPerc = SALES_TAX_PERCENTAGE;

const CheckoutCommonComponent = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { openDiamondDetailDrawer } = useSelector(({ common }) => common);
  const { cartList } = useSelector(({ cart }) => cart);
  const { isNewYorkState, selectedShippingCharge } = useSelector(
    ({ checkout }) => checkout
  );
  const { appliedPromoDetail, discountAmount } = useSelector(
    ({ coupon }) => coupon
  );
  const pathname = usePathname();

  useEffect(() => {
    if (!cartList.length) {
      dispatch(fetchCart());
    }
  }, [cartList.length, dispatch]);

  useEffect(() => {
    const address = localStorage.getItem("address");
    const getParsedAddress = address ? JSON.parse(address) : null;

    const newYorkState =
      getParsedAddress?.stateCode?.toUpperCase() === NEW_YORK_CODE;

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
      const discountValue = Number(discountAmount) || 0;

      return (subTotal - discountValue) * salesTaxPerc;
    }
    return 0;
  }, [cartList, getSubTotal, discountAmount, isNewYorkState]);

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

  const cartContentRef = useRef(null);

  const getGrandTotal = useCallback(() => {
    const subTotal = Number(getSubTotal());
    const discount = discountAmount;
    const discountedSubTotal = subTotal - discount;

    const isCheckoutPage = pathname === "/checkout";

    // Only apply tax if not on checkout AND if New York
    const taxedAmount =
      !isCheckoutPage && isNewYorkState
        ? discountedSubTotal + discountedSubTotal * salesTaxPerc
        : discountedSubTotal;

    const shippingCharge = subTotal < 199 ? Number(selectedShippingCharge) : 0;

    const grandTotal = taxedAmount + shippingCharge;

    return grandTotal.toFixed(2);
  }, [
    getSubTotal,
    discountAmount,
    isNewYorkState,
    selectedShippingCharge,
    salesTaxPerc,
    pathname,
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
              className="flex-1 overflow-y-auto max-h-[65vh] custom-scrollbar relative"
              ref={cartContentRef}
            >
              {cartList?.map((cartItem) => (
                <div
                  className="py-6  border-b border-grayborder last:border-b-0  px-2 xs:px-6"
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
                        {helperFunctions?.formatProductNameWithCarat({
                          caratWeight: cartItem?.diamondDetail ? cartItem?.diamondDetail?.caratWeight : cartItem?.totalCaratWeight,
                          productName: cartItem?.productName,
                        })}
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

                      <p className="text-sm font-semibold xs:text-base w-fit flex items-center gap-2">
                        $
                        {cartItem?.productSellingPrice?.toLocaleString("en-US")}
                        {` × ${cartItem?.quantity}`}
                        {cartItem?.productDiscountPerc && !cartItem?.diamondDetail ? (
                          <span className="text-xs xs:text-sm text-basegray line-through ml-2 font-normal">
                            $
                            {cartItem?.productBasePrice?.toLocaleString(
                              "en-US"
                            )}
                          </span>
                        ) : null}
                      </p>

                      {appliedPromoDetail && (
                        <p className="text-sm font-semibold xs:text-base w-fit flex items-center gap-2">
                          Promo Offer: -
                          {helperFunctions?.formatDiscountForItem({
                            productPrice: cartItem?.productSellingPrice,
                            cartQuantity: cartItem?.quantity,
                            subTotal: getSubTotal(),
                            discountAmount: discountAmount,
                          })}
                        </p>
                      )}

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
              <div
                className="pointer-events-none sticky bottom-0 left-0 w-full h-16"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(250, 250, 248, 0) 0%, #FAFAF8 76.83%)",
                }}
              />
            </section>

            <CheckoutCommonSummary
              getSubTotal={getSubTotal}
              getSalesTaxAmount={getSalesTaxAmount}
              selectedShippingCharge={selectedShippingCharge}
              getGrandTotal={getGrandTotal}
              paymentOptions={paymentOptions}
            />
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
            <span className="px-1">${getGrandTotal()}</span>
          </div>
          {isOpen ? (
            <HiChevronUp className="w-5 h-5" />
          ) : (
            <HiChevronDown className="w-5 h-5" />
          )}
        </button>

        {isOpen && (
          <div className="shadow-inner border border-t-0 border-gray-200">
            <section className="max-h-[50vh] overflow-y-auto">
              {cartList?.map((cartItem) => (
                <div
                  key={`cart-item-${cartItem?.id}`}
                  className="px-4 xs:px-6 py-6 border-b border-grayborder last:border-b-0"
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
                        {helperFunctions?.formatProductNameWithCarat({
                          caratWeight: cartItem?.diamondDetail ? cartItem?.diamondDetail?.caratWeight : cartItem?.totalCaratWeight,
                          productName: cartItem?.productName,
                        })}
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

                      <p className="text-sm font-semibold xs:text-base w-fit flex items-center gap-2">
                        $
                        {cartItem?.productSellingPrice?.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                        {` × ${cartItem?.quantity}`}
                        {cartItem?.productDiscountPerc ? (
                          <span className="text-xs xs:text-sm text-basegray line-through ml-2 font-normal">
                            $
                            {cartItem?.productBasePrice?.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </span>
                        ) : null}
                      </p>

                      {appliedPromoDetail && (
                        <p className="text-sm font-semibold xs:text-base w-fit flex items-center gap-2 ">
                          Promo Offer: -
                          {helperFunctions?.formatDiscountForItem({
                            productPrice: cartItem?.productSellingPrice,
                            cartQuantity: cartItem?.quantity,
                            subTotal: getSubTotal(),
                            discountAmount: discountAmount,
                          })}
                        </p>
                      )}

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
              <div
                className="pointer-events-none sticky -bottom-1 left-0 w-full h-16"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(250, 250, 248, 0) 0%, #FAFAF8 76.83%)",
                }}
              />
            </section>
            <CheckoutCommonSummary
              getSubTotal={getSubTotal}
              getSalesTaxAmount={getSalesTaxAmount}
              selectedShippingCharge={selectedShippingCharge}
              getGrandTotal={getGrandTotal}
              paymentOptions={paymentOptions}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default CheckoutCommonComponent;
