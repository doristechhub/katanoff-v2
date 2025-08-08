"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { helperFunctions } from "@/_helper";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import {
  setSendOtpMessage,
  setUserRegisterMessage,
} from "@/store/slices/userSlice";
import { SendOTPForEmailVerification } from "@/_actions/user.action";
import { setIsHovered } from "@/store/slices/commonSlice";
import { LoadingPrimaryButton } from "../ui/button";
import FixedAlert from "../ui/FixedAlert";
import { messageType } from "@/_helper/constants";
import ErrorMessage from "../ui/ErrorMessage";

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const initialValues = {
  email: "",
};

// ----------------------------------------------------------------------

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { sendOtpLoading, sendOtpMessage, userRegisterMessage } = useSelector(
    ({ user }) => user
  );
  const { isHovered } = useSelector(({ common }) => common);

  useAlertTimeout(userRegisterMessage, () =>
    dispatch(setUserRegisterMessage({ message: "", type: "" }))
  );

  useAlertTimeout(sendOtpMessage, () =>
    dispatch(setSendOtpMessage({ message: "", type: "" }))
  );

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      email: fields.email,
    };

    const response = await dispatch(SendOTPForEmailVerification(payload));
    if (response) {
      resetForm();
      localStorage.setItem("email", fields.email);
      router.push("/auth/verify-otp");
    }
  }, []);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      initialValues,
    });

  const currentUser = helperFunctions.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (
        sendOtpMessage?.type &&
        sendOtpMessage?.type !== messageType?.SUCCESS
      ) {
        dispatch(setSendOtpMessage({ message: "", type: "" }));
      }
    };
  }, []);

  return (
    <div className="w-full lg:w-[100%] flex flex-col items-center justify-center h-full py-12">
      <h2 className="text-3xl sm:text-2xl md:text-3xl 2xl:text-4xl text-baseblack font-castoro">
        Login
      </h2>
      <p className="text-sm sm:text-base 2xl:text-lg text-basegray mt-2 font-Figtree">
        Enter your registered email address to receive the OTP
      </p>

      {/* Email Input */}
      <div className="mt-10 lg:mt-8 2xl:mt-10 w-full">
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          className={`custom-input w-full ${
            touched?.email && errors?.email ? "border border-red-500" : ""
          }`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.email}
        />
        {touched?.email && errors?.email ? (
          <ErrorMessage message={errors?.email} />
        ) : null}
      </div>
      <div
        className="uppercase mt-6 2xl:mt-8 w-full"
        onMouseEnter={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        <LoadingPrimaryButton
          className="w-full uppercase"
          loading={sendOtpLoading}
          loaderType={isHovered ? "" : "white"}
          onClick={handleSubmit}
        >
          LOG IN
        </LoadingPrimaryButton>
      </div>

      <p className="mt-3 lg:mt-4 text-sm sm:text-base 2xl:text-lg text-basegray text-center">
        Don’t have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="underline text-primary hover:text-basegray transition-all duration-300 font-bold"
        >
          Sign Up
        </Link>
      </p>

      {sendOtpMessage?.type !== messageType?.SUCCESS ? (
        <FixedAlert
          message={sendOtpMessage?.message}
          type={sendOtpMessage?.type}
        />
      ) : null}
      {/* <FixedAlert
        message={userRegisterMessage?.message}
        type={userRegisterMessage?.type}
      /> */}
      {/* Privacy Policy */}
      <p className="absolute bottom-14 md:bottom-20 lg:bottom-10 2xl:bottom-20 2xl:right-28 md:right-28 right-14 lg:right-14">
        <Link
          href="/privacy-policy"
          className="underline text-sm sm:text-base 2xl:text-lg text-basegray hover:text-primary transition-all duration-300"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
