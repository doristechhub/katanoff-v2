"use client";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { helperFunctions } from "@/_helper";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { setLoginMessage, setSendOtpMessage } from "@/store/slices/userSlice";
import { SendOTPForEmailVerification, verifyOTP } from "@/_actions/user.action";
import { setIsHovered } from "@/store/slices/commonSlice";
import { LoadingPrimaryButton } from "../ui/button";
import FixedAlert from "../ui/FixedAlert";
import { messageType } from "@/_helper/constants";
import {
  fetchCart,
  insertMultipleProductsIntoCart,
} from "@/_actions/cart.action";
import ErrorMessage from "../ui/ErrorMessage";
import { setAuthToken } from "@/interceptors/httpInterceptor";
import { EllipsisLoader } from "../dynamiComponents";

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  otp: Yup.array()
    .of(
      Yup.string()
        .matches(/^\d$/, "Each digit must be a number")
        .required("Required")
    )
    .length(6, "OTP must be 6 digits")
    .test("no-empty", "All fields must be filled", (value) =>
      value.every((digit) => digit)
    ),
});

const initialValues = {
  otp: ["", "", "", "", "", ""],
};

// ----------------------------------------------------------------------

const VerifyOTPForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [redirectingPostLogin, setRedirectingPostLogin] = useState(false);
  const { verifyOTPLoading, sendOtpMessage, sendOtpLoading, loginMessage } =
    useSelector(({ user }) => user);
  const { isHovered } = useSelector(({ common }) => common);

  useAlertTimeout(sendOtpMessage, () =>
    dispatch(setSendOtpMessage({ message: "", type: "" }))
  );

  const removeEmailFromStorage = () => {
    localStorage.removeItem("email");
  };

  useEffect(() => {
    const getEmail = localStorage.getItem("email");
    if (!getEmail) {
      router.push("/auth/login");
      return;
    }
    setEmail(getEmail);

    return () => {
      removeEmailFromStorage();
    };
  }, []);

  const currentUser = helperFunctions.getCurrentUser();

  useEffect(() => {
    if (currentUser && !redirectingPostLogin) {
      const postLoginRedirect = localStorage.getItem("postLoginRedirect");
      if (!postLoginRedirect) {
        router.replace("/");
      }
    }
  }, [currentUser, router, redirectingPostLogin]);

  useEffect(() => {
    return () => {
      if (loginMessage?.type && loginMessage?.type !== messageType?.SUCCESS) {
        dispatch(setLoginMessage({ message: "", type: "" }));
      }
    };
  }, [loginMessage.type]);

  const addToCartFromLocalStorage = useCallback(async () => {
    const storageData = JSON.parse(localStorage.getItem("cart"));
    if (storageData !== null && storageData.length) {
      const payload = {
        cartData: storageData,
      };
      const resp = await dispatch(insertMultipleProductsIntoCart(payload));

      if (resp) {
        dispatch(fetchCart());
        localStorage.removeItem("cart");
      }
    }
  }, [dispatch]);

  const onSubmit = useCallback(
    async (fields, { resetForm }) => {
      const otpCode = fields?.otp?.join("");

      const payload = {
        email: email,
        otp: otpCode,
      };
      const response = await dispatch(verifyOTP(payload));
      if (response) {
        resetForm();
        removeEmailFromStorage();
        localStorage.setItem("currentUser", JSON.stringify(response?.userData));
        Cookies.set("token", response?.userData?.token);
        addToCartFromLocalStorage();
        setAuthToken();

        const postLoginRedirect = localStorage.getItem("postLoginRedirect");
        if (postLoginRedirect) {
          setRedirectingPostLogin(true); // Set flag before redirect
          router.push(postLoginRedirect);
          localStorage.removeItem("postLoginRedirect");
          return;
        } else {
          router.push("/");
        }
      }
    },
    [dispatch, router, email]
  );

  const { values, errors, touched, setFieldValue, handleSubmit } = useFormik({
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    initialValues,
  });

  const OtpHandleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...values.otp];
      newOtp[index] = value;

      setFieldValue("otp", newOtp, true).then(() => {
        if (value && index < 5) {
          document.getElementsByClassName("otp-input")[index + 1].focus();
        }
        if (newOtp.every((digit) => digit)) {
          handleSubmit();
        }
      });
    }
  };

  const OtpHandleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !values.otp[index] && index > 0) {
      document.getElementsByClassName("otp-input")[index - 1].focus();
    }
  };

  const handlePaste = (event) => {
    // Get pasted data and limit to 6 characters
    const pasteData = event.clipboardData.getData("Text").slice(0, 6);

    const newOtp = [...values.otp]; // Start with current OTP values

    // Fill in the pasted data
    for (let i = 0; i < pasteData.length; i++) {
      if (i < newOtp.length && /^\d$/.test(pasteData[i])) {
        // Only accept digits
        newOtp[i] = pasteData[i];
      }
    }

    // Update Formik state
    setFieldValue("otp", newOtp, true).then(() => {
      // Focus the first empty input, or the last one if all filled
      const firstEmptyIndex = newOtp.findIndex((digit) => digit === "");
      if (firstEmptyIndex !== -1) {
        document.getElementsByClassName("otp-input")[firstEmptyIndex].focus();
      } else {
        document.getElementsByClassName("otp-input")[5].focus(); // Focus last input if all filled
      }

      // Auto-submit if all digits are filled
      if (newOtp.every((digit) => digit)) {
        handleSubmit();
      }
    });

    event.preventDefault(); // Prevent default paste behavior
  };

  const handleResendOTP = useCallback(async () => {
    try {
      const payload = { email: email };
      const response = await dispatch(SendOTPForEmailVerification(payload));
    } catch (e) {
      dispatch(
        setLoginMessage({
          message: e.message || "something went wrong",
          type: messageType.ERROR,
        })
      );
    }
  }, [email]);

  return (
    <div className="w-full 2xl:w-[100%] flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl md:text-4xl text-baseblack font-castoro">
        OTP Verification
      </h2>
      <p className="text-sm sm:text-base 2xl:text-lg text-basegray mt-2">
        Enter the verification code received on your Email ID
      </p>

      <div className="mt-10 lg:mt-8 2xl:mt-10 w-full">
        <div className="flex gap-3 justify-between w-full">
          {values.otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className={`otp-input custom-input text-center text-2xl font-bold ${
                touched.otp && errors.otp && digit == ""
                  ? "border border-red-500"
                  : ""
              }`}
              value={digit}
              onChange={(e) => OtpHandleChange(e, index)}
              onKeyDown={(e) => OtpHandleKeyDown(e, index)}
              onPaste={handlePaste}
              autoFocus={index === 0}
            />
          ))}
        </div>
        {touched.otp && errors.otp && (
          <ErrorMessage
            message={"Please enter a valid 6-digit OTP"}
            className="mt-2"
          />
        )}
      </div>
      <div
        className="uppercase mt-6 2xl:mt-8 w-full"
        onMouseEnter={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        <LoadingPrimaryButton
          className="w-full uppercase"
          loading={verifyOTPLoading}
          disabled={sendOtpLoading || verifyOTPLoading}
          loaderType={isHovered ? "" : "white"}
          onClick={handleSubmit}
        >
          VERIFY OTP
        </LoadingPrimaryButton>
      </div>

      <div className="mt-3 lg:mt-4 text-sm sm:text-base 2xl:text-lg text-basegray  flex items-center justify-center flex-wrap gap-1">
        <p>Didn't Receive OTP? </p>
        <div>
          {!sendOtpLoading ? (
            <Link
              href="#"
              onClick={handleResendOTP}
              className="underline text-primary hover:text-basegray transition-all duration-300 font-bold"
            >
              Resend OTP
            </Link>
          ) : (
            <EllipsisLoader />
          )}
        </div>
      </div>
      {/* Privacy Policy */}
      <p className="absolute bottom-14 md:bottom-20 lg:bottom-10 2xl:bottom-20 2xl:right-28 md:right-28 right-14 lg:right-14  ">
        <Link
          href="/privacy-policy"
          className="underline text-sm sm:text-base 2xl:text-lg text-basegray hover:text-primary transition-all duration-300"
        >
          Privacy Policy
        </Link>
      </p>
      {loginMessage?.type !== messageType?.SUCCESS ? (
        <FixedAlert message={loginMessage?.message} type={loginMessage?.type} />
      ) : null}

      <FixedAlert
        message={sendOtpMessage?.message}
        type={sendOtpMessage?.type}
      />
    </div>
  );
};

export default VerifyOTPForm;
