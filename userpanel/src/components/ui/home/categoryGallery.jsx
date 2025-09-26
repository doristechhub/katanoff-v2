"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CustomImg from "../custom-img";
import Link from "next/link";
import { COLLECTION_SLIDER, helperFunctions, PAGE_CONSTANTS } from "@/_helper";
import leftArrow from "@/assets/icons/centerFocusSliderLeftArrow.svg";
import rightArrow from "@/assets/icons/centerFocusSliderRightArrow.svg";
import { ProgressiveImg } from "@/components/dynamiComponents";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import collectionFallbackImg from "@/assets/images/collections/collections-fallback.webp";

export default function CategoryGallery({ categories = [], type = "", title = "" }) {
  return (
    <section>
      <h2 className="text-center text-2xl md:text-2xl xl:text-3xl 2xl:text-4xl font-semibold uppercase font-gelasio">
        {title ? title : "OUR SELECTIONS"}
      </h2>

      <div className="relative mt-8 lg:mt-12">
        <div className="swiper-button-prev !left-0 absolute top-1/2 -translate-y-1/2 z-10">
          <CustomImg srcAttr={leftArrow} altAttr="left-arrow" />
        </div>
        <div className="swiper-button-next !right-0 absolute top-1/2 -translate-y-1/2 z-10">
          <CustomImg srcAttr={rightArrow} altAttr="right-arrow" />
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: type === COLLECTION_SLIDER ? 4 : 3 },
            1240: { slidesPerView: 4 },
          }}
        >
          {categories.map((category, index) => {
            const href =
              category.title === "Bangle"
                ? "/collections/categories/Jewelry"
                : `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  category.title
                )}`;

            return (
              <SwiperSlide key={`category-${index}`}>
                <Link href={href}>
                  <div className="flex flex-col">
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                      {" "}
                      {category?.image?.trim() ? (
                        <ProgressiveImg
                          src={category?.image}
                          alt={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
                          title={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
                          className="w-full h-full"
                        />
                      ) : (
                        <CustomImg
                          srcAttr={collectionFallbackImg}
                          alt={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
                          title={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
                          className="object-contain w-full h-full"
                        />
                      )}
                    </div>
                    <p className="uppercase text-[10px] xss:text-[12px] md:text-base lg:text-base 6xl:text-lg font-medium text-baseblack text-center">
                      {category.title}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
