"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { createUser } from "@/_actions/user.action";
import { setIsHovered } from "@/store/slices/commonSlice";
import { LoadingPrimaryButton } from "../ui/button";
import FixedAlert from "../ui/FixedAlert";
import { messageType } from "@/_helper/constants";
import openEye from "@/assets/icons/open-eye.svg";
import closeEye from "@/assets/icons/close-eye.svg";
import ErrorMessage from "../ui/ErrorMessage";
import CustomImg from "../ui/custom-img";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import textLogo from "@/assets/images/logo-text.webp";

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is Required"),
});

// ----------------------------------------------------------------------

const SignUpForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { userRegisterLoading, userRegisterMessage, sendOtpMessage } =
    useSelector(({ user }) => user);
  const { isHovered } = useSelector(({ common }) => common);
  useAlertTimeout(userRegisterMessage, () =>
    dispatch(setUserRegisterMessage({ message: "", type: "" }))
  );

  const signUpOfferEmail = localStorage.getItem("signUpOfferEmail");
  useAlertTimeout(sendOtpMessage, () =>
    dispatch(setSendOtpMessage({ message: "", type: "" }))
  );
  const onSubmit = useCallback(
    async (fields, { resetForm }) => {
      const payload = {
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        phoneNumber: fields?.phoneNumber,
        password: fields.password,
        confirmPassword: fields.confirmPassword,
        isSignUpOffer: !!signUpOfferEmail,
      };

      const response = await dispatch(createUser(payload));

      if (response) {
        resetForm();
        localStorage.removeItem("signUpOfferEmail");
        router.push("/auth/login");
      }
    },
    [signUpOfferEmail, dispatch, router]
  );

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

  const initialValues = {
    firstName: "",
    lastName: "",
    email: signUpOfferEmail ? signUpOfferEmail : "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useFormik({
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
    dispatch(setUserRegisterMessage({ message: "", type: "" }));
  }, []);

  const ShowHidePassword = useMemo(
    () => (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer"
        >
          <CustomImg
            srcAttr={showPassword ? closeEye : openEye}
            titleAttr={showPassword ? "hide" : "show"}
            className="w-5 h-5"
          />
        </div>
      </div>
    ),
    [showPassword]
  );

  return (
    <div className="w-[90%] mx-auto flex flex-col items-center justify-center h-full">
      <Link href={"/"} className="flex justify-center mb-5 4xl:mb-8">
        <CustomImg
          srcAttr={textLogo}
          altAttr="lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff"
          titleAttr="Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York"
          className="w-40 md:w-44 4xl:w-52 2xl:w-44"
        />
      </Link>
      <h1 className="text-2xl md:text-3xl 4xl:text-4xl text-baseblack font-gelasio">
        Create Your Account
      </h1>
      <p className="text-sm sm:text-base 4xl:text-lg text-basegray mt-2 font-Poppins">
        Sign up for your new account
      </p>

      <div className="mt-10 lg:mt-6 4xl:mt-10 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className={`custom-input w-full ${
                touched?.firstName && errors?.firstName
                  ? "border border-red-500"
                  : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.firstName}
            />
            {touched?.firstName && errors?.firstName ? (
              <ErrorMessage
                className="lg:!text-sm"
                message={errors?.firstName}
              />
            ) : null}
          </div>

          <div className="col-span-1">
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className={`custom-input w-full ${
                touched?.lastName && errors?.lastName
                  ? "border border-red-500"
                  : ""
              }`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.lastName}
            />
            {touched?.lastName && errors?.lastName ? (
              <ErrorMessage
                className="lg:!text-sm"
                message={errors?.lastName}
              />
            ) : null}
          </div>

          {/* Email */}
          <div className="col-span-2">
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
              <ErrorMessage className="lg:!text-sm" message={errors?.email} />
            ) : null}
          </div>

          {/* Phone Number */}
          <div className="col-span-2">
            <div className="bg-white px-2 lg:px-4">
              <PhoneInput
                country={"us"}
                value={values.phoneNumber}
                onChange={(value) => setFieldValue("phoneNumber", value)}
                inputClass="!w-full !h-[44px] lg:!h-[48px] 2xl:!h-[52px] 4xl:!h-[68px] !ms-1 !border-none !text-base 2xl:!text-lg"
                containerClass={`!w-full [&_.flag]:scale-[1.4] [&_.flag]:origin-center [&_.selected-flag]:w-[56px] [&_.selected-flag]:px-2`}
                buttonClass="!border-none !bg-transparent "
                inputProps={{
                  name: "phoneNumber",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="col-span-2 lg:col-span-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`custom-input !pe-8 w-full ${
                  touched?.password && errors?.password
                    ? "border border-red-500"
                    : ""
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.password}
              />
              {ShowHidePassword}
            </div>
            {touched?.password && errors?.password ? (
              <ErrorMessage
                className="lg:!text-sm"
                message={errors?.password}
              />
            ) : null}
          </div>

          {/* Confirm Password */}
          <div className="col-span-2 lg:col-span-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`custom-input !pe-8 w-full ${
                  touched?.confirmPassword && errors?.confirmPassword
                    ? "border border-red-500"
                    : ""
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.confirmPassword}
              />
              {ShowHidePassword}
            </div>
            {touched?.confirmPassword && errors?.confirmPassword ? (
              <ErrorMessage
                className="lg:!text-sm"
                message={errors?.confirmPassword}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="uppercase mt-6 2xl:mt-8 w-full"
        onMouseEnter={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        <LoadingPrimaryButton
          className="w-full uppercase"
          loading={userRegisterLoading}
          loaderType={isHovered ? "" : "white"}
          onClick={handleSubmit}
        >
          SIGN UP
        </LoadingPrimaryButton>
      </div>
      {signUpOfferEmail && (
        <div className="mt-4 lg:mt-6 rounded-md w-full">
          <p className="text-base lg:text-lg text-primary font-medium">
            You’ll receive a promo code via email once you complete your
            sign-up.
          </p>
        </div>
      )}
      <p className="mt-3 lg:mt-4 text-sm sm:text-base 2xl:text-lg text-basegray text-center">
        Already a Member?{" "}
        <Link
          href="/auth/login"
          className="underline text-primary hover:text-basegray transition-all duration-300 font-bold"
        >
          Log In
        </Link>
      </p>
      {userRegisterMessage?.type !== messageType?.SUCCESS ? (
        <FixedAlert
          message={userRegisterMessage?.message}
          type={userRegisterMessage?.type}
        />
      ) : null}

      {/* Privacy Policy */}
      <Link
        href="/privacy-policy"
        className="absolute bottom-6 md:bottom-[16%] md:right-40 right-10 lg:fixed lg:bottom-6 lg:right-[6%] underline text-sm sm:text-base 2xl:text-lg text-basegray hover:text-primary transition-all duration-300"
      >
        Privacy Policy
      </Link>
    </div>
  );
};

export default SignUpForm;
