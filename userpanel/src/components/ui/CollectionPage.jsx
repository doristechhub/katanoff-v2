"use client";
import { fetchCollectionsTypeWiseProduct } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import { ProductGrid, SwipperHomePageBig } from "@/components/dynamiComponents";
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
  const { collectionTypeProductList, productLoading, uniqueFilterOptions } =
    useSelector(({ product }) => product);
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
    return defaultBanner;
  };

  useEffect(() => {
    if (collectionType && collectionTitle) {
      loadData();
    }
  }, [collectionType, collectionTitle, loadData]);
  return (
    <>
      {/* Swiper Section */}
      <HeroBanner
        imageSrc={getBannerImage(collectionType, collectionTitle)}
        altAttr=""
        titleAttr=""
      />

      {/* Setting Style Swiper */}
      <section className="container pt-10 md:pt-14 lg:pt-20 2xl:pt-20">
        <h2 className="text-center text-[20px] leading-6 md:text-3xl lg:text-[26px] lg:leading-[33px] 2xl:text-5xl font-castoro capitalize">
          {collectionTitle}
        </h2>

        <SettingStyleCategorySwiper
          settingStyleCategories={uniqueFilterOptions.uniqueSettingStyles}
          loading={productLoading}
        />
      </section>
      {/* Product Grid Section */}
      <section className="container pt-10 md:pt-14 lg:pt-20 2xl:pt-20">
        <ProductGrid
          productList={collectionTypeProductList}
          pagination={true}
          isLoading={productLoading}
        />
      </section>
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <SwipperHomePageBig navigation={true} />
      </section>
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>
    </>
  );
}
