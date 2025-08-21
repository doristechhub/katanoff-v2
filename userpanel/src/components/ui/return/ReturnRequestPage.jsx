"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import dropdownArrow from "@/assets/icons/dropdownArrow.svg";

import {
  createReturnRequest,
  fetchOrderDetailByOrderId,
} from "@/_actions/return.action";
import {
  setReturnMessage,
  setSelectedProducts,
} from "@/store/slices/returnSlice";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomImg, ProgressiveImg } from "@/components/dynamiComponents";
import {
  ESTIMATE_AMOUNT_NOTE,
  helperFunctions,
  messageType,
  RING_SIZE,
} from "@/_helper";
import DiamondDetailDrawer from "../customize/DiamondDetailDrawer";
import {
  setIsHovered,
  setOpenDiamondDetailDrawer,
} from "@/store/slices/commonSlice";
import { setOrderDetail } from "@/store/slices/orderSlice";
import { getProductsArray } from "@/_services";
import ErrorMessage from "../ErrorMessage";
import { LinkButton, LoadingPrimaryButton } from "../button";
import CommonBgHeading from "../CommonBgHeading";
import FixedAlert from "../FixedAlert";
import SkeletonLoader from "../skeletonLoader";
import CommonNotFound from "../CommonNotFound";

const validationSchema = Yup.object().shape({
  returnRequestReason: Yup.string().required("Reason is required"),
  selectedProducts: Yup.array()
    .min(1, "Please select at least one product")
    .required("Please select at least one product"),
});

