import { memo, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ZoomImage from "./ZoomImage";
import { ProgressiveImg, ProgressiveVed } from "../dynamiComponents";
import { DIAMOND_SHAPE, GOLD_COLOR, helperFunctions } from "@/_helper";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import CustomImg from "./custom-img";

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

const MemoizedSlide = memo(({ src, title, alt, isVideo, videoType }) => (
  <div className="flex items-center w-full h-full relative">
    {isVideo ? (
      <ProgressiveVed
        src={src}
        type={videoType}
        className="!object-cover"
        style={{ aspectRatio: "4/4", objectFit: "cover" }}
      />
    ) : (
      <ZoomImage src={src} alt={alt} title={title} />
    )}
  </div>
));

const MemoizedProgressBar = memo(
  ({ totalSlides, activeIndex, swiperRef, activeMediaKey }) => (
    <div className="flex justify-center items-center">
      <div className="flex gap-1 w-full cursor-pointer">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={`${activeMediaKey}-${i}`}
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
  ({ productDetail, selectedVariations = [], hoveredVariation }) => {
    const [preloadedData, setPreloadedData] = useState({});
    const [activeMediaKey, setActiveMediaKey] = useState("");
    const [selectedMediaSetId, setSelectedMediaSetId] = useState(null);
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

    // Helper: exact-match check
    const isExactCombinationMatch = (comboCombination = [], selected = []) => {
      if (!Array.isArray(comboCombination) || !Array.isArray(selected))
        return false;
      if (comboCombination.length !== selected.length) return false;

      return comboCombination.every((pair) =>
        selected.some(
          (s) =>
            s?.variationId === pair?.variationId &&
            s?.variationTypeId === pair?.variationTypeId
        )
      );
    };
    const getProductDiamondShape = () => {
      const diamondVariations = productDetail?.variations?.find(
        (v) => v?.variationName === DIAMOND_SHAPE
      );

      return diamondVariations?.variationTypes?.[0]?.variationTypeName;
    };

    const { titleAttr, altAttr } = helperFunctions.generateProductImgAltTitle({
      gender: productDetail.gender,
      productType: productDetail?.productTypeNames?.[0]?.title,
      diamondShape: getProductDiamondShape() || "",
      metalColor: selectedColor,
    });

    // Helper: find media set
    const getMediaSet = (id) => {
      if (!productDetail?.mediaMapping) return undefined;
      return productDetail.mediaMapping.find((m) => m.mediaSetId === id);
    };

    // Step1: Determine which mediaSetId to use
    useEffect(() => {
      if (!productDetail) {
        setSelectedMediaSetId(null);
        return;
      }

      const mapping = productDetail.mediaMapping || [];
      if (!mapping.length) {
        setSelectedMediaSetId(null);
        return;
      }

      let effectiveVariations = selectedVariations;

      // ✅ APPLY HOVERED VARIATION (ANY TYPE)
      if (hoveredVariation?.variationId && hoveredVariation?.variationTypeId) {
        effectiveVariations = [
          ...selectedVariations.filter(
            (v) => v.variationId !== hoveredVariation.variationId
          ),
          hoveredVariation,
        ];
      }

      const combos = productDetail.variComboWithQuantity || [];
      const matchedCombo = combos.find((combo) =>
        isExactCombinationMatch(combo?.combination, effectiveVariations)
      );

      setSelectedMediaSetId(matchedCombo?.mediaSetId || mapping[0].mediaSetId);
    }, [productDetail, selectedVariations, hoveredVariation]);

    const debouncedSetActiveMediaKey = useDebounce(setActiveMediaKey, 100);

    // Step2: Preload images for selected media set
    useEffect(() => {
      if (!productDetail) return;
      const mapping = productDetail.mediaMapping || [];

      if (mapping.length === 0) return;

      const key = selectedMediaSetId;
      if (!key || hasPreloadedRef.current.has(key)) return;

      hasPreloadedRef.current.add(key);

      const mediaSet = getMediaSet(key);
      const thumbnail = mediaSet?.thumbnailImage || null;
      const images = mediaSet?.images || [];
      const video = mediaSet?.video || null;

      // preload thumbnail
      if (thumbnail) {
        const img = new Image();
        img.src = thumbnail;
        preloadElementsRef.current.push(img);
      }

      images?.forEach((imgObj) => {
        if (imgObj?.image) {
          const img = new Image();
          img.src = imgObj.image;
          preloadElementsRef.current.push(img);
        }
      });

      if (video) {
        const videoEl = document.createElement("video");
        videoEl.src = video;
        videoEl.preload = "auto";
        preloadElementsRef.current.push(videoEl);
      }

      setPreloadedData((prev) => ({
        ...prev,
        [key]: { thumbnail, images, video },
      }));

      // Preload other media sets softly
      setTimeout(() => {
        mapping
          .filter((m) => m?.mediaSetId !== key)
          .forEach((other) => {
            if (!hasPreloadedRef.current.has(other?.mediaSetId)) {
              hasPreloadedRef.current.add(other?.mediaSetId);

              const otherThumb = other?.thumbnailImage;
              const otherImages = other?.images || [];
              const otherVideo = other?.video || null;

              if (otherThumb) {
                const img = new Image();
                img.src = otherThumb;
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
                [other.mediaSetId]: {
                  thumbnail: otherThumb,
                  images: otherImages,
                  video: otherVideo,
                },
              }));
            }
          });
      }, 300);
    }, [productDetail, selectedMediaSetId]);

    // Step3: Switch active media set when preloaded
    useEffect(() => {
      if (!selectedMediaSetId) return;
      if (preloadedData[selectedMediaSetId]) {
        debouncedSetActiveMediaKey(selectedMediaSetId);
        if (swiperRef.current) {
          swiperRef.current.slideTo(0);
        }
      }
    }, [preloadedData, selectedMediaSetId]);

    // Step4: Build slides
    const currentData = preloadedData[activeMediaKey] || {
      thumbnail: null,
      images: [],
      video: null,
    };

    const allSlides = [
      ...(currentData.thumbnail
        ? [{ src: currentData.thumbnail, isVideo: false }]
        : []),
      ...currentData.images.map((img) => ({
        src: img?.image,
        isVideo: false,
      })),
      ...(currentData.video ? [{ src: currentData.video, isVideo: true }] : []),
    ];

    const totalSlides = allSlides.length;

    return (
      <div className="w-full h-full relative">
        {productDetail?.mediaMapping?.length === 0 && (
          <ProgressiveImg
            src={null}
            alt="fallback"
            className="w-full h-full object-cover"
            style={{ aspectRatio: "4/4" }}
          />
        )}

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
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          className="w-full h-full aspect-[4/4]"
        >
          {allSlides.map((slide, idx) => (
            <SwiperSlide key={`${activeMediaKey}-${idx}`}>
              <MemoizedSlide
                src={slide.src}
                isVideo={slide.isVideo}
                title={titleAttr}
                alt={altAttr}
                videoType={
                  slide.isVideo
                    ? helperFunctions?.getVideoType(slide.src)
                    : null
                }
              />
            </SwiperSlide>
          ))}

          {totalSlides === 0 && (
            <SwiperSlide>
              <ProgressiveImg
                src={null}
                alt="fallback"
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
          activeMediaKey={activeMediaKey}
        />
      </div>
    );
  }
);

export default ProductDetailPageImage;
