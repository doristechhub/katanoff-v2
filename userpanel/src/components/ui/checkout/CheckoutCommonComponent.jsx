"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { helperFunctions } from "@/_helper";
import { CustomImg, ProgressiveImg } from "../../dynamiComponents";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import { fetchCart } from "@/_actions/cart.action";
import { setIsNewYorkState } from "@/store/slices/checkoutSlice";
import { usePathname } from "next/navigation";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import DiamondDetailDrawer from "../customize/DiamondDetailDrawer";
import { paymentOptions } from "@/_utils/paymentOptions";

const salesTaxPerc = 0.08; // 8%

const CheckoutCommonComponent = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { openDiamondDetailDrawer } = useSelector(({ common }) => common);
  const pathname = usePathname();
  const { cartList } = useSelector((state) => state.cart);
  const { isNewYorkState } = useSelector(({ checkout }) => checkout);
  const { selectedShippingCharge } = useSelector(({ checkout }) => checkout);
  useEffect(() => {
    if (!cartList.length) {
      dispatch(fetchCart());
    }
  }, [cartList.length, dispatch]);

  useEffect(() => {
    const address = localStorage.getItem("address");
    const getParsedAddress = address ? JSON.parse(address) : null;
    const newYorkState = getParsedAddress?.state?.toLowerCase() === "new york";

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
      return subTotal * salesTaxPerc; //8%
    }
    return 0;
  }, [cartList, getSubTotal, isNewYorkState]);

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

  return (
    <>
      <div className="hidden lg:block ">
        <div className=" flex flex-col gap-6 pt-8 lg:pt-12 h-fit">
          <section
            className="bg-white px-2 xs:px-6 flex-1 overflow-y-auto max-h-[45vh]"
            ref={cartContentRef}
          >
            {cartList?.map((cartItem) => (
              <div
                className="bg-white py-6  border-b-2 border-alabaster last:border-b-0"
                key={cartItem?.id}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative flex border border-alabaster w-36 h-36 md:w-36 md:h-36 mx-auto">
                    <div className="absolute top-0 left-0 bg-primary text-white text-xs xs:text-sm font-semibold px-3 py-1  z-10">
                      Qty: {cartItem?.quantity}
                    </div>

                    <ProgressiveImg
                      src={cartItem?.productImage}
                      alt={cartItem?.productName}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col xs:flex-row xs:justify-between  items-center">
                      <p className="text-lg 2xl:text-xl font-semibold">
                        {cartItem?.productName}
                      </p>

                      <p className="text-xl 2xl:text-2xl font-medium font-chong-modern pt-1">
                        $
                        {helperFunctions.toFixedNumber(
                          cartItem?.quantityWiseSellingPrice
                        )}
                      </p>
                    </div>

                    {cartItem?.diamondDetail && (
                      <p className="font-chong-modern text-xl 2xl:text-2xl font-medium text-baseblack">
                        $
                        {helperFunctions
                          .calculateCustomProductPrice({
                            netWeight: cartItem?.netWeight,
                            variations: cartItem?.variations,
                          })
                          .toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        {` × ${cartItem?.quantity}`}
                      </p>
                    )}
                    <div className="text-baseblack flex flex-wrap gap-2 md:gap-x-4 md:gap-y-2 pt-2">
                      {cartItem?.variations?.map((variItem) => (
                        <div
                          className="border-2  text-sm xs:text-base px-2 font-medium"
                          key={variItem?.variationId}
                        >
                          <span className="font-bold">
                            {variItem?.variationName}:{" "}
                          </span>{" "}
                          {variItem?.variationTypeName}
                        </div>
                      ))}
                    </div>
                    {!cartItem?.diamondDetail && (
                      <div className=" text-sm font-semibold xs:text-base px-2  w-fit mt-2">
                        $
                        {helperFunctions.toFixedNumber(
                          cartItem?.quantityWiseSellingPrice /
                            cartItem?.quantity
                        )}{" "}
                        | Per Item
                      </div>
                    )}
                    <div className="hidden xl:block mt-4">
                      <DiamondDetailDrawer
                        cartItem={cartItem}
                        isCheckoutPage={true}
                        openDiamondDetailDrawer={openDiamondDetailDrawer}
                        dispatch={dispatch}
                        setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                      />
                    </div>
                  </div>
                </div>
                <div className="xl:hidden mt-4">
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
          </section>
          <section className="bg-white px-2 xs:px-10 pt-10">
            <p className="text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold">
              Order Summary
            </p>
            <p className="my-4 border-t-2 border-black_opacity_10" />
            <p className="text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
              Subtotal: <span>${getSubTotal()}</span>
            </p>
            {pathname === "/checkout" ? (
              <p className="text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Sales Tax {calculateNextStep}
              </p>
            ) : (
              <div className="flex justify-between pt-4 text-baseblack">
                <p className="text-lg 2xl:text-xl text-baseblack flex flex-col justify-between font-semibold  max-w-[75%]">
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
              <p className="text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Shipping {calculateNextStep}
              </p>
            ) : (
              <div className="flex justify-between pt-4 text-baseblack">
                <p className="text-lg 2xl:text-xl text-baseblack  font-semibold  max-w-[75%]">
                  Shipping
                </p>
                <span className="text-lg 2xl:text-xl text-baseblack font-medium">
                  ${selectedShippingCharge}
                </span>
              </div>
            )}

            {/* <p className="text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
          Subtotal: <span >${getSubTotal()}</span>
        </p> */}
            <p className="my-4 border-t-2 border-black_opacity_10" />

            {pathname === "/checkout" ? (
              <p className="text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Grand Total: <span>${getSubTotal()}</span>
              </p>
            ) : (
              <p className="text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Grand Total: <span>${renderTotalAmount.toFixed(2)}</span>
              </p>
            )}

            <div className="py-6 2xl:py-10">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex-grow h-px bg-gray-300" />
                <p className="text-sm md:text-lg font-medium text-baseblack uppercase whitespace-nowrap">
                  We Accept Payment
                </p>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              <div className="flex items-center gap-3">
                <p className="font-medium text-lg text-gray-500">Pay With:</p>
                <div className="flex gap-3 xl:gap-6 flex-wrap">
                  {paymentOptions?.map((option, index) => (
                    <CustomImg
                      key={index}
                      srcAttr={option?.img}
                      titleAttr={option?.titleAttr}
                      altAttr={option?.altAttr}
                      alt={option}
                      className="object-contain w-8 h-10 xs:w-10 xs:h-10 md:h-12 md:w-12 2xl:h-16 2xl:w-16"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
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
          <div className="bg-white shadow-inner border border-t-0 border-gray-200">
            <section className="px-2 xs:px-6 max-h-[45vh] overflow-y-auto">
              {cartList?.map((cartItem) => (
                <div
                  key={`cartItem-${cartItem?.productName}`}
                  className="bg-white py-6  border-b-2 border-alabaster last:border-b-0"
                >
                  <div className="flex flex-row  gap-4">
                    <div className="relative flex-shrink-0 h-fit border border-alabaster">
                      <div className="absolute top-0 left-0 bg-primary text-white text-xs xs:text-sm font-semibold px-3 py-1  z-10">
                        Qty: {cartItem?.quantity}
                      </div>

                      <ProgressiveImg
                        src={cartItem?.productImage}
                        alt={cartItem?.productName}
                        className="w-28 h-28 object-cover"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex flex-col xs:flex-row xs:justify-between ">
                        <p className="text-lg md:text-xl font-semibold">
                          {cartItem?.productName}
                        </p>

                        <p className="text-xl lg:text-2xl font-medium font-chong-modern pt-1">
                          $
                          {helperFunctions.toFixedNumber(
                            cartItem?.quantityWiseSellingPrice
                          )}
                        </p>
                      </div>

                      <div className="text-baseblack flex flex-wrap gap-2 md:gap-x-4 md:gap-y-2 pt-2">
                        {cartItem?.variations?.map((variItem) => (
                          <div
                            className="border-2  text-sm xs:text-base px-2 font-medium"
                            key={variItem?.variationId}
                          >
                            <span className="font-bold">
                              {variItem?.variationName}:{" "}
                            </span>{" "}
                            {variItem?.variationTypeName}
                          </div>
                        ))}
                      </div>
                      {cartItem?.diamondDetail && (
                        <p className="font-chong-modern text-lg md:text-xl lg:text-2xl font-medium text-baseblack pt-2">
                          $
                          {helperFunctions
                            .calculateCustomProductPrice({
                              netWeight: cartItem?.netWeight,
                              variations: cartItem?.variations,
                            })
                            .toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          {cartItem?.quantity > 1 && ` × ${cartItem.quantity}`}
                        </p>
                      )}
                      {!cartItem?.diamondDetail && (
                        <div className=" text-sm font-semibold xs:text-base px-2  w-fit mt-2">
                          $
                          {helperFunctions.toFixedNumber(
                            cartItem?.quantityWiseSellingPrice /
                              cartItem?.quantity
                          )}{" "}
                          | Per Item
                        </div>
                      )}
                      <div className="hidden xs:block mt-4">
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
                  <div className="xs:hidden mt-4">
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
            </section>

            {/* Your summary section */}
            <section className="px-4 lg:px-2 pt-4 pb-4">
              <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Subtotal: <span>${getSubTotal()}</span>
              </p>
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

              <p className="my-4 border-t-2 border-black_opacity_10" />

              {pathname === "/checkout" ? (
                <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                  Grand Total: <span>${getSubTotal()}</span>
                </p>
              ) : (
                <p className="text-base lg:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                  Grand Total: <span>${renderTotalAmount}</span>
                </p>
              )}

              <div className="py-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex-grow h-px bg-gray-300" />
                  <p className="text-sm md:text-lg font-medium text-baseblack uppercase whitespace-nowrap">
                    We Accept Payment
                  </p>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                <div className="flex items-center gap-3">
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
