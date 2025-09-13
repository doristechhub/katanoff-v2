"use client";
import { helperFunctions } from "@/_helper";
import {
  setIsMobileSearchOpen,
  setIsShowingResults,
  setSearchQuery,
} from "@/store/slices/commonSlice";
import { setSearchedProductList } from "@/store/slices/productSlice";
import Link from "next/link";
import { memo } from "react";
import { useDispatch } from "react-redux";
import ProgressiveImg from "./ui/progressive-img";

const SimpleProductGrid = memo(({ products }) => {
  const dispatch = useDispatch();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-5 lg:gap-4">
      {products.map((product) => (
        <Link
          href={`/products/${helperFunctions.stringReplacedWithUnderScore(
            product?.productName
          )}`}
          onClick={() => {
            dispatch(setIsShowingResults(false));
            dispatch(setIsMobileSearchOpen(false));
            dispatch(setSearchQuery(""));
            dispatch(setSearchedProductList([]));
          }}
          key={product.id}
        >
          <div className="p-2 aspect-square mb-2 border border-[#80808021]">
            <ProgressiveImg
              src={product?.yellowGoldThumbnailImage}
              alt={product?.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-medium truncate">{product?.productName}</p>
          <p className="text-xs text-gray-500">${product?.baseSellingPrice}</p>
        </Link>
      ))}
    </div>
  );
});

export default SimpleProductGrid;
