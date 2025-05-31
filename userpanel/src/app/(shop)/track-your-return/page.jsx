"use client";

import { fetchTrackReturnByOrderNumberAndEmail } from "@/_actions/return.action";
import { CustomImg, ReturnDetails } from "@/components/dynamiComponents";
import { LoadingPrimaryButton } from "@/components/ui/button";
import returnArrow from "@/assets/icons/returnArrow.svg";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import CommonNotFound from "@/components/ui/CommonNotFound";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { setIsHovered } from "@/store/slices/commonSlice";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { helperFunctions } from "@/_helper";

const ReturnAccordion = ({
  returnItem,
  returnLoading,
  isExpanded,
  onToggle,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(returnItem?.id);
    }
  };

  const handleClick = () => {
    onToggle(returnItem?.id);
  };

  const { colorClass, filter } = helperFunctions?.getStatusColor(
    returnItem?.status
  );

  if (!returnItem?.id) {
    return null;
  }

  return (
    <div className="border !bg-none border-gray-200 mb-4 rounded-lg">
      <div
        className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-controls={`return-panel-${returnItem?.id}`}
      >
        <span className="text-sm font-semibold">
          {helperFunctions?.formatDate(returnItem?.createdDate)}
        </span>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${colorClass}`}>
            {helperFunctions?.capitalizeCamelCase(returnItem?.status)}
          </span>
          <CustomImg
            srcAttr={returnArrow}
            altAttr="Arrow"
            titleAttr="Arrow"
            className={`w-5 h-5 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            style={{ filter }}
          />
        </div>
      </div>

      {isExpanded && (
        <div
          id={`return-panel-${returnItem?.id}`}
          className="bg-offwhite w-full"
        >
          {returnItem ? (
            <div className="">
              <ReturnDetails
                returnLoading={returnLoading}
                returnDetail={returnItem}
                isShadow={false}
              />
            </div>
          ) : (
            <CommonNotFound message="Return Not Found!" />
          )}
        </div>
      )}
    </div>
  );
};

export default function CheckYourReturnPage() {
  const dispatch = useDispatch();
  const { isHovered } = useSelector(({ common }) => common);
  const {
    returnDetail,
    returnDetailLoading,
    trackReturnLoading,
    returnMessage,
  } = useSelector(({ returns }) => returns);
  const returnDetailsRef = useRef(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [hasUserToggled, setHasUserToggled] = useState(false);

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
      setFormSubmitted(false);
      setHasUserToggled(false);
      setExpandedId(null);
      await dispatch(fetchTrackReturnByOrderNumberAndEmail(values));
      setFormSubmitted(true);
    },
  });

  const { handleSubmit, getFieldProps, touched, errors } = formik;

  const sortedReturnDetail = Array.isArray(returnDetail)
    ? [...returnDetail].sort(
        (a, b) => (b.createdDate || 0) - (a.createdDate || 0)
      )
    : [];

  useEffect(() => {
    if (sortedReturnDetail?.length > 0 && formSubmitted && !hasUserToggled) {
      const firstId = sortedReturnDetail[0].id;
      setExpandedId(firstId);
    } else if (!sortedReturnDetail?.length) {
      setExpandedId(null);
    }
  }, [sortedReturnDetail, formSubmitted, hasUserToggled]);

  useEffect(() => {
    if (formSubmitted && returnDetailsRef?.current) {
      const topOffset =
        returnDetailsRef?.current?.getBoundingClientRect().top +
        window.pageYOffset;
      const customOffset = 100;
      window.scrollTo({ top: topOffset - customOffset, behavior: "smooth" });
    }
  }, [formSubmitted]);

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setHasUserToggled(true);
  };

  return (
    <div className="pt-12">
      <CommonBgHeading title="Return Tracking" />

      <section className="pt-8 flex mx-auto justify-center max-w-4xl">
        <div className="container w-full">
          <div className="flex justify-end mb-2">
            <p className="block text-sm font-semibold mb-2">
              <span className="text-red-500">*</span>Required Fields
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="bg-white p-10">
            <div className="mb-6">
              <label
                htmlFor="orderNumber"
                className="block text-sm font-semibold mb-2"
              >
                Order Number <span className="text-red-500">*</span>
              </label>
              <input
                id="orderNumber"
                type="text"
                {...getFieldProps("orderNumber")}
                placeholder="Enter your Order Number"
                className="w-full border px-4 py-2 focus:outline-none"
              />
              {touched.orderNumber && errors.orderNumber && (
                <ErrorMessage message={errors.orderNumber} />
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Order Billing Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...getFieldProps("email")}
                placeholder="Enter your Billing Email"
                className="w-full border px-4 py-2 focus:outline-none"
              />
              {touched.email && errors.email && (
                <ErrorMessage message={errors.email} />
              )}
            </div>

            <div
              className="uppercase mt-6 2xl:mt-8 w-full"
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
            >
              <LoadingPrimaryButton
                type="submit"
                className="w-full uppercase"
                loading={trackReturnLoading}
                loaderType={isHovered ? "" : "white"}
              >
                Submit
              </LoadingPrimaryButton>
            </div>
            {returnMessage?.message && (
              <div className="mt-4">
                <ErrorMessage message={returnMessage.message} />
              </div>
            )}
          </form>
        </div>
      </section>

      <section ref={returnDetailsRef} className="my-10 flex justify-center">
        <div className="container w-full">
          {formSubmitted && (
            <>
              {trackReturnLoading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : Array.isArray(sortedReturnDetail) &&
                sortedReturnDetail?.length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Return Details</h2>
                  {sortedReturnDetail?.map((returnItem) => (
                    <ReturnAccordion
                      key={returnItem?.id}
                      returnItem={returnItem}
                      returnLoading={returnDetailLoading}
                      isExpanded={expandedId === returnItem?.id}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              ) : (
                <CommonNotFound message="No Returns Found!" />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
