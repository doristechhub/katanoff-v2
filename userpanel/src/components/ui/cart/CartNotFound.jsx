"use client";
import cartImage from "@/assets/images/cart/cart.webp";
import { CustomImg } from "@/components/dynamiComponents";
import { setIsCartOpen } from "@/store/slices/commonSlice";
import { useDispatch } from "react-redux";
import { PrimaryLinkButton } from "../button";

const CartNotFound = ({ textClassName = "" }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center justify-center px-4 h-full">
      <CustomImg
        srcAttr={cartImage}
        altAttr=""
        titleAttr=""
        className="lg:w-60"
      />

      <p
        className={`text-lg md:text-xl 2xl:text-2xl font-medium font-castoro text-baseblack mt-4 md:mt-6 text-center ${textClassName}`}
      >
        Oops! Your cart is empty. Let’s fix that with some stunning jewelry
      </p>
      <div className="mt-6 md:mt-8">
        <PrimaryLinkButton
          href="/"
          className="uppercase w-fit !px-16 !py-6"
          onClick={() => dispatch(setIsCartOpen(false))}
        >
          Back To Shop
        </PrimaryLinkButton>
      </div>
    </div>
  );
};

export default CartNotFound;
