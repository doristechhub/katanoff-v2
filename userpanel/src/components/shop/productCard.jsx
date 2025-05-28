import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { ProgressiveImg } from "../dynamiComponents";

export default function ProductCard({
  goldColorVariations,
  goldTypeVariations,
  // key,
  title,
  discount,
  basePrice,
  img,
  price,
  productLink = "",
  video,
  isDiamondSettingPage = false,
}) {
  productLink =
    productLink ||
    `/products/${helperFunctions.stringReplacedWithUnderScore(title)}`;

  return (
    <Link href={productLink} aria-label={title}>
      <div className="relative group w-full h-[200px] md:h-[300px] 2xl:h-[400px] ">
        {" "}
        <ProgressiveImg
          className="w-full h-[200px] md:w-[300px] md:h-[300px] 2xl:w-[400px] 2xl:h-[400px] !object-cover"
          src={img}
          alt={title}
          title={title}
        />
        {video && (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            src={video}
            autoPlay
            loop
            playsInline
            muted
          />
        )}
        {!isDiamondSettingPage && discount ? (
          <div className="bg-primary absolute top-3 left-3 text-xs md:text-sm text-white px-2 py-1 md:px-3 md:py-1.5">
            {discount}% Off
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="text-black text-base font-medium line-clamp-2 h-[48px]">
          {title}
        </p>
        <div className="flex items-center gap-2 font-chong-modern">
          <p className="my-1 tracking-wider text-lg md:text-xl">${price}</p>

          {!isDiamondSettingPage && discount ? (
            <p className="text-sm md:text-base text-gray-500 line-through">
              ${basePrice}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full mt-3 gap-2 lg:gap-0">
          {goldColorVariations?.length ? (
            <div className="flex items-center gap-2">
              {goldColorVariations?.map((x, i) => (
                <div
                  key={`gold-color-${i}-${title}`}
                  style={{ background: x?.variationTypeHexCode }}
                  className="w-8 h-[16px] lg:w-11 lg:h-[22px]"
                ></div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
