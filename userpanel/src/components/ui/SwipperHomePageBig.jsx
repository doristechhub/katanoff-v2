"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { CustomImg } from "../dynamiComponents";
import Link from "next/link";
import { useRef, useState } from "react";
import { helperFunctions } from "@/_helper";

// Images
import home26 from "@/assets/images/home/home-26.webp";
import home27 from "@/assets/images/home/home-27.webp";
import home28 from "@/assets/images/home/home-28.webp";
import home29 from "@/assets/images/home/home-29.webp";
import home30 from "@/assets/images/home/home-30.webp";
import home31 from "@/assets/images/home/home-31.webp";
import home32 from "@/assets/images/home/home-32.webp";
import home33 from "@/assets/images/home/home-33.webp";
import home34 from "@/assets/images/home/home-34.webp";
import home35 from "@/assets/images/home/home-35.webp";

import leftArrow from "@/assets/icons/leftArrow.svg";
const collections = [
  {
    title: "Badgley Mischka",
    image: home26,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
  {
    title: "Naas Jewelry",
    image: home27,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
  {
    title: "High Jewelry",
    image: home28,
    btnText: "Shop Now",
    btnLink: `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
      "High Jewelry"
    )}`,
  },
  {
    title: "Curve Collection",
    image: home29,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
  {
    title: "Nostalgia Collection",
    image: home30,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
  {
    title: "Mossiac Collection",
    image: home31,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
  {
    title: "Boundless Collection",
    image: home32,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
  {
    title: "Trending Collection",
    image: home33,
    btnText: "Shop Now",
    btnLink: `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
      "Trending "
    )}`,
  },
  {
    title: "Toi Et Moi",
    image: home34,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
  {
    title: "Ether Diamond Collection",
    image: home35,
    btnText: "Shop Now",
    btnLink: `/collections/categories/Jewelry`,
  },
];

const RightArrow = () => (
  <div className="rotate-180">
    <CustomImg srcAttr={leftArrow} altAttr="left-arrow" className="w-6 h-6" />
  </div>
);

const SwipperHomePageBig = ({ navigation = true }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative">
      <Swiper
        spaceBetween={10}
        slidesPerView={1.2}
        className="w-full"
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
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
            <div className="relative h-[50vh] lg:h-auto">
              <CustomImg
                srcAttr={collection.image}
                altAttr={collection.title}
                className="object-cover h-full w-full"
              />
              <div className="absolute inset-1 left-14 bottom-14 lg:left-20 lg:bottom-16 flex flex-col justify-end items-start z-40 gap-4 lg:gap-6 text-white">
                <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-4xl font-castoro">
                  {collection.title}
                </h2>
                <Link
                  href={
                    collection.btnLink ||
                    `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                      collection.title
                    )}`
                  }
                  className="text-sm 2xl:text-base font-semibold tracking-wide border-b-[1px] uppercase border-white"
                >
                  {collection.btnText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {navigation && (
        <div className="hidden xs:block">
          <button
            className={`absolute -left-10   lg:-left-4 2xl:-left-10 top-1/2 -translate-y-1/2 z-10 p-2${
              isBeginning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
          >
            <CustomImg
              srcAttr={leftArrow}
              altAttr="left-arrow"
              className="w-6 h-6"
            />
          </button>

          <button
            className={`absolute -right-10 lg:-right-4 2xl:-right-10 top-1/2 -translate-y-1/2 z-10 p-2 ${
              isEnd ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
          >
            <RightArrow />
          </button>
        </div>
      )}
    </div>
  );
};

export default SwipperHomePageBig;
