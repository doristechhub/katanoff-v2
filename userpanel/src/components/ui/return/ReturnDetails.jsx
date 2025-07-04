"use client";
import {
  CustomImg,
  ProductNotFound,
  ProgressiveImg,
} from "@/components/dynamiComponents";
import { helperFunctions } from "@/_helper";
import SkeletonLoader from "../skeletonLoader";
import moment from "moment";
import DiamondDetailDrawer from "@/components/ui/customize/DiamondDetailDrawer";
import effect from "@/assets/icons/effect.png";

import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";

import CancelReturnRequest from "./CancelReturnRequest";
import { useEffect, useRef } from "react";

const ReturnDetails = ({
  returnDetail,
  returnLoader = false,
  isShadow = true,
}) => {
  const { openDiamondDetailDrawer } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  const orderMetaFields = [
    {
      label: "Return Request Date",
      value: moment(returnDetail?.createdDate).format("DD-MM-YYYY"),
    },
    {
      label: "Order Number",
      value: returnDetail?.orderNumber,
    },
    {
      label: "Tracking Number",
      value: returnDetail?.trackingNumber,
      isOptional: true,
    },
    {
      label: "Payment Status",
      value: returnDetail?.returnPaymentStatus,
      // render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
    },
    {
      label: "Return Status",
      value: returnDetail?.status,
      // render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
    },
    {
      label: "Shipping Label",

      value: returnDetail?.shippingLabel ? (
        <div
          className="text-primary underline cursor-pointer"
          onClick={() => window.open(returnDetail.shippingLabel, "_blank")}
        >
          Show Shipping Label
        </div>
      ) : null,
      isOptional: true,
    },
    {
      label: "Return Request Reason",
      value: returnDetail?.returnRequestReason,
      isOptional: true,
    },
    {
      label: "Cancel Reason",
      value: returnDetail?.cancelReason,
      isOptional: true,
    },
    {
      label: "Refund Description",
      value: returnDetail?.refundDescription,
      isOptional: true,
    },
    {
      label: "Reject Resason",
      value: returnDetail?.adminNote,
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
  return (
    <>
      {returnLoader ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 container my-8">
            <div className="flex flex-col gap-4">
              <SkeletonLoader height="h-[400px]" />
              <SkeletonLoader height="h-[200px]" />
            </div>
            <div className="flex flex-col gap-4">
              <SkeletonLoader height="h-[200px]" />
            </div>
          </div>
        </>
      ) : !returnDetail || Object.keys(returnDetail).length === 0 ? (
        <ProductNotFound message="Sorry, no order found." />
      ) : (
        <>
          <div
            className={`md:px-2 lg:px-6 my-8 ${isShadow ? "shadow-lg" : null}`}
          >
            <div className="flex justify-end">
              <div className="flex gap-4 mb-2">
                {returnDetail?.status === "pending" &&
                returnDetail?.returnPaymentStatus === "pending" ? (
                  <>
                    <CancelReturnRequest returnId={returnDetail.id} />
                  </>
                ) : null}
              </div>
            </div>

            {/* Left Panel: Products */}
            <div className="relative flex flex-col lg:flex-row">
              <div className="flex flex-col gap-4 lg:pr-6 w-full lg:w-1/2">
                <div
                  className="px-4 flex-1 overflow-y-auto max-h-[55vh] custom-scrollbar relative pt-6"
                  ref={cartContentRef}
                >
                  {returnDetail?.products?.map((product, index) => {
                    return (
                      <div key={index} className="pt-6">
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className="absolute -top-2 -left-2 bg-baseblack text-white text-xs xs:text-sm lg:text-base font-semibold rounded-full px-2  z-10">
                              {product?.returnQuantity}
                            </div>
                            <ProgressiveImg
                              src={product.productImage}
                              alt={product.productName}
                              title={product.productName}
                              className={"w-60 md:w-44 border border-alabaster"}
                            />
                          </div>

                          <div className="w-full">
                            <div className="flex flex-col xs:flex-row xs:justify-between text-sm md:text-base gap-1 xs:gap-0">
                              <h3 className="font-medium">
                                {product?.productName}
                              </h3>
                              <h3 className="font-semibold">
                                {helperFunctions?.formatCurrencyWithDollar(
                                  product?.unitAmount
                                )}
                              </h3>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div className="flex flex-col">
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
                                        id: product?.productId,
                                        quantity: product?.returnQuantity,
                                      }}
                                      openDiamondDetailDrawer={
                                        openDiamondDetailDrawer
                                      }
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
                                  {helperFunctions.toFixedNumber(
                                    product?.productPrice
                                  )}{" "}
                                  <span className="pl-1">
                                    {" "}
                                    x {product?.returnQuantity}{" "}
                                  </span>
                                </h3>
                              </div>

                              <div className="flex flex-col sm:items-end">
                                {returnDetail?.discount > 0 && (
                                  <h3 className="font-medium flex gap-2 text-sm md:text-base pt-1 text-red-600">
                                    Discount:
                                    <span>
                                      {helperFunctions?.formatCurrencyWithDollar(
                                        helperFunctions?.splitDiscountAmongProducts(
                                          {
                                            quantityWiseProductPrice:
                                              product?.productPrice *
                                              product?.returnQuantity,
                                            subTotal: returnDetail?.subTotal,
                                            discountAmount:
                                              returnDetail?.discount,
                                          }
                                        )
                                      )}
                                    </span>
                                  </h3>
                                )}
                                {returnDetail?.salesTax > 0 && (
                                  <div className="text-sm md:text-base font-medium flex flex-wrap gap-2 text-green-600">
                                    <span className="inline xss:block">
                                      Sales Tax:
                                    </span>
                                    <span className="inline xss:block">
                                      {helperFunctions?.formatCurrencyWithDollar(
                                        helperFunctions?.splitTaxAmongProducts({
                                          quantityWiseProductPrice:
                                            product?.productPrice *
                                            product.returnQuantity,
                                          subTotal: returnDetail?.subTotal,
                                          discountAmount:
                                            returnDetail?.discount || 0,
                                          totalTaxAmount:
                                            returnDetail?.salesTax,
                                        })
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {product.diamondDetail && (
                              <div className="xs:hidden">
                                <DiamondDetailDrawer
                                  key={product.productId}
                                  cartItem={{
                                    ...product,
                                    id: product?.productId,
                                    quantity: product?.returnQuantity,
                                  }}
                                  openDiamondDetailDrawer={
                                    openDiamondDetailDrawer
                                  }
                                  dispatch={dispatch}
                                  setOpenDiamondDetailDrawer={
                                    setOpenDiamondDetailDrawer
                                  }
                                  isOrderPage={true}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {returnDetail?.products?.length > 3 && (
                    <div className="sticky bottom-0 w-full h-24 pointer-events-none">
                      <CustomImg
                        src={effect}
                        alt="Effect"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 lg:p-6 flex flex-col gap-2 text-sm md:text-base font-semibold">
                  {[
                    {
                      label: "Sub Total",
                      value: `${helperFunctions.formatCurrencyWithDollar(
                        helperFunctions.calculateRefundAmount(
                          returnDetail?.products
                        )
                      )}`,
                    },
                    ...(returnDetail?.discount > 0
                      ? [
                          {
                            label: `Promo Discount`,
                            value: `- ${helperFunctions?.formatCurrencyWithDollar(
                              returnDetail?.discount
                            )}`,
                            strong: false,
                            customClass: "text-red-500",
                          },
                        ]
                      : []),
                    {
                      label: "Sales Tax(8%)",
                      value:
                        returnDetail?.salesTax > 0
                          ? helperFunctions?.formatCurrencyWithDollar(
                              returnDetail?.salesTax
                            )
                          : "N/A",
                      customClass: "text-green-600",
                    },
                    {
                      label: "Service Fees",
                      value:
                        returnDetail?.serviceFees > 0
                          ? helperFunctions?.formatCurrencyWithDollar(
                              returnDetail?.serviceFees
                            )
                          : "N/A",
                      customClass:
                        returnDetail?.serviceFees > 0
                          ? "text-yellow-400"
                          : "text-gray-400",
                    },
                  ].map((item, index) => (
                    <div
                      key={`refund-${item.label}-${index}`}
                      className={`flex justify-between ${item?.customClass}`}
                    >
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="font-semibold">{item.value || "N/A"}</p>
                    </div>
                  ))}
                  <hr className="w-full border-t border-gray-300 my-2 mx-auto" />

                  <div className="flex justify-between">
                    <h4 className="font-medium">Estimated Amount</h4>
                    <p className="font-semibold">
                      {helperFunctions?.formatCurrencyWithDollar(
                        returnDetail?.returnRequestAmount
                      ) || "N/A"}
                    </p>
                  </div>

                  {returnDetail?.refundAmount ? (
                    <>
                      <div className="text-red-500 flex justify-between text-sm md:text-base">
                        <p>Deducted Amount</p>
                        <p>
                          -
                          {helperFunctions.formatCurrencyWithDollar(
                            returnDetail?.returnRequestAmount -
                              returnDetail?.refundAmount
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm md:text-base">
                        <h4 className="font-medium">Refunded Amount</h4>
                        <p className="font-medium">
                          <strong>
                            {helperFunctions.formatCurrencyWithDollar(
                              returnDetail?.refundAmount
                            )}
                          </strong>
                        </p>
                      </div>
                    </>
                  ) : null}

                  <p className="text-xs italic text-gray-500 pt-1">
                    * Estimated Amount is provisional. After review of the
                    returned products, the estimated amount may vary.
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center px-2 my-4 lg:my-0">
                <div className="w-full h-px bg-grayborder lg:w-px lg:h-[80%]"></div>
              </div>
              <div className="flex flex-col gap-4 lg:pl-6 w-full lg:w-1/2">
                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-sm md:text-base">
                    {orderMetaFields.map(
                      ({ label, value, render, isOptional }) => {
                        const isEmpty =
                          value === undefined ||
                          value === null ||
                          value === "" ||
                          (typeof value === "string" && value.trim() === "");

                        if (isOptional && isEmpty) return null;

                        return (
                          <div
                            key={`meta-${label}`}
                            className="mb-4 flex flex-col flex-wrap w-full"
                          >
                            <p className="text-basegray">{label}</p>

                            {typeof value === "string" ||
                            typeof value === "number" ? (
                              <span className="font-medium break-words mt-1 w-full">
                                {render ? render(value) : value}
                              </span>
                            ) : (
                              <div className="mt-1 break-words w-full">
                                {value}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReturnDetails;
