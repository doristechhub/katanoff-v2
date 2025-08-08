"use client";
import React, { useCallback } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./spinner";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { emailPattern } from "@/_utils/common";
import { setSubscriberMessage } from "@/store/slices/subscriberSlice";
import { createSubscriber } from "@/_actions/subscriber.action";
import { setIsHovered } from "@/store/slices/commonSlice";
import Alert from "./Alert";
import { messageType } from "@/_helper";
const inputClassName =
  "rounded-none rounded-s block w-full p-3 md:p-3 2xl:p-4 text-[14px] placeholder:text-white placeholder:italic bg-transparent lg:text-base sm:text-sm border-white border focus:outline-none";

const SubscribeEmail = () => {
  const dispatch = useDispatch();

  const { subscriberLoading, subscriberMessage } = useSelector(
    ({ subscriber }) => subscriber
  );
  const { isHovered } = useSelector(({ common }) => common);
  useAlertTimeout(subscriberMessage, () =>
    dispatch(setSubscriberMessage({ message: "", type: "" }))
  );

  const onSubmit = useCallback(async (val, { resetForm }) => {
    const res = await dispatch(createSubscriber(val));
    if (res) resetForm();
  }, []);

  const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: yup.object({
        email: yup
          .string()
          .matches(emailPattern, "Email is not valid")
          .required("Email is required"),
      }),
      enableReinitialize: true,
      onSubmit,
    });
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyPress}
      className="flex flex-col gap-2 pt-2 lg:pt-5 lg:w-[80%]"
    >
      <div className="flex h-12">
        <input
          className={inputClassName}
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.email || ""}
        />

        <Button
          type="submit"
          title={"Submit"}
          variant="contained"
          color="black"
          disabled={subscriberLoading}
          onMouseEnter={() => dispatch(setIsHovered(true))}
          onMouseLeave={() => dispatch(setIsHovered(false))}
          className={`relative group !h-full !min-w-[100px] lg:!min-w-[100px] !text-primary rounded-none font-inter overflow-hidden border rounded-e cursor-pointer transition-all duration-500 ${
            subscriberLoading
              ? "border-white !bg-primary !hover:bg-primary pointer-events-none"
              : "!bg-primary "
          }`}
        >
          {/* Button Text */}
          <span
            className={`relative z-10 transition-colors duration-500 ${
              subscriberLoading ? "" : "group-hover:text-white"
            }`}
          >
            {subscriberLoading ? (
              <Spinner
                className={"w-16 lg:w-auto !h-8"}
                loaderType={isHovered ? "white" : "primary"}
              />
            ) : (
              <MdOutlineArrowRightAlt className="text-4xl" />
            )}
          </span>
          {/* Hover Background Effect */}
          {!subscriberLoading && (
            <div className="absolute inset-0 bg-white z-0 transition-all duration-500 transform translate-x-0 group-hover:translate-x-full"></div>
          )}
        </Button>
      </div>
      {touched?.email && errors?.email && (
        <p className="text-left text-sm text-rose-500 ">{errors?.email}</p>
      )}
      {subscriberMessage?.message && (
        <div className="mt-1">
          <Alert
            message={subscriberMessage?.message}
            type={subscriberMessage?.type}
            removeMessage={
              subscriberMessage.type === messageType.ERROR
                ? () =>
                    dispatch(setSubscriberMessage({ message: "", type: "" }))
                : undefined
            }
          />
        </div>
      )}
    </form>
  );
};
export default SubscribeEmail;
