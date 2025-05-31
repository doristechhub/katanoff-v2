"use client";
import { useFormik } from "formik";
import * as Yup from "yup";

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
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProgressiveImg } from "@/components/dynamiComponents";
import { helperFunctions, messageType } from "@/_helper";
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
import Alert from "../Alert";
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

  const handleProductQtyChange = useCallback(
    (
      type,
      { returnQuantity, cartQuantity, productId, variations, diamondDetail }
    ) => {
      if (
        type === "increase" &&
        (returnQuantity < minQuantity || returnQuantity >= cartQuantity)
      ) {
        return;
      }
      if (
        type === "decrease" &&
        (returnQuantity <= minQuantity || returnQuantity > cartQuantity)
      ) {
        return;
      }
      const quantity =
        type === "increase" ? returnQuantity + 1 : returnQuantity - 1;
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

  const bgHeadingText = `${selectedProducts?.length}  Selected Products`;
  return (
    <>
      {orderLoading ? (
        <OrderSkeleton />
      ) : orderDetail && Object.keys(orderDetail)?.length ? (
        <>
          <CommonBgHeading title="Return Request" rightText={bgHeadingText} />
          <div className="max-w-5xl justify-center flex flex-col mx-auto container">
            {orderDetail?.products?.map((cartItem) => (
              <div
                className="bg-white mt-8 xl:mt-12  py-4 md:py-6 px-2  xs:px-6"
                key={helperFunctions.getRandomValue()}
              >
                <div className="flex gap-2 md:gap-6">
                  <div className="flex h-fit pt-[20%] xss:pt-[12%] md:pt-[8%] mb-4">
                    <input
                      type="checkbox"
                      name="productCheckbox"
                      value={cartItem.productId}
                      checked={cartItem.isChecked}
                      onChange={(e) => handleCheckboxChange(e, cartItem)}
                      className="w-5 h-5 rounded-full border-2 border-gray-400 text-primary accent-primary focus:ring-primary checked:bg-primary checked:border-primary"
                    />
                  </div>
                  <div>
                    <ProgressiveImg
                      src={cartItem?.productImage}
                      alt={cartItem?.productName}
                      className="w-32 md:w-40 border border-alabaster"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="grid grid-cols-2 xs:flex-row xs:justify-between">
                      <h2 className="text-sm md:text-base lg:text-lg font-medium flex-wrap">
                        {cartItem?.productName}
                      </h2>

                      <p className="text-base md:text-xl lg:text-2xl font-medium font-castoro text-end">
                        $
                        {helperFunctions.toFixedNumber(
                          cartItem.productPrice * cartItem.returnQuantity
                        )}
                      </p>
                    </div>

                    <div className="text-baseblack flex flex-wrap gap-1 md:gap-x-4 md:gap-y-2 pt-1 md:pt-2">
                      {cartItem.variations.map((variItem) => (
                        <div
                          className="border md:border-2 border-black_opacity_10  text-xs lg:text-base p-1 md:px-2 font-medium"
                          key={variItem.variationId}
                        >
                          <span className="font-bold">
                            {variItem.variationName}:{" "}
                          </span>{" "}
                          {variItem.variationTypeName}
                        </div>
                      ))}
                    </div>

                    {cartItem?.diamondDetail && (
                      <p className="font-castoro text-base md:text-xl lg:text-2xl font-medium text-baseblack  md:pt-4 pt-2">
                        ${(cartItem?.productPrice).toFixed(2)}{" "}
                        {` × ${cartItem?.returnQuantity} `}
                      </p>
                    )}

                    <div className="flex items-center gap-x-1 pt-1 md:pt-2">
                      <h3 className="text-[12px] md:text-base lg:text-lg font-medium">
                        Qty:
                      </h3>
                      <div className="flex items-center bg-alabaster px-1 lg:px-2">
                        <button
                          className={`lg:px-1 lg:py-1 text-[12px] md:text-lg lg:text-xl font-medium text-black ${
                            cartItem?.returnQuantity <= minQuantity
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            handleProductQtyChange("decrease", cartItem)
                          }
                          disabled={cartItem?.returnQuantity <= minQuantity}
                        >
                          −
                        </button>

                        <span className="px-2 md:px-4 text-[12px] md:text-lg lg:text-xl font-medium text-black">
                          {cartItem.returnQuantity}
                        </span>
                        <button
                          className={`md:px-1 py-1 text-[12px] md:text-lg lg:text-xl font-medium text-black ${
                            cartItem?.returnQuantity >= cartItem.cartQuantity
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            handleProductQtyChange("increase", cartItem)
                          }
                          disabled={
                            cartItem.returnQuantity >= cartItem.cartQuantity
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* {selectedCartItem.id === cartItem.id &&
                  removeCartErrorMessage ? (
                    <ErrorMessage message={removeCartErrorMessage} />
                  ) : null} */}
                    </div>
                    <div className="hidden xs:block mt-4">
                      <DiamondDetailDrawer
                        cartItem={cartItem}
                        openDiamondDetailDrawer={openDiamondDetailDrawer}
                        dispatch={dispatch}
                        setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                        isOrderPage={true}
                      />
                    </div>
                  </div>
                </div>

                <div className=" xs:hidden mt-4">
                  <DiamondDetailDrawer
                    cartItem={cartItem}
                    openDiamondDetailDrawer={openDiamondDetailDrawer}
                    dispatch={dispatch}
                    setOpenDiamondDetailDrawer={setOpenDiamondDetailDrawer}
                    isOrderPage={true}
                  />
                </div>
              </div>
            ))}
            {touched.selectedProducts && errors.selectedProducts && (
              <ErrorMessage message={errors.selectedProducts} />
            )}
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
                  className="!text-baseblack !h-12 xl:!h-16 !font-medium  w-fit xl:!py-6 !bg-[#E5E5E5] !text-base hover:!border-[#202A4E] hover:!bg-transparent hover:!text-[#202A4E] !border-black_opacity_10 !uppercase !border !rounded-none"
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
                    className="uppercase !h-12 xl:!h-16"
                    onClick={handleSubmit}
                  >
                    Request
                  </LoadingPrimaryButton>
                </div>
              </div>
            </form>
            {returnMessage?.type === messageType.SUCCESS ? (
              <Alert
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
