"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ProgressiveImg, ProgressiveVed } from "../dynamiComponents";
import { helperFunctions } from "@/_helper";

export default function ProductDetailSwipperSm({ images = [], video }) {
  return (
    <div className="lg:hidden block w-full  ">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        loop={true}
        spaceBetween={12}
        breakpoints={{
          320: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
        }}
        className="product-swiper"
      >
        {video && (
          <SwiperSlide>
            {video && (
              <div className="w-full h-[350px] relative overflow-hidden rounded-md">
                <ProgressiveVed
                  src={video}
                  type={helperFunctions?.getVideoType(video)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </SwiperSlide>
        )}

        {/* 🖼️ Image Slides */}
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-[350px]  relative overflow-hidden rounded-md">
              <ProgressiveImg
                src={img?.image}
                alt={`Product Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ⬇️ Pagination Dots Below Image */}
      <div className="swiper-pagination !mt-4 text-center" />
    </div>
  );
}
