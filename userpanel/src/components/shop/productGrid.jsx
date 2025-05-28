"use client";
import React, { memo, useEffect } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import ProductCard from "./productCard";
import { useWindowSize } from "@/_helper/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilters,
  setCurrentPage,
  setSelectedVariations,
  setShowFilterSidebar,
  setSortByValue,
} from "@/store/slices/productSlice";
import SkeletonLoader from "../ui/skeletonLoader";
import { VscSettings } from "react-icons/vsc";
import { ProductFilterSidebar } from "../dynamiComponents";
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
    showFilter = true,
  }) => {
    const queryParams = useQueryParams();
    const dispatch = useDispatch();
    const { columnCount } = useWindowSize();
    const {
      currentPage,
      selectedSortByValue,
      showFilterSidebar,
      selectedVariations,
      uniqueFilterOptions,
      selectedSettingStyles,
      selectedDiamondShape,
      selectedPrices,
    } = useSelector(({ product }) => product);

    const handlePageClick = ({ selected }) => {
      dispatch(setCurrentPage(selected));
    };

    let filteredItemsList = productList;
    if (Object.keys(selectedVariations)?.length) {
      filteredItemsList = productList.filter((product) => {
        return product.variations.some((variation) => {
          const selectedType = selectedVariations[variation.variationName];
          if (!selectedType) return false;
          return variation.variationTypes.some(
            (type) => type.variationTypeName === selectedType
          );
        });
      });
    }

    filteredItemsList = [...filteredItemsList].sort((a, b) => {
      if (selectedSortByValue === "alphabetically_a_to_z") {
        return a.productName.localeCompare(b.productName);
      }
      if (selectedSortByValue === "alphabetically_z_to_a") {
        return b.productName.localeCompare(a.productName);
      }
      if (selectedSortByValue === "price_low_to_high") {
        return parseFloat(a.baseSellingPrice) - parseFloat(b.baseSellingPrice);
      }
      if (selectedSortByValue === "price_high_to_low") {
        return parseFloat(b.baseSellingPrice) - parseFloat(a.baseSellingPrice);
      }
      if (selectedSortByValue === "date_old_to_new") {
        return new Date(a.createdDate) - new Date(b.createdDate);
      }
      if (selectedSortByValue === "date_new_to_old") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });
    if (selectedSettingStyles) {
      filteredItemsList = filteredItemsList.filter((product) => {
        return product?.settingStyleNamesWithImg?.some(
          (item) => item.id === selectedSettingStyles
        );
      });
    }
    if (selectedDiamondShape) {
      filteredItemsList = filteredItemsList.filter((product) => {
        return product?.diamondFilters?.diamondShapes?.some(
          (item) => item.id === selectedDiamondShape
        );
      });
    }
    if (selectedPrices?.length === 2) {
      const [minPrice, maxPrice] = selectedPrices;
      filteredItemsList = filteredItemsList.filter((product) => {
        const price = parseFloat(product.baseSellingPrice);
        return price >= minPrice && price <= maxPrice;
      });
    }
    const pageCount = Math.ceil(filteredItemsList.length / ITEMS_PER_PAGE);
    const currentProducts = filteredItemsList.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

    const getProductLink = ({ queryParams, isDiamondSettingPage, product }) => {
      if (!isDiamondSettingPage) return null;
      const { dId, format } = queryParams || {};
      const basePath = `/customize/start-with-setting/${product?.id}`;
      // const queryString = dId
      //   ? `?dId=${dId}&format=${format}`
      //   : `?format=${format}`;
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
          <div className="relative">
            {filteredItemsList.length && showFilter ? (
              <div
                className={`flex ${
                  showFilterSidebar ? "justify-end" : "justify-between"
                } mb-6 items-center`}
              >
                <button
                  onClick={() => dispatch(setShowFilterSidebar(true))}
                  className={`${
                    showFilterSidebar ? "hidden" : "block"
                  } flex items-center gap-2 px-4 py-2 border shadow-sm bg-primary text-white hover:bg-gray-100 hover:border-primary hover:text-primary font-medium transition-all duration-300`}
                >
                  <VscSettings className="text-xl" /> Filter
                </button>
                {filteredItemsList ? (
                  <span>{filteredItemsList.length} items</span>
                ) : null}
              </div>
            ) : null}

            <div className={`flex gap-6`}>
              <ProductFilterSidebar
                uniqueVariations={uniqueFilterOptions.uniqueVariations}
              />
              {/* Product Grid */}
              <div
                className={`w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${
                  showFilterSidebar ? "lg:grid-cols-3" : "lg:grid-cols-4"
                } 6xl:grid-cols-6 gap-x-4 gap-y-6`}
              >
                {currentProducts.map((product) => (
                  <ProductCard
                    isDiamondSettingPage={isDiamondSettingPage}
                    key={`product-key-${product?.productName}`}
                    title={product?.productName}
                    discount={product?.discount}
                    basePrice={product?.basePrice}
                    img={product?.thumbnailImage || product?.images?.[0]?.image}
                    video={product?.video}
                    price={product?.baseSellingPrice}
                    goldColorVariations={product?.goldColorVariations}
                    productLink={getProductLink({
                      queryParams,
                      isDiamondSettingPage,
                      product,
                    })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !filteredItemsList.length && <ProductNotFound />}

        {pagination && !isLoading && productList.length > ITEMS_PER_PAGE && (
          <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
        )}
      </>
    );
  }
);

export default ProductGrid;
