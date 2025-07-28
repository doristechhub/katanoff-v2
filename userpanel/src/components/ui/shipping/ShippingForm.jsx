"use client";
import {
  createOrderForPaypal,
  createPaymentIntent,
  handleCreatePaymentIntentError,
} from "@/_actions/payment.action";
import amazonPay from "@/assets/images/payment/amazon-pay.webp";
import applePay from "@/assets/images/payment/applepay.webp";
import gpay from "@/assets/images/payment/gpay.webp";
import klarna from "@/assets/images/payment/klarna.webp";
import paypal from "@/assets/images/payment/paypal.webp";
import link from "@/assets/images/payment/link.webp";

import mastercard from "@/assets/images/payment/mastercard.webp";
import visa from "@/assets/images/payment/visa.webp";
import samsungPay from "@/assets/images/payment/samsung-pay.webp";
import americanExpress from "@/assets/images/payment/american-express.webp";
import discover from "@/assets/images/payment/discover.webp";
import { helperFunctions, PAYPAL, STRIPE } from "@/_helper";
import {
  setSelectedShippingAddress,
  setSelectedShippingCharge,
} from "@/store/slices/checkoutSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GrayLinkButton, LoadingPrimaryButton } from "../button";
import { setIsHovered, setIsSubmitted } from "@/store/slices/commonSlice";
import ErrorMessage from "../ErrorMessage";
import {
  setPaymentIntentMessage,
  setPaypalPaymentMessage,
} from "@/store/slices/paymentSlice";
import { CustomImg } from "@/components/dynamiComponents";
import { verifyCouponCode } from "@/_actions/coupon.action";
const paymentOptions = [
  {
    value: STRIPE,
    label: "Credit/Debit Card",
    logos: [americanExpress, visa, mastercard, discover],
  },
  {
    value: STRIPE,
    label: "Apple Pay, Google Pay, Amazon Pay, Link, Klarna",
    logos: [applePay, gpay, amazonPay, link, klarna, samsungPay],
  },
  {
    value: PAYPAL,
    label: "PayPal",
    logos: [paypal],
  },
];

// Handle image load error by showing a placeholder
const handleImageError = (e) => {
  e.target.src = "https://via.placeholder.com/24?text=Logo"; // Fallback placeholder
};

const shippingForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isHovered, isSubmitted } = useSelector(({ common }) => common);
  const { appliedPromoDetail } = useSelector(({ coupon }) => coupon);
  const { selectedShippingCharge, activeIndex, selectedShippingAddress } =
    useSelector(({ checkout }) => checkout);

  const { cartList } = useSelector(({ cart }) => cart);
  const {
    paymentIntentLoader,
    paymentIntentMessage,
    paypalPaymentLoader,
    paypalPaymentMessage,
  } = useSelector(({ payment }) => payment);

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(STRIPE);
  const [selectedOption, setSelectedOption] = useState(
    `${STRIPE}-Credit/Debit Card`
  );
  const abortControllerRef = useRef(null);
  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
  }, []);

  useEffect(() => {
    dispatch(handleCreatePaymentIntentError(""));
    dispatch(setIsSubmitted(false));
    const address = localStorage.getItem("address");
    const getParsedAddress = address ? JSON.parse(address) : null;
    const savedShippingMethod = localStorage.getItem("selectedShippingMethod");
    const parsedSavedMethod = savedShippingMethod
      ? JSON.parse(savedShippingMethod)
      : null;
    if (!getParsedAddress) {
      router.push("/checkout");
      return;
    }
    dispatch(setSelectedShippingAddress(getParsedAddress));
    dispatch(setSelectedShippingCharge(0));

    return () => {
      clearAbortController();
    };
  }, [dispatch, router, cartList, clearAbortController]);

  const getCoupon = localStorage.getItem("appliedCoupon");
  const subTotal = helperFunctions.getSubTotal(cartList);
  useEffect(() => {
    if (!appliedPromoDetail && getCoupon && subTotal) {
      dispatch(
        verifyCouponCode({
          promoCode: getCoupon,
          orderValue: subTotal,
        })
      );
    }
  }, [dispatch, appliedPromoDetail, subTotal]);

  const processPayment = useCallback(
    async (paymentAction, payload) => {
      dispatch(setPaymentIntentMessage({ message: "", type: "" }));
      dispatch(setPaypalPaymentMessage({ message: "", type: "" }));
      const res = await dispatch(
        paymentAction(payload, abortControllerRef.current)
      );
      if (res) {
        dispatch(setIsSubmitted(false));
        router.push(`/payment/${res}`);
      }
    },
    [dispatch, cartList, activeIndex, router]
  );

  const submitShippingMethod = useCallback(async () => {
    try {
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      dispatch(handleCreatePaymentIntentError(""));
      dispatch(setIsSubmitted(true));

      let payload = {
        countryName: selectedShippingAddress?.countryName,
        firstName: selectedShippingAddress?.firstName,
        lastName: selectedShippingAddress?.lastName,
        address: selectedShippingAddress?.address,
        city: selectedShippingAddress?.city,
        state: selectedShippingAddress?.state,
        stateCode: selectedShippingAddress?.stateCode,
        pinCode: selectedShippingAddress?.pinCode,
        mobile: Number(selectedShippingAddress?.mobile),
        email: selectedShippingAddress?.email,
        companyName: selectedShippingAddress?.companyName,
        apartment: selectedShippingAddress?.apartment,
        shippingCharge: 0,
        promoCode: appliedPromoDetail?.promoCode || "",
      };

      if (!cartList.length) {
        dispatch(handleCreatePaymentIntentError("Cart is empty"));
        return;
      }

      const userData = helperFunctions.getCurrentUser();
      if (!userData) {
        payload.cartList = cartList?.map((x) => ({
          productId: x?.productId,
          quantity: x?.quantity,
          variations: x?.variations?.map((v) => ({
            variationId: v?.variationId,
            variationTypeId: v?.variationTypeId,
          })),
          ...(x?.diamondDetail && {
            diamondDetail: {
              shapeId: x.diamondDetail.shapeId,
              caratWeight: x.diamondDetail.caratWeight,
              clarity: x.diamondDetail.clarity,
              color: x.diamondDetail.color,
            },
          }),
        }));
      }

      if (selectedPaymentMethod === STRIPE) {
        await processPayment(createPaymentIntent, {
          ...payload,
          paymentMethod: STRIPE,
        });
      } else if (selectedPaymentMethod === PAYPAL) {
        await processPayment(createOrderForPaypal, {
          ...payload,
          paymentMethod: PAYPAL,
        });
      }
    } catch (error) {
      console.error("Error occurred during payment:", error);
    } finally {
      clearAbortController();
    }
  }, [
    dispatch,
    cartList,
    selectedShippingAddress,
    selectedShippingCharge,
    selectedPaymentMethod,
    processPayment,
    clearAbortController,
    appliedPromoDetail,
  ]);

  const shippingOptions = [
    {
      id: helperFunctions.getRandomValue(),
      name: "Priority",
      // price: 19.99,
      price: 0.0,
    },
    {
      id: helperFunctions.getRandomValue(),
      name: "Overnight",
      // price: 39.99,
      price: 0.0,
    },
  ];

  return (
    <div className="flex flex-col gap-6 lg:gap-10 pt-8 lg:pt-12">
      <div className="border border-grayborder rounded-md px-4 lg:px-6 flex flex-col">
        <div className="flex justify-between items-center border-b py-4">
          <div>
            <p className="text-baseblack text-lg font-semibold">Contact</p>
            <p className="text-basegray text-base md:text-lg">
              {selectedShippingAddress?.email}
            </p>
          </div>
          <Link href={"/checkout"}>
            <span className="text-baseblack font-semibold text-lg underline">
              Change
            </span>
          </Link>
        </div>
        <div className="flex justify-between items-center py-4">
          <div>
            <p className="text-baseblack text-lg font-semibold">Ship To:</p>
            <div>
              {selectedShippingAddress &&
                Object.keys(selectedShippingAddress)?.length && (
                  <span className="text-basegray text-base md:text-lg">
                    {selectedShippingAddress?.address}{" "}
                    {selectedShippingAddress?.apartment},{" "}
                    {selectedShippingAddress?.city},{" "}
                    {selectedShippingAddress?.state},{" "}
                    {selectedShippingAddress?.countryName} -{" "}
                    {selectedShippingAddress?.pinCode}
                  </span>
                )}
            </div>
          </div>
          <Link href={"/checkout"}>
            <span className="text-baseblack font-semibold text-lg underline">
              Change
            </span>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Shipping Method:</h3>
        <div className="flex flex-col px-4 border border-grayborder rounded-md">
          <div
            className={`flex justify-between py-5 items-center cursor-pointer border-b border-b-grayborder last:border-b-0 border-[#0C1D3D]`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value="FedEx 2Day"
                id="fedex-2day"
                checked={true}
                readOnly
                className="form-radio w-6 h-5 accent-primary"
              />
              <span className="text-lg text-baseblack font-medium">
                FedEx 2Day
              </span>
            </div>
            <span className="text-lg text-baseblack font-semibold">Free</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Payment Method:</h3>
        <div className="flex flex-col gap-3">
          {paymentOptions?.map(({ value, label, logos }) => {
            const isChecked = selectedOption === `${value}-${label}`;
            return (
              <label
                key={`${value}-${label}`}
                className={`flex flex-wrap items-center justify-between gap-3 p-3 border rounded cursor-pointer transition-all duration-200 ${
                  isChecked
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                aria-checked={isChecked}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={isChecked}
                    disabled={paymentIntentLoader || paypalPaymentLoader}
                    onChange={() => {
                      dispatch(
                        setPaymentIntentMessage({ message: "", type: "" })
                      );
                      dispatch(
                        setPaypalPaymentMessage({ message: "", type: "" })
                      );
                      setSelectedOption(`${value}-${label}`);
                      setSelectedPaymentMethod(value);
                    }}
                    className="form-radio w-5 h-5 text-primary accent-primary"
                    aria-label={`Select ${label} as payment method`}
                  />
                  <span className="text-base font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {logos && (
                    <div className="flex gap-2">
                      {logos.map((logoUrl, index) => (
                        <CustomImg
                          key={index}
                          src={logoUrl}
                          alt={`${label} logo ${index + 1}`}
                          className="h-8 w-auto"
                          onError={handleImageError}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div
          className="mt-5 2xl:mt-8 w-full"
          onMouseEnter={() => dispatch(setIsHovered(true))}
          onMouseLeave={() => dispatch(setIsHovered(false))}
        >
          <LoadingPrimaryButton
            className="w-full uppercase"
            loading={paymentIntentLoader || paypalPaymentLoader}
            loaderType={isHovered ? "" : "white"}
            onClick={submitShippingMethod}
          >
            CONTINUE PAYMENT
          </LoadingPrimaryButton>
        </div>

        <GrayLinkButton href="/checkout" variant="grayHover" className="mt-4">
          Back To Checkout
        </GrayLinkButton>
        {isSubmitted && paymentIntentMessage?.message ? (
          <ErrorMessage message={paymentIntentMessage?.message} />
        ) : null}
        {isSubmitted && paypalPaymentMessage?.message ? (
          <ErrorMessage message={paypalPaymentMessage?.message} />
        ) : null}
      </div>
    </div>
  );
};

export default shippingForm;
