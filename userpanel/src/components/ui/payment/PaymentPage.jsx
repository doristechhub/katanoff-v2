"use client";

import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CommonBgHeading from "../CommonBgHeading";
import CheckoutBreadCrumbs from "../checkout/CheckoutBreadCrumbs";
import SkeletonLoader from "../skeletonLoader";
import {
  AddressSummary,
  CartNotFound,
  CheckoutCommonComponent,
  LatestProduct,
  PaymentForm,
  PaypalForm,
} from "@/components/dynamiComponents";
import KeyFeatures from "../KeyFeatures";
import { useCallback, useEffect, useRef } from "react";
import { setPaymentIntentStatus } from "@/store/slices/paymentSlice";
import {
  cancelPaymentIntent,
  checkPaymentIntentStatus,
} from "@/_actions/payment.action";
import ErrorMessage from "../ErrorMessage";
import { messageType, PAYPAL, STRIPE } from "@/_helper/constants";
// ---------- stripe -----------------------
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { helperFunctions, stripePublishableKey } from "@/_helper";
import { deleteOrder, verifyOrder } from "@/_actions/order.action";
import { verifyCouponCode } from "@/_actions/coupon.action";
const stripePromise = loadStripe(stripePublishableKey);
// const appearance = {
//   theme: "night",
//   variables: {
//     colorPrimary: "#0570de",
//     colorBackground: "black",
//     colorText: "#ffffff", // label color
//     colorDanger: "red", // error color
//     fontFamily: "Ideal Sans, system-ui, sans-serif",
//     spacingUnit: "4px",
//     borderRadius: "4px",
//     // See all possible variables below
//   },
// };
// ---------- stripe -----------------------

const PaymentPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { secretData } = params;
  const { cartLoading, cartList } = useSelector(({ cart }) => cart);
  const { appliedPromoDetail } = useSelector(({ coupon }) => coupon);
  const { orderDetail } = useSelector(({ order }) => order);
  const {
    checkPIStatusLoader,
    paymentIntentMessage,
    paymentIntentStatus,
    paypalPaymentMessage,
    verifyOrderLoader,
    verifyOrderMessage,
  } = useSelector(({ payment }) => payment);

  const getDecodedData = useCallback((secretData) => {
    try {
      const decoded = atob(decodeURIComponent(secretData));
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Failed to decode secret data:", error);
      return {};
    }
  }, []);

  const getCoupon = localStorage.getItem("appliedCoupon");

  const subTotal = helperFunctions?.getSubTotal(cartList);
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

  // abortcontroller
  const abortControllerRef = useRef(null);
  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
  }, []);

  useEffect(() => {
    const decoded = getDecodedData(secretData);
    const { paymentMethod, orderId } = decoded;
    if (paymentMethod === PAYPAL) {
      dispatch(verifyOrder(orderId));
    }
    if (paymentMethod === STRIPE) {
      verifyPaymentIntent();
    }
    return () => {
      if (paymentMethod === STRIPE) {
        terminatePaymentIntent();
        clearAbortController();
      }
      // delete order when payment method is paypal
      else if (paymentMethod === PAYPAL) {
        dispatch(deleteOrder(orderId));
      }
    };
  }, [secretData]);

  const verifyPaymentIntent = useCallback(async () => {
    try {
      const decoded = getDecodedData(secretData);
      const payload = {
        paymentIntentId: decoded?.paymentIntentId,
      };
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      const response = await dispatch(
        checkPaymentIntentStatus(payload, abortControllerRef.current)
      );
      if (response?.paymentIntentStatus) {
        dispatch(setPaymentIntentStatus(response.paymentIntentStatus));
      }
    } catch (error) {
      console.error("Error occurred while check payment intent:", error);
    } finally {
      clearAbortController();
    }
  }, [clearAbortController, dispatch, secretData]);

  const terminatePaymentIntent = useCallback(async () => {
    const parsedDecoded = getDecodedData(secretData);

    const payload = {
      paymentIntentId: parsedDecoded?.paymentIntentId,
      orderId: parsedDecoded?.orderId,
    };

    dispatch(cancelPaymentIntent(payload));
  }, [dispatch, secretData]);

  const renderPaymentContent = useCallback(() => {
    const decoded = getDecodedData(secretData);
    const { clientSecret, orderId, paymentMethod } = decoded;

    // Handle invalid or missing decoded data
    if (!paymentMethod) {
      return <ErrorMessage message="Invalid payment configuration" />;
    }

    // Handle error messages
    if (
      paymentMethod === STRIPE &&
      paymentIntentMessage?.message &&
      paymentIntentMessage?.type !== messageType.SUCCESS
    ) {
      return <ErrorMessage message={paymentIntentMessage.message} />;
    }

    if (
      paymentMethod === PAYPAL &&
      verifyOrderMessage?.message &&
      verifyOrderMessage?.type !== messageType.SUCCESS
    ) {
      return <ErrorMessage message={verifyOrderMessage.message} />;
    }

    if (
      paymentMethod === PAYPAL &&
      paypalPaymentMessage?.message &&
      paypalPaymentMessage?.type !== messageType.SUCCESS
    ) {
      return <ErrorMessage message={paypalPaymentMessage.message} />;
    }

    // Handle loading state
    if (checkPIStatusLoader || verifyOrderLoader) {
      return <PaymentFormSkeleton />;
    }

    // Handle Stripe payment
    if (
      paymentMethod === STRIPE &&
      clientSecret &&
      paymentIntentStatus === "requires_payment_method"
    ) {
      return (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
          }}
        >
          <PaymentForm orderId={orderId} />
        </Elements>
      );
    }

    // Handle PayPal payment
    if (paymentMethod === PAYPAL && orderDetail) {
      return (
        <div className="mt-4 z-10 relative">
          <PaypalForm orderId={orderId} orderData={orderDetail} />
        </div>
      );
    }

    // Fallback for unexpected states
    return <ErrorMessage message="Unable to process payment at this time" />;
  }, [
    secretData,
    checkPIStatusLoader,
    verifyOrderLoader,
    paymentIntentMessage,
    paymentIntentStatus,
    verifyOrderMessage,
    paypalPaymentMessage,
    orderDetail,
    getDecodedData,
  ]);

  return (
    <div className="mx-auto pt-10 lg:pt-10 2xl:pt-12">
      {cartLoading ? (
        <PaymentSkeleton />
      ) : (
        <>
          <CommonBgHeading
            title="Secure Checkout"
            backText="Back to Shipping"
            backHref="/shipping"
          />
          <div className="px-4 container mt-4 md:mt-8 lg:mt-12">
            <CheckoutBreadCrumbs currentStep={2} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] lg:gap-6 container mx-auto h-full">
            <div>
              {cartList?.length ? (
                <div className="lg:hidden pt-8">
                  <CheckoutCommonComponent />
                </div>
              ) : null}
              <AddressSummary />
              <div>{renderPaymentContent()}</div>
            </div>
            <div className="lg:block hidden">
              {cartList?.length ? (
                <CheckoutCommonComponent />
              ) : (
                <CartNotFound />
              )}
            </div>
          </div>
          <section className="container pt-16 lg:pt-20 2xl:pt-36">
            <LatestProduct />
          </section>
          <section className="container pt-16 lg:pt-20 2xl:pt-36">
            <KeyFeatures />
          </section>
        </>
      )}
    </div>
  );
};

export default PaymentPage;

const PaymentSkeleton = () => {
  const skeletons = [
    { width: "w-[60%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[60%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div className="container grid grid-cols-1 lg:grid-cols-[70%_auto] gap-12 pt-12">
      <div>
        {Array(4)
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
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[70px] md:h-[220px] 2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70px] md:h-[220px] 2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70px] md:h-[220px] 2xl:h-[150px]" />
        <SkeletonLoader height="w-[20%] h-[40px]" />
      </div>
    </div>
  );
};

const PaymentFormSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 auto-rows-min mt-5">
      {Array.from({ length: 7 }).map((_, index) => (
        <SkeletonLoader
          key={index}
          height="w-full h-[20px] md:h-[25px] 2xl:h-[30px]"
        />
      ))}
      <SkeletonLoader height="w-[20%] h-[40px]" />
    </div>
  );
};
