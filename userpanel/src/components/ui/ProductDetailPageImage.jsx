import { memo, useEffect, useRef, useState, useCallback, useMemo } from "react";
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

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
};

const MemoizedSlide = memo(({ src, alt, isVideo, videoType }) => (
  <div className="flex items-center w-full h-full relative">
    {isVideo ? (
      <ProgressiveVed
        src={src}
        type={videoType}
        className="!object-cover"
        style={{ aspectRatio: "4/4", objectFit: "cover" }}
      />
    ) : (
      <ZoomImage src={src} alt={alt} />
    )}
  </div>
));

const MemoizedProgressBar = memo(
  ({ totalSlides, activeIndex, swiperRef, activeColorKey }) => (
    <div className="flex justify-center items-center">
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
    const preloadElementsRef = useRef([]);
    const hasPreloadedRef = useRef(new Set());

    const selectedColor = useMemo(
      () =>
        selectedVariations?.find((v) => v?.variationName === GOLD_COLOR)
          ?.variationTypeName,
      [selectedVariations]
    );
    const selectedKey = useMemo(
      () =>
        toCamelCase(hoveredColor) ||
        toCamelCase(selectedColor) ||
        colorOptions[0],
      [hoveredColor, selectedColor]
    );

    const debouncedSetActiveColorKey = useDebounce(setActiveColorKey, 100);

    useEffect(() => {
      if (
        !productDetail ||
        !selectedKey ||
        hasPreloadedRef.current.has(selectedKey)
      ) {
        return;
      }

      hasPreloadedRef.current.add(selectedKey);

      const thumbnail = productDetail[`${selectedKey}ThumbnailImage`];
      if (thumbnail) {
        const img = new Image();
        img.src = thumbnail;
        img.onerror = () =>
          console.error(`Thumbnail failed to load: ${thumbnail}`);
        preloadElementsRef.current.push(img);
      }

      const images = productDetail[`${selectedKey}Images`] || [];
      images.forEach((imgObj, idx) => {
        if (imgObj?.image) {
          const img = new Image();
          img.src = imgObj.image;
          img.onerror = () =>
            console.error(`Image failed to load: ${imgObj.image}`);
          preloadElementsRef.current.push(img);
        }
      });

      const video = productDetail[`${selectedKey}Video`] || null;
      if (video) {
        const videoEl = document.createElement("video");
        videoEl.src = video;
        videoEl.preload = "auto";
        videoEl.onerror = () => console.error(`Video failed to load: ${video}`);
        preloadElementsRef.current.push(videoEl);
      }

      setPreloadedData((prev) => ({
        ...prev,
        [selectedKey]: {
          thumbnail: thumbnail || null,
          images,
          video,
        },
      }));

      setTimeout(() => {
        colorOptions
          .filter(
            (colorKey) =>
              colorKey !== selectedKey && !hasPreloadedRef.current.has(colorKey)
          )
          .forEach((colorKey) => {
            hasPreloadedRef.current.add(colorKey);

            const otherThumbnail =
              productDetail[`${colorKey}ThumbnailImage`] || null;
            const otherImages = productDetail[`${colorKey}Images`] || [];
            const otherVideo = productDetail[`${colorKey}Video`] || null;

            if (otherThumbnail) {
              const img = new Image();
              img.src = otherThumbnail;
              preloadElementsRef.current.push(img);
            }

            otherImages.forEach((imgObj) => {
              if (imgObj?.image) {
                const img = new Image();
                img.src = imgObj.image;
                preloadElementsRef.current.push(img);
              }
            });

            if (otherVideo) {
              const videoEl = document.createElement("video");
              videoEl.src = otherVideo;
              videoEl.preload = "auto";
              preloadElementsRef.current.push(videoEl);
            }

            setPreloadedData((prev) => ({
              ...prev,
              [colorKey]: {
                thumbnail: otherThumbnail,
                images: otherImages,
                video: otherVideo,
              },
            }));
          });
      }, 500);

      return () => {
        preloadElementsRef.current.forEach((el) => el.remove());
        preloadElementsRef.current = [];
      };
    }, [productDetail, selectedKey]);

    useEffect(() => {
      if (selectedKey && preloadedData[selectedKey]) {
        debouncedSetActiveColorKey(selectedKey);
        if (swiperRef.current) {
          swiperRef.current.disable();
          swiperRef.current.slideTo(0);
          setTimeout(() => swiperRef.current.enable(), 0);
        }
      }
    }, [selectedKey, preloadedData, debouncedSetActiveColorKey]);

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
        ? currentData.images.map((img) => ({
            src: img?.image,
            isVideo: false,
          }))
        : []),
      ...(currentData.video
        ? [
            {
              src: currentData.video,
              isVideo: true,
            },
          ]
        : []),
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
          className="w-full h-full aspect-[4/4]"
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
                style={{ aspectRatio: "4/4" }}
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
