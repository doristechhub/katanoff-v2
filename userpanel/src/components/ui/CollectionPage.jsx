"use client";
import {
  fetchCollectionBannersAction,
  fetchCollectionsTypeWiseProduct,
} from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import {
  HeroBanner,
  ProductFilter,
  ProductGrid,
} from "@/components/dynamiComponents";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyFeatures from "@/components/ui/KeyFeatures";
import SettingStyleCategorySwiper from "@/components/ui/settingStyleSwiper";
import SkeletonLoader from "./skeletonLoader";

export default function CollectionPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const {
    collectionTypeProductList,
    productLoading,
    uniqueFilterOptions,
    filteredProducts,
    bannerLoading,
    banners,
  } = useSelector(({ product }) => product);
  let { collectionType, collectionTitle } = params;
  const parentCategory = searchParams.get("parentCategory");
  const parentMainCategory = searchParams.get("parentMainCategory");
  collectionTitle = helperFunctions.stringReplacedWithSpace(
    decodeURIComponent(collectionTitle)
  );

  const loadData = useCallback(async () => {
    if (collectionType && collectionTitle) {
      await dispatch(
        fetchCollectionBannersAction({
          collectionCategory: collectionType,
          collectionName: collectionTitle,
          parentSubCategory: parentCategory,
          parentMainCategory,
        })
      );
      await dispatch(
        fetchCollectionsTypeWiseProduct(
          collectionType,
          collectionTitle,
          parentCategory,
          parentMainCategory
        )
      );
    }
  }, [
    dispatch,
    collectionType,
    collectionTitle,
    parentCategory,
    parentMainCategory,
  ]);

  useEffect(() => {
    if (collectionType && collectionTitle) {
      loadData();
    }
  }, [collectionType, collectionTitle, loadData]);

  return (
    <>
      {/* Swiper Section */}
      {bannerLoading ? (
        <SkeletonLoader className="aspect-[1500/738] lg:aspect-[1920/448] w-full" />
      ) : (
        <HeroBanner
          imageSrcDesktop={banners?.desktop}
          imageSrcMobile={banners?.mobile}
          altAttr=""
          titleAttr=""
        />
      )}

      <h2 className="sm:text-[20px] sm:leading-[24px]  md:text-[16px] md:leading-[20px] lg:text-[30px] lg:leading-[35px] 2xl:text-[35px] 2xl:leading-[40px] text-[26px] leading-[33px] font-normal font-castoro text-center pt-10 2xl:pt-12 capitalize text-[#2B2B2B]">
        {collectionTitle}
      </h2>

      {collectionTypeProductList?.length ? (
        <section className="pt-6 2xl:pt-10">
          <ProductFilter productList={collectionTypeProductList} />
        </section>
      ) : null}

      {/* Setting Style Swiper */}
      <section className="container">
        <SettingStyleCategorySwiper
          settingStyleCategories={uniqueFilterOptions.uniqueSettingStyles}
          loading={productLoading}
        />
      </section>
      {/* Product Grid Section */}
      <section className="container pt-6 lg:pt-10 2xl:pt-12">
        <ProductGrid
          productsList={filteredProducts}
          pagination={true}
          isLoading={productLoading}
        />
      </section>
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>
    </>
  );
}
