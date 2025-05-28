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
import { setSelectedSettingStyle } from "@/store/slices/productSlice";
import defaultSettingStyle from "@/assets/images/default-setting-style.webp";

export default function SettingStyleCategorySwiper({
  settingStyleCategories = [],
  loading = false,
  className,
}) {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const { selectedSettingStyles } = useSelector(({ product }) => product);
  const { diamondColumnCount } = useWindowSize();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);

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
  const handleStyleSelect = (style) => {
    const isSelected = selectedSettingStyles === style;

    const updatedStyles = isSelected ? "" : style;

    dispatch(setSelectedSettingStyle(updatedStyles));
  };
  return (
    <div>
      {loading ? (
        <div
          className={`pt-10 md:pt-10 lg:pt-18 2xl:pt-20 mx-8 lg:mx-20 2xl:mx-28 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 6xl:grid-cols-7 gap-4 ${className}`}
        >
          {Array.from({ length: diamondColumnCount }).map((_, index) => (
            <div key={index}>
              <SkeletonLoader height="h-24 lg:h-36 2xl:h-48 aspect-square" />
              <div className="flex justify-center">
                <SkeletonLoader width="w-[70%]" height="h-5" className="mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : settingStyleCategories?.length ? (
        <div
          className={`pt-10 md:pt-10 lg:pt-18 2xl:pt-20 mx-8 lg:mx-20 2xl:mx-28 ${className}`}
        >
          <div className="relative">
            {showNavigationButtons && (
              <button
                className={`absolute top-1/2 left-0 -translate-x-8 lg:-translate-x-10 -translate-y-1/2 ${
                  isBeginning ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
              >
                <SlArrowLeft className="text-sm md:text-lg lg:text-xl" />
              </button>
            )}
            {showNavigationButtons && (
              <button
                className={`absolute top-1/2 -right-8 lg:-right-10 -translate-y-1/2 ${
                  isEnd ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
              >
                <SlArrowRight className="text-sm md:text-lg lg:text-xl" />
              </button>
            )}
            <Swiper
              spaceBetween={20}
              modules={[Navigation]}
              slidesPerView={7}
              breakpoints={{
                320: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                480: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
                1280: {
                  slidesPerView: 6,
                  spaceBetween: 20,
                },
                1536: {
                  slidesPerView: 7,
                  spaceBetween: 20,
                },
              }}
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
            >
              {settingStyleCategories?.map((settingStyle) => {
                const isSelected =
                  selectedSettingStyles === settingStyle?.value;

                return (
                  <SwiperSlide key={`setting-style-key-${settingStyle?.value}`}>
                    <div
                      className={`text-center cursor-pointer `}
                      onClick={() => handleStyleSelect(settingStyle?.value)}
                    >
                      {settingStyle?.image?.trim() ? (
                        <ProgressiveImg
                          className={`h-24 lg:h-36 2xl:h-48 aspect-square object-cover !transition-none  border-2 border-transparent ${
                            isSelected ? "border-2 !border-primary" : ""
                          }`}
                          src={settingStyle?.image}
                          alt={settingStyle?.title}
                          title={settingStyle?.title}
                        />
                      ) : (
                        <CustomImg
                          srcAttr={defaultSettingStyle}
                          altAttr=""
                          titleAttr=""
                          className={`h-24 md:h-32 lg:h-36 2xl:h-48 aspect-square object-cover !transition-none  border-2 border-transparent ${
                            isSelected ? "border-2 !border-primary" : ""
                          }`}
                        />
                      )}
                      <h2 className="text-sm lg:text-lg font-normal mt-2">
                        {settingStyle?.title}
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
