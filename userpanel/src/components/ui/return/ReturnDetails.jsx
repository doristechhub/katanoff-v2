"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  CustomImg,
  ProductNotFound,
  ProgressiveImg,
} from "@/components/dynamiComponents";
import {
  ESTIMATE_AMOUNT_NOTE,
  helperFunctions,
  SALES_TAX_PERCENTAGE_VALUE,
} from "@/_helper";
import SkeletonLoader from "../skeletonLoader";
import DiamondDetailDrawer from "@/components/ui/customize/DiamondDetailDrawer";
import CancelReturnRequest from "./CancelReturnRequest";
import effect from "@/assets/icons/effect.png";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import DownloadInvoice from "../order-history/downloadInvoice";
import Spinner from "../spinner";

const ReturnDetails = ({
  returnDetail,
  returnLoader = false,
  isShadow = true,
  invoiceLoading = false,
}) => {
  const { openDiamondDetailDrawer } = useSelector((state) => state.common);
  const dispatch = useDispatch();
  const cartContentRef = useRef(null);

  const formatCurrency = (value) =>
    helperFunctions.formatCurrencyWithDollar(value);

  // Order metadata fields configuration
  const orderMetaFields = [
    {
      label: "Return Request Date",
      value: moment(returnDetail?.createdDate).format("DD-MM-YYYY"),
    },
    { label: "Order Number", value: returnDetail?.orderNumber },
    {
      label: "Tracking Number",
      value: returnDetail?.trackingNumber,
      isOptional: true,
    },
    { label: "Payment Status", value: returnDetail?.returnPaymentStatus },
    { label: "Return Status", value: returnDetail?.status },
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
      label: "Reject Reason",
      value: returnDetail?.adminNote,
      isOptional: true,
    },
  ];

  // Handle custom scroll behavior
  useEffect(() => {
    const contentElement = cartContentRef.current;
    if (!contentElement) return;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const scrollAmount = event.deltaY;
      const maxScroll =
        contentElement.scrollHeight - contentElement.clientHeight;
      contentElement.scrollTop = Math.max(
        0,
        Math.min(contentElement.scrollTop + scrollAmount, maxScroll)
      );
    };

    contentElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => contentElement.removeEventListener("wheel", handleWheel);
  }, []);

  // Render loading state
  if (returnLoader) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 container my-8">
        <div className="flex flex-col gap-4">
          <SkeletonLoader height="h-[400px]" />
          <SkeletonLoader height="h-[200px]" />
        </div>
        <div className="flex flex-col gap-4">
          <SkeletonLoader height="h-[200px]" />
        </div>
      </div>
    );
  }

  // Render not found state
  if (!returnDetail || !Object.keys(returnDetail).length) {
    return <ProductNotFound message="Sorry, no order found." />;
  }
  return (
    <div className={`md:px-2 lg:px-6 my-6 ${isShadow ? "shadow-lg" : ""}`}>
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-2">
        {returnDetail?.status === "pending" &&
          returnDetail?.returnPaymentStatus === "pending" && (
            <CancelReturnRequest returnId={returnDetail.id} />
          )}
        {["approved", "received"]?.includes(returnDetail?.status) &&
          (invoiceLoading ? (
            <Spinner className="h-6" />
          ) : (
            <DownloadInvoice returnId={returnDetail.id} />
          ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Panel: Products */}
        <div className="flex flex-col gap-4 lg:pr-6 w-full lg:w-1/2">
          <div
            className="px-4 flex-1 overflow-y-auto max-h-[55vh] custom-scrollbar pt-6"
            ref={cartContentRef}
          >
            {returnDetail?.products?.map((product, index) => (
              <div key={index} className="pt-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 bg-baseblack text-white text-xs xs:text-sm lg:text-base font-semibold rounded-full px-2 z-10">
                      {product?.returnQuantity}
                    </div>
                    <ProgressiveImg
                      src={product.productImage}
                      alt={product.productName}
                      title={product.productName}
                      className="w-60 md:w-44 border border-alabaster"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="w-full">
                    <div className="flex flex-col xs:flex-row xs:justify-between text-sm md:text-base gap-1 xs:gap-0">
                      <h3 className="font-medium">
                        {helperFunctions?.formatProductNameWithCarat({
                          caratWeight: product?.totalCaratWeight,
                          productName: product?.productName,
                        })}
                      </h3>
                      <h3 className="font-semibold">
                        {formatCurrency(product?.unitAmount)}
                      </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="flex flex-col">
                        <p className="text-baseblack font-medium text-sm md:text-base my-1 sm:my-1.5">
                          {helperFunctions?.displayVariationsLabel(
                            product?.variations
                          )}
                        </p>

                        {product?.diamondDetail && (
                          <div className="hidden xs:block">
                            <DiamondDetailDrawer
                              key={product.productId}
                              cartItem={{
                                ...product,
                                id: product.productId,
                                quantity: product.returnQuantity,
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
                          x {product?.returnQuantity}
                        </h3>
                      </div>

                      {/* Discount and Tax */}
                      <div className="flex flex-col sm:items-end min-w-40">
                        {returnDetail.discount > 0 && (
                          <h3 className="font-medium text-sm md:text-base pt-1 text-lightblack">
                            Discount:{" "}
                            <span>
                              -
                              {helperFunctions?.formatDiscountForItem({
                                productPrice: product?.productPrice,
                                cartQuantity: product?.returnQuantity,
                                subTotal: returnDetail?.subTotal,
                                discountAmount: returnDetail?.discount,
                              })}
                            </span>
                          </h3>
                        )}
                      </div>
                    </div>

                    {product?.diamondDetail && (
                      <div className="xs:hidden">
                        <DiamondDetailDrawer
                          key={product.productId}
                          cartItem={{
                            ...product,
                            id: product.productId,
                            quantity: product.returnQuantity,
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
                </div>
              </div>
            ))}
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

          {/* Summary Section */}
          <div className="p-4 lg:p-6 flex flex-col gap-2 text-sm md:text-base font-semibold">
            <div className="flex justify-between">
              <h4 className="font-medium">Sub Total</h4>
              <p className="font-semibold">
                {formatCurrency(
                  helperFunctions?.calculateRefundAmount(returnDetail?.products)
                )}
              </p>
            </div>
            {returnDetail?.discount > 0 && (
              <div className="flex justify-between text-lightblack">
                <h4 className="font-medium">Promo Discount</h4>
                <p className="font-semibold">
                  -{formatCurrency(returnDetail?.discount)}
                </p>
              </div>
            )}
            <div className="flex justify-between text-lightblack">
              <h4 className="font-medium">
                Sales Tax ({SALES_TAX_PERCENTAGE_VALUE})
              </h4>
              <p className="font-semibold">
                {returnDetail?.salesTax > 0
                  ? formatCurrency(returnDetail?.salesTax)
                  : "$0.00"}
              </p>
            </div>
            <hr className="w-full border-t border-gray-300 my-2 mx-auto" />
            {returnDetail?.returnRequestAmount &&
            returnDetail?.refundAmount &&
            Number(returnDetail?.returnRequestAmount) ===
              Number(returnDetail?.refundAmount) ? (
              // Case: Full refund, show only Refunded Amount
              <div className="flex justify-between">
                <h4 className="font-medium">Refunded Amount</h4>
                <p className="font-semibold">
                  {formatCurrency(returnDetail?.refundAmount) || "$0.00"}
                </p>
              </div>
            ) : (
              // Case: Partial refund or no refund
              <>
                <div className="flex justify-between">
                  <h4 className="font-medium">Estimated Amount</h4>
                  <p className="font-semibold">
                    {formatCurrency(returnDetail?.returnRequestAmount) ||
                      "$0.00"}
                  </p>
                </div>

                {returnDetail?.refundAmount && (
                  <>
                    <div className="text-lightblack flex justify-between text-sm md:text-base">
                      <p>Deducted Amount</p>
                      <p>
                        -
                        {formatCurrency(
                          Number(returnDetail?.returnRequestAmount) -
                            Number(returnDetail?.refundAmount)
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm md:text-base">
                      <h4 className="font-medium">Refunded Amount</h4>
                      <p className="font-medium">
                        <strong>
                          {formatCurrency(returnDetail?.refundAmount)}
                        </strong>
                      </p>
                    </div>
                  </>
                )}
                <p className="text-xs italic text-gray-500 pt-1">
                  {ESTIMATE_AMOUNT_NOTE}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center items-center px-2 my-4 lg:my-0">
          <div className="w-full h-px bg-grayborder lg:w-px lg:h-[80%]"></div>
        </div>

        {/* Right Panel: Order Details */}
        <div className="flex flex-col gap-4 lg:pl-6 w-full lg:w-1/2">
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-sm md:text-base">
              {orderMetaFields.map(({ label, value, isOptional }) => {
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
                    <div className="mt-1 break-words w-full font-medium">
                      {typeof value === "string" || typeof value === "number"
                        ? value
                        : value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnDetails;
