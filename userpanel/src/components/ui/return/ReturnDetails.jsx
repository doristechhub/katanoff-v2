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
      label: "Admin Note",
      value: returnDetail?.adminNote,
      isOptional: true,
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
                                $
                                {helperFunctions.toFixedNumber(
                                  product?.unitAmount
                                )}
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
                      label: "Total Amount",
                      value: `USD $${helperFunctions.toFixedNumber(
                        helperFunctions.calculateRefundAmount(
                          returnDetail?.products
                        )
                      )}`,
                    },
                  ].map((item) => (
                    <div
                      key={helperFunctions.getRandomValue()}
                      className="flex justify-between"
                    >
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  ))}

                  {returnDetail?.refundAmount ? (
                    <div className="flex justify-between text-sm md:text-base">
                      <h4 className="font-medium">Refund Amount</h4>
                      <p className="font-semibold">
                        {" "}
                        USD{" "}
                        <strong>
                          $
                          {helperFunctions.toFixedNumber(
                            returnDetail?.refundAmount
                          )}
                        </strong>
                      </p>
                    </div>
                  ) : null}
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
