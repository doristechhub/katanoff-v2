"use client";
import { useCallback, useEffect } from "react";
import deleteIcon from "@/assets/icons/delete.svg";
import {
  CartNotFound,
  CustomImg,
  ProgressiveImg,
} from "@/components/dynamiComponents";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import KeyFeatures from "@/components/ui/KeyFeatures";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  handleSelectCartItem,
  removeProductIntoCart,
  updateProductQuantityIntoCart,
} from "@/_actions/cart.action";
import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { LinkButton, PrimaryButton } from "@/components/ui/button";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
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

  const setCustomProductInLocalStorage = (cartItem) => {
    if (!cartItem?.diamondDetail) return;

    const customProduct = {
      productId: cartItem.productId,
      selectedVariations: cartItem.variations.map((v) => ({
        variationId: v.variationId,
        variationTypeId: v.variationTypeId,
      })),
      diamondDetails: {
        shape: {
          title: cartItem.diamondDetail.shapeName,
          image: cartItem.productImage,
          id: cartItem.diamondDetail.shapeId,
        },
        clarity: {
          title: "",
          value: cartItem.diamondDetail.clarity,
        },
        color: {
          title: "",
          value: cartItem.diamondDetail.color,
        },
        caratWeight: cartItem.diamondDetail.caratWeight,
      },
    };

    localStorage.setItem("customProduct", JSON.stringify(customProduct));
  };

  return (
    <div className="mx-auto pt-10  2xl:pt-12">
      {cartLoading ? (
        <CartSkeleton />
      ) : cartList?.length ? (
        <>
          <CommonBgHeading title="Shopping Cart" />

          <div className="flex flex-col lg:flex-row gap-6 container mx-auto">
            <div className="w-full lg:w-2/3">
              {cartList?.map((cartItem) => (
                <div
                  className="bg-white mb-6 py-4 md:py-6 px-2  xs:px-6"
                  key={cartItem.id}
                >
                  <div className="flex gap-2 md:gap-6">
                    <div>
                      <ProgressiveImg
                        src={cartItem?.productImage}
                        alt={cartItem?.productName}
                        className="w-28 md:w-40 border border-alabaster"
                      />
                      <div className="flex lg:hidden items-center gap-x-1 pt-1 md:pt-2 w-fit">
                        <h3 className="text-[12px] md:text-base lg:text-lg font-medium">
                          Qty:
                        </h3>
                        <div className="flex items-center bg-alabaster px-2 lg:px-2">
                          <button
                            className={`lg:px-1 lg:py-1 text-base md:text-lg lg:text-xl font-medium text-black ${
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
                          {selectedCartItem?.id === cartItem?.id &&
                          updateCartQtyErrorMessage ? (
                            <ErrorMessage message={updateCartQtyErrorMessage} />
                          ) : null}
                          <span className="px-2 md:px-4 text-base md:text-lg lg:text-xl font-medium text-black">
                            {cartItem?.quantity}
                          </span>
                          <button
                            className={`md:px-1 py-1 text-base md:text-lg lg:text-xl font-medium text-black ${
                              cartItem?.quantity >= maxQuantity ||
                              cartItem?.quantity >= cartItem?.productQuantity
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              handleCartQuantity("increase", cartItem)
                            }
                            disabled={
                              cartItem?.quantity >= maxQuantity ||
                              cartItem?.quantity >= cartItem?.productQuantity
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="font-medium px-3  cursor-pointer flex items-center justify-center transition-all duration-200"
                          onClick={() => removeFromCart(cartItem)}
                          disabled={deleteLoader}
                        >
                          <CustomImg
                            srcAttr={deleteIcon}
                            altAttr=""
                            titleAttr=""
                            className="md:w-6 md:h-6 h-4 w-4 transition-transform duration-200 hover:scale-110"
                          />
                        </button>

                        {selectedCartItem.id === cartItem.id &&
                        removeCartErrorMessage ? (
                          <ErrorMessage message={removeCartErrorMessage} />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex-1 w-full">
                      {/* <div className="grid grid-cols-2 xs:flex-row xs:justify-between"> */}
                      <div className="lg:flex lg:justify-between lg:items-center">
                        <Link
                          href={
                            cartItem?.diamondDetail
                              ? "/customize/complete-ring"
                              : `/products/${cartItem?.productName
                                  ?.split(" ")
                                  ?.join("_")}`
                          }
                          onClick={() =>
                            setCustomProductInLocalStorage(cartItem)
                          }
                          className="text-sm md:text-base lg:text-lg font-medium flex-wrap"
                        >
                          {cartItem?.productName}
                        </Link>
                        <p className="text-base md:text-xl lg:text-2xl font-medium font-chong-modern">
                          {cartItem?.productDiscount &&
                          !cartItem?.diamondDetail ? (
                            <span className="text-lg text-gray-500 line-through mr-2">
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
                      </div>

                      <div className="text-baseblack flex flex-wrap gap-1 md:gap-x-4 md:gap-y-2 pt-1 md:pt-2">
                        {cartItem?.variations?.map((variItem) => (
                          <div
                            className="border md:border-2 border-black_opacity_10  text-xs lg:text-base p-1 md:px-2 font-medium"
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
                        <p className="font-chong-modern text-base md:text-xl lg:text-2xl font-medium text-baseblack  md:pt-4 pt-2">
                          $
                          {(
                            helperFunctions.calculateCustomProductPrice({
                              netWeight: cartItem?.netWeight,
                              variations: cartItem?.variations,
                            }) * (cartItem?.quantity || 1)
                          ).toFixed(2)}
                        </p>
                      )}

                      <div className="hidden lg:flex items-center gap-x-1 pt-1 md:pt-2">
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
                          {selectedCartItem?.id === cartItem?.id &&
                          updateCartQtyErrorMessage ? (
                            <ErrorMessage message={updateCartQtyErrorMessage} />
                          ) : null}
                          <span className="px-2 md:px-4 text-[12px] md:text-lg lg:text-xl font-medium text-black">
                            {cartItem?.quantity}
                          </span>
                          <button
                            className={`md:px-1 py-1 text-[12px] md:text-lg lg:text-xl font-medium text-black ${
                              cartItem?.quantity >= maxQuantity ||
                              cartItem?.quantity >= cartItem?.productQuantity
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              handleCartQuantity("increase", cartItem)
                            }
                            disabled={
                              cartItem?.quantity >= maxQuantity ||
                              cartItem?.quantity >= cartItem?.productQuantity
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="font-medium px-3  cursor-pointer flex items-center justify-center transition-all duration-200"
                          onClick={() => removeFromCart(cartItem)}
                          disabled={deleteLoader}
                        >
                          <CustomImg
                            srcAttr={deleteIcon}
                            altAttr=""
                            titleAttr=""
                            className="md:w-6 md:h-6 h-4 w-4 transition-transform duration-200 hover:scale-110"
                          />
                        </button>

                        {selectedCartItem.id === cartItem.id &&
                        removeCartErrorMessage ? (
                          <ErrorMessage message={removeCartErrorMessage} />
                        ) : null}
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

                  <div className=" xs:hidden mt-4">
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
                  className="!text-white !font-medium  w-fit !py-6 !bg-[#202A4E] !text-lg hover:!border-[#202A4E] hover:!bg-transparent hover:!text-[#202A4E] !border-black_opacity_10 !border !rounded-none"
                >
                  Continue Shopping
                </LinkButton>
              </div>
            </div>

            <div className="w-full lg:w-1/3 bg-white py-6 lg:py-10 px-2 xs:px-6  self-start">
              <p className="xs:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold">
                Order Total: <span className="">${getOrderTotal()}</span>
              </p>
              <p className="xs:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Discount Offer: <span className="">-${getDiscountTotal()}</span>
              </p>
              <p className="xs:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Subtotal: <span className="">${getSubTotal()}</span>
              </p>
              <p className="my-4 border-t-2 border-black_opacity_10" />
              <p className="xs:text-lg 2xl:text-xl text-baseblack flex justify-between font-semibold pt-2">
                Grand Total: <span>${grandTotal}</span>
              </p>

              <div className="flex items-start gap-2 mt-3 text-sm">
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

              <p className="text-sm font-medium text-baseblack mt-4">
                Made-To-Order. Estimated Ship Date: Wednesday, April 9th
              </p>
              <div className="mt-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex-grow h-px bg-gray-300" />
                  <p className="text-sm md:text-lg font-medium text-baseblack uppercase whitespace-nowrap">
                    We Accept Payment
                  </p>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                <div className="flex items-center gap-3 ">
                  <p className="font-medium text-base 2xl:text-lg text-gray-500">
                    Pay With:
                  </p>
                  <div className="flex gap-2 gap2xl:gap-6 flex-wrap">
                    {paymentOptions?.map((option, index) => (
                      <CustomImg
                        key={index}
                        srcAttr={option?.img}
                        titleAttr={option?.titleAttr}
                        altAttr={option?.altAttr}
                        className="object-contain  w-12  lg:w-10 2xl:w-auto 2xl:h-12"
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
