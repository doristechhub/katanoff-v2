"use client";
import React, { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { CustomImg, ProgressiveImg } from "../dynamiComponents";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SkeletonLoader from "./skeletonLoader";
import { useWindowSize } from "@/_helper/hooks";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import defaultSettingStyle from "@/assets/images/default-setting-style.webp";
import {
  setSelectedSettingStyles,
  setSelectedProductTypes,
  setSelectedSubCategories,
} from "@/store/slices/productSlice";
import { PRODUCT_TYPE_KEY, SETTING_STYLE_KEY, SUB_CATEGORIES_KEY } from "@/_helper";

const FILTER_STATE_MAP = {
  [SETTING_STYLE_KEY]: { stateKey: "selectedSettingStyles", action: setSelectedSettingStyles },
  [PRODUCT_TYPE_KEY]: { stateKey: "selectedProductTypes", action: setSelectedProductTypes },
  [SUB_CATEGORIES_KEY]: { stateKey: "selectedSubCategories", action: setSelectedSubCategories },
  default: { stateKey: "selectedSettingStyles", action: setSelectedSettingStyles },
};

export default function SettingStyleCategorySwiper({
  filterType = SETTING_STYLE_KEY,
  settingStyleCategories = [],
  loading = false,
  className,
}) {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const { diamondColumnCount } = useWindowSize();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);

  // Get stateKey and action dynamically
  const { stateKey, action } = FILTER_STATE_MAP[filterType] || FILTER_STATE_MAP.default;
  const selectedFilters = useSelector(({ product }) => product[stateKey]) || [];

  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const currentBreakpoint = swiper.currentBreakpoint;
    const slidesPerView =
      swiper.params.breakpoints?.[currentBreakpoint]?.slidesPerView ||
      swiper.params.slidesPerView;
    const totalSlides = swiper.slides.length;

    setShowNavigationButtons(totalSlides > slidesPerView);
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    const currentBreakpoint = swiper.currentBreakpoint;
    const slidesPerView =
      swiper.params.breakpoints?.[currentBreakpoint]?.slidesPerView ||
      swiper.params.slidesPerView;
    const totalSlides = swiper.slides.length;

    setShowNavigationButtons(totalSlides > slidesPerView);
  };

  const handleStyleSelect = (item) => {
    const { value, title } = item || {};

    let updatedFilters;
    if (selectedFilters?.some((filter) => filter?.value === value)) {
      updatedFilters = selectedFilters.filter((filter) => filter.value !== value);
    } else {
      updatedFilters = [...selectedFilters, { value, title }];
    }

    dispatch(action(updatedFilters));
  };

  return (
    <div>
      {loading ? (
        <div
          className={`pt-10 md:pt-10 lg:pt-18 2xl:pt-20 mx-8 lg:mx-20 2xl:mx-28 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 6xl:grid-cols-7 gap-4 ${className}`}
        >
          {Array.from({ length: diamondColumnCount }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <SkeletonLoader width="max-w-[170px]" height="w-full aspect-square" />
              <SkeletonLoader width="w-[50%]" height="h-5" className="mt-2" />
            </div>
          ))}
        </div>
      ) : settingStyleCategories?.length ? (
        <div className={`pt-10 md:pt-10 lg:pt-18 2xl:pt-20 mx-8 lg:mx-20 2xl:mx-28 ${className}`}>
          <div className="relative">
            {showNavigationButtons && (
              <button
                className={`absolute top-1/2 left-0 -translate-x-8 lg:-translate-x-10 -translate-y-1/2 ${isBeginning ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
              >
                <SlArrowLeft className="text-sm md:text-lg lg:text-xl" />
              </button>
            )}
            {showNavigationButtons && (
              <button
                className={`absolute top-1/2 -right-8 lg:-right-10 -translate-y-1/2 ${isEnd ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
              >
                <SlArrowRight className="text-sm md:text-lg lg:text-xl" />
              </button>
            )}
            <Swiper
              spaceBetween={20}
              centerInsufficientSlides={true}
              modules={[Navigation]}
              slidesPerView={7}
              breakpoints={{
                320: { slidesPerView: 3, spaceBetween: 10 },
                480: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
                1280: { slidesPerView: 6, spaceBetween: 20 },
                1536: { slidesPerView: 7, spaceBetween: 20 },
              }}
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
            >
              {settingStyleCategories?.map((item) => {
                const isSelected = selectedFilters?.some((filter) => filter?.value === item?.value);
                return (
                  <SwiperSlide key={`filter-key-${item.value}`}>
                    <div
                      className="text-center cursor-pointer flex flex-col items-center"
                      onClick={() => handleStyleSelect(item)}
                    >
                      {item?.image?.trim() ? (
                        <ProgressiveImg
                          className={`max-w-[170px] w-full aspect-square object-cover !transition-none border-2 border-transparent ${isSelected ? "border-2 !border-primary" : ""}`}
                          src={item?.image}
                          alt={item?.title}
                          title={item?.title}
                          width={24}
                          height={24}
                        />
                      ) : (
                        <CustomImg
                          srcAttr={defaultSettingStyle}
                          altAttr=""
                          titleAttr=""
                          className={`max-w-[170px] w-full aspect-square object-cover !transition-none border-2 border-transparent ${isSelected ? "border-2 !border-primary" : ""}`}
                        />
                      )}
                      <h2 className="text-sm lg:text-[15px] leading-4 font-normal mt-2">
                        {item?.title}
                      </h2>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      ) : null}
    </div>
  );
}
