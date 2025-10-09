"use client";
import {
  fetchCollectionBannersAction,
  fetchCollectionsTypeWiseProduct,
} from "@/_actions/product.actions";
import {
  COLLECTION,
  COLLECTION_SLIDER,
  FILTER_TO_OPTIONS_MAP,
  GENERAL,
  GIFTS_FOR_HER,
  GIFTS_FOR_HIM,
  GIFTS_UNDER_1000,
  helperFunctions,
  NEW_ARRIVAL,
  SETTING_STYLE_KEY,
} from "@/_helper";
import {
  HeroBanner,
  ProductFilter,
  ProductGrid,
} from "@/components/dynamiComponents";

import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyFeatures from "@/components/ui/KeyFeatures";
import SettingStyleCategorySwiper from "@/components/ui/settingStyleSwiper";
import SkeletonLoader from "./skeletonLoader";
import giftsForHimDesktop from "@/assets/images/collections/giftsForHimDesktop.webp";
import giftsForHimMobile from "@/assets/images/collections/giftsForHimMobile.webp";
import giftsForHerDesktop from "@/assets/images/collections/giftsForHerDesktop.webp";
import giftsForHerMobile from "@/assets/images/collections/giftsForHerMobile.webp";
import giftsUnder1000Desktop from "@/assets/images/collections/giftsUnder1000Desktop.webp";
import giftsUnder1000Mobile from "@/assets/images/collections/giftsUnder1000Mobile.webp";
import newArrivalDesktop from "@/assets/images/collections/newArrivalDesktop.webp";
import newArrivalMobile from "@/assets/images/collections/newArrivalMobile.webp";
import { fetchAllCollections, fetchCollectionByTitle } from "@/_actions/collection.action";
import { setActiveFilterType } from "@/store/slices/productSlice";
import HomePageSliderSkeleton from "./HomePageSliderSkeleton";
import CategoryGallery from "./home/categoryGallery";

export default function CollectionPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const headingRef = useRef(null);
  const {
    collectionTypeProductList,
    productLoading,
    uniqueFilterOptions,
    filteredProducts,
    bannerLoading,
    banners,
    filterProductLoading,
    activeFilterType,
  } = useSelector(({ product }) => product);
  const { collectionsListLoading, collectionsList } = useSelector(
    ({ collection }) => collection
  );

  let { collectionType, collectionTitle } = params;
  const parentCategory = searchParams.get("parentCategory");
  const parentMainCategory = searchParams.get("parentMainCategory");
  collectionTitle = helperFunctions.stringReplacedWithSpace(
    decodeURIComponent(collectionTitle)
  );

  const loadData = useCallback(async () => {
    let latestFilterType = SETTING_STYLE_KEY;
    if (collectionType === COLLECTION) {
      const collectionData = await dispatch(
        fetchCollectionByTitle(collectionTitle)
      );
      latestFilterType = collectionData?.filterType || latestFilterType;
    } else {
      latestFilterType = helperFunctions?.getFilterTypeForPage(
        collectionType,
        collectionTitle
      );
    }
    dispatch(setActiveFilterType(latestFilterType));
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
    activeFilterType,
  ]);

  useEffect(() => {
    if (collectionType && collectionTitle) {
      loadData();
    }
  }, [collectionType, collectionTitle, loadData]);

    useEffect(() => {
    dispatch(fetchAllCollections());
  }, [dispatch]);

  const STATIC_PROPS = {
    [GIFTS_FOR_HER]: { desktop: giftsForHerDesktop, mobile: giftsForHerMobile },
    [GIFTS_FOR_HIM]: { desktop: giftsForHimDesktop, mobile: giftsForHimMobile },
    [GIFTS_UNDER_1000]: {
      desktop: giftsUnder1000Desktop,
      mobile: giftsUnder1000Mobile,
    },
    [NEW_ARRIVAL]: {
      desktop: newArrivalDesktop,
      mobile: newArrivalMobile,
    },
  };

  const bannerProps =
    collectionType === GENERAL && STATIC_PROPS[collectionTitle]
      ? {
        staticSrcDesktop: STATIC_PROPS[collectionTitle]?.desktop,
        staticSrcMobile: STATIC_PROPS[collectionTitle]?.mobile,
      }
      : {
        imageSrcDesktop: banners?.desktop,
        imageSrcMobile: banners?.mobile,
      };

  const bannerTitleAttr = `${collectionTitle} | Katanoff Lab Grown Diamond Jewelry`;
  const bannerAltAttr = `Discover the ${collectionTitle} collection at Katanoff, featuring stunning lab grown diamond rings, earrings, necklaces, bracelets, and fine jewelry, crafted ethically in New York.`;

  return (
    <>
      {/* Swiper Section */}
      {bannerLoading ? (
        <SkeletonLoader className="aspect-[1500/738] lg:aspect-[1920/448] w-full" />
      ) : (
        <>
          <HeroBanner
            {...bannerProps}
            altAttr={bannerAltAttr}
            titleAttr={bannerTitleAttr}
          />
        </>
      )}

      <h1
        ref={headingRef}
        className="sm:text-[20px] sm:leading-[24px]  md:text-[16px] md:leading-[20px] lg:text-[30px] lg:leading-[35px] 2xl:text-[35px] 2xl:leading-[40px] text-[26px] leading-[33px] font-normal font-gelasio text-center pt-10 2xl:pt-12 capitalize text-[#2B2B2B]"
      >
        {collectionTitle}
      </h1>

      {collectionTypeProductList?.length ? (
        <section className="pt-6 2xl:pt-10">
          <ProductFilter
            productList={collectionTypeProductList}
            displayRef={headingRef}
          />
        </section>
      ) : null}

      {/* Setting Style Swiper */}
      <section className="container">
        {activeFilterType && (
          <SettingStyleCategorySwiper
            settingStyleCategories={
              uniqueFilterOptions[FILTER_TO_OPTIONS_MAP[activeFilterType]]
            }
            loading={productLoading}
            filterType={activeFilterType}
          />
        )}
      </section>

      {/* Product Grid Section */}
      <section className="container pt-6 lg:pt-10 2xl:pt-12">
        <ProductGrid
          productsList={filteredProducts}
          filterProductLoading={filterProductLoading}
          pagination={true}
          isLoading={productLoading}
        />
      </section>
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>

      {collectionsListLoading ? (
        <HomePageSliderSkeleton />
      ) : collectionsList?.length ? (
        <section className="container pt-12 lg:pt-16 2xl:pt-24">
          <CategoryGallery categories={collectionsList} type={COLLECTION_SLIDER} title="Our Collections" />
        </section>
      ) : null}
    </>
  );
}
