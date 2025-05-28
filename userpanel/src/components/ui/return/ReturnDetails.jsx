import { ProductNotFound, ProgressiveImg } from "@/components/dynamiComponents";
import CustomBadge from "@/components/ui/CustomBadge";
import { helperFunctions } from "@/_helper";
import SkeletonLoader from "../skeletonLoader";
import moment from "moment";
import DiamondDetailDrawer from "@/components/ui/customize/DiamondDetailDrawer";

import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";

import CancelReturnRequest from "./CancelReturnRequest";

const ReturnDetails = ({ returnDetail, returnLoader = false }) => {
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
      render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
    },
    {
      label: "Return Status",
      value: returnDetail?.status,
      render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
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
          <div className="container my-8">
            <div className="flex justify-end">
              <div className="flex gap-4 mb-2">
                {returnDetail?.status === "pending" &&
                returnDetail?.returnPaymentStatus === "pending" ? (
                  <>
                    <CancelReturnRequest returnId={returnDetail.id} />
                  </>
                ) : null}

                {/* {returnDetail?.returnPaymentStatus == "refunded" ? (
                  <>
                
                    {invoiceLoading ? (
                      <Spinner className="h-6" />
                    ) : (
                      <DownloadInvoice orderId={returnDetail.id} />
                    )}
                  </>
                ) : (
                  ""
                )} */}
              </div>
            </div>

            {/* Left Panel: Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="bg-white p-4 lg:p-6 min-h-[300px] lg:min-h-[400px] flex flex-col gap-6">
                  {returnDetail?.products?.map((product, index) => {
                    return (
                      <div key={index}>
                        <div className="flex gap-4">
                          <div className="relative">
                            <ProgressiveImg
                              src={product.productImage}
                              alt={product.productName}
                              title={product.productName}
                              className={"w-60 md:w-44 border border-alabaster"}
                            />
                            <div className="absolute top-0 left-0 bg-primary text-white text-xs font-semibold px-2 py-1 z-10">
                              Qty: {product?.returnQuantity}
                            </div>
                          </div>

                          <div className="w-full">
                            <div className="flex justify-between text-sm md:text-base">
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

                            <div className="flex flex-wrap gap-0.5 sm:gap-1 lg:gap-2 my-1 sm:my-1.5 lg:my-3">
                              {product?.variations?.map((variItem) => (
                                <span
                                  className="flex p-1 md:p-1.5 w-fit border border-alabaster text-xs sm:text-xs lg:text-sm 2xl:text-base"
                                  key={helperFunctions.getRandomValue()}
                                >
                                  <p className="font-bold">
                                    {variItem.variationName}:
                                  </p>
                                  <p className="mb-0 text-capitalize pl-1">
                                    {variItem.variationTypeName}
                                  </p>
                                </span>
                              ))}
                            </div>
                            <h3 className="font-medium text-sm md:text-base">
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
                          </div>
                        </div>
                        {product.diamondDetail && (
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
                    );
                  })}
                </div>

                {/* Billing Section */}
                <div className="bg-white p-4 lg:p-6 flex flex-col gap-2 text-sm md:text-base">
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
              <div className="flex flex-col gap-4">
                {/* Order Info Section */}
                <div className="bg-white p-4 lg:p-6">
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
