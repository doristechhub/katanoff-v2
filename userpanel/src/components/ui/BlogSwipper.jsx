"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import CustomImg from "./custom-img";
import Link from "next/link";
import { helperFunctions } from "@/_helper";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function BlogSwipper({ blogData }) {
  return (
    <div className="block w-full relative">
      <button
        className="swiper-button-prev-blog  absolute top-48 -left-16
      w-12 h-12 rounded-full bg-black/80 text-white shadow-xl
      flex items-center justify-center hover:bg-black transition"
      >
        <MdKeyboardArrowLeft size={30} />
      </button>

      <button
        className="swiper-button-next-blog absolute top-48 -right-16
      w-12 h-12 rounded-full bg-black/80 text-white shadow-xl
      flex items-center justify-center hover:bg-black transition"
      >
        <MdKeyboardArrowRight size={30} />
      </button>

      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        navigation={{
          nextEl: ".swiper-button-next-blog",
          prevEl: ".swiper-button-prev-blog",
        }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          560: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        className="product-swiper"
      >
        {blogData.map((blog, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative overflow-hidden rounded-md group">
              <div className="overflow-hidden rounded-md">
                <Link
                  href={`/blogs/${helperFunctions?.stringReplacedWithDash(
                    blog?.title
                  )}`}
                >
                  <CustomImg
                    src={blog?.thumbnailImage}
                    altAttr={blog?.altAttr}
                    titleAttr={blog?.titleAttr}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

              <Link
                href={`/blogs/${helperFunctions?.stringReplacedWithDash(
                  blog?.title
                )}`}
                className="block mt-3"
              >
                <h3 className="text-lg md:text-xl font-medium text-baseblack font-castoro hover:underline underline-offset-4 transition-all uppercase">
                  {blog?.title}
                </h3>
              </Link>

              <p className="text-[#686868] text-sm 2xl:text-base mt-2 line-clamp-2">
                {blog?.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
