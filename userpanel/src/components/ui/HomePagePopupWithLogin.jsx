// components/EmailOfferPopup.tsx
"use client";
import { X } from "lucide-react";
import { setOpenHomePagePopup } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import HomePopupLoginImg from "@/assets/images/home/home-page-popup-login.webp";
import { CustomImg } from "../dynamiComponents";
import { LinkButton } from "./button";
import { SHINE10 } from "@/_helper";
import { useEffect } from "react";

export default function HomePagePopupWithLogin() {
  const { openHomePagePopup } = useSelector(({ common }) => common);
  const dispatch = useDispatch();

  useEffect(() => {
    sessionStorage.removeItem("homePagePopup");
    dispatch(setOpenHomePagePopup(true));
  }, [dispatch]);

  if (!openHomePagePopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-[#F6EAE3]  md:max-w-[700px] w-full overflow-hidden flex flex-col relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={() => {
            dispatch(setOpenHomePagePopup(false));
          }}
        >
          <X size={24} />
        </button>
        <div className=" flex items-center justify-center">
          <CustomImg src={HomePopupLoginImg} alt="Offer Rings" />
        </div>
        <div className="w-full px-6 flex flex-col text-center justify-center pt-6 pb-6 sm:pb-10 xl:pb-12">
          <h2 className="text-xl md:text-3xl xl:text-4xl font-semibold italic font-castoro text-center text-[#202A4E] mb-2 md:mb-3 uppercase">
            You’ve unlocked 10% OFF
          </h2>
          <p className="text-base  md:text-xl 2xl:text-2xl text-[#202A4E] font-semibold border border-[#B89A89] rounded-md w-fit mx-auto bg-[#F3E4DB] md:px-12 px-6 py-2 md:py-4">
            {SHINE10}
          </p>

          <p className="text-base md:text-xl xl:text-xl text-[#5D6480] mt-3 md:mt-4 md:w-[85%] lg:w-[80%] mx-auto">
            Use code {SHINE10} at checkout and enjoy a little extra sparkle on
            us.
          </p>
          <div className="mt-4 flex flex-col md:flex-row gap-6 mx-auto w-[70%]">
            <LinkButton
              href="/collections/categories/Jewelry"
              className="!text-white md:!text-lg !uppercase !font-medium !w-full !py-6 md:!py-7 !bg-[#202A4E] !text-base hover:!border-[#202A4E] hover:!bg-transparent hover:!text-[#202A4E] !border-[#202A4E] !border !rounded-full !px-12"
            >
              Shop Now
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
