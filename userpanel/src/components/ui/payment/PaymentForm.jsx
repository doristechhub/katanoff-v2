"use client";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  checkOutSuccessUrl,
  fetchWrapperService,
  helperFunctions,
  ordersUrl,
} from "@/_helper";
import { GrayLinkButton, LoadingPrimaryButton } from "../button";
import { setIsHovered, setIsSubmitted } from "@/store/slices/commonSlice";
import ErrorMessage from "../ErrorMessage";
import {
  clearPaymentMessage,
  setPaymentLoader,
  setPaymentMessage,
} from "@/store/slices/paymentSlice";
import { messageType } from "@/_helper/constants";
import {
  updateBillingAddress,
  updatePaymentStatus,
} from "@/_actions/payment.action";
import { deleteOrder } from "@/_actions/order.action";
import { setCartList } from "@/store/slices/cartSlice";
import { paymentService } from "@/_services";
import { removeCouponCode } from "@/_actions/coupon.action";

const expressCheckoutOptions = {
  buttonType: {
    applePay: "plain",
    googlePay: "plain",
  },
  // buttonType: {
  //   applePay: "buy",
  //   googlePay: "buy",
  // },
  buttonTheme: {
    applePay: "black",
    googlePay: "black",
  },
  buttonHeight: 44,
  layout: {
    maxRows: 2,
    maxColumns: 2,
  },
};

const paymentElementOptions = {
  layout: "tabs",
  wallets: {
    applePay: "never",
    googlePay: "never",
  },
};

const paymentFormInitialValues = {
  address: null,
  email: "",
};

