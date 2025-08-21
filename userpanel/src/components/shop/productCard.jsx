import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { ProgressiveImg } from "../dynamiComponents";
import { useState, useEffect, useMemo, useCallback } from "react";

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
  productId,
  selectedFilterGoldColor = [],
}) {
  // State for selected and hovered gold color
  const [selectedGoldColor, setSelectedGoldColor] = useState(null);
  const [hoveredState, setHoveredState] = useState({
    isImageHovered: false,
    hoveredGoldColor: null,
  });

  const goldTypes = goldTypeVariations
    .map((item) => item.variationTypeName)
    .join(",");

  // Map gold color variation names to their thumbnail and hovered images
  const goldColorImageMap = useMemo(
    () => ({
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
    }),
    [
      whiteGoldThumbnailImage,
      yellowGoldThumbnailImage,
      roseGoldThumbnailImage,
      hoveredWhiteGoldImage,
      hoveredYellowGoldImage,
      hoveredRoseGoldImage,
    ]
  );

  useEffect(() => {
    if (goldColorVariations?.length > 0) {
      if (selectedFilterGoldColor.length > 0) {
        // pick the last added filter color
        const lastSelected =
          selectedFilterGoldColor[selectedFilterGoldColor.length - 1];
        const match = goldColorVariations.find(
          (x) => x.variationTypeName === lastSelected
        );
        if (match) {
          setSelectedGoldColor(match.variationTypeName);
          return;
        }
      }
      // fallback if no filter
      setSelectedGoldColor(goldColorVariations[0].variationTypeName);
    }
  }, [goldColorVariations, selectedFilterGoldColor]);

  const computedProductLink = useMemo(
    () =>
      productLink
        ? `${productLink}?goldColor=${helperFunctions.stringReplacedWithUnderScore(
            selectedGoldColor
          )}`
        : `/products/${helperFunctions.stringReplacedWithUnderScore(
            title
          )}?goldColor=${helperFunctions.stringReplacedWithUnderScore(
            selectedGoldColor
          )}`,
    [productLink, title, selectedGoldColor]
  );

  // Compute image source
  const imageSrc = useMemo(() => {
    if (hoveredState.isImageHovered) {
      return goldColorImageMap[selectedGoldColor]?.hovered;
    }
    if (hoveredState.hoveredGoldColor) {
      return goldColorImageMap[hoveredState.hoveredGoldColor]?.thumbnail;
    }
    return goldColorImageMap[selectedGoldColor]?.thumbnail;
  }, [
    hoveredState.isImageHovered,
    hoveredState.hoveredGoldColor,
    selectedGoldColor,
    goldColorImageMap,
  ]);

  const handleImageMouseEnter = useCallback(
    helperFunctions?.debounce(() => {
      setHoveredState((prev) => ({
        ...prev,
        isImageHovered: true,
        hoveredGoldColor: null,
      }));
    }, 100),
    []
  );

  const handleImageMouseLeave = useCallback(
    helperFunctions?.debounce(() => {
      setHoveredState((prev) => ({
        ...prev,
        isImageHovered: false,
      }));
    }, 100),
    []
  );

  const handleGoldColorMouseEnter = useCallback(
    helperFunctions?.debounce((goldColor) => {
      setHoveredState((prev) => ({
        ...prev,
        isImageHovered: false,
        hoveredGoldColor: goldColor,
      }));
    }, 100),
    []
  );

  const handleGoldColorMouseLeave = useCallback(
    helperFunctions?.debounce(() => {
      setHoveredState((prev) => ({
        ...prev,
        hoveredGoldColor: null,
      }));
    }, 100),
    []
  );

  return (
    <div className="flex flex-col">
      <Link
        href={computedProductLink}
        className="relative group aspect-[1/1]"
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
        onClick={() => {
          if (isDiamondSettingPage) {
            const customProduct = helperFunctions?.getCustomProduct();
            localStorage.setItem(
              "customProduct",
              JSON.stringify({ ...customProduct, productId })
            );
          }
        }}
      >
        <ProgressiveImg
          className="max-w-full h-auto"
          src={imageSrc}
          alt={title}
          title={title}
          width={700}
          height={700}
          key={imageSrc} // Force re-render on imageSrc change
        />

        {!isDiamondSettingPage && discount ? (
          <div className="bg-primary absolute top-3 left-3 text-xs md:text-sm text-white px-2 py-1 md:px-3 md:py-1.5">
            {discount}% Off
          </div>
        ) : null}
      </Link>

      <div className="mt-3">
        <Link
          href={computedProductLink}
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
                  key={`gold-color-${i}-${productId}`} // Use productId for uniqueness
                  className={`p-[2px] group border cursor-pointer ${
                    selectedGoldColor === x.variationTypeName
                      ? "border-primary"
                      : "border-transparent hover:border-primary"
                  }`}
                  onMouseEnter={() =>
                    handleGoldColorMouseEnter(x.variationTypeName)
                  }
                  onMouseLeave={handleGoldColorMouseLeave}
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
