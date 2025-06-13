"use client";
import { fetchCollectionsTypeWiseProduct } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import {
  ProductFilter,
  ProductGrid,
  SwipperHomePageBig,
} from "@/components/dynamiComponents";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultBanner from "@/assets/images/banners/default-banner.webp";
import KeyFeatures from "@/components/ui/KeyFeatures";
import SettingStyleCategorySwiper from "@/components/ui/settingStyleSwiper";
import HeroBanner from "./HeroBanner";
import { bannerList } from "@/_utils/bannerList";

export default function CollectionPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const {
    collectionTypeProductList,
    productLoading,
    uniqueFilterOptions,
    filteredProducts,
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

  const getBannerImage = (collectionType, collectionTitle) => {
    // Match banner from bannerList
    for (const item of bannerList) {
      // 1. Match by category
      if (item?.type === collectionType && item.title === collectionTitle) {
        return item.banner;
      }

      // 2. Match by subcategory
      if (item?.type === "categories" && item.subCategories) {
        const sub = item.subCategories.find(
          (sub) => sub.title === collectionTitle
        );
        if (sub) return sub.banner;
      }

      // 3. Match by collection (e.g. Flash Deals)
      if (
        collectionType === "collection" &&
        item.collection?.title === collectionTitle
      ) {
        return item.collection.banner;
      }

      // 4. Match productTypes via parent subcategory banner
      if (
        collectionType === "productTypes" &&
        parentCategory &&
        item.subCategories
      ) {
        const sub = item.subCategories.find(
          (sub) => sub.title === parentCategory
        );
        if (sub && sub.banner) return sub.banner;
      }
    }

    // Final fallback
    return {
      desktop: null,
      mobile: null,
    };
  };
  const banner = getBannerImage(collectionType, collectionTitle);

  useEffect(() => {
    if (collectionType && collectionTitle) {
      loadData();
    }
  }, [collectionType, collectionTitle, loadData]);

  return (
    <>
      {/* Swiper Section */}
      <HeroBanner
        imageSrcDesktop={banner?.desktop}
        imageSrcMobile={banner?.mobile}
        altAttr=""
        titleAttr=""
      />

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
      {/* <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <SwipperHomePageBig navigation={true} />
      </section> */}
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>
    </>
  );
}
