"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Link from "next/link";
import ProgressiveImg from "./progressive-img";
import CustomImg from "./custom-img";

import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";

export default function DiamondShapeSwipper({
  shapes = [],
  title = "Shop for Lab Grown Diamonds",
}) {
  if (!shapes?.length) return null;

  return (
    <section className="container">
      {/* Title */}
      <h2 className="text-center text-xl md:text-2xl 4xl:text-3xl font-semibold uppercase">
        {title}
      </h2>

      {/* Swiper */}
      <div className="relative mt-8 lg:mt-12">
        {/* Navigation Buttons */}
        <div className="swiper-button-prev !left-0 z-10">
          <CustomImg srcAttr={leftArrow} altAttr="left-arrow" />
        </div>
        <div className="swiper-button-next !right-0 z-10">
          <CustomImg srcAttr={rightArrow} altAttr="right-arrow" />
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={3}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            640: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 6,
            },
            1024: {
              slidesPerView: 8,
            },
            1280: {
              slidesPerView: 9,
            },
          }}
          className="!mx-8"
        >
          {shapes.map((shape, idx) => (
            <SwiperSlide key={shape?.id || idx}>
              <Link
                href={`/customize/start-with-setting?diamondShape=${shape?.id}`}
                className="flex flex-col items-center text-center focus:outline-none hover:font-bold transition-all duration-300"
              >
                <ProgressiveImg
                  src={shape?.image}
                  alt={shape?.title}
                  width={64}
                  height={64}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-xs md:text-sm mt-4 text-black">
                  {shape?.title}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
