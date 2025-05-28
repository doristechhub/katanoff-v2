"use client";
import React, { useCallback } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Button, LoadingPrimaryButton } from "./button";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./spinner";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Alert from "./Alert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { emailPattern } from "@/_utils/common";
import { setSubscriberMessage } from "@/store/slices/subscriberSlice";
import { createSubscriber } from "@/_actions/subscriber.action";
import { setIsHovered } from "@/store/slices/commonSlice";
const inputClassName =
  "block w-full p-3 md:p-3 2xl:p-4 text-[14px] placeholder:text-white placeholder:italic bg-transparent lg:text-base   sm:text-sm border-white border focus:outline-none ";

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
    <div>
      <div>
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyPress}
          className="flex flex-col gap-3 lg:gap-4 sm:gap-3 pt-2 lg:pt-5"
        >
          <div className="flex">
            <div>
              <input
                className={inputClassName}
                id="email"
                type="email"
                name="email"
                placeholder="Sign Me Up"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.email || ""}
              />
              {touched?.email && errors?.email && (
                <p className="text-left text-sm text-rose-500 ml-4 mt-1">
                  {errors?.email}
                </p>
              )}
            </div>
            {/* <Button
              type="submit"
              title={"Submit"}
              variant="contained"
              color="black"
              disabled={subscriberLoading}
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
              className={`relative group w-fit !h-[3rem] md:!h-[2.9rem] lg:!h-[3.1rem] 2xl:!h-[3.6rem] lg:!min-w-[100px] !text-primary rounded-none font-inter overflow-hidden border cursor-pointer transition-all duration-500 ${
                subscriberLoading
                  ? "border-white  !bg-primary !hover:bg-primary pointer-events-none"
                  : "!bg-primary "
              }`}
            >
              <span
                className={`relative z-10 transition-colors duration-500  ${
                  subscriberLoading ? "" : "group-hover:text-white"
                }`}
              >
                {true ? (
                  <Spinner
                    className={""}
                    loaderType={isHovered ? "" : "white"}
                  />
                ) : (
                  <MdOutlineArrowRightAlt className="text-4xl" />
                )}
              </span>
              {!subscriberLoading && (
                <div className="absolute inset-0 bg-white z-0 transition-all duration-500 transform translate-x-0 group-hover:translate-x-full"></div>
              )}{" "}
            </Button> */}
            <Button
              type="submit"
              title={"Submit"}
              variant="contained"
              color="black"
              disabled={subscriberLoading}
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
              className={`relative group w-fit !h-[3rem] md:!h-[2.9rem] lg:!h-[3.1rem] 2xl:!h-[3.6rem] lg:!min-w-[100px] !text-primary rounded-none font-inter overflow-hidden border cursor-pointer transition-all duration-500 ${
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
                    className={"h-8"}
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

          {subscriberMessage?.message ? (
            <Alert
              message={subscriberMessage?.message}
              type={subscriberMessage.type}
            />
          ) : null}
        </form>
      </div>
    </div>
  );
};
export default SubscribeEmail;
