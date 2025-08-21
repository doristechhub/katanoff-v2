"use client";
import { useEffect, useCallback, useRef, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import dropdownArrow from "@/assets/icons/dropdownArrow.svg";
import {
  fetchCart,
  handleSelectCartItem,
  removeProductIntoCart,
  updateProductQuantityIntoCart,
} from "@/_actions/cart.action";
import { helperFunctions, LENGTH, RING_SIZE } from "@/_helper";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsCartOpen,
  setIsChecked,
  setIsSubmitted,
  setOpenDiamondDetailDrawer,
} from "@/store/slices/commonSlice";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import { CartNotFound, CustomImg, ProgressiveImg } from "../dynamiComponents";
import ErrorMessage from "./ErrorMessage";
import DiamondDetailDrawer from "./customize/DiamondDetailDrawer";
import { paymentOptions } from "@/_utils/paymentOptions";
import { verifyCouponCode } from "@/_actions/coupon.action";
import {
  setDeleteLoader,
  setRemoveCartErrorMessage,
} from "@/store/slices/cartSlice";

const maxQuantity = 5;
const minQuantity = 1;

const CartPopup = () => {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const { isCartOpen, isChecked, isSubmitted, openDiamondDetailDrawer } =
    useSelector(({ common }) => common);
  const {
    cartLoading,
    cartList,
    selectedCartItem,
    updateCartQtyErrorMessage,
    removeCartErrorMessage,
  } = useSelector(({ cart }) => cart);
  const { discountAmount, couponCode, appliedPromoDetail } = useSelector(
    ({ coupon }) => coupon
  );

  const handleApplyCoupon = (orderValue = null) => {
    const calculatedOrderValue =
      orderValue !== null ? orderValue : getSubTotal();
    dispatch(
      verifyCouponCode({
        promoCode: couponCode,
        orderValue: calculatedOrderValue,
      })
    );
  };

  const handleCartQuantity = useCallback(
    (type, cartItem) => {
      dispatch(handleSelectCartItem({ selectedCartItem: cartItem }));
      if (
        (type === "increase" &&
          (cartItem.quantity < minQuantity ||
            cartItem.quantity >= maxQuantity ||
            cartItem.quantity >= cartItem.productQuantity)) ||
        (type === "decrease" &&
          (cartItem.quantity <= minQuantity ||
            cartItem.quantity > maxQuantity)) ||
        (type === "set" &&
          (cartItem.quantity < minQuantity ||
            cartItem.quantity > maxQuantity ||
            cartItem.quantity > cartItem.productQuantity))
      ) {
        return;
      }

      const quantity =
        type === "increase"
          ? cartItem.quantity + 1
          : type === "decrease"
            ? cartItem.quantity - 1
            : cartItem.quantity;
      const payload = {
        type: type,
        quantity: quantity,
        cartId: cartItem.id,
      };
      dispatch(updateProductQuantityIntoCart(payload));

      const newSubTotal = cartList.reduce((acc, item) => {
        if (item.id === cartItem.id) {
          return acc + quantity * item?.productSellingPrice;
        }
        return acc + item.quantityWiseSellingPrice;
      }, 0);

      if (appliedPromoDetail || couponCode) {
        handleApplyCoupon(newSubTotal);
      }
    },
    [dispatch, appliedPromoDetail, couponCode, cartList]
  );
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setViewportHeight(`${vh * 100}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  useEffect(() => {
    if (!cartList.length) {
      dispatch(fetchCart());
    }
  }, [cartList?.length, dispatch]);

  const removeFromCart = useCallback(
    async (cartItem) => {
      if (!cartItem.id) return;

      dispatch(handleSelectCartItem({ selectedCartItem: cartItem }));
      dispatch(setDeleteLoader(true));

      try {
        const payload = { cartId: cartItem.id };
        await dispatch(removeProductIntoCart(payload));

        const newSubTotal = cartList.reduce((acc, item) => {
          if (item.id !== cartItem.id) {
            return (
              acc +
              (item.quantityWiseSellingPrice ||
                item.quantity * (item.sellingPrice || item.price || 0))
            );
          }
          return acc;
        }, 0);
        if (appliedPromoDetail) {
          handleApplyCoupon(newSubTotal);
        }
      } catch (error) {
        dispatch(
          setRemoveCartErrorMessage({
            message: error.message,
            type: messageType.ERROR,
          })
        );
        console.error("Failed to remove item from cart:", error);
      } finally {
        dispatch(setDeleteLoader(false));
      }
    },
    [dispatch, cartList, appliedPromoDetail, handleApplyCoupon]
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

  const handleCartQuantityChange = (item, newQty) => {
    handleCartQuantity("set", { ...item, quantity: newQty });
  };

  const grandTotal = useCallback(() => {
    if (discountAmount > 0) {
      return getSubTotal() - discountAmount;
    }
    return getSubTotal();
  }, [getSubTotal, discountAmount]);

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
        className={`fixed top-0 right-0 w-full md:w-[450px] bg-offwhite xl:w-[480px] 3xl:w-[500px] shadow-xl z-50 transform transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ height: viewportHeight }}
      >
        <div className="flex flex-col h-full">
          <div className="shrink-0 p-4 border-b border-black flex justify-between items-center pt-4">
            <h2 className="text-xl md:text-2xl font-medium font-castoro text-baseblack mx-auto">
              My Bag {cartList?.length ? "(" + cartList.length + ")" : null}
            </h2>
            <button
              onClick={closeCartPopup}
              className="text-xl text-baseblack font-semibold px-4"
            >
              ✕
            </button>
          </div>
          {cartLoading ? (
            <CartPopupSkeleton />
          ) : cartList?.length ? (
            <>
              <div className="flex flex-col h-full min-h-0 ">
                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto pt-6 relative custom-scrollbar"
                >
                  {cartList?.map((cartItem) => (
                    <div className="pb-6 px-6 xl:pb-8" key={cartItem?.id}>
                      <div className="flex justify-between gap-4">
                        <div className="flex-shrink-0 w-32 h-32 md:w-24 md:h-24 ">
                          <ProgressiveImg
                            src={cartItem?.productImage}
                            alt={cartItem?.productName}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="xs:flex justify-between">
                            <div>
                              <Link
                                href={
                                  cartItem?.diamondDetail
                                    ? "/customize/complete-ring"
                                    : `/products/${cartItem?.productName
                                      ?.split(" ")
                                      ?.join("_")}`
                                }
                                onClick={() => {
                                  helperFunctions?.setCustomProductInLocalStorage(
                                    cartItem
                                  );
                                  closeCartPopup();
                                }}
                                className="text-xs  2xl:text-base font-semibold text-baseblack"
                              >
                                {helperFunctions?.formatProductNameWithCarat({
                                  caratWeight: cartItem?.diamondDetail ? cartItem?.diamondDetail?.caratWeight : cartItem?.totalCaratWeight,
                                  productName: cartItem?.productName,
                                })}
                              </Link>
                              <p className="text-baseblack font-medium  flex flex-wrap text-xs  2xl:text-sm">
                                {helperFunctions?.displayVariationsLabel(
                                  cartItem?.variations
                                )}
                              </p>
                            </div>
                            <div className="pr-2 items-center flex">
                              {cartItem?.diamondDetail ? (
                                <p className="text-sm font-semibold text-baseblack">
                                  ${cartItem?.quantityWiseSellingPrice}
                                </p>
                              ) : (
                                <p className="text-base font-bold">
                                  {cartItem?.productDiscountPerc ? (
                                    <span className="text-base text-gray-500 line-through mr-2">
                                      ${cartItem?.quantityWisePrice}
                                    </span>
                                  ) : null}
                                  ${cartItem?.quantityWiseSellingPrice}
                                </p>
                              )}
                            </div>
                          </div>

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

                          <div className="flex items-center justify-between gap-x-1 pt-1 md:pt-2">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium">Qty</p>
                              {selectedCartItem?.id === cartItem.id &&
                                updateCartQtyErrorMessage && (
                                  <ErrorMessage
                                    message={updateCartQtyErrorMessage}
                                  />
                                )}

                              <div className="relative inline-block w-fit">
                                <select
                                  className={`appearance-none px-3 py-1 pr-10 border border-grayborder rounded-sm text-xs  2xl:text-sm font-semibold bg-transparent  cursor-pointer
                                 ${(cartItem.quantity < minQuantity ||
                                      cartItem.quantity > maxQuantity ||
                                      cartItem.quantity >
                                      cartItem.productQuantity) &&
                                    "opacity-50 cursor-not-allowed"
                                    }
                                 `}
                                  value={cartItem.quantity}
                                  onChange={(e) =>
                                    handleCartQuantityChange(
                                      cartItem,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  disabled={
                                    cartItem.quantity < minQuantity ||
                                    cartItem.quantity > maxQuantity ||
                                    cartItem.quantity > cartItem.productQuantity
                                  }
                                >
                                  {Array.from(
                                    {
                                      length:
                                        Math.min(
                                          10,
                                          maxQuantity,
                                          cartItem.productQuantity || 10
                                        ) -
                                        minQuantity +
                                        1,
                                    },
                                    (_, i) => i + minQuantity
                                  ).map((qty) => {
                                    const isDisabled =
                                      qty < minQuantity ||
                                      qty > maxQuantity ||
                                      qty > cartItem.productQuantity;

                                    return (
                                      <option
                                        key={qty}
                                        value={qty}
                                        disabled={isDisabled}
                                      >
                                        {qty}
                                      </option>
                                    );
                                  })}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-black">
                                  <CustomImg
                                    srcAttr={dropdownArrow}
                                    altAttr="Arrow"
                                    titleAttr="Arrow"
                                    className="w-5 h-5"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <button
                                className="font-medium px-3 text-xs underline 2xl:text-sm cursor-pointer flex items-center justify-center transition-all duration-200 hover:!font-bold"
                                onClick={() => removeFromCart(cartItem)}
                              >
                                Remove
                              </button>
                              {selectedCartItem.id === cartItem.id &&
                                removeCartErrorMessage ? (
                                <ErrorMessage
                                  message={removeCartErrorMessage}
                                />
                              ) : null}
                            </div>
                          </div>

                          <div className="hidden xs:block mt-4">
                            <DiamondDetailDrawer
                              cartItem={cartItem}
                              isCartPopupPage={true}
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
                          isCartPopupPage={true}
                          openDiamondDetailDrawer={openDiamondDetailDrawer}
                          dispatch={dispatch}
                          setOpenDiamondDetailDrawer={
                            setOpenDiamondDetailDrawer
                          }
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
                </div>

                <div className="shrink-0 bg-offwhite border-t border-[#00000033] !mx-6 pb-4 pt-2">
                  <p className="text-sm sm:text-base text-baseblack flex justify-between font-semibold pt-2">
                    Sub Total:{" "}
                    <span>
                      {helperFunctions?.formatCurrencyWithDollar(getSubTotal())}
                    </span>
                  </p>
                  {appliedPromoDetail && (
                    <>
                      <p className="text-sm sm:text-base text-baseblack flex justify-between font-semibold pt-2">
                        Discount ({appliedPromoDetail?.promoCode}):{" "}
                        <span className="">
                          {" "}
                          -
                          {helperFunctions?.formatCurrencyWithDollar(
                            discountAmount
                          )}
                        </span>
                      </p>
                      <p className="text-base xs:text-lg text-baseblack flex justify-between font-bold pt-2">
                        Grand Total:{" "}
                        <span>
                          {helperFunctions?.formatCurrencyWithDollar(
                            grandTotal()
                          )}
                        </span>
                      </p>
                    </>
                  )}
                  <p className="text-basegray text-xs pt-1 2xl:text-sm">
                    Taxes and shipping calculated at checkout
                  </p>
                  <div className="flex items-start gap-2 mt-2 text-xs  2xl:text-sm">
                    <input
                      type="checkbox"
                      id="terms"
                      className={`mt-2 cursor-pointer accent-black rounded-sm ring-1 ring-transparent ${isSubmitted && !isChecked
                        ? " !ring-red-500 appearance-none p-1.5"
                        : ""
                        }`}
                      checked={isChecked}
                      onChange={(e) => dispatch(setIsChecked(e.target.checked))}
                    />
                    <label
                      htmlFor="terms"
                      className="leading-tight text-baseblack text-xs  2xl:text-sm font-medium"
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

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <LinkButton
                      className="!bg-transparent !text-baseblack hover:!bg-primary hover:!text-white !border-black !font-semibold !rounded-none !text-sm"
                      title="CHECKOUT"
                      href={isChecked ? "/checkout" : undefined}
                      onClick={(e) => {
                        if (!isChecked) {
                          e.preventDefault();
                          return;
                        }
                        if (appliedPromoDetail) {
                          localStorage.setItem(
                            "appliedCoupon",
                            appliedPromoDetail?.promoCode
                          );
                        }
                        closeCartPopup();
                      }}
                    >
                      CHECKOUT
                    </LinkButton>
                    <LinkButton
                      className="!bg-primary !text-white !uppercase hover:!bg-transparent hover:!text-baseblack !border-black !font-semibold !rounded-none !text-sm"
                      title="View Your Bag"
                      href="/cart"
                      onClick={(e) => {
                        closeCartPopup();
                      }}
                    >
                      View Your Bag
                    </LinkButton>
                  </div>

                  <div className="mt-2 md:mt-2">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-sm text-gray-500">
                        Pay With:
                      </p>
                      <div className="flex gap-3 xl:gap-4 flex-wrap">
                        {paymentOptions?.map((option, index) => (
                          <CustomImg
                            key={index}
                            srcAttr={option?.img}
                            titleAttr={option?.titleAttr}
                            altAttr={option?.altAttr}
                            className="object-contain h-6 w-6 md:h-6 md:w-10 xl:h-6 xl:w-10"
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
