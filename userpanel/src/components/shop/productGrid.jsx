"use client";
import React, { memo, useEffect } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import ProductCard from "./productCard";
import { useWindowSize } from "@/_helper/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedSortByValue,
  setVisibleItemCount,
} from "@/store/slices/productSlice";
import SkeletonLoader from "../ui/skeletonLoader";
import ProductNotFound from "./productNotFound";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import { HeaderLinkButton } from "../ui/button";
import { GOLD_COLOR } from "@/_helper";

const ProductGrid = memo(
  ({
    productsList = [],
    isLoading = false,
    pagination = false,
    isDiamondSettingPage,
    className,
  }) => {
    const queryParams = useQueryParams();
    const dispatch = useDispatch();
    const { columnCount } = useWindowSize();
    const {
      selectedSortByValue,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedGenders,
      visibleItemCount,
    } = useSelector(({ product }) => product);

    const currentProducts = productsList.slice(0, visibleItemCount);

    const getProductLink = ({ isDiamondSettingPage, product }) => {
      if (!isDiamondSettingPage) return null;
      const basePath = `/customize/complete-ring`;
      return `${basePath}`;
    };

    useEffect(() => {
      dispatch(setSelectedSortByValue(selectedSortByValue));
    }, [selectedSortByValue, dispatch]);

    useEffect(() => {
      dispatch(setVisibleItemCount(ITEMS_PER_PAGE));
    }, [
      // selectedSortByValue,
      selectedFilterVariations,
      selectedSettingStyles,
      selectedPrices,
      selectedGenders,
      dispatch,
    ]);

    return (
      <>
        {/* Product Grid */}
        {isLoading ? (
          <div
            className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 6xl:grid-cols-6 gap-4 ${className}`}
          >
            {Array.from({ length: columnCount }).map((_, index) => (
              <div key={index} className="border-0">
                <SkeletonLoader height="w-full h-[200px] md:h-[300px] 2xl:h-[400px]" />
                <SkeletonLoader width="w-[90%]" height="h-4" className="mt-4" />
                <SkeletonLoader width="w-[40%]" height="h-4" className="mt-2" />
                <SkeletonLoader width="w-full" height="h-8" className="mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div
              className={`w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
               6xl:grid-cols-6 gap-x-4 gap-y-6`}
            >
              {currentProducts.length
                ? currentProducts.map((product) => (
                    <ProductCard
                      isDiamondSettingPage={isDiamondSettingPage}
                      key={`product-key-${product?.id}`}
                      title={product?.productName}
                      discount={product?.discount}
                      basePrice={product?.basePrice}
                      price={product?.baseSellingPrice}
                      goldColorVariations={product?.goldColorVariations}
                      goldTypeVariations={product?.goldTypeVariations}
                      whiteGoldThumbnailImage={product?.whiteGoldThumbnailImage}
                      yellowGoldThumbnailImage={
                        product?.yellowGoldThumbnailImage
                      }
                      roseGoldThumbnailImage={product?.roseGoldThumbnailImage}
                      hoveredWhiteGoldImage={
                        product?.whiteGoldImages?.length
                          ? product?.whiteGoldImages[0]?.image
                          : null
                      }
                      hoveredYellowGoldImage={
                        product?.yellowGoldImages?.length
                          ? product?.yellowGoldImages[0]?.image
                          : null
                      }
                      hoveredRoseGoldImage={
                        product?.roseGoldImages?.length
                          ? product?.roseGoldImages[0]?.image
                          : null
                      }
                      productLink={getProductLink({
                        queryParams,
                        isDiamondSettingPage,
                        product,
                      })}
                      productId={product?.id}
                      selectedFilterGoldColor={
                        selectedFilterVariations?.[GOLD_COLOR] ?? []
                      }
                    />
                  ))
                : null}
            </div>
          </div>
        )}
        {!isLoading && !productsList.length && <ProductNotFound />}
        {pagination &&
          !isLoading &&
          currentProducts.length < productsList.length && (
            <div className="mt-12 md:mt-16 lg:mt-24 justify-center flex">
              <HeaderLinkButton
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setVisibleItemCount(visibleItemCount + ITEMS_PER_PAGE)
                  );
                }}
                className="transition-all w-fit !font-semibold !text-baseblack duration-300 uppercase !py-4 !px-20 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack"
              >
                View More
              </HeaderLinkButton>
            </div>
          )}
      </>
    );
  }
);

export default ProductGrid;
