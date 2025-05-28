// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ZoomImage from "./ZoomImage";
// import { CustomImg, ProgressiveVed } from "../dynamiComponents";
// import { helperFunctions } from "@/_helper";
// import leftArrow from "@/assets/icons/leftArrow.svg";
// import rightArrow from "@/assets/icons/rightArrow.svg";
// import { useEffect, useState } from "react";
// // const ProductDetailPageImage = ({ productDetail }) => {
// //   if (!productDetail) return null;

// //   return (
// //     <div className="w-full relative">
// //       <div
// //         className="swiper-button-prev !text-black !left-2 !top-1/2 z-10 absolute"
// //         id="custom-swiper-prev"
// //       >
// //         <CustomImg srcAttr={leftArrow} altAttr="left-arrow" />
// //       </div>
// //       <div
// //         className="swiper-button-next !text-black !right-2 !top-1/2 z-10 absolute"
// //         id="custom-swiper-next"
// //       >
// //         <CustomImg srcAttr={rightArrow} altAttr="right-arrow" />
// //       </div>

// //       <Swiper
// //         modules={[Navigation]}
// //         navigation={{
// //           nextEl: "#custom-swiper-next",
// //           prevEl: "#custom-swiper-prev",
// //         }}
// //         className="w-full"
// //       >
// //         {/* Thumbnail Image */}
// //         {productDetail?.thumbnailImage && (
// //           <SwiperSlide className="flex justify-center items-center max-h-[750px]">
// //             <ZoomImage
// //               src={productDetail.thumbnailImage}
// //               alt="Product Thumbnail"
// //             />
// //           </SwiperSlide>
// //         )}

// //         {/* Gallery Images */}
// //         {productDetail?.images?.map((media, index) => (
// //           <SwiperSlide
// //             key={index}
// //             className="flex justify-center items-center max-h-[750px]"
// //           >
// //             <ZoomImage src={media?.image} alt={`Product Image ${index + 1}`} />
// //           </SwiperSlide>
// //         ))}
// //         {/* Video Slide */}
// //         {productDetail?.video && (
// //           <SwiperSlide className="relative w-full max-h-[750px]">
// //             <ProgressiveVed
// //               src={productDetail.video}
// //               type={helperFunctions?.getVideoType(productDetail?.video)}
// //               className="w-full h-full object-cover"
// //             />
// //           </SwiperSlide>
// //         )}
// //       </Swiper>
// //     </div>
// //   );
// // };

// // Helper to preload an image

// function toCamelCase(str) {
//   if (!str) return "";
//   const [first, ...rest] = str.trim().split(" ");
//   return (
//     first.toLowerCase() +
//     rest.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")
//   );
// }

// function preloadImage(src) {
//   return new Promise((resolve) => {
//     if (!src) return resolve(null);
//     const img = new Image();
//     img.src = src;
//     img.onload = () => resolve(src);
//     img.onerror = () => resolve(null);
//   });
// }

// // Helper to preload video
// function preloadVideo(src) {
//   return new Promise((resolve) => {
//     if (!src) return resolve(null);
//     const video = document.createElement("video");
//     video.src = src;
//     // Wait until enough data is loaded to play
//     video.onloadeddata = () => resolve(src);
//     video.onerror = () => resolve(null);
//   });
// }

// const ProductDetailPageImage = ({ productDetail, selectedVariations }) => {
//   if (!productDetail) return null;
//   // Detect all color variations in productDetail keys dynamically
//   // (assuming all variation keys end with 'Images' or 'ThumbnailImage' or 'Video')
//   // You can adjust this if you have a fixed set of colors

//   // Example colors from productDetail keys:
//   // goldColorThumbnailImage, goldColorImages, goldColorVideo, silverColorThumbnailImage, ...

//   // Extract unique color keys from productDetail keys:
//   const colorKeys = Object.keys(productDetail)
//     .map((key) => {
//       // Extract color prefix before 'ThumbnailImage', 'Images' or 'Video'
//       if (key.endsWith("ThumbnailImage"))
//         return key.replace("ThumbnailImage", "");
//       if (key.endsWith("Images")) return key.replace("Images", "");
//       if (key.endsWith("Video")) return key.replace("Video", "");
//       return null;
//     })
//     .filter(Boolean);

//   // Unique colors only
//   const uniqueColors = [...new Set(colorKeys)];

//   // We'll store preloaded media here:
//   // { goldColor: { thumbnail: string, images: [{image: string}], video: string }, ... }
//   const [cachedMedia, setCachedMedia] = useState({});

//   // On mount, preload all media for all colors
//   useEffect(() => {
//     async function preloadAllMedia() {
//       const cache = {};

//       for (const colorKey of uniqueColors) {
//         const thumbnailKey = `${colorKey}ThumbnailImage`;
//         const imagesKey = `${colorKey}Images`;
//         const videoKey = `${colorKey}Video`;

//         // Preload thumbnail
//         const thumbnail = productDetail[thumbnailKey];
//         await preloadImage(thumbnail);

//         // Preload images array
//         const images = productDetail[imagesKey] || [];
//         await Promise.all(images.map((imgObj) => preloadImage(imgObj?.image)));

//         // Preload video
//         const video = productDetail[videoKey];
//         if (video) await preloadVideo(video);

//         cache[colorKey] = {
//           thumbnail,
//           images,
//           video,
//         };
//       }
//       setCachedMedia(cache);
//     }

