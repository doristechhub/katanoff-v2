"use client";

import React, { useCallback, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { paypalClientId } from "@/_helper";
import {
  setPaymentLoader,
  setPaymentMessage,
  setPaypalPaymentMessage,
} from "@/store/slices/paymentSlice";
import {
  updatePaymentStatus,
  updateBillingAddress,
  insertPaypalOrder,
  paypalCaptureOrder,
} from "@/_actions/payment.action";
import { setCartList } from "@/store/slices/cartSlice";
import { helperFunctions } from "@/_helper";
import { useRouter } from "next/navigation";
import { messageType } from "@/_helper/constants";
import { removeCouponCode, verifyCouponCode } from "@/_actions/coupon.action";

const PaypalForm = ({ orderData }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cartList } = useSelector(({ cart }) => cart);
  const { paypalPaymentMessage } = useSelector(({ payment }) => payment);
  const { appliedPromoDetail } = useSelector(({ coupon }) => coupon);

  useEffect(() => {
    dispatch(setPaymentLoader(false));
  }, [dispatch]);

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

  const handleSuccessfulPayment = useCallback(
    async (billingAddressData) => {
      try {
        const currentUser = helperFunctions?.getCurrentUser();

        const paymentPayload = {
          orderId: orderData?.id,
          paymentStatus: "success",
          ...(currentUser && { cartIds: cartList.map((item) => item.id) }),
        };

        const billingPayload = {
          orderId: orderData?.id,
          billingAddress: billingAddressData,
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
          localStorage.removeItem("address");
          localStorage.removeItem("selectedShippingMethod");
          dispatch(setCartList([]));
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
      }
    },
    [cartList, dispatch, router, orderData?.id]
  );

  const createPayPalOrder = async () => {
    try {
      const payload = {
        orderNumber: orderData?.orderNumber,
      };
      const response = await dispatch(insertPaypalOrder(payload));
      return response?.paypalOrderData?.id;
    } catch (error) {
      dispatch(
        setPaymentMessage({
          message: "Unable to create PayPal order.",
          type: messageType.ERROR,
        })
      );
      throw error;
    }
  };

  const onApprove = async (data) => {
    const payload = {
      paypalOrderId: data.orderID,
    };
    const captureRes = await dispatch(paypalCaptureOrder(payload));
    if (captureRes?.success) {
      if (captureRes?.paypalOrderCaptureResult?.status === "COMPLETED") {
        // set billing address same as shipping Address
        const billingAddress = {
          line1: orderData?.shippingAddress?.address || "",
          line2: orderData?.shippingAddress?.apartment || "",
          city: orderData?.shippingAddress?.city || "",
          state: orderData?.shippingAddress?.state || "",
          country: orderData?.shippingAddress?.country || "",
          postal_code: orderData?.shippingAddress?.pinCode?.toString() || "",
        };
        await handleSuccessfulPayment(billingAddress);
      } else {
        dispatch(
          setPaypalPaymentMessage({
            message: "PayPal payment not completed.",
            type: messageType.ERROR,
          })
        );
      }
    }
  };
  return (
    <>
      {paypalPaymentMessage?.message &&
        paypalPaymentMessage?.type !== messageType?.SUCCESS && (
          <ErrorMessage message={paypalPaymentMessage.message} />
        )}

      <PayPalScriptProvider
        options={{
          "client-id": paypalClientId || "test",
          currency: "USD",
          intent: "capture",
        }}
      >
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-3">Pay with PayPal</h2>
          <PayPalButtons
            fundingSource="paypal"
            createOrder={createPayPalOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error("PayPal error:", err);
              dispatch(
                setPaymentMessage({
                  message: "An error occurred with PayPal. Please try again.",
                  type: messageType.ERROR,
                })
              );
            }}
          />
        </div>
      </PayPalScriptProvider>
    </>
  );
};

export default PaypalForm;
