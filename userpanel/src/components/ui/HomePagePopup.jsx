// components/EmailOfferPopup.tsx
"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  setHomePagePopupLoader,
  setIsHovered,
  setOpenHomePagePopup,
} from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import HomePopupImg from "@/assets/images/home/home-page-popup.webp";
import { CustomImg } from "../dynamiComponents";
import { LoadingPrimaryButton } from "./button";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import ErrorMessage from "./ErrorMessage";
export default function HomePagePopup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { openHomePagePopup, homePagePopupLoader, isHovered } = useSelector(
    ({ common }) => common
  );
  useEffect(() => {
    sessionStorage.removeItem("homePagePopup");
    dispatch(setOpenHomePagePopup(true));
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      dispatch(setHomePagePopupLoader(true));
      dispatch(setOpenHomePagePopup(false));
      sessionStorage.setItem("homePagePopup", "true");
      router.push(`/auth/sign-up?email=${values.email}`);
      dispatch(setHomePagePopupLoader(false));
    },
  });
  const { handleSubmit, getFieldProps, touched, errors } = formik;

  if (!openHomePagePopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-[#FCFCFC] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={() => {
            dispatch(setOpenHomePagePopup(false));
          }}
        >
          <X size={24} />
        </button>

        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 px-6 flex flex-col justify-center pl-10">
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-medium italic font-castoro text-[#202A4E] mb-3">
            GET 35% OFF
          </h2>
          <p className="text-sm md:text-base xl:text-lg text-[#202A4E] mb-4">
            Enter your email address to get a discount on your purchase of $200
            or more
          </p>

          <form onSubmit={handleSubmit} className="pt-4">
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                id="email"
                {...getFieldProps("email")}
                className="border border-gray-300 px-4 py-3 xl:py-4 w-full focus:outline-none"
              />
              {touched.email && errors.email && (
                <ErrorMessage message={errors.email} />
              )}
            </div>

            <div
              className="uppercase mt-2 w-full"
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
            >
              <LoadingPrimaryButton
                type="submit"
                className="w-full uppercase !rounded-full"
                loading={homePagePopupLoader}
                loaderType={isHovered ? "" : "white"}
              >
                Sign Up
              </LoadingPrimaryButton>
            </div>

            {/* <PrimaryLinkButton
              onClick={handleSubmit}
              className="!uppercase !rounded-full"
            >
              Sign Up
            </PrimaryLinkButton> */}
          </form>
          <p className="text-sm md:text-base text-[#202A4E] mt-4">
            By completing this form you are signing up to receive our emails and
            can unsubscribe at any time.
          </p>
        </div>

        <div className="w-full md:w-1/2 h-[450px] bg-[#f9f9f9] flex items-center justify-center">
          <CustomImg
            src={HomePopupImg}
            alt="Offer Rings"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
