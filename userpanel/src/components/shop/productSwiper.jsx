"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import useQueryParams from "@/hooks/useQueryParams";
import { Navigation } from "swiper/modules";
import { useState, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import SkeletonLoader from "../ui/skeletonLoader";
import { useWindowSize } from "@/_helper/hooks";
import ProductCard from "./productCard";

export default function ProductSwiper({
  productList,
  title = "",
  loading,
  isDiamondSettingPage,
}) {
  const queryParams = useQueryParams();
  const { columnCount } = useWindowSize();
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const getProductLink = ({ queryParams, isDiamondSettingPage, product }) => {
    if (!isDiamondSettingPage) return null;
    const basePath = `/customize/start-with-setting/${product?.id}`;
    return `${basePath}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5 2xl:mb-8">
        {title ? (
          <h3 className="font-castoro text-2xl md:text-3xl 2xl:text-3xl capitalize">
            {title}
          </h3>
        ) : null}
        <div className="flex gap-4">
          <button
            className={`${isBeginning ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
          >
            <FaAngleLeft className="text-xl" />
          </button>
          <button
            className={`${isEnd ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
          >
            <FaAngleRight className="text-xl" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 6xl:grid-cols-6 gap-4">
          {Array.from({ length: columnCount }).map((_, index) => (
            <div key={index} className="border-0">
              <SkeletonLoader height="w-full h-[200px] md:h-[300px] 2xl:h-[400px]" />
              <SkeletonLoader width="w-[90%]" height="h-4" className="mt-4" />
              <SkeletonLoader width="w-[40%]" height="h-4" className="mt-2" />
              <SkeletonLoader width="w-full" height="h-8" className="mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          slidesPerView={2}
          breakpoints={{
            338: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 2, spaceBetween: 15 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
            2200: { slidesPerView: 6, spaceBetween: 20 },
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
          {productList &&
            productList.map((product) => (
              <SwiperSlide key={`product-key-${product?.productName}`}>
                <ProductCard
                  key={`product-key-${product?.id}`}
                  title={product?.productName}
                  discount={product?.discount}
                  basePrice={product?.basePrice}
                  price={product?.baseSellingPrice}
                  goldColorVariations={product?.goldColorVariations}
                  goldTypeVariations={product?.goldTypeVariations}
                  whiteGoldThumbnailImage={product?.whiteGoldThumbnailImage}
                  yellowGoldThumbnailImage={product?.yellowGoldThumbnailImage}
                  roseGoldThumbnailImage={product?.roseGoldThumbnailImage}
                  hoveredWhiteGoldImage={
                    product?.whiteGoldImages?.length
                      ? product?.whiteGoldImages[0]?.image
                      : null
                  }
                  hoveredYellowGoldImage={
                    product?.yellowGoldImages?.length
                      ? product?.yellowGoldImages[0]?.image
                      : null
                  }
                  hoveredRoseGoldImage={
                    product?.roseGoldImages?.length
                      ? product?.roseGoldImages[0]?.image
                      : null
                  }
                  productLink={getProductLink({
                    queryParams,
                    isDiamondSettingPage,
                    product,
                  })}
                  productId={product?.id}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  );
}
