"use client";
import { useEffect, useCallback, useRef } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import stepArrow from "@/assets/icons/3stepArrow.svg";

import {
  handleSelectCartItem,
  removeProductIntoCart,
  updateProductQuantityIntoCart,
} from "@/_actions/cart.action";
import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { GrayLinkButton, PrimaryButton } from "@/components/ui/button";
import deleteIcon from "@/assets/icons/delete.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsCartOpen,
  setIsChecked,
  setIsSubmitted,
  setOpenDiamondDetailDrawer,
} from "@/store/slices/commonSlice";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import { CartNotFound, CustomImg, ProgressiveImg } from "../dynamiComponents";
import { useRouter } from "next/navigation";
import ErrorMessage from "./ErrorMessage";
import DiamondDetailDrawer from "./customize/DiamondDetailDrawer";
import { paymentOptions } from "@/_utils/paymentOptions";

const maxQuantity = 5;
const minQuantity = 1;

const CartPopup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const contentRef = useRef(null);
  const { isCartOpen, isChecked, isSubmitted, openDiamondDetailDrawer } =
    useSelector(({ common }) => common);
  const {
    cartLoading,
    cartList,
    selectedCartItem,
    updateCartQtyErrorMessage,
    removeCartErrorMessage,
  } = useSelector(({ cart }) => cart);
  const handleCartQuantity = useCallback(
    (type, cartItem) => {
      dispatch(handleSelectCartItem({ selectedCartItem: cartItem }));
      if (
        type === "increase" &&
        (cartItem.quantity < minQuantity ||
          cartItem.quantity >= maxQuantity ||
          cartItem.quantity >= cartItem.productQuantity)
      ) {
        return;
      }

      if (
        type === "decrease" &&
        (cartItem.quantity < minQuantity || cartItem.quantity > maxQuantity)
      ) {
        return;
      }

      const quantity =
        type === "increase" ? cartItem.quantity + 1 : cartItem.quantity - 1;
      const payload = {
        type: type,
        quantity: quantity,
        cartId: cartItem.id,
      };
      dispatch(updateProductQuantityIntoCart(payload));
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (cartItem) => {
      dispatch(handleSelectCartItem({ selectedCartItem: cartItem }));
      if (!cartItem.id) return;

      const payload = { cartId: cartItem.id };
      dispatch(removeProductIntoCart(payload));
    },
    [dispatch]
  );

  const getSubTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item.quantityWiseSellingPrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") dispatch(setIsCartOpen(false));
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  // Handle mouse wheel scrolling
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement || !isCartOpen) return;

    const handleWheel = (event) => {
      event.preventDefault();
      const scrollAmount = event.deltaY;
      contentElement.scrollTop += scrollAmount;
    };

    contentElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      contentElement.removeEventListener("wheel", handleWheel);
    };
  }, [isCartOpen]);

  const closeCartPopup = useCallback(() => {
    dispatch(setIsSubmitted(false));
    dispatch(setIsCartOpen(false));
    dispatch(setIsChecked(false));
  }, []);

  return (
    <>
      <button
        onClick={() => dispatch(setIsCartOpen(true))}
        aria-label="Open cart"
        className="relative"
      >
        <HiOutlineShoppingBag className="text-xl" />
        {cartList?.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            {cartList.length}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => dispatch(setIsCartOpen(false))}
        />
      )}

      <div
        className={`fixed px-4 md:px-8 top-0 right-0 h-screen w-full md:w-[500px] bg-offwhite xl:w-[600px] 3xl:w-[650px] shadow-xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="shrink-0 p-4 border-b-2 border-black_opacity_10 flex justify-between items-center pt-8 xl:pt-8 2xl:pt-10 mb-6">
            <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-chong-modern text-baseblack">
              My Bag <span className="pl-2">({cartList?.length}) </span>
            </h2>
            <button
              onClick={closeCartPopup}
              className="text-xl text-baseblack font-semibold"
            >
              ✕
            </button>
          </div>

          {cartLoading ? (
            <CartPopupSkeleton />
          ) : cartList?.length ? (
            <>
              <div className="flex flex-col h-full min-h-0">
                <div
                  ref={contentRef}
                  className="flex-1 min-h-0 overflow-y-auto px-2 xs:px-6"
                >
                  {cartList?.map((cartItem) => (
                    <div
                      className="border-b-2 border-alabaster last:border-b-0 pb-6 xl:pb-10 mb-10 last:mb-0"
                      key={cartItem?.id}
                    >
                      <div className="flex justify-between gap-4">
                        <div className="flex-shrink-0 border-2 border-alabaster w-32 h-32 md:w-36 md:h-36 ">
                          <ProgressiveImg
                            src={cartItem?.productImage}
                            alt={cartItem?.productName}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <div>
                            <Link
                              href={`/products/${cartItem?.productName
                                ?.split(" ")
                                ?.join("_")}`}
                              className="text-lg font-medium"
                            >
                              {cartItem?.productName}
                            </Link>
                            {cartItem?.diamondDetail ? (
                              <p className="font-chong-modern text-base md:text-xl lg:text-2xl font-medium text-baseblack">
                                $
                                {(
                                  helperFunctions?.calculateCustomProductPrice({
                                    netWeight: cartItem?.netWeight,
                                    variations: cartItem?.variations,
                                  }) * (cartItem?.quantity || 1)
                                ).toFixed(2)}
                              </p>
                            ) : (
                              <p className="text-base md:text-xl lg:text-2xl font-medium font-chong-modern">
                                {cartItem?.productDiscount ? (
                                  <span className="text-lg text-gray-500 line-through mr-2">
                                    $
                                    {helperFunctions?.toFixedNumber(
                                      cartItem?.quantityWisePrice
                                    )}
                                  </span>
                                ) : null}
                                $
                                {helperFunctions?.toFixedNumber(
                                  cartItem?.quantityWiseSellingPrice
                                )}
                              </p>
                            )}
                          </div>
                          <div className="text-baseblack flex flex-wrap gap-1 md:gap-x-4 md:gap-y-2 pt-1 md:pt-2">
                            {cartItem.variations.map((variItem) => (
                              <div
                                className="border md:border-2 border-black_opacity_10  text-xs lg:text-base p-1 md:px-2 font-medium"
                                key={variItem.variationId}
                              >
                                <span className="font-bold">
                                  {variItem.variationName}:{" "}
                                </span>{" "}
                                {variItem.variationTypeName}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-x-1 pt-1 md:pt-2">
                            <h3 className="text-[12px] md:text-base lg:text-lg font-medium">
                              Qty:
                            </h3>
                            <div className="flex items-center bg-alabaster px-1 lg:px-2">
                              <button
                                className={`lg:px-1 lg:py-1 text-[12px] md:text-lg lg:text-xl font-medium text-black ${
                                  cartItem?.quantity <= minQuantity
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleCartQuantity("decrease", cartItem)
                                }
                                disabled={cartItem?.quantity <= minQuantity}
                              >
                                −
                              </button>

                              {selectedCartItem.id === cartItem.id &&
                              updateCartQtyErrorMessage ? (
                                <ErrorMessage
                                  message={updateCartQtyErrorMessage}
                                />
                              ) : null}
                              <span className="px-2 md:px-4 text-[12px] md:text-lg lg:text-xl font-medium text-black">
                                {cartItem.quantity}
                              </span>
                              <button
                                className={`md:px-1 py-1 text-[12px] md:text-lg lg:text-xl font-medium text-black ${
                                  cartItem?.quantity >= maxQuantity ||
                                  cartItem.quantity >= cartItem.productQuantity
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleCartQuantity("increase", cartItem)
                                }
                                disabled={
                                  cartItem?.quantity >= maxQuantity ||
                                  cartItem.quantity >= cartItem.productQuantity
                                }
                              >
                                +
                              </button>
                            </div>
                            {selectedCartItem.id === cartItem.id &&
                            removeCartErrorMessage ? (
                              <ErrorMessage message={removeCartErrorMessage} />
                            ) : null}
                            <button
                              className="font-medium px-3  cursor-pointer flex items-center justify-center transition-all duration-200"
                              onClick={() => removeFromCart(cartItem)}
                            >
                              <CustomImg
                                srcAttr={deleteIcon}
                                altAttr=""
                                titleAttr=""
                                className="md:w-6 md:h-6 h-4 w-4 transition-transform duration-200 hover:scale-110"
                              />
                            </button>
                          </div>
                          <div className="hidden xs:block mt-4">
                            <DiamondDetailDrawer
                              cartItem={cartItem}
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
                          openDiamondDetailDrawer={openDiamondDetailDrawer}
                          dispatch={dispatch}
                          setOpenDiamondDetailDrawer={
                            setOpenDiamondDetailDrawer
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="shrink-0 px-2 xs:px-6 bg-offwhite border-t-2 border-black_opacity_10 pb-24 pt-4  xl:pt-4 xl:pb-4 ">
                  <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold md:pt-4">
                    Order Total: <span>${getSubTotal()}</span>
                  </p>
                  <p className="text-basegray text-base mb-2 mt-4">
                    Taxes and shipping calculated at checkout
                  </p>
                  <div className="flex items-start gap-2 mt-2 text-sm">
                    <input
                      type="checkbox"
                      id="terms"
                      className={`mt-2 cursor-pointer accent-primary rounded-sm ring-1 ring-transparent ${
                        isSubmitted && !isChecked
                          ? " !ring-red-500 appearance-none p-1.5"
                          : ""
                      }`}
                      checked={isChecked}
                      onChange={(e) => dispatch(setIsChecked(e.target.checked))}
                    />
                    <label
                      htmlFor="terms"
                      className="leading-tight text-baseblack text-sm md:text-base font-medium"
                    >
                      I have read, understood, and agree to the{" "}
                      <Link
                        href="/terms-and-conditions"
                        className="text-primary underline"
                        target="_blank"
                      >
                        Terms and Conditions
                      </Link>
                      ,{" "}
                      <Link
                        href="/shipping-policy"
                        className="text-primary underline"
                        target="_blank"
                      >
                        Shipping Policy
                      </Link>
                      ,
                      <Link
                        href="/privacy-policy"
                        className="text-primary underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link
                        href="/return-policy"
                        className="text-primary underline"
                        target="_blank"
                      >
                        Return Policy
                      </Link>
                      .
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <PrimaryButton
                      title="CHECKOUT"
                      onClick={() => {
                        dispatch(setIsSubmitted(true));
                        if (isChecked) {
                          closeCartPopup();
                          router.push("/checkout");
                        }
                      }}
                    >
                      CHECKOUT
                    </PrimaryButton>
                    <GrayLinkButton
                      title="SHOPPING BAG"
                      href="/cart"
                      onClick={closeCartPopup}
                    >
                      SHOPPING BAG
                    </GrayLinkButton>
                  </div>

                  <div className="mt-2 md:mt-6">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-base md:text-lg text-gray-500">
                        Pay With:
                      </p>
                      <div className="flex gap-3 xl:gap-6 flex-wrap">
                        {paymentOptions?.map((option, index) => (
                          <CustomImg
                            key={index}
                            srcAttr={option?.img}
                            titleAttr={option?.titleAttr}
                            altAttr={option?.altAttr}
                            className="object-contain h-10 w-10 md:h-12 md:w-12 xl:h-12 xl:w-auto"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <CartNotFound />
          )}
        </div>
      </div>
    </>
  );
};

export default CartPopup;

const CartPopupSkeleton = () => {
  const skeletons = [
    { width: "w-full", height: "h-2", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div className="container grid grid-cols-1 gap-6 pt-6">
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[100px] md:h-[200px] 2xl:h-[250px]" />
        <SkeletonLoader height="w-full h-[100px] md:h-[200px] 2xl:h-[250px]" />
      </div>
      <div>
        {Array(1)
          .fill(skeletons)
          .flat()
          .map((skeleton, index) => (
            <SkeletonLoader
              key={index}
              width={skeleton.width}
              height={skeleton.height}
              className={skeleton.margin}
            />
          ))}
      </div>
    </div>
  );
};
