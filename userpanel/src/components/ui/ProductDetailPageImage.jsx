import { memo, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ZoomImage from "./ZoomImage";
import { CustomImg, ProgressiveImg, ProgressiveVed } from "../dynamiComponents";
import { GOLD_COLOR, helperFunctions } from "@/_helper";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";

const toCamelCase = (str) => {
  if (!str) return "";
  const [first, ...rest] = str.trim().split(" ");
  return (
    first.toLowerCase() +
    rest.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")
  );
};

const colorOptions = ["yellowGold", "roseGold", "whiteGold"];

const MemoizedSlide = memo(({ src, alt, isVideo, videoType }) => (
  <div className="flex items-center w-full h-full">
    {isVideo ? (
      <ProgressiveVed
        src={null}
        type={videoType}
        className="w-full h-full object-cover"
      />
    ) : (
      <ZoomImage src={src} alt={alt} />
    )}
  </div>
));

const MemoizedProgressBar = memo(
  ({ totalSlides, activeIndex, swiperRef, activeColorKey }) => (
    <div className="flex justify-center items-center mt-2">
      <div className="flex gap-1 w-full cursor-pointer">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={`${activeColorKey}-${i}`}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-1 flex-1 transition-colors duration-300 ${
              i === activeIndex ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
);

const ProductDetailPageImage = memo(
  ({ productDetail, selectedVariations, hoveredColor }) => {
    const [preloadedData, setPreloadedData] = useState({});
    const [activeColorKey, setActiveColorKey] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    const selectedColor = selectedVariations?.find(
      (v) => v?.variationName?.toLowerCase() === GOLD_COLOR
    )?.variationTypeName;
    const selectedKey = toCamelCase(hoveredColor) || toCamelCase(selectedColor);

    useEffect(() => {
      if (!productDetail) return;

      const preload = {};
      const preloadElements = [];

      colorOptions.forEach((colorKey) => {
        preload[colorKey] = {
          thumbnail: productDetail[`${colorKey}ThumbnailImage`] || null,
          images: productDetail[`${colorKey}Images`] || [],
          video: productDetail[`${colorKey}Video`] || null,
        };

        if (preload[colorKey].thumbnail) {
          const img = new Image();
          img.src = preload[colorKey].thumbnail;
          preloadElements.push(img);
        }
        preload[colorKey].images.forEach((imgObj) => {
          const img = new Image();
          img.src = imgObj?.image;
          preloadElements.push(img);
        });

        if (preload[colorKey].video) {
          const video = document.createElement("video");
          video.src = preload[colorKey].video;
          video.preload = "auto";
          preloadElements.push(video);
        }
      });

      setPreloadedData(preload);

      return () => {
        preloadElements.forEach((el) => el.remove());
      };
    }, [productDetail]);

    useEffect(() => {
      if (selectedKey && preloadedData[selectedKey]) {
        if (swiperRef.current) {
          swiperRef.current.disable();
          setActiveColorKey(selectedKey);
          swiperRef.current.slideTo(0);
          setTimeout(() => swiperRef.current.enable(), 0);
        }
      }
    }, [selectedKey, preloadedData]);

    const currentData = preloadedData[activeColorKey] || {
      thumbnail: null,
      images: [],
      video: null,
    };

    const allSlides = [
      ...(currentData.thumbnail
        ? [{ src: currentData.thumbnail, isVideo: false }]
        : []),
      ...(Array.isArray(currentData.images)
        ? currentData.images.map((img) => ({ src: img?.image, isVideo: false }))
        : []),
      ...(currentData.video ? [{ src: currentData.video, isVideo: true }] : []),
    ];

    const totalSlides = allSlides.length;

    return (
      <div className="w-full h-full relative">
        <div
          className="swiper-button-prev !text-black !left-2 !top-1/2 z-10 absolute"
          id="custom-swiper-prev"
        >
          <CustomImg srcAttr={leftArrow} altAttr="left-arrow" />
        </div>
        <div
          className="swiper-button-next !text-black !right-2 !top-1/2 z-10 absolute"
          id="custom-swiper-next"
        >
          <CustomImg srcAttr={rightArrow} altAttr="right-arrow" />
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: "#custom-swiper-next",
            prevEl: "#custom-swiper-prev",
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full aspect-[4/3]"
        >
          {allSlides.map((slide, index) => (
            <SwiperSlide
              key={`${activeColorKey}-${slide.src}-${index}`}
              className="flex items-center justify-center w-full h-full"
            >
              <MemoizedSlide
                src={slide.src}
                alt={
                  slide.isVideo ? "Product Video" : `Product Image ${index + 1}`
                }
                isVideo={slide.isVideo}
                videoType={
                  slide.isVideo
                    ? helperFunctions?.getVideoType(slide.src)
                    : null
                }
              />
            </SwiperSlide>
          ))}
          {totalSlides === 0 && (
            <SwiperSlide className="flex items-center justify-center w-full h-full">
              <ProgressiveImg
                src={null}
                alt="Fallback Image"
                className="w-full h-full object-cover"
                style={{ aspectRatio: "4/3" }}
              />
            </SwiperSlide>
          )}
        </Swiper>

        <MemoizedProgressBar
          totalSlides={totalSlides}
          activeIndex={activeIndex}
          swiperRef={swiperRef}
          activeColorKey={activeColorKey}
        />
      </div>
    );
  }
);

export default ProductDetailPageImage;
