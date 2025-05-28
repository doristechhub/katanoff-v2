"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import home26 from "@/assets/images/home/home-26.webp";
import home27 from "@/assets/images/home/home-27.webp";
import "swiper/css";
import "swiper/css/pagination";
import { CustomImg } from "../dynamiComponents";
import Link from "next/link";
import { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";
import { helperFunctions } from "@/_helper";
export const collections = [
  {
    title: "New Arrival",
    image: home26,
    btnText: "Shop Now",
    altAttr: "",
    titleAttr: "",
  },
  {
    title: "Trending Collection",
    image: home27,
    btnText: "Shop Now",
    btnLink: `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
      "Trending"
    )}`,
    altAttr: "",
    titleAttr: "",
  },
];
const SwipperHomePageBig = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  return (
    <div>
      <Swiper
        spaceBetween={10}
        slidesPerView={1.2}
        className="w-full"
        modules={[Navigation]}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          480: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 1.3,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {collections.map((collection, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-[60vh] lg:h-auto">
              <CustomImg
                srcAttr={collection?.image}
                altAttr={collection?.title}
                className="object-cover h-full w-full"
              />

              <div className="absolute inset-1 left-14 bottom-14 lg:left-20 lg:bottom-16 flex flex-col justify-end items-start z-40 gap-4 lg:gap-6 text-white">
                <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-chong-modern">
                  {collection.title}
                </h2>
                <Link
                  href={
                    collection.btnLink ||
                    `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                      collection.title
                    )}`
                  }
                  className="text-sm 2xl:text-lg font-semibold tracking-wide border-b-[1px] uppercase border-white"
                >
                  {collection?.btnText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {navigation ? (
        <div className="container mt-8 flex justify-end">
          <div className="flex gap-3">
            <button
              className={`${
                isBeginning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
            >
              <BsArrowLeftShort className="text-3xl" />
            </button>
            <button
              className={`${isEnd ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
            >
              <BsArrowRightShort className="text-3xl" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SwipperHomePageBig;
