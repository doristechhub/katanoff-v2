"use client";
import productImage from "@/assets/images/product/no-product.webp";
import { CustomImg } from "@/components/dynamiComponents";
import { setIsCartOpen } from "@/store/slices/commonSlice";
import { useDispatch } from "react-redux";
import { PrimaryLinkButton } from "../button";

const ProductNotFound = ({ textClassName = "" }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center justify-center px-4 h-full">
      <CustomImg
        srcAttr={productImage}
        altAttr=""
        titleAttr=""
        className="w-80"
      />

      <p
        className={`text-lg md:text-xl 2xl:text-3xl font-medium font-castoro text-baseblack mt-4 md:mt-6 text-center ${textClassName}`}
      >
        Sorry, No product Found
      </p>
      <p
        className={`text-base md:text-lg 2xl:text-xl font-medium  text-baseblack mt-4 md:mt-6 text-center ${textClassName}`}
      >
        You can Try Our Different Product...
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

export default ProductNotFound;