//     preloadAllMedia();
//   }, [productDetail, uniqueColors]);

//   // Now get selected color key from selectedVariations:
//   const selectedColorName = selectedVariations?.find(
//     (v) => v?.variationName?.toLowerCase() === "gold color"
//   )?.variationTypeName;

//   const selectedKey = toCamelCase(selectedColorName || "");

//   // Use cached media for selected color, fallback to empty data
//   const media = cachedMedia[selectedKey] || {
//     thumbnail: null,
//     images: [],
//     video: null,
//   };

//   return (
//     <div className="w-full relative">
//       <div
//         className="swiper-button-prev !text-black !left-2 !top-1/2 z-10 absolute"
//         id="custom-swiper-prev"
//       >
//         <CustomImg srcAttr={leftArrow} altAttr="left-arrow" />
//       </div>
//       <div
//         className="swiper-button-next !text-black !right-2 !top-1/2 z-10 absolute"
//         id="custom-swiper-next"
//       >
//         <CustomImg srcAttr={rightArrow} altAttr="right-arrow" />
//       </div>

//       <Swiper
//         modules={[Navigation]}
//         navigation={{
//           nextEl: "#custom-swiper-next",
//           prevEl: "#custom-swiper-prev",
//         }}
//         className="w-full"
//       >
//         {/* Thumbnail Image */}
//         {thumbnailImage && (
//           <SwiperSlide className="flex justify-center items-center max-h-[750px]">
//             <ZoomImage src={media.thumbnail} alt="Product Thumbnail" />
//           </SwiperSlide>
//         )}

//         {/* Gallery Images */}
//         {Array.isArray(images) &&
//           images.map((imgObj, index) => (
//             <SwiperSlide
//               key={index}
//               className="flex justify-center items-center max-h-[750px]"
//             >
//               <ZoomImage
//                 src={imgObj?.image}
//                 alt={`Product Image ${index + 1}`}
//               />
//             </SwiperSlide>
//           ))}

//         {/* Video Slide */}
//         {video && (
//           <SwiperSlide className="relative w-full max-h-[750px]">
//             <ProgressiveVed
//               key={media.video} // force remount on video change
//               src={media.video}
//               type={helperFunctions?.getVideoType(video)}
//               className="w-full h-full object-cover"
//             />
//           </SwiperSlide>
//         )}
//       </Swiper>
//     </div>
//   );
// };

// export default ProductDetailPageImage;

"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ZoomImage from "./ZoomImage";
import { CustomImg, ProgressiveVed } from "../dynamiComponents";
import { helperFunctions } from "@/_helper";
import leftArrow from "@/assets/icons/leftArrow.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";

function toCamelCase(str) {
  if (!str) return "";
  const [first, ...rest] = str.trim().split(" ");
  return (
    first.toLowerCase() +
    rest.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")
  );
}

const colorOptions = ["yellowGold", "roseGold", "whiteGold"]; // your expected keys

const ProductDetailPageImage = ({
  productDetail,
  selectedVariations,
  hoveredColor,
}) => {
  const [preloadedData, setPreloadedData] = useState({});
  const [activeColorKey, setActiveColorKey] = useState("");

  // Extract selected gold color from variations
  const selectedColor = selectedVariations?.find(
    (v) => v?.variationName?.toLowerCase() === "gold color"
  )?.variationTypeName;

  const selectedKey = hoveredColor || toCamelCase(selectedColor);

  useEffect(() => {
    if (!productDetail) return;

    const preload = {};

    colorOptions.forEach((colorKey) => {
      preload[colorKey] = {
        thumbnail: productDetail[`${colorKey}ThumbnailImage`] || null,
        images: productDetail[`${colorKey}Images`] || [],
        video: productDetail[`${colorKey}Video`] || null,
      };
    });

    setPreloadedData(preload);
  }, [productDetail]);

  // Update active color key when selected changes
  useEffect(() => {
    if (selectedKey && preloadedData[selectedKey]) {
      setActiveColorKey(selectedKey);
    }
  }, [selectedKey, preloadedData]);

  // Get current active data from preloaded
  const currentData = preloadedData[activeColorKey] || {
    thumbnail: null,
    images: [],
    video: null,
  };

  return (
    <div className="w-full relative">
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
        modules={[Navigation]}
        navigation={{
          nextEl: "#custom-swiper-next",
          prevEl: "#custom-swiper-prev",
        }}
        className="w-full"
      >
        {/* Thumbnail Image */}
        {currentData.thumbnail && (
          <SwiperSlide className="flex justify-center items-center max-h-[750px]">
            <ZoomImage src={currentData.thumbnail} alt="Product Thumbnail" />
          </SwiperSlide>
        )}

        {/* Gallery Images */}
        {Array.isArray(currentData.images) &&
          currentData.images.map((imgObj, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center max-h-[750px]"
            >
              <ZoomImage
                src={imgObj?.image}
                alt={`Product Image ${index + 1}`}
              />
            </SwiperSlide>
          ))}

        {/* Video Slide */}
        {currentData.video && (
          <SwiperSlide className="relative w-full max-h-[750px]">
            <ProgressiveVed
              key={currentData.video} // force re-render on video change
              src={currentData.video}
              type={helperFunctions?.getVideoType(currentData.video)}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default ProductDetailPageImage;
