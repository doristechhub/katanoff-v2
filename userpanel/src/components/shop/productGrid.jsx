"use client";
import React, { memo, useEffect, useState } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import ProductCard from "./productCard";
import { useWindowSize } from "@/_helper/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setSelectedVariations,
  setSortByValue,
} from "@/store/slices/productSlice";
import SkeletonLoader from "../ui/skeletonLoader";
import ProductNotFound from "./productNotFound";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import Pagination from "../ui/Pagination";

const ProductGrid = memo(
  ({
    productList = [],
    isLoading,
    pagination = false,
    isDiamondSettingPage,
    className,
  }) => {
    const queryParams = useQueryParams();
    const dispatch = useDispatch();
    const { columnCount } = useWindowSize();
    const { currentPage, selectedSortByValue, filteredProducts } = useSelector(
      ({ product }) => product
    );

    const handlePageClick = ({ selected }) => {
      dispatch(setCurrentPage(selected));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
    const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

    const getProductLink = ({ isDiamondSettingPage, product }) => {
      if (!isDiamondSettingPage) return null;
      const basePath = `/customize/start-with-setting/${product?.id}`;
      return `${basePath}`;
    };

    useEffect(() => {
      dispatch(setSortByValue(selectedSortByValue));
    }, [selectedSortByValue]);

    useEffect(() => {
      dispatch(setSelectedVariations([]));
    }, []);

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
                      key={`product-key-${product?.productName}`}
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
                    />
                  ))
                : null}
            </div>
          </div>
        )}
        {!isLoading && !filteredProducts.length && <ProductNotFound />}

        {pagination &&
          !isLoading &&
          filteredProducts.length > ITEMS_PER_PAGE && (
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          )}
      </>
    );
  }
);

export default ProductGrid;
