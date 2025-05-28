import { ProgressiveImg } from "@/components/dynamiComponents";
import CustomBadge from "@/components/ui/CustomBadge";
import { helperFunctions } from "@/_helper";
import DownloadInvoice from "@/components/ui/order-history/downloadInvoice";
import CancelOrder from "@/components/ui/order-history/CancelOrder";
import Spinner from "@/components/ui/spinner";
import SkeletonLoader from "./skeletonLoader";
import moment from "moment";
import DiamondDetailDrawer from "@/components/ui/customize/DiamondDetailDrawer";
import { setOpenDiamondDetailDrawer } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";

const shippingFields = [
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Mobile", key: "mobile" },
  { label: "Company Name", key: "companyName", default: "Not available" },
  { label: "Address", key: "address" },
  { label: "Apartment", key: "apartment", default: "Not available" },
  { label: "City", key: "city" },
  { label: "State", key: "state" },
  { label: "Country", key: "country" },
  { label: "Zipcode", key: "pinCode" },
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
      render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
    },
    {
      label: "Order Status",
      value: orderDetail?.orderStatus,
      render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
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
      label: "Delivery Date",
      value: orderDetail?.deliveryDate ? (
        <span className="fw-semibold">
          {moment(orderDetail.deliveryDate).format("DD-MM-YYYY")}
        </span>
      ) : null,
      isOptional: true,
    },
  ];

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
    <div className="container my-8">
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

      {/* Left Panel: Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 lg:p-6 min-h-[300px] lg:min-h-[400px] flex flex-col gap-6">
            {orderDetail?.products?.map((product, index) => {
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
                        Qty: {product?.cartQuantity}
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex justify-between text-sm md:text-base">
                        <h3 className="font-medium">{product?.productName}</h3>
                        <h3 className="font-semibold">
                          ${helperFunctions.toFixedNumber(product?.unitAmount)}
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
                        ${helperFunctions.toFixedNumber(product?.productPrice)}{" "}
                        <span className="pl-1">
                          {" "}
                          x {product?.cartQuantity}{" "}
                        </span>
                      </h3>
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
          </div>

          {/* Billing Section */}
          <div className="bg-white p-4 lg:p-6 flex flex-col gap-2 text-sm md:text-base">
            {[
              { label: "Sub Total", value: `$${orderDetail?.subTotal}` },
              {
                label: "Sales Tax(8%)",
                value: `$${helperFunctions.toFixedNumber(
                  orderDetail?.salesTax
                )}`,
              },
              {
                label: "Shipping Charge",
                value: `$${orderDetail?.shippingCharge}`,
              },
              {
                label: "Total Amount",
                value: `USD $${helperFunctions.toFixedNumber(
                  orderDetail?.total
                )}`,
              },
            ].map((item) => (
              <div
                key={`billing-${item.label}`}
                className="flex justify-between"
              >
                <h4 className="font-medium">{item.label}</h4>
                <p className="font-semibold">{item.value}</p>
              </div>
            ))}
            <p className="font-medium mt-2">
              *Sales tax will be applied to shipped to addresses within New York
              State.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* Order Info Section */}
          <div className="bg-white p-4 lg:p-6">
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
          <div className="bg-white p-4 lg:p-6">
            <h3 className="font-castoro text-2xl lg:text-3xl">Order Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-4">
              {shippingFields.map(
                ({ label, key, default: defaultValue = "" }) => (
                  <div key={`shipping-${key}`} className="text-sm md:text-base">
                    <p className="text-basegray">{label}</p>
                    <span className="font-medium break-words mt-1">
                      {orderDetail?.shippingAddress?.[key] || defaultValue}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
