"use client";
import { useCallback, useEffect } from "react";
import crossIcon from "@/assets/icons/cross.svg";
import dropdownArrow from "@/assets/icons/dropdownArrow.svg";

import {
  CartNotFound,
  CustomImg,
  ProgressiveImg,
} from "@/components/dynamiComponents";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import KeyFeatures from "@/components/ui/KeyFeatures";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  handleSelectCartItem,
  removeProductIntoCart,
  updateProductQuantityIntoCart,
} from "@/_actions/cart.action";
import { helperFunctions, RING_SIZE } from "@/_helper";
import Link from "next/link";
import { LinkButton, PrimaryButton } from "@/components/ui/button";
import { setDeleteLoader } from "@/store/slices/cartSlice";
import {
  setIsChecked,
  setIsSubmitted,
  setOpenDiamondDetailDrawer,
} from "@/store/slices/commonSlice";
import { useRouter } from "next/navigation";
import ErrorMessage from "../ErrorMessage";
import DiamondDetailDrawer from "../customize/DiamondDetailDrawer";
import { paymentOptions } from "@/_utils/paymentOptions";
const maxQuantity = 5;
const minQuantity = 1;

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isChecked, isSubmitted, openDiamondDetailDrawer } = useSelector(
    ({ common }) => common
  );
  const {
    cartLoading,
    cartList,
    selectedCartItem,
    isProductQuantityHasUpdatedIntoCart,
    updateCartQtyErrorMessage,
    removeCartErrorMessage,
    deleteLoader,
  } = useSelector(({ cart }) => cart);

  useEffect(() => {
    dispatch(fetchCart());
    resetValues();
  }, []);

  const loadData = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch, isProductQuantityHasUpdatedIntoCart]);

  useEffect(() => {
    loadData();
  }, [isProductQuantityHasUpdatedIntoCart]);

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
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (cartItem) => {
      dispatch(handleSelectCartItem({ selectedCartItem: cartItem }));
      if (!cartItem.id) {
        return;
      }

      const payload = {
        cartId: cartItem.id,
      };

      dispatch(setDeleteLoader(true));
      dispatch(removeProductIntoCart(payload));
      dispatch(setDeleteLoader(false));
    },
    [dispatch]
  );

  const getOrderTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item.quantityWisePrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  const getDiscountTotal = useCallback(() => {
    const totalDiscount = cartList.reduce((acc, item) => {
      if (item.productDiscount) {
        return acc + (item.quantityWisePrice - item.quantityWiseSellingPrice);
      }
      return acc;
    }, 0);
    return helperFunctions.toFixedNumber(totalDiscount);
  }, [cartList]);

  const getSubTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item.quantityWiseSellingPrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  const grandTotal = getSubTotal();

  const resetValues = useCallback(() => {
    dispatch(setIsSubmitted(false));
    dispatch(setIsChecked(false));
  }, []);

  const handleCartQuantityChange = (item, newQty) => {
    handleCartQuantity("set", { ...item, quantity: newQty });
  };
  return (
    <div className="mx-auto pt-12 2xl:pt-16">
      {cartLoading ? (
        <CartSkeleton />
      ) : cartList?.length ? (
        <>
          <div className="mx-auto w-fit pt-4">
            <h1 className="text-2xl xl:text-3xl 4xl:text-4xl font-medium font-castoro text-baseblack">
              My Bag
            </h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 container mx-auto pt-8 lg:pt-12">
            <div className="w-full lg:w-2/3">
              {cartList?.map((cartItem, index) => (
                <div
                  className={`py-6 md:py-8 pr-2 xs:pr-6 ${
                    index !== cartList?.length - 1
                      ? "border-b border-grayborder"
                      : ""
                  }`}
                  key={cartItem.id}
                >
                  <div className="flex gap-2 md:gap-6">
                    <div>
                      <ProgressiveImg
                        src={cartItem?.productImage}
                        alt={cartItem?.productName}
                        className="w-32 md:w-40 xl:w-48 border border-alabaster"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex justify-between">
                          <Link
                            href={
                              cartItem?.diamondDetail
                                ? "/customize/complete-ring"
                                : `/products/${cartItem?.productName
                                    ?.split(" ")
                                    ?.join("_")}`
                            }
                            onClick={() =>
                              helperFunctions?.setCustomProductInLocalStorage(
                                cartItem
                              )
                            }
                            className="md:text-base lg:text-lg font-semibold hover:underline"
                          >
                            {cartItem?.productName}
                          </Link>

                          <div className="sm:hidden">
                            <button
                              className=" font-medium px-1 sm:px-3 cursor-pointer flex items-center justify-center transition-all duration-200"
                              onClick={() => removeFromCart(cartItem)}
                              disabled={deleteLoader}
                            >
                              <CustomImg
                                srcAttr={crossIcon}
                                altAttr=""
                                titleAttr=""
                                className="h-3 w-3 xss:h-4 xss:w-4 transition-transform duration-200 hover:scale-110"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex xss:gap-4 xss:flex-row flex-col sm:items-center gap-2">
                          <p className="text-base md:text-lg font-bold">
                            {cartItem?.productDiscount &&
                            !cartItem?.diamondDetail ? (
                              <span className="text-sm md:text-base lg:text-lg text-gray-500 line-through mr-2">
                                $
                                {helperFunctions.toFixedNumber(
                                  cartItem?.quantityWisePrice
                                )}
                              </span>
                            ) : null}
                            $
                            {helperFunctions.toFixedNumber(
                              cartItem?.quantityWiseSellingPrice
                            )}
                          </p>
                          <div className="hidden sm:block">
                            <button
                              className=" font-medium px-1 sm:px-3 cursor-pointer flex items-center justify-center transition-all duration-200 -mt-2"
                              onClick={() => removeFromCart(cartItem)}
                              disabled={deleteLoader}
                            >
                              <CustomImg
                                srcAttr={crossIcon}
                                altAttr=""
                                titleAttr=""
                                className="h-3 w-3 xss:h-4 xss:w-4 transition-transform duration-200 hover:scale-110"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between mt-1">
                        <div className="flex flex-col">
                          <div className="text-baseblack font-medium text-sm md:text-base  flex flex-wrap gap-1">
                            {helperFunctions?.displayVariationsLabel(
                              cartItem?.variations
                            )}
                          </div>
                          <div className="text-baseblack font-medium text-sm md:text-base flex flex-wrap">
                            <span className="inline xss:block">
                              Product SKU:
                            </span>
                            <span className="inline xss:block">
                              {cartItem?.productSku}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm md:text-base font-medium">
                            Qty
                          </p>
                          <div className="relative w-fit">
                            <select
                              value={cartItem.quantity} // <-- this sets selected value correctly
                              onChange={(e) =>
                                handleCartQuantityChange(
                                  cartItem,
                                  parseInt(e.target.value)
                                )
                              }
                              className={`appearance-none px-2 sm:px-4 sm:py-2 pr-6 sm:pr-10 border border-grayborder rounded-sm text-sm font-medium bg-transparent cursor-pointer`}
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

                            <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 sm:px-2 text-black">
                              <CustomImg
                                srcAttr={dropdownArrow}
                                altAttr="Arrow"
                                titleAttr="Arrow"
                                className="w-4 h-4"
                              />
                            </div>
                          </div>

                          {/* Show error messages only for selected cart item */}
                          {selectedCartItem?.id === cartItem.id &&
                            updateCartQtyErrorMessage && (
                              <ErrorMessage
                                message={updateCartQtyErrorMessage}
                              />
                            )}

                          {selectedCartItem?.id === cartItem.id &&
                            removeCartErrorMessage && (
                              <ErrorMessage message={removeCartErrorMessage} />
                            )}
                        </div>
                      </div>

                      {cartItem?.variations?.some(
                        (v) => v.variationName === RING_SIZE
                      ) && (
                        <div className="flex items-center gap-2 pt-2 sm:pt-0">
                          <p className="text-sm items-center md:text-base font-medium text-baseblack">
                            {v?.variationName}:{" "}
                            {cartItem?.variations?.find(
                              (v) => v.variationName === RING_SIZE
                            )?.variationTypeName || "N/A"}
                          </p>
                        </div>
                      )}

                      <div className="hidden xs:block mt-2">
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

                  <div className="pl-2 xs:hidden mt-1">
                    <DiamondDetailDrawer
                      cartItem={cartItem}
                      openDiamondDetailDrawer={openDiamondDetailDrawer}
                      dispatch={dispatch}
                      setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4 flex flex-col md:flex-row gap-6">
                <LinkButton
                  href="/"
                  className="!text-baseblack !font-medium  w-fit !py-6 !bg-offwhite !text-lg hover:!border-[#202A4E] hover:!bg-primary hover:!text-white !border-black !border !rounded-none"
                >
                  Continue Shopping
                </LinkButton>
              </div>
            </div>

            <div className="w-full lg:w-1/3 border border-baseblack rounded py-6 lg:py-10 px-2 xs:px-8  self-start">
              <p className="xs:text-lg text-baseblack flex justify-between">
                Order Total: <span className="">${getOrderTotal()}</span>
              </p>
              <p className="xs:text-lg text-baseblack flex justify-between pt-4">
                Discount Offer: <span className="">-${getDiscountTotal()}</span>
              </p>
              <p className="xs:text-lg text-baseblack flex justify-between pt-4">
                Subtotal: <span className="">${getSubTotal()}</span>
              </p>
              <p className="my-4 border-t-2 border-black_opacity_10" />
              <p className="xs:text-lg text-baseblack flex justify-between font-bold pt-2">
                Grand Total: <span>${grandTotal}</span>
              </p>

              <div className="flex items-start gap-2 mt-3 lg:mt-6 text-sm">
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
                  I Have Read, Understood, And Agree To The{" "}
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
              <PrimaryButton
                title="SECURE CHECKOUT"
                className={"w-full mt-5"}
                onClick={() => {
                  dispatch(setIsSubmitted(true));
                  if (isChecked) {
                    resetValues();
                    router.push("/checkout");
                  }
                }}
              >
                SECURE CHECKOUT
              </PrimaryButton>
              <div className="mt-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex-grow h-px bg-gray-300" />
                  <p className="text-sm font-semibold text-baseblack uppercase whitespace-nowrap">
                    We Accept Payment
                  </p>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                <div className="flex items-center gap-3 ">
                  <p className="font-medium text-base text-gray-500">
                    Pay With:
                  </p>
                  <div className="flex gap-2 gap2xl:gap-6 flex-wrap">
                    {paymentOptions?.map((option, index) => (
                      <CustomImg
                        key={index}
                        srcAttr={option?.img}
                        titleAttr={option?.titleAttr}
                        altAttr={option?.altAttr}
                        className="object-contain w-12 lg:w-8 2xl:w-auto 2xl:h-8"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="pt-10 lg:pt-16 2xl:pt-24 container">
            <KeyFeatures />
          </section>
        </>
      ) : (
        <CartNotFound textClassName="px-4 md:px-8 w-full md:w-[50%] lg:w-[35%] 2xl:w-[32%]" />
      )}
    </div>
  );
};

export default CartPage;

const CartSkeleton = () => {
  const skeletons = [
    { width: "w-[40%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[40%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[60%_auto] gap-12 pt-12`}
    >
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[100px] md:h-[300px]  2xl:h-[250px]" />
        <SkeletonLoader height="w-[20%] h-[40px]" />
      </div>
      <div>
        {Array(2)
          .fill(skeletons)
          .flat()
          .map((skeleton, index) => (
            <SkeletonLoader
              key={`skeleton-${index}`}
              width={skeleton.width}
              height={skeleton.height}
              className={skeleton.margin}
            />
          ))}
      </div>
    </div>
  );
};