const validationSchema = Yup.object({
  address: Yup.object().required("Billing address is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const PaymentForm = ({ orderId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const { cartList } = useSelector(({ cart }) => cart);
  const { isHovered } = useSelector(({ common }) => common);
  const { paymentLoader, paymentMessage } = useSelector(
    ({ payment }) => payment
  );

  useEffect(() => {
    dispatch(setIsSubmitted(false));
    dispatch(clearPaymentMessage());
  }, [dispatch]);

  const resetValue = () => {
    dispatch(setIsSubmitted(false));
    dispatch(clearPaymentMessage());
  };

  // const addressesMatch = (shipping, billing) => {
  //   const isValidShipping =
  //     shipping &&
  //     shipping.address &&
  //     shipping.city &&
  //     shipping.country &&
  //     shipping.pinCode &&
  //     shipping.stateCode;
  //   const isValidBilling =
  //     billing &&
  //     billing.line1 &&
  //     billing.city &&
  //     billing.country &&
  //     billing.postal_code &&
  //     billing.state;
  //   if (!isValidShipping || !isValidBilling) {
  //     return false;
  //   }
  //   const matches = {
  //     address:
  //       shipping?.address?.toLowerCase() === billing?.line1?.toLowerCase(),
  //     city: shipping?.city?.toLowerCase() === billing?.city?.toLowerCase(),
  //     country:
  //       shipping?.country?.toLowerCase() === billing.country?.toLowerCase(),
  //     postal_code:
  //       shipping.pinCode?.toString().toLowerCase() ===
  //       billing?.postal_code?.toLowerCase(),
  //     state:
  //       shipping?.stateCode?.toLowerCase() === billing?.state?.toLowerCase(),
  //   };

  //   return Object.values(matches).every((value) => value === true);
  // };

  const onExpressCheckoutReady = ({ element }) => {
    console.log("ExpressCheckoutElement ready:", element);
  };

  // Consolidated payment confirmation logic
  const handlePaymentConfirmation = useCallback(async () => {
    if (!stripe || !elements) {
      console.error("Stripe or Elements not initialized");
      dispatch(
        setPaymentMessage({
          message: "Payment processing is not available. Please try again.",
          type: messageType.ERROR,
        })
      );
      return false;
    }

    try {
      const orderData = await fetchWrapperService.findOne(ordersUrl, {
        id: orderId,
      });

      if (!orderData) {
        dispatch(
          setPaymentMessage({
            message: "Order not found.",
            type: messageType.ERROR,
          })
        );
        return false;
      }

      // Validate addresses if billingAddress is provided (not for Express Checkout)
      // if (
      //   billingAddress &&
      //   !addressesMatch(orderData.shippingAddress, billingAddress)
      // ) {
      //   dispatch(
      //     setPaymentMessage({
      //       message: "The shipping address does not match the card address.",
      //       type: messageType.ERROR,
      //     })
      //   );
      //   return false;
      // }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${checkOutSuccessUrl}`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        dispatch(
          setPaymentMessage({
            message: error?.message || "Payment failed. Please try again.",
            type: messageType.ERROR,
          })
        );
        return false;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        let billingAddress = null;
        let paymentMethodDetails = {
          type: "",
          brand: "",
          lastFour: "",
          funding: "",
        };

        // Fetch payment intent details
        try {
          const paymentIntentResp = await paymentService.retrivePaymentIntent({
            paymentIntentId: paymentIntent?.id,
          });

          const { payment_method_details, billing_details } =
            paymentIntentResp?.data?.paymentIntent?.latest_charge || {};

          if (payment_method_details) {
            paymentMethodDetails.type = payment_method_details?.type || "";
            if (payment_method_details?.card) {
              paymentMethodDetails = {
                ...paymentMethodDetails,
                brand: payment_method_details.card.brand || "",
                lastFour: payment_method_details.card.last4 || "",
                funding: payment_method_details.card.funding || "",
              };
            }
          }
          if (billing_details) {
            const { address, name, email, phone } = billing_details;
            const { line1, line2, city, state, country, postal_code } =
              address || {};
            billingAddress = {
              name,
              email,
              phone,
              line1,
              line2,
              city,
              state,
              country,
              postal_code,
            };
          }
        } catch (error) {
          console.error("Error fetching payment intent:", error);
        }

        await handleSuccessfulPayment({ billingAddress, paymentMethodDetails });
        return true;
      }

      if (paymentIntent && paymentIntent.status === "failed") {
        console.error("Payment failed:", paymentIntent);
        dispatch(
          setPaymentMessage({
            message: "Payment status: " + paymentIntent.status,
            type: messageType.ERROR,
          })
        );
        dispatch(deleteOrder(orderId));
        return false;
      }

      return false;
    } catch (error) {
      console.error("Error in payment confirmation:", error);
      dispatch(
        setPaymentMessage({
          message: "An error occurred. Please try again.",
          type: messageType.ERROR,
        })
      );
      return false;
    }
  }, [stripe, elements, orderId, dispatch, checkOutSuccessUrl]);

  const onExpressCheckoutConfirm = async () => {
    dispatch(setPaymentLoader(true));
    resetValue();

    try {
      await handlePaymentConfirmation();
    } finally {
      dispatch(setPaymentLoader(false));
    }
  };

  const onSubmit = useCallback(
    async (values) => {
      dispatch(setPaymentLoader(true));
      resetValue();

      try {
        if (!values?.address) {
          dispatch(
            setPaymentMessage({
              message: "Please provide a billing address.",
              type: messageType.ERROR,
            })
          );
          return;
        }

        await handlePaymentConfirmation();
      } finally {
        dispatch(setPaymentLoader(false));
        dispatch(setIsSubmitted(false));
      }
    },
    [dispatch, handlePaymentConfirmation]
  );

  const { setFieldValue, setFieldTouched, touched, errors, handleSubmit } =
    useFormik({
      initialValues: paymentFormInitialValues,
      validationSchema,
      onSubmit,
    });

  const handleSuccessfulPayment = useCallback(
    async ({ billingAddress, paymentMethodDetails }) => {
      try {
        const currentUser = helperFunctions?.getCurrentUser();

        const paymentPayload = {
          orderId: orderId,
          paymentStatus: "success",
          ...(currentUser && { cartIds: cartList.map((item) => item.id) }),
        };

        const billingPayload = {
          orderId: orderId,
          billingAddress,
          paymentMethodDetails,
        };

        await dispatch(updateBillingAddress(billingPayload));
        const paymentResponse = await dispatch(
          updatePaymentStatus(paymentPayload)
        );

        if (paymentResponse) {
          dispatch(removeCouponCode());
          router.push(`/order/success/${paymentResponse?.orderNumber}`);
          if (!currentUser) {
            localStorage.removeItem("cart");
          }
          // localStorage.removeItem("address");
          // localStorage.removeItem("selectedShippingMethod");
          // dispatch(setCartList([]));
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
      }
    },
    [cartList, router, orderId]
  );

  const handleAddressChange = (event) => {
    if (event.complete) {
      setFieldValue("address", event.value.address);
    }
  };

  const handleEmailChange = (event) => {
    if (event.complete) {
      setFieldValue("email", event.value.email);
      setFieldTouched("email", true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !paymentLoader) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border border-grayborder rounded-md p-5 mt-5">
      <p className="text-baseblack text-lg md:text-xl font-semibold">Payment</p>
      <h6 className="mb-2 text-basegray">
        All transactions are secure and encrypted.
      </h6>
      <form onKeyDown={handleKeyDown}>
        <ExpressCheckoutElement
          id="express-checkout"
          options={expressCheckoutOptions}
          onReady={onExpressCheckoutReady}
          onConfirm={onExpressCheckoutConfirm}
        />
        <LinkAuthenticationElement
          id="email"
          onChange={handleEmailChange}
          headerText="Email"
        />
        {touched?.email && errors?.email && (
          <ErrorMessage message={errors?.email} />
        )}
        <AddressElement
          id="address"
          options={{ mode: "billing" }}
          onChange={handleAddressChange}
        />
        {touched?.address && errors?.address && (
          <ErrorMessage message={errors?.address} />
        )}
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div
          className="w-full mt-5"
          onMouseEnter={() => dispatch(setIsHovered(true))}
          onMouseLeave={() => dispatch(setIsHovered(false))}
        >
          <LoadingPrimaryButton
            loading={paymentLoader}
            disabled={paymentLoader}
            className="uppercase w-full"
            loaderType={isHovered ? "" : "white"}
            onClick={handleSubmit}
          >
            PAY NOW
          </LoadingPrimaryButton>
        </div>

        <GrayLinkButton href="/shipping" variant="grayHover" className="mt-4">
          Back To Shipping
        </GrayLinkButton>
        {paymentMessage?.message && (
          <ErrorMessage message={paymentMessage?.message} />
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