const ReturnRequestPage = () => {
  let { orderId } = useParams();
  const [returnRequestTotalSummary, setReturnRequestTotalSummary] = useState(
    {}
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const minQuantity = 1;
  const { returnReqLoader, returnMessage, selectedProducts } = useSelector(
    ({ returns }) => returns
  );
  const { openDiamondDetailDrawer, isHovered } = useSelector(
    ({ common }) => common
  );
  const { orderDetail, orderLoading } = useSelector(({ order }) => order);

  useEffect(() => {
    dispatch(fetchOrderDetailByOrderId(orderId));
    dispatch(setSelectedProducts([]));
    dispatch(setReturnMessage({ message: "", type: "" }));
  }, [orderId]);
  const updateDetail = useCallback(
    (detail, productId, variations, diamondDetail, key, value) => {
      const updatedDetail = {
        ...detail,
        products: detail.products.map((product) => {
          if (
            product.productId === productId &&
            helperFunctions.areArraysEqual(product.variations, variations) &&
            helperFunctions.areDiamondDetailsEqual(
              product.diamondDetail,
              diamondDetail
            )
          ) {
            return {
              ...product,
              [key]: value,
            };
          }
          return product;
        }),
      };
      dispatch(setOrderDetail(updatedDetail));

      const getSelectedProducts = updatedDetail.products.filter(
        (item) => item.isChecked === true
      );
      dispatch(setSelectedProducts(getSelectedProducts));
    },
    [dispatch]
  );

  const returnReqSubmit = useCallback(
    async (values, { resetForm }) => {
      try {
        dispatch(setReturnMessage({ message: "", type: "" }));

        const payload = {
          orderId: orderDetail?.id,
          products: getProductsArray(selectedProducts),
          returnRequestReason: values.returnRequestReason,
        };
        const response = await dispatch(createReturnRequest(payload));
        if (response) {
          router.push("/return-history");
          resetForm();
        }
      } catch (error) {
        console.error("Error occurred while returning request:", error);
      }
    },
    [dispatch, router, orderDetail?.id, selectedProducts]
  );
  const {
    handleBlur,
    handleChange,
    errors,
    values,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      returnRequestReason: "",
      selectedProducts: [],
    },
    validationSchema: validationSchema,
    onSubmit: returnReqSubmit,
  });

  const handleCheckboxChange = useCallback(
    (event, cartItem) => {
      const isChecked = event.target.checked;
      const prevSelected = values.selectedProducts || [];

      let updatedSelected = [];

      if (isChecked) {
        updatedSelected = [...prevSelected, cartItem.productId];
      } else {
        updatedSelected = prevSelected.filter(
          (id) => id !== cartItem.productId
        );
      }

      setFieldValue("selectedProducts", updatedSelected);
      updateDetail(
        orderDetail,
        cartItem.productId,
        cartItem.variations,
        cartItem.diamondDetail,
        "isChecked",
        isChecked
      );
    },
    [orderDetail, setFieldValue, updateDetail, values.selectedProducts]
  );

  const handleSelectAllChange = (isChecked) => {
    const updatedProducts = orderDetail.products.map((item) => ({
      ...item,
      isChecked,
    }));

    const updatedDetail = {
      ...orderDetail,
      products: updatedProducts,
    };

    dispatch(setOrderDetail(updatedDetail));

    const selectedIds = isChecked
      ? updatedProducts.map((item) => item.productId)
      : [];

    setFieldValue("selectedProducts", selectedIds);
    dispatch(
      setSelectedProducts(updatedProducts.filter((item) => item.isChecked))
    );
  };

  useEffect(() => {
    const returnRequestTotalSummary = helperFunctions?.calcReturnPayment(
      selectedProducts,
      orderDetail
    );
    setReturnRequestTotalSummary(returnRequestTotalSummary);
  }, [selectedProducts]);

  const allSelected =
    orderDetail?.products?.length > 0 &&
    orderDetail.products.every((item) => item.isChecked);

  const handleProductQtyChange = useCallback(
    (
      type,
      { returnQuantity, cartQuantity, productId, variations, diamondDetail }
    ) => {
      let quantity;
      if (type === "increase") {
        if (returnQuantity >= cartQuantity) return;
        quantity = returnQuantity + 1;
      } else if (type === "decrease") {
        if (returnQuantity <= minQuantity) return;
        quantity = returnQuantity - 1;
      } else if (type === "set") {
        quantity = returnQuantity;
      }
      updateDetail(
        orderDetail,
        productId,
        variations,
        diamondDetail,
        "returnQuantity",
        quantity
      );
    },
    [orderDetail, updateDetail]
  );

  const bgHeadingText = ` ${selectedProducts?.length
    ? `${selectedProducts?.length} Products Selected`
    : ""
    } `;

  return (
    <>
      {orderLoading ? (
        <OrderSkeleton />
      ) : orderDetail && Object.keys(orderDetail)?.length ? (
        <>
          <CommonBgHeading
            title="Return Request"
            rightText={bgHeadingText}
            showSelectAll={true}
            allSelected={allSelected}
            onSelectAllChange={handleSelectAllChange}
            countMobileText={
              selectedProducts?.length ? selectedProducts?.length : ""
            }
          />
          <div className="max-w-5xl justify-center flex flex-col mx-auto container">
            {orderDetail?.products?.map((cartItem, index) => (
              <div
                className={`py-6 md:py-8 pr-2 xs:pr-6 ${index !== orderDetail?.products?.length - 1
                  ? "border-b border-grayborder"
                  : ""
                  }`}
                key={`returnRequest-${index}`}
              >
                <div className="flex gap-2 md:gap-4">
                  <div className="flex gap-4 h-fit">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="productCheckbox"
                        value={cartItem.productId}
                        checked={cartItem.isChecked}
                        onChange={(e) => handleCheckboxChange(e, cartItem)}
                        className="w-4 h-4 rounded-full border-2 border-gray-400 text-primary accent-primary focus:ring-primary checked:bg-primary checked:border-primary"
                      />
                    </div>
                    <div>
                      <ProgressiveImg
                        src={cartItem?.productImage}
                        alt={cartItem?.productName}
                        className="w-32 md:w-40 border border-alabaster"
                      />
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <h2 className="md:text-base lg:text-lg font-semibold">
                        {helperFunctions?.formatProductNameWithCarat({
                          caratWeight: cartItem?.diamondDetail ? cartItem?.diamondDetail?.caratWeight : cartItem?.totalCaratWeight,
                          productName: cartItem?.productName,
                        })}
                      </h2>

                      <p className="text-base md:text-lg font-bold">
                        {helperFunctions.formatCurrencyWithDollar(
                          cartItem.productPrice * cartItem.returnQuantity
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between mt-1">
                      <div className="flex flex-col">
                        <div className="text-baseblack font-medium text-sm md:text-base  flex flex-wrap gap-1">
                          {helperFunctions?.displayVariationsLabel(
                            cartItem?.variations
                          )}
                        </div>
                        <div className="text-baseblack font-medium text-sm md:text-base flex flex-wrap">
                          <span className="inline xss:block">Product SKU:</span>
                          <span className="inline xss:block">
                            {cartItem?.productSku}
                          </span>
                        </div>

                        {cartItem?.variations?.some(
                          (v) => v.variationName === RING_SIZE
                        ) && (
                            <div className="flex items-center gap-2 pt-2 sm:pt-0">
                              <p className="text-sm items-center md:text-base font-medium text-baseblack">
                                {cartItem?.variations?.find(
                                  (v) => v.variationName === RING_SIZE
                                )?.variationName || "N/A"}
                                :{" "}
                                {cartItem?.variations?.find(
                                  (v) => v.variationName === RING_SIZE
                                )?.variationTypeName || "N/A"}
                              </p>
                            </div>
                          )}

                        <DiamondDetailDrawer
                          cartItem={cartItem}
                          openDiamondDetailDrawer={openDiamondDetailDrawer}
                          dispatch={dispatch}
                          setOpenDiamondDetailDrawer={
                            setOpenDiamondDetailDrawer
                          }
                          isOrderPage={true}
                        />
                      </div>
                      <div className="flex flex-col pt-1 sm:pt-0 sm:items-end sm:gap-2 w-48">
                        {orderDetail?.discount > 0 && (
                          <div className="text-lightblack text-sm md:text-base font-semibold flex flex-wrap gap-2">
                            <span className="inline xss:block">Discount:</span>
                            <span className="inline xss:block">
                              -
                              {helperFunctions?.formatDiscountForItem({
                                productPrice: cartItem?.productPrice,
                                cartQuantity: cartItem?.returnQuantity,
                                subTotal: orderDetail?.subTotal,
                                discountAmount: orderDetail?.discount,
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1 md:pt-2">
                          <p className="text-sm md:text-base font-medium">
                            Qty
                          </p>

                          <div className="relative w-fit">
                            <select
                              value={cartItem.returnQuantity}
                              onChange={(e) =>
                                handleProductQtyChange("set", {
                                  ...cartItem,
                                  returnQuantity: parseInt(e.target.value),
                                })
                              }
                              className="appearance-none px-2 sm:px-4 sm:py-2 pr-6 sm:pr-10 border border-grayborder rounded-sm text-sm font-medium bg-transparent cursor-pointer"
                            >
                              {Array.from(
                                {
                                  length:
                                    cartItem.cartQuantity - minQuantity + 1,
                                },
                                (_, i) => i + minQuantity
                              ).map((qty) => (
                                <option key={qty} value={qty}>
                                  {qty}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 sm:px-2 text-black">
                              <CustomImg
                                srcAttr={dropdownArrow}
                                altAttr="Arrow"
                                titleAttr="Arrow"
                                className="w-4 h-4"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className=" xs:hidden mt-1">
                  <DiamondDetailDrawer
                    cartItem={cartItem}
                    openDiamondDetailDrawer={openDiamondDetailDrawer}
                    dispatch={dispatch}
                    setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                    isOrderPage={true}
                  />
                </div> */}
              </div>
            ))}
            {touched.selectedProducts && errors.selectedProducts && (
              <ErrorMessage message={errors.selectedProducts} />
            )}

            {selectedProducts?.length ? (
              <div className="flex flex-col gap-2 w-full items-end text-right px-4 md:px-6">
                {/* Sub Total */}
                <div className="text-sm md:text-base flex justify-between w-full max-w-xs font-semibold text-baseblack">
                  <span>Sub Total:</span>
                  <span>
                    {returnRequestTotalSummary?.subTotal
                      ? helperFunctions?.formatCurrencyWithDollar(
                        returnRequestTotalSummary?.subTotal
                      )
                      : "$0.00"}
                  </span>
                </div>

                <div className="text-sm md:text-base flex justify-between w-full max-w-xs font-semibold text-lightblack">
                  <span>Discount:</span>
                  <span>
                    {returnRequestTotalSummary?.discount
                      ? ` - ${helperFunctions?.formatCurrencyWithDollar(
                        returnRequestTotalSummary?.discount
                      )}`
                      : "$0.00"}
                  </span>
                </div>

                <div className="text-sm md:text-base flex justify-between w-full max-w-xs font-semibold text-lightblack">
                  <span>Sales Tax:</span>
                  <span>
                    {returnRequestTotalSummary?.salesTax
                      ? helperFunctions?.formatCurrencyWithDollar(
                        returnRequestTotalSummary?.salesTax
                      )
                      : "$0.00"}
                  </span>
                </div>

                {/* Divider */}
                <hr className="w-full max-w-xs border-t border-gray-300 my-2" />

                {/* Grand Total */}
                <div className="text-sm md:text-lg flex justify-between w-full max-w-xs font-bold text-baseblack">
                  <span>Estimated Amount:</span>
                  <span>
                    {selectedProducts?.length
                      ? helperFunctions?.formatCurrencyWithDollar(
                        returnRequestTotalSummary?.returnRequestAmount
                      )
                      : "$0.00"}
                  </span>
                </div>
                <p className="text-sm text-lightblack font-medium mt-2">
                  {ESTIMATE_AMOUNT_NOTE}
                </p>
              </div>
            ) : null}
            <form className="flex flex-col  gap-6 pt-6 w-full">
              <div>
                <textarea
                  name="returnRequestReason"
                  placeholder="Enter Reason"
                  className="w-full h-32 p-4 focus:outline-none resize-none text-base"
                  value={values.returnRequestReason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {touched.returnRequestReason && errors.returnRequestReason ? (
                  <ErrorMessage
                    className="!text-start"
                    message={errors.returnRequestReason}
                  />
                ) : null}
              </div>
              {returnMessage && returnMessage.type !== messageType.SUCCESS ? (
                <ErrorMessage
                  className="!text-start"
                  message={returnMessage?.message}
                />
              ) : null}
              <div className="flex gap-4 items-center justify-center">
                <LinkButton
                  href="/order-history"
                  className="!text-baseblack !h-12 lg:!h-[2.8rem] 2xl:!h-[3.5rem] !font-medium  w-fit xl:!py-6 !bg-[#E5E5E5] !text-base hover:!border-[#202A4E] hover:!bg-transparent hover:!text-[#202A4E] !border-black_opacity_10 !uppercase !border !rounded-none"
                >
                  Cancel
                </LinkButton>
                <div
                  onMouseEnter={() => dispatch(setIsHovered(true))}
                  onMouseLeave={() => dispatch(setIsHovered(false))}
                >
                  <LoadingPrimaryButton
                    type="submit"
                    title="Submit"
                    loading={returnReqLoader}
                    disabled={returnReqLoader}
                    loaderType={isHovered ? "" : "white"}
                    className="uppercase !h-12 lg:!h-[2.8rem] 2xl:!h-[3.5rem] xl:!py-6"
                    onClick={handleSubmit}
                  >
                    Request
                  </LoadingPrimaryButton>
                </div>
              </div>
            </form>
            {returnMessage?.type === messageType.SUCCESS ? (
              <FixedAlert
                message={returnMessage.message}
                type={returnMessage.type}
              />
            ) : null}
          </div>
        </>
      ) : (
        <CommonNotFound
          message="Sorry, no order found."
          subMessage="You can Try with Different order..."
        />
      )}
    </>
  );
};

export default ReturnRequestPage;

const OrderSkeleton = () => {
  const skeletons = [{ width: "w-full", height: "h-36", margin: "mt-8" }];
  return (
    <div className={`container grid grid-cols-1  gap-6 xs:gap-12`}>
      <div className="max-w-6xl justify-center flex flex-col mx-auto container">
        {Array(3)
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
      <div className="flex justify-center items-center gap-4 mt-4">
        <SkeletonLoader width="w-36 !h-12" />
        <SkeletonLoader width="w-36 !h-12" />
      </div>
    </div>
  );
};
