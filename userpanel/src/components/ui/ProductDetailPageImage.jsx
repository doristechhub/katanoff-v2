"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import ZoomImage from "./ZoomImage";
import { CustomImg, ProgressiveImg, ProgressiveVed } from "../dynamiComponents";
import { helperFunctions } from "@/_helper";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";

const toCamelCase = (str) => {
  if (!str) return "";
  const [first, ...rest] = str.trim().split(" ");
  return (
    first.toLowerCase() +
    rest.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")
  );
};

const colorOptions = ["yellowGold", "roseGold", "whiteGold"];
const ProductDetailPageImage = ({
  productDetail,
  selectedVariations,
  hoveredColor,
}) => {
  const [preloadedData, setPreloadedData] = useState({});
  const [activeColorKey, setActiveColorKey] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef(null);
  const selectedColor = selectedVariations?.find(
    (v) => v?.variationName?.toLowerCase() === "gold color"
  )?.variationTypeName;

  const selectedKey = toCamelCase(hoveredColor) || toCamelCase(selectedColor);

  useEffect(() => {
    if (!productDetail) return;

    const preload = {};

    colorOptions.forEach((colorKey) => {
      preload[colorKey] = {
        thumbnail: productDetail[`${colorKey}ThumbnailImage`] || null,
        images: productDetail[`${colorKey}Images`] || [],
        video: productDetail[`${colorKey}Video`] || null,
      };
    });

    setPreloadedData(preload);
  }, [productDetail]);

  useEffect(() => {
    if (selectedKey && preloadedData[selectedKey]) {
      setActiveColorKey(selectedKey);
    }
  }, [selectedKey, preloadedData]);

  const currentData = preloadedData[activeColorKey] || {
    thumbnail: null,
    images: [],
    video: null,
  };

  const allSlides = [
    ...(currentData.thumbnail ? [currentData.thumbnail] : []),
    ...(Array.isArray(currentData.images)
      ? currentData.images.map((img) => img?.image)
      : []),
    ...(currentData.video ? [currentData.video] : []),
  ];

  const totalSlides = allSlides.length;

  return (
    <div className="w-full relative">
      <div
        className="swiper-button-prev !text-black !left-2 !top-1/2 z-10 absolute"
        id="custom-swiper-prev"
      >
        <CustomImg srcAttr={leftArrow} altAttr="left-arrow" />
      </div>
      <div
        className="swiper-button-next !text-black !right-2 !top-1/2 z-10 absolute"
        id="custom-swiper-next"
      >
        <CustomImg srcAttr={rightArrow} altAttr="right-arrow" />
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: "#custom-swiper-next",
          prevEl: "#custom-swiper-prev",
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full"
      >
        {currentData.thumbnail && (
          <SwiperSlide className="flex justify-center items-center max-h-[750px]">
            <ZoomImage src={currentData.thumbnail} alt="Product Thumbnail" />
          </SwiperSlide>
        )}

        {Array.isArray(currentData.images) &&
          currentData.images.map((imgObj, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center max-h-[750px]"
            >
              <ZoomImage
                src={imgObj?.image}
                alt={`Product Image ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        {currentData.video && (
          <SwiperSlide className="flex justify-center items-center max-h-[750px]">
            <ProgressiveVed
              key={currentData.video} // force re-render on video change
              src={currentData.video}
              type={helperFunctions?.getVideoType(currentData.video)}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        )}
        {totalSlides === 0 && (
          <SwiperSlide className="flex justify-center items-center max-h-[750px]">
            <ProgressiveImg
              src={null}
              alt="Fallback Image"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        )}
      </Swiper>
      <div className="flex justify-center items-center">
        <div className="flex gap-1 w-full cursor-pointer">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              onClick={() => {
                if (
                  swiperRef.current &&
                  typeof swiperRef.current.slideTo === "function"
                ) {
                  swiperRef.current.slideTo(i);
                }
              }}
              className={`h-1 flex-1 transition-colors duration-300 ${
                i === activeIndex ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPageImage;
