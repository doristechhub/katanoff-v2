// components/EmailOfferPopup.tsx
"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import {
  setHomePagePopupLoader,
  setIsHovered,
  setOpenHomePagePopup,
} from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import HomePopupImg from "@/assets/images/home/home-page-popup.webp";
import HomePopupImgMobile from "@/assets/images/home/home-page-popup-mobile.webp";
import { CustomImg } from "../dynamiComponents";
import { LoadingPrimaryButton } from "./button";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import ErrorMessage from "./ErrorMessage";
import { fetchCart } from "@/_actions/cart.action";
import Cookies from "js-cookie";

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
      localStorage.removeItem("currentUser");
      Cookies.remove("token");
      dispatch(fetchCart());
      dispatch(setHomePagePopupLoader(true));
      dispatch(setOpenHomePagePopup(false));
      localStorage.setItem("signUpOfferEmail", values.email);
      router.push(`/auth/sign-up`);
      dispatch(setHomePagePopupLoader(false));
    },
  });
  const { handleSubmit, getFieldProps, touched, errors } = formik;

  if (!openHomePagePopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-[#FCFCFC]  md:max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={() => {
            dispatch(setOpenHomePagePopup(false));
          }}
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-1/2 px-6 flex flex-col justify-center pt-8 sm:pt-10 md:pt-0 md:pl-10">
          <h2 className="text-2xl md:text-4xl xl:text-5xl font-medium italic font-castoro text-[#202A4E] mb-1 md:mb-3">
            GET 10% OFF
          </h2>
          <p className="text-sm md:text-base xl:text-lg text-[#202A4E] mb-2 md:mb-4">
            Enter your email address to get a discount on your purchase of $200
            or more
          </p>

          <form onSubmit={handleSubmit} className="pt-2 md:pt-4">
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
          </form>
          <p className="text-sm md:text-base text-[#202A4E] mt-2 md:mt-4">
            By completing this form you are signing up to receive our emails and
            can unsubscribe at any time.
          </p>
        </div>

        <div className="h-[300px] md:w-1/2 md:h-[450px] flex items-center justify-center pt-4 md:pt-0 pb-4 md:pb-0">
          <CustomImg
            src={HomePopupImg}
            alt="Offer Rings"
            className="w-full h-full object-cover hidden sm:block"
          />
          <CustomImg
            src={HomePopupImgMobile}
            alt="Offer Rings"
            className="w-full h-full object-cover sm:hidden"
          />
        </div>
      </div>
    </div>
  );
}
