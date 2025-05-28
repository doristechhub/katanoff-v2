"use client"; // Only needed if you're using Next.js App Router

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ProgressiveImg from "./progressive-img";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import CustomImg from "./custom-img";

export default function DiamondShapeSwipper({
  shapes = [],
  title = "Shop for Lab Grown Diamonds",
}) {
  const scrollRef = useRef(null);

  const scrollBy = (direction = "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 0.6;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!shapes?.length) return null;

  return (
    <section className=" mx-auto">
      {/* Title */}
      <h2 className="text-center text-xl md:text-2xl 4xl:text-3xl font-semibold uppercase">
        {title}
      </h2>

      {/* Swiper Wrapper */}
      <div className="relative mt-8 lg:mt-12">
        {/* Left Arrow */}
        <button
          onClick={() => scrollBy("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 3xl:p-8"
        >
          <CustomImg srcAttr={leftArrow} altAttr="left-arrow" />
        </button>

        {/* Scrollable Shape Items */}
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar scroll-smooth flex gap-6 items-center px-10 justify-center "
        >
          {shapes.map((shape, idx) => (
            <Link
              href={`/customize/start-with-setting?diamondShape=${shape?.id}`}
              key={shape?.id || idx}
              className="flex flex-col items-center min-w-[80px] md:min-w-[100px] text-center focus:outline-none hover:font-bold "
            >
              <ProgressiveImg
                src={shape?.image}
                alt={shape?.title}
                width={64}
                height={64}
                className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xs md:text-sm mt-4 text-black ">
                {shape?.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scrollBy("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 3xl:p-8"
        >
          <CustomImg srcAttr={rightArrow} altAttr="right-arrow" />
        </button>
      </div>
    </section>
  );
}
