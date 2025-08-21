"use client";

import { fetchTrackOrderByOrderNumberAndEmail } from "@/_actions/order.action";
import { LoadingPrimaryButton } from "@/components/ui/button";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import CommonNotFound from "@/components/ui/CommonNotFound";
import ErrorMessage from "@/components/ui/ErrorMessage";
import OrderDetails from "@/components/ui/order-history/OrderDetail";
import { setIsHovered } from "@/store/slices/commonSlice";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

export default function TrackYourOrderPage() {
  const dispatch = useDispatch();
  const { isHovered } = useSelector(({ common }) => common);
  const { orderDetail, orderDetailLoading, trackOrderLoading, orderMessage } =
    useSelector(({ order }) => order);

  const orderDetailsRef = useRef(null);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      orderNumber: "",
      email: "",
    },
    validationSchema: Yup.object({
      orderNumber: Yup.string().required("Order Number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Order Email is required"),
    }),
    onSubmit: async (values) => {
      await dispatch(fetchTrackOrderByOrderNumberAndEmail(values));
      setFormSubmitted(true);
    },
  });

  const { handleSubmit, getFieldProps, touched, errors } = formik;

  useEffect(() => {
    if (orderDetailsRef.current) {
      const topOffset =
        orderDetailsRef.current.getBoundingClientRect().top +
        window.pageYOffset;
      const customOffset = 100;
      window.scrollTo({ top: topOffset - customOffset, behavior: "smooth" });
    }
  }, [orderDetail]);

  return (
    <>
      <div className="pt-12">
        <CommonBgHeading title="Order Tracking" />
      </div>
      <section className="pt-8 flex mx-auto justify-center max-w-4xl">
        <div className="container w-full">
          <div className="flex justify-end mb-2">
            <p className="block text-sm font-semibold mb-2">
              <span className="text-red-500">*</span>Required Fields
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            {/* Order Number Field */}
            <div className="mb-6">
              <label
                htmlFor="orderNumber"
                className="block text-sm md:text-base font-semibold mb-2"
              >
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                id="orderNumber"
                type="text"
                {...getFieldProps("orderNumber")}
                placeholder="Enter your Order Number"
                className="w-full border px-4 py-2 focus:outline-none !bg-transparent !rounded-md"
              />
              {touched.orderNumber && errors.orderNumber && (
                <ErrorMessage message={errors.orderNumber} />
              )}
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm md:text-base font-semibold mb-2"
              >
                Order Billing Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...getFieldProps("email")}
                placeholder="Enter your Billing Email"
                className="w-full border px-4 py-2 focus:outline-none !bg-transparent !rounded-md"
              />
              {touched.email && errors.email && (
                <ErrorMessage message={errors.email} />
              )}
            </div>

            {/* Submit Button */}
            <div
              className="uppercase mt-6 2xl:mt-8 w-full"
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
            >
              <LoadingPrimaryButton
                type="submit"
                className="w-full uppercase"
                loading={trackOrderLoading}
                loaderType={isHovered ? "" : "white"}
              >
                Submit
              </LoadingPrimaryButton>
            </div>
            {orderMessage && (
              <div className="mt-4">
                <ErrorMessage message={orderMessage.message} />
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Order Details Section */}
      <div ref={orderDetailsRef}>
        {formSubmitted && (
          <div className="pt-12 xl:pt-16 container">
            {orderDetail ? (
              <OrderDetails
                orderLoading={orderDetailLoading}
                orderDetail={orderDetail}
                showInvoice={true}
              />
            ) : (
              <CommonNotFound message={"Order Not Found!"} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
