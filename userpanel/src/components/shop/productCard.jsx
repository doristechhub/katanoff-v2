import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { ProgressiveImg } from "../dynamiComponents";
import { useState, useEffect } from "react";

export default function ProductCard({
  goldColorVariations = [],
  goldTypeVariations = [],
  title,
  discount,
  basePrice,
  price,
  productLink = "",
  isDiamondSettingPage = false,
  whiteGoldThumbnailImage,
  yellowGoldThumbnailImage,
  roseGoldThumbnailImage,
  hoveredWhiteGoldImage,
  hoveredYellowGoldImage,
  hoveredRoseGoldImage,
}) {
  productLink =
    productLink ||
    `/products/${helperFunctions.stringReplacedWithUnderScore(title)}`;

  // State for selected and hovered gold color, and image hover
  const [selectedGoldColor, setSelectedGoldColor] = useState(null);
  const [hoveredGoldColor, setHoveredGoldColor] = useState(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const goldTypes = goldTypeVariations
    .map((item) => item.variationTypeName)
    .join(",");

  // Map gold color variation names to their thumbnail and hovered images
  const goldColorImageMap = {
    "White Gold": {
      thumbnail: whiteGoldThumbnailImage,
      hovered: hoveredWhiteGoldImage,
    },
    "Yellow Gold": {
      thumbnail: yellowGoldThumbnailImage,
      hovered: hoveredYellowGoldImage,
    },
    "Rose Gold": {
      thumbnail: roseGoldThumbnailImage,
      hovered: hoveredRoseGoldImage,
    },
  };

  // Set the first gold color as default on mount
  useEffect(() => {
    if (goldColorVariations?.length > 0 && !selectedGoldColor) {
      setSelectedGoldColor(goldColorVariations[0].variationTypeName);
    }
  }, [goldColorVariations, selectedGoldColor]);

  // Determine the current image to display
  const currentImage =
    (isImageHovered &&
      selectedGoldColor &&
      goldColorImageMap[selectedGoldColor]?.hovered) ||
    (hoveredGoldColor && goldColorImageMap[hoveredGoldColor]?.thumbnail) ||
    (selectedGoldColor && goldColorImageMap[selectedGoldColor]?.thumbnail) ||
    (goldColorVariations?.length > 0 &&
      goldColorImageMap[goldColorVariations[0].variationTypeName]?.thumbnail) ||
    "";

  return (
    <div className="flex flex-col">
      <Link
        href={productLink}
        className="relative group aspect-[1/1]"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {currentImage ? (
          <ProgressiveImg
            className="max-w-full h-auto"
            src={currentImage}
            alt={title}
            title={title}
            width={700}
            height={700}
          />
        ) : null}

        {!isDiamondSettingPage && discount ? (
          <div className="bg-primary absolute top-3 left-3 text-xs md:text-sm text-white px-2 py-1 md:px-3 md:py-1.5">
            {discount}% Off
          </div>
        ) : null}
      </Link>

      <div className="mt-3">
        <Link
          href={productLink}
          className="text-base leading-5 mb-[15px] line-clamp-1"
        >
          {title}
        </Link>
        <div className="flex items-center gap-2 font-castoro text-base font-bold leading-4 pb-[10px]">
          <p>${price}</p>
          {!isDiamondSettingPage && discount ? (
            <p className="text-gray-500 line-through">${basePrice}</p>
          ) : null}
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full gap-1 lg:gap-0">
          {goldColorVariations?.length ? (
            <div className="flex items-center gap-2">
              {goldColorVariations?.map((x, i) => (
                <div
                  key={`gold-color-${i}-${title}`}
                  className={`p-[2px] group border cursor-pointer ${
                    selectedGoldColor === x.variationTypeName
                      ? "border-primary"
                      : "border-transparent hover:border-primary"
                  }`}
                  onMouseEnter={() => setHoveredGoldColor(x.variationTypeName)}
                  onMouseLeave={() => setHoveredGoldColor(null)}
                  onClick={() => setSelectedGoldColor(x.variationTypeName)}
                >
                  <div
                    style={{ background: x?.variationTypeHexCode }}
                    className="min-w-[35px] h-[18px] lg:min-w-[44px] lg:h-[22px] relative flex items-center justify-center text-[12px] text-baseblack font-bold"
                  >
                    <span
                      className={`opacity-0 ${
                        selectedGoldColor === x.variationTypeName
                          ? "opacity-100"
                          : "group-hover:opacity-100"
                      } transition duration-200 absolute inset-0 flex items-center justify-center`}
                    >
                      {goldTypes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
