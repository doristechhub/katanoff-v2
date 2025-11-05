"use client";
import React, { memo, useMemo } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import ProductCard from "./productCard";
import { useDispatch, useSelector } from "react-redux";
import { setVisibleItemCount } from "@/store/slices/productSlice";
import SkeletonLoader from "../ui/skeletonLoader";
import ProductNotFound from "./productNotFound";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import { HeaderLinkButton } from "../ui/button";
import { DEALS_OF_THE_WEEK, DIAMOND_SHAPE, EARRINGS, FLASH_DEALS, GOLD_COLOR, helperFunctions, STUDS } from "@/_helper";
import dealsOfTheWeekEarringBanner from "@/assets/images/collections/deals-of-the-week-banner-earring.webp";
import dealsOfTheWeekFlashDealsBanner from "@/assets/images/collections/deals-of-the-week-banner-flash-deals.webp";
import CustomImg from "../ui/custom-img";
import { useParams } from "next/navigation";
import Link from "next/link";

function useActiveColumns() {
  if (typeof window === "undefined") return 2;
  const width = window.innerWidth;
  if (width >= 2200) return 6;
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  return 2;
}

const ProductGrid = memo(
  ({
    productsList = [],
    isLoading = false,
    pagination = false,
    filterProductLoading = false,
    isDiamondSettingPage,
    className,
  }) => {
    const queryParams = useQueryParams();
    const params = useParams();

    const dispatch = useDispatch();
    const { selectedFilterVariations, visibleItemCount } = useSelector(
      ({ product }) => product
    );
    let { collectionTitle } = params;
    collectionTitle = helperFunctions?.stringReplacedWithSpace(
      decodeURIComponent(collectionTitle)
    );

    const bannerConfig = {
      [STUDS]: {
        image: dealsOfTheWeekEarringBanner,
        link: `/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(DEALS_OF_THE_WEEK)}`,
      },
      [EARRINGS]: {
        image: dealsOfTheWeekEarringBanner,
        link: `/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(DEALS_OF_THE_WEEK)}`,
      },
      [FLASH_DEALS]: {
        image: dealsOfTheWeekFlashDealsBanner,
        link: `/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(DEALS_OF_THE_WEEK)}`,
      },
    };
    const bannerData = bannerConfig[collectionTitle];
    const shouldShowBanner = !!bannerData;


    const currentProducts = productsList.slice(0, visibleItemCount);

    const getProductLink = ({ isDiamondSettingPage, product }) => {
      if (!isDiamondSettingPage) return null;
      const basePath = `/customize/complete-ring`;
      return `${basePath}`;
    };

    const getProductDiamondShape = (product) => {
      const diamondVariations = product?.variations?.find(
        (v) => v?.variationName === DIAMOND_SHAPE
      );
      return diamondVariations?.variationTypes?.[0]?.variationTypeName;
    };

    const columnCount = useActiveColumns();

    const renderProductsWithBanner = useMemo(() => {
      const elements = [];
      const minProductsForRow = Math.min(columnCount, 6);
      const requiredProductsForBanner = minProductsForRow + 1;
      const canInsertBanner =
        shouldShowBanner && currentProducts.length >= requiredProductsForBanner;


      if (!canInsertBanner) {
        return currentProducts.map((product) => (
          <ProductCard
            key={`product-${product?.id}`}
            isDiamondSettingPage={isDiamondSettingPage}
            title={product?.productName}
            discount={product?.discount}
            basePrice={product?.basePrice}
            price={product?.baseSellingPrice}
            goldColorVariations={product?.goldColorVariations}
            goldTypeVariations={product?.goldTypeVariations}
            whiteGoldThumbnailImage={product?.whiteGoldThumbnailImage}
            yellowGoldThumbnailImage={product?.yellowGoldThumbnailImage}
            roseGoldThumbnailImage={product?.roseGoldThumbnailImage}
            hoveredWhiteGoldImage={product?.whiteGoldImages?.[0]?.image ?? null}
            hoveredYellowGoldImage={product?.yellowGoldImages?.[0]?.image ?? null}
            hoveredRoseGoldImage={product?.roseGoldImages?.[0]?.image ?? null}
            productLink={getProductLink({ queryParams, isDiamondSettingPage, product })}
            productId={product?.id}
            selectedFilterGoldColor={selectedFilterVariations?.[GOLD_COLOR] ?? []}
            gender={product?.gender}
            productType={product?.productTypeNames?.[0]?.title}
            diamondShape={getProductDiamondShape(product) || ""}
            productData={product}
          />
        ));
      }

      const firstRowProducts = currentProducts.slice(0, minProductsForRow);
      firstRowProducts.forEach((product) => {
        elements.push(
          <ProductCard
            key={`product-${product?.id}`}
            isDiamondSettingPage={isDiamondSettingPage}
            title={product?.productName}
            discount={product?.discount}
            basePrice={product?.basePrice}
            price={product?.baseSellingPrice}
            goldColorVariations={product?.goldColorVariations}
            goldTypeVariations={product?.goldTypeVariations}
            whiteGoldThumbnailImage={product?.whiteGoldThumbnailImage}
            yellowGoldThumbnailImage={product?.yellowGoldThumbnailImage}
            roseGoldThumbnailImage={product?.roseGoldThumbnailImage}
            hoveredWhiteGoldImage={product?.whiteGoldImages?.[0]?.image ?? null}
            hoveredYellowGoldImage={product?.yellowGoldImages?.[0]?.image ?? null}
            hoveredRoseGoldImage={product?.roseGoldImages?.[0]?.image ?? null}
            productLink={getProductLink({ queryParams, isDiamondSettingPage, product })}
            productId={product?.id}
            selectedFilterGoldColor={selectedFilterVariations?.[GOLD_COLOR] ?? []}
            gender={product?.gender}
            productType={product?.productTypeNames?.[0]?.title}
            diamondShape={getProductDiamondShape(product) || ""}
            productData={product}
          />
        );
      });

      elements.push(
        <div
          key="banner-placeholder"
          className={`${columnCount <= 2 ? "col-span-2" : "col-span-2"
            } h-full md:h-full`}
        >
          <Link href={bannerData.link} aria-label="Collection banner">
            <CustomImg
              srcAttr={bannerData.image}
              altAttr={`${collectionTitle} Banner`}
              className="w-full h-full cursor-pointer"
            />
          </Link>
        </div>
      );

      const remainingProducts = currentProducts.slice(minProductsForRow);
      remainingProducts.forEach((product) => {
        elements.push(
          <ProductCard
            key={`product-${product?.id}`}
            isDiamondSettingPage={isDiamondSettingPage}
            title={product?.productName}
            discount={product?.discount}
            basePrice={product?.basePrice}
            price={product?.baseSellingPrice}
            goldColorVariations={product?.goldColorVariations}
            goldTypeVariations={product?.goldTypeVariations}
            whiteGoldThumbnailImage={product?.whiteGoldThumbnailImage}
            yellowGoldThumbnailImage={product?.yellowGoldThumbnailImage}
            roseGoldThumbnailImage={product?.roseGoldThumbnailImage}
            hoveredWhiteGoldImage={product?.whiteGoldImages?.[0]?.image ?? null}
            hoveredYellowGoldImage={product?.yellowGoldImages?.[0]?.image ?? null}
            hoveredRoseGoldImage={product?.roseGoldImages?.[0]?.image ?? null}
            productLink={getProductLink({ queryParams, isDiamondSettingPage, product })}
            productId={product?.id}
            selectedFilterGoldColor={selectedFilterVariations?.[GOLD_COLOR] ?? []}
            gender={product?.gender}
            productType={product?.productTypeNames?.[0]?.title}
            diamondShape={getProductDiamondShape(product) || ""}
            productData={product}
          />
        );
      });

      return elements;
    }, [currentProducts, columnCount, selectedFilterVariations, shouldShowBanner]);

    return (
      <>
        {isLoading || filterProductLoading ? (
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
        ) : productsList.length > 0 ? (
          <div>
            <div
              className={`w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
               6xl:grid-cols-6 gap-x-4 gap-y-6`}
            >
              {renderProductsWithBanner}
            </div>
          </div>
        ) : (
          <ProductNotFound />
        )}

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
