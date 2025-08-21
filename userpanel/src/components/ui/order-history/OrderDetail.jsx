"use client";
import { ProgressiveImg } from "@/components/dynamiComponents";
import {
  CARD,
  helperFunctions,
  LENGTH,
  RING_SIZE,
  SALES_TAX_NOTE,
  SALES_TAX_PERCENTAGE_VALUE,
} from "@/_helper";
import CancelOrder from "@/components/ui/order-history/CancelOrder";
import Spinner from "@/components/ui/spinner";
import moment from "moment";
import DiamondDetailDrawer from "@/components/ui/customize/DiamondDetailDrawer";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
// import { downloadOrderInvoice } from "@/_actions/order.action";
// import { BsDownload } from "react-icons/bs";
import DownloadInvoice from "@/components/ui/order-history/downloadInvoice";
import SkeletonLoader from "../skeletonLoader";

const shippingFields = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Mobile", key: "mobile" },
  { label: "Company Name", key: "companyName", default: "Not available" },
  {
    label: "Address",
    key: "fullAddress",
  },
];

const OrderDetails = ({
  orderLoading = false,
  orderDetail,
  showInvoice = false,
  showCancel = false,
}) => {
  const { openDiamondDetailDrawer } = useSelector(({ common }) => common);
  const { invoiceLoading } = useSelector(({ order }) => order);
  const dispatch = useDispatch();
  const cartContentRef = useRef(null);
  const [showGradient, setShowGradient] = useState(false);

  const orderMetaFields = [
    {
      label: "Order Date",
      value: moment(orderDetail?.createdDate).format("DD-MM-YYYY"),
    },
    {
      label: "Order Number",
      value: orderDetail?.orderNumber,
    },
    {
      label: "Tracking Number",
      value: orderDetail?.trackingNumber,
      isOptional: true,
    },
    {
      label: "Payment Status",
      value: orderDetail?.paymentStatus,
    },
    {
      label: "Order Status",
      value: orderDetail?.orderStatus,
    },
    {
      label: "Admin Note",
      value: orderDetail?.adminNote,
      isOptional: true,
    },
    {
      label: "Cancelled By",
      value: orderDetail?.cancelledByName,
      isOptional: true,
    },
    {
      label: "Cancel Reason",
      value: orderDetail?.cancelReason,
      isOptional: true,
    },

    {
      label: "Refund Failure Reason",
      value: orderDetail?.stripeRefundFailureReason,
      isOptional: true,
    },
    {
      label: "Refund Failure Reason",
      value: orderDetail?.paypalRefundFailureReason,
      isOptional: true,
    },
    {
      label: "Delivery Date",
      value: orderDetail?.deliveryDate ? (
        <span className="fw-semibold">
          {moment(orderDetail.deliveryDate).format("DD-MM-YYYY")}
        </span>
      ) : null,
      isOptional: true,
    },
  ];

  const paymentDataFields = [
    {
      label: "Payment Method",
      value: orderDetail?.paymentMethodDetails?.type ? (
        <>
          {orderDetail?.paymentMethodDetails?.type === CARD ? (
            <>
              {orderDetail?.paymentMethodDetails?.brand} ending in{" "}
              {orderDetail?.paymentMethodDetails?.lastFour}
            </>
          ) : (
            orderDetail?.paymentMethodDetails?.type
          )}
        </>
      ) : null,
      isOptional: true,
    },
    {
      label: "Billing Address",
      value: orderDetail?.billingAddress ? (
        <>
          {orderDetail?.billingAddress?.line1}{" "}
          {orderDetail?.billingAddress?.line2},{" "}
          {orderDetail?.billingAddress?.city},{" "}
          {orderDetail?.billingAddress?.state},{" "}
          {orderDetail?.billingAddress?.country},{" "}
          {orderDetail?.billingAddress?.postal_code}
        </>
      ) : null,
      isOptional: true,
    },
  ];

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

  useEffect(() => {
    const el = cartContentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5; // small tolerance
      setShowGradient(isScrollable && !atBottom);
    };

    // run once on mount
    handleScroll();

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // handle resize case too

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [orderDetail]);

  // const handleDownloadInvoice = (orderNumber) => {
  //   if (!orderNumber) return;
  //   dispatch(downloadOrderInvoice(orderNumber));
  // };

  return orderLoading ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 container py-5 shadow-[0px_0px_12px_0px_#0000001A] rounded-md">
      {/* Left Panel Skeleton */}
      <div className="flex flex-col gap-4">
        <SkeletonLoader height="h-[400px]" />
        <SkeletonLoader height="h-[200px]" />
      </div>

      {/* Right Panel Skeleton */}
      <div className="flex flex-col gap-4">
        <SkeletonLoader height="h-[200px]" />
        <SkeletonLoader height="h-[250px]" />
      </div>
    </div>
  ) : (
    <div
      className={`p-4 lg:p-8 2xl:p-10 shadow-[0px_0px_10px_0px_#0000001A] rounded-md`}
    >
      <div className="flex justify-end">
        <div className="flex gap-4 mb-2">
          <div className="w-[24px]">
            {showInvoice &&
              (invoiceLoading ? (
                <Spinner className="h-[24px] w-7" />
              ) : (
                <DownloadInvoice orderId={orderDetail.id} />
              ))}
          </div>

          {showCancel &&
            ["pending", "confirmed"].includes(orderDetail.orderStatus) &&
            orderDetail.paymentStatus === "success" && (
              <CancelOrder orderId={orderDetail.id} />
            )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row pt-2 lg:pt-3 lg:divide-x divide-[#00000033]">
        <div className="flex flex-col gap-6 md:px-4 lg:pr-12 2xl:pr-14 w-full lg:w-1/2">
          <section
            className="overflow-y-auto max-h-[55vh] custom-scrollbar"
            ref={cartContentRef}
          >
            <div className="flex flex-col gap-5">
              {orderDetail?.products?.map((product, index) => {
                return (
                  <div
                    key={index}
                    className={`pt-2.5 pl-2.5 ${showGradient ? "pr-2.5" : ""}`}
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 bg-baseblack text-white text-xs xs:text-sm lg:text-base font-semibold rounded-full min-h-[22px] min-w-[22px] flex justify-center items-center  z-10">
                          <span>{product?.cartQuantity}</span>
                        </div>
                        <ProgressiveImg
                          src={product.productImage}
                          alt={product.productName}
                          title={product.productName}
                          className={"w-60 md:w-44 border border-alabaster"}
                        />
                      </div>

                      <div className="w-full">
                        <div className="flex justify-between text-sm md:text-base">
                          <h3 className="font-medium">
                            {helperFunctions?.formatProductNameWithCarat({
                              caratWeight: product?.diamondDetail
                                ? product?.diamondDetail?.caratWeight
                                : product?.totalCaratWeight,
                              productName: product?.productName,
                            })}
                          </h3>
                          <h3 className="font-semibold">
                            $
                            {helperFunctions.toFixedNumber(product?.unitAmount)}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-0.5 sm:gap-1 lg:gap-2 my-1 sm:my-1.5">
                          <p className="text-baseblack font-medium  flex flex-wrap text-sm md:text-base">
                            {helperFunctions?.displayVariationsLabel(
                              product?.variations
                            )}
                          </p>
                        </div>
                        {[RING_SIZE, LENGTH].map((variationName) => {
                          const { name, type, exists } =
                            helperFunctions?.getVariationDisplay(
                              product?.variations,
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

                        {product.diamondDetail && (
                          <div className="hidden xs:block">
                            <DiamondDetailDrawer
                              key={product.productId}
                              cartItem={{
                                ...product,
                                id: product.productId,
                                quantity: product.cartQuantity,
                              }}
                              openDiamondDetailDrawer={openDiamondDetailDrawer}
                              dispatch={dispatch}
                              setOpenDiamondDetailDrawer={
                                setOpenDiamondDetailDrawer
                              }
                              isOrderPage={true}
                            />
                          </div>
                        )}
                        <h3 className="font-medium text-sm md:text-base pt-1">
                          $
                          {helperFunctions.toFixedNumber(product?.productPrice)}{" "}
                          <span className="pl-1">
                            {" "}
                            x {product?.cartQuantity}{" "}
                          </span>
                        </h3>
                        {orderDetail?.discount > 0 && (
                          <h3 className="font-medium flex gap-2 text-sm md:text-base pt-1">
                            Promo Offer:
                            <span>
                              -
                              {helperFunctions?.formatDiscountForItem({
                                productPrice: product?.productPrice,
                                cartQuantity: product?.cartQuantity,
                                subTotal: orderDetail?.subTotal,
                                discountAmount: orderDetail?.discount,
                              })}
                            </span>
                          </h3>
                        )}
                      </div>
                    </div>
                    {product.diamondDetail && (
                      <div className="xs:hidden">
                        <DiamondDetailDrawer
                          key={product.productId}
                          cartItem={{
                            ...product,
                            id: product.productId,
                            quantity: product.cartQuantity,
                          }}
                          openDiamondDetailDrawer={openDiamondDetailDrawer}
                          dispatch={dispatch}
                          setOpenDiamondDetailDrawer={
                            setOpenDiamondDetailDrawer
                          }
                          isOrderPage={true}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {showGradient && (
              <div
                className="pointer-events-none sticky -bottom-1 left-0 w-full h-16"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(250, 250, 248, 0) 0%, #FAFAF8 76.83%)",
                }}
              />
            )}
          </section>

          {/* Billing Section */}
          <div className="flex flex-col gap-2 text-sm md:text-base">
            {[
              {
                label: "Sub Total",
                value: `${helperFunctions?.formatCurrencyWithDollar(
                  orderDetail?.subTotal
                )}`,
              },
              ...(orderDetail?.discount > 0
                ? [
                    {
                      label: `Promo Discount (${orderDetail?.promoCode})`,
                      value: `- ${helperFunctions?.formatCurrencyWithDollar(
                        orderDetail?.discount
                      )}`,
                      strong: false,
                    },
                  ]
                : []),
              {
                label: `Sales Tax (${SALES_TAX_PERCENTAGE_VALUE})`,
                value:
                  orderDetail?.salesTax > 0
                    ? helperFunctions?.formatCurrencyWithDollar(
                        orderDetail?.salesTax
                      )
                    : "$0.00",
              },
              {
                label: "Shipping Charge",
                value:
                  orderDetail?.shippingCharge > 0
                    ? `$${helperFunctions?.formatCurrencyWithDollar(
                        orderDetail.shippingCharge
                      )}`
                    : "Free",
              },
              {
                label: "Total Amount",
                value: `${helperFunctions?.formatCurrencyWithDollar(
                  orderDetail?.total
                )}`,
              },
            ].map((item) => (
              <div
                key={`billing-${item.label}`}
                className="flex justify-between"
              >
                <h4
                  className={`${
                    item.label === "Total Amount" ? "font-bold" : "font-medium"
                  }`}
                >
                  {item.label}
                </h4>
                <p className="font-semibold">{item?.value || "$0.00"}</p>
              </div>
            ))}
            <p className="font-medium mt-2">{SALES_TAX_NOTE}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:px-4 lg:pl-12 2xl:pl-14 pt-2.5 w-full lg:w-1/2">
          {/* Order Info Section */}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-sm md:text-base">
              {orderMetaFields.map(
                ({ label, value, render, isOptional }) =>
                  (!isOptional || value) && (
                    <div key={`meta-${label}`}>
                      <p className="text-basegray">{label}</p>
                      <span className="font-medium break-words mt-1 inline-block">
                        {render ? render(value) : value}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>
          {/* Shipping Info Section */}
          {orderDetail?.shippingAddress ? (
            <div>
              <h3 className="font-castoro text-xl">Shipping Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mt-4">
                {shippingFields.map(
                  ({ label, key, default: defaultValue = "" }) => {
                    let value;

                    if (key === "fullAddress") {
                      const addressParts = [
                        orderDetail?.shippingAddress?.address,
                        orderDetail?.shippingAddress?.apartment,
                        orderDetail?.shippingAddress?.city,
                        orderDetail?.shippingAddress?.state,
                        orderDetail?.shippingAddress?.country,
                        orderDetail?.shippingAddress?.pinCode,
                      ].filter(Boolean); // Remove undefined/null/empty parts

                      value =
                        addressParts.length > 0
                          ? addressParts.join(", ")
                          : "Not available";
                    } else {
                      value =
                        orderDetail?.shippingAddress?.[key] || defaultValue;
                    }

                    return (
                      <div
                        key={`shipping-${key}`}
                        className="text-sm md:text-base"
                      >
                        <p className="text-basegray">{label}</p>
                        <span className="font-medium break-words mt-1">
                          {value}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : null}
          {orderDetail?.paymentMethodDetails ? (
            <div>
              <h3 className="font-castoro text-xl">Payment Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-sm md:text-base pt-4">
                {paymentDataFields.map(
                  ({ label, value, render, isOptional }) =>
                    (!isOptional || value) && (
                      <div key={`meta-${label}`}>
                        <p className="text-basegray">{label}</p>
                        <span className="font-medium break-words mt-1 inline-block">
                          {render ? render(value) : value}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
