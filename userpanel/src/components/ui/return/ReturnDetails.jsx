"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ProductNotFound, ProgressiveImg } from "@/components/dynamiComponents";
import {
  ESTIMATE_AMOUNT_NOTE,
  helperFunctions,
  LENGTH,
  RING_SIZE,
  SALES_TAX_PERCENTAGE_VALUE,
} from "@/_helper";
import SkeletonLoader from "../skeletonLoader";
import DiamondDetailDrawer from "@/components/ui/customize/DiamondDetailDrawer";
import CancelReturnRequest from "./CancelReturnRequest";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import Spinner from "../spinner";
// import { downloadReturnInvoice } from "@/_actions/return.action";
// import { BsDownload } from "react-icons/bs";
import DownloadInvoice from "../order-history/downloadInvoice";

const ReturnDetails = ({
  returnDetail,
  returnLoader = false,
  showShadow = true,
  showCancel = false,
}) => {
  const { openDiamondDetailDrawer } = useSelector((state) => state.common);
  const { invoiceLoading } = useSelector(({ order }) => order);
  const dispatch = useDispatch();
  const cartContentRef = useRef(null);
  const [showGradient, setShowGradient] = useState(false);

  const formatCurrency = (value) =>
    helperFunctions.formatCurrencyWithDollar(value);
  // Return Order metadata fields configuration
  const returnOrderMetaFields = [
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
  }, [returnDetail]);

  // const handleDownloadInvoice = ({ returnId, orderNumber }) => {
  //   if (!returnId) return;
  //   dispatch(downloadReturnInvoice({ returnId, orderNumber }));
  // };

  // Render loading state
  if (returnLoader) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 container py-5 shadow-[0px_0px_12px_0px_#0000001A] rounded-md">
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
    return <ProductNotFound message="Sorry, no return order found." />;
  }

  return (
    <div
      className={`p-4 lg:p-8 2xl:p-10 ${
        showShadow ? "shadow-[0px_0px_10px_0px_#0000001A]" : ""
      } rounded-md`}
    >
      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {showCancel
          ? returnDetail?.status === "pending" &&
            returnDetail?.returnPaymentStatus === "pending" && (
              <CancelReturnRequest returnId={returnDetail.id} />
            )
          : null}
        {/* {["approved", "received"]?.includes(returnDetail?.status) &&
          (invoiceLoading ? (
            <Spinner className="h-6" />
          ) : (
            <button
              className="text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray"
              onClick={() =>
                handleDownloadInvoice({
                  returnId: returnDetail?.id,
                  orderNumber: returnDetail?.orderNumber,
                })
              }
            >
              <BsDownload
                title="Download Invoice"
                className="text-xl text-basegray"
              />
            </button>
          ))} */}
        <div className="w-[24px]">
          {["approved", "received"]?.includes(returnDetail?.status) &&
            (invoiceLoading ? (
              <Spinner className="h-[24px] w-7" />
            ) : (
              <DownloadInvoice returnId={returnDetail.id} />
            ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row pt-2 lg:pt-3 lg:divide-x divide-[#00000033]">
        {/* Left Panel: Products */}
        <div className="flex flex-col gap-6 md:px-4 lg:pr-12 2xl:pr-14 w-full lg:w-1/2">
          <div
            className="overflow-y-auto max-h-[55vh] custom-scrollbar"
            ref={cartContentRef}
          >
            <div className="flex flex-col gap-5">
              {returnDetail?.products?.map((product, index) => (
                <div
                  key={index}
                  className={`pt-2.5 pl-2.5 ${showGradient ? "pr-2.5" : ""}`}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 bg-baseblack text-white text-xs xs:text-sm lg:text-base font-semibold rounded-full min-h-[22px] min-w-[22px] flex justify-center items-center  z-10">
                        <span>{product?.returnQuantity}</span>
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
                            caratWeight: product?.diamondDetail
                              ? product?.diamondDetail?.caratWeight
                              : product?.totalCaratWeight,
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

                          {[RING_SIZE, LENGTH].map((variationName) => {
                            const { name, type, exists } =
                              helperFunctions?.getVariationDisplay(
                                product?.variations,
                                variationName
                              );
                            return exists ? (
                              <div
                                key={variationName}
                                className="flex items-center gap-2 pt-1 sm:pt-0"
                              >
                                <p className="text-sm items-center md:text-base font-medium text-baseblack">
                                  {name}: {type}
                                </p>
                              </div>
                            ) : null;
                          })}

                          {product?.diamondDetail && (
                            <div className="hidden xs:block">
                              <DiamondDetailDrawer
                                key={product.productId}
                                cartItem={{
                                  ...product,
                                  id: product.productId,
                                  quantity: product.returnQuantity,
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
          </div>

          {/* Summary Section */}
          <div className="flex flex-col gap-2 text-sm md:text-base font-semibold">
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

        {/* Right Panel: Order Details */}
        <div className="flex flex-col gap-6 md:px-4 lg:pl-12 2xl:pl-14 pt-2.5 w-full lg:w-1/2">
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-sm md:text-base">
              {returnOrderMetaFields.map(({ label, value, isOptional }) => {
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
