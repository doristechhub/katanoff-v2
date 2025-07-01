"use client";

import "swiper/css";
import "swiper/css/navigation";
import CustomImg from "./custom-img";
import centerFocusSliderLeftArrow from "@/assets/icons/centerFocusSliderLeftArrow.svg";
import centerFocusSliderRightArrow from "@/assets/icons/centerFocusSliderRightArrow.svg";

import asscher from "@/assets/images/home/asscher.webp";
import cushion from "@/assets/images/home/cushion.webp";
import emerald from "@/assets/images/home/emerald.webp";
import heart from "@/assets/images/home/heart.webp";
import marquise from "@/assets/images/home/marquise.webp";
import pearl from "@/assets/images/home/pearl.webp";
import oval from "@/assets/images/home/oval.webp";
import princess from "@/assets/images/home/princess.webp";
import round from "@/assets/images/home/round.webp";
import radiant from "@/assets/images/home/radiant.webp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import Link from "next/link";
import {
  ASSCHER,
  CUSHION,
  EMERALD,
  HEART,
  MARQUISE,
  OVAL,
  PEAR,
  PRINCESS,
  RADIANT,
  ROUND,
} from "@/_helper";

const ringData = [
  {
    title: OVAL,
    subtitle: "Graceful elongation with soft curves for timeless beauty",
    img: oval,
  },
  {
    title: ROUND,
    subtitle: "Classic brilliance with unmatched sparkle and symmetry",
    img: round,
  },
  {
    title: PRINCESS,
    subtitle: "A modern square cut with royal brilliance and bold edges",
    img: princess,
  },
  {
    title: PEAR,
    subtitle: "Elegant teardrop shape blending tradition and flair",
    img: pearl,
  },
  {
    title: EMERALD,
    subtitle: "Sophisticated step cuts with a hall-of-mirrors effect",
    img: emerald,
  },
  {
    title: MARQUISE,
    subtitle: "Elongated elegance with pointed tips for a regal look",
    img: marquise,
  },
  {
    title: HEART,
    subtitle: "A romantic silhouette symbolizing love and devotion",
    img: heart,
  },
  {
    title: CUSHION,
    subtitle: "Vintage charm with rounded corners and a soft glow",
    img: cushion,
  },
  {
    title: ASSCHER,
    subtitle: "Art Deco-inspired step cuts for geometric sophistication",
    img: asscher,
  },
  {
    title: RADIANT,
    subtitle: "Brilliant facets with a rectangular edge for extra fire",
    img: radiant,
  },
];

export default function CenterFocusSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const settings = {
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 5,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    beforeChange: (oldIndex, newIndex) => {
      setCurrentIndex(newIndex % ringData.length);
    },
  };

  const getSlideClass = (index) => {
    const total = ringData.length;
    const left2 = (currentIndex - 2 + total) % total;
    const left1 = (currentIndex - 1 + total) % total;
    const right1 = (currentIndex + 1) % total;
    const right2 = (currentIndex + 2) % total;

    if (index === currentIndex) return "scale-center";
    if (index === left1 || index === right1) return "scale-mid";
    if (index === left2 || index === right2) return "scale-back";
    return "scale-default";
  };

  let sliderRef = null;
  return (
    <section className="relative pt-6 sm:pt-8 pb-12 md:py-16 overflow-hidden">
      <div className="flex flex-col gap-2 sm:gap-4 xl:gap-6 justify-center text-center items-center">
        <h2 className="text-center text-2xl md:text-2xl xl:text-3xl 2xl:text-4xl font-semibold uppercase font-castoro">
          Discover Shapes
        </h2>
        <p className="w-[90%] md:w-[60%] 2xl:w-[40%] text-center text-base lg:text-lg xl:text-xl">
          Explore our curated selection, categorized by diamond shape, to find
          your perfect expression of elegance.
        </p>
      </div>
      <div className="mx-auto px-4">
        <Slider
          {...settings}
          ref={(slider) => (sliderRef = slider)}
          className="custom-slick-slider"
        >
          {ringData.map((item, idx) => (
            <div key={idx} className="px-2 py-8">
              <Link
                href={`/customize/select-diamond?shape=${item.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <div
                  className={`transition-all duration-500 ease-in-out slide-inner ${getSlideClass(
                    idx
                  )}`}
                >
                  <CustomImg
                    srcAttr={item.img}
                    altAttr={item.title}
                    className="w-full max-w-[120px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[240px] mx-auto"
                  />
                </div>
              </Link>
            </div>
          ))}
        </Slider>

        {/* Title + Subtitle + Navigation Arrows */}
        <div className="lg:mt-10 flex items-center justify-center gap-6">
          <button
            onClick={() => sliderRef?.slickPrev()}
            className="slick-prev-custom"
          >
            <CustomImg
              srcAttr={centerFocusSliderLeftArrow}
              altAttr="Left Arrow"
              className="w-4 h-4"
            />
          </button>
          <div className="text-center w-96">
            <Link
              href={`/customize/select-diamond?shape=${ringData[
                currentIndex
              ]?.title
                ?.toLowerCase()
                ?.replace(/\s+/g, "-")}`}
              className="text-center w-96"
            >
              <h3 className="text-lg xl:text-xl font-semibold">
                {ringData[currentIndex]?.title}
              </h3>
              <p className="text-sm lg:text-base xl:text-lg text-gray-500">
                {ringData[currentIndex]?.subtitle}
              </p>
            </Link>
          </div>
          <button
            onClick={() => sliderRef?.slickNext()}
            className="slick-next-custom"
          >
            <CustomImg
              srcAttr={centerFocusSliderRightArrow}
              altAttr="Right Arrow"
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
