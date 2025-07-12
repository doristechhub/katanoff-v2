"use client";
import { CustomImg, ProgressiveImg } from "@/components/dynamiComponents";
import { helperFunctions, SALES_TAX_NOTE } from "@/_helper";
import DownloadInvoice from "@/components/ui/order-history/downloadInvoice";
import CancelOrder from "@/components/ui/order-history/CancelOrder";
import Spinner from "@/components/ui/spinner";
import SkeletonLoader from "./skeletonLoader";
import moment from "moment";
import DiamondDetailDrawer from "@/components/ui/customize/DiamondDetailDrawer";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import effect from "@/assets/icons/effect.png";
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
  invoiceLoading = false,
  selectedOrder,
  showInvoice = false,
  showCancel = false,
}) => {
  const { openDiamondDetailDrawer } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
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
  const cartContentRef = useRef(null);
  return orderLoading ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 container my-8">
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
    <div className="px-6 shadow-lg pt-4">
      <div className="flex justify-end">
        <div className="flex gap-4 mb-2">
          {showInvoice &&
            (invoiceLoading && orderDetail.id === selectedOrder ? (
              <Spinner className="h-6" />
            ) : (
              <DownloadInvoice orderId={orderDetail.id} />
            ))}

          {showCancel &&
            ["pending", "confirmed"].includes(orderDetail.orderStatus) &&
            orderDetail.paymentStatus === "success" && (
              <CancelOrder orderId={orderDetail.id} />
            )}
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row">
        <div className="flex flex-col gap-4 pr-6 w-full lg:w-1/2">
          <section
            className="px-4 flex-1 overflow-y-auto max-h-[55vh] custom-scrollbar relative pt-6"
            ref={cartContentRef}
          >
            {orderDetail?.products?.map((product, index) => {
              return (
                <div key={index} className="pt-6">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 bg-baseblack text-white text-xs xs:text-sm lg:text-base font-semibold rounded-full px-2  z-10">
                        {product?.cartQuantity}
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
                        <h3 className="font-medium">{product?.productName}</h3>
                        <h3 className="font-semibold">
                          ${helperFunctions.toFixedNumber(product?.unitAmount)}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-0.5 sm:gap-1 lg:gap-2 my-1 sm:my-1.5">
                        <p className="text-baseblack font-medium  flex flex-wrap text-sm md:text-base">
                          {helperFunctions?.displayVariationsLabel(
                            product?.variations
                          )}
                        </p>
                      </div>

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
                        ${helperFunctions.toFixedNumber(product?.productPrice)}{" "}
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
                        setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                        isOrderPage={true}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {orderDetail?.products?.length > 3 && (
              <div className="sticky bottom-0 w-full h-24 pointer-events-none">
                <CustomImg
                  src={effect}
                  alt="Effect"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </section>

          {/* Billing Section */}
          <div className="p-4 lg:p-6 flex flex-col gap-2 text-sm md:text-base">
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
                label: "Sales Tax(8%)",
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
        <div className="flex justify-center items-center px-2 my-4 lg:my-0">
          <div className="w-full h-px bg-grayborder lg:w-px lg:h-[80%]"></div>
        </div>

        <div className="flex flex-col gap-4 lg:pl-6 w-full lg:w-1/2">
          {/* Order Info Section */}
          <div className="p-4 lg:p-6">
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
          <div className="p-4 lg:p-6">
            <h3 className="font-castoro text-2xl">Shipping Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-4">
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
                    value = orderDetail?.shippingAddress?.[key] || defaultValue;
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
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
