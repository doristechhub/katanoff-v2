"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import CustomImg from "./custom-img";
import Link from "next/link";
import { helperFunctions } from "@/_helper";

export default function BlogSwipper({ blogData }) {
  return (
    <div className="block w-full">
      {/* Swiper for mobile and tablet */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
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
              <div className="w-full h-full relative overflow-hidden rounded-md">
                <div className="overflow-hidden">
                  <Link
                    href={`/blogs/${helperFunctions?.stringReplacedWithDash(
                      blog?.title
                    )}`}
                  >
                    <CustomImg
                      src={blog?.thumbnailImage}
                      altAttr={blog?.altAttr}
                      titleAttr={blog?.titleAttr}
                      className="w-full h-auto object-cover !rounded-none transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </div>

                <Link
                  href={`/blogs/${helperFunctions?.stringReplacedWithDash(
                    blog?.title
                  )}`}
                >
                  <h3 className="pt-2 xl:pt-3 text-lg md:text-xl font-medium text-baseblack font-castoro group-hover:underline underline-offset-4 transition uppercase">
                    {blog?.title}
                  </h3>
                </Link>

                <p className="text-[#686868] text-sm 2xl:text-base mt-2 line-clamp-2">
                  {blog.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Flex for large screens */}
      <div className="hidden lg:flex flex-wrap justify-center gap-5">
        {blogData.map((blog, index) => (
          <div key={index} className="w-full lg:w-1/4 flex-shrink-0 group">
            <div className="w-full h-full relative overflow-hidden rounded-md">
              <div className="overflow-hidden">
                <Link
                  href={`/blogs/${helperFunctions?.stringReplacedWithDash(
                    blog?.title
                  )}`}
                >
                  <CustomImg
                    src={blog?.thumbnailImage}
                    altAttr={blog?.altAttr}
                    titleAttr={blog?.titleAttr}
                    className="w-full h-auto object-cover !rounded-none transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

              <Link
                href={`/blogs/${helperFunctions?.stringReplacedWithDash(
                  blog?.title
                )}`}
              >
                <h3 className="pt-2 xl:pt-3 text-lg md:text-xl font-medium text-baseblack font-castoro group-hover:underline underline-offset-4 transition uppercase">
                  {blog?.title}
                </h3>
              </Link>

              <p className="text-[#686868] text-sm 2xl:text-base mt-2 line-clamp-2">
                {blog.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
