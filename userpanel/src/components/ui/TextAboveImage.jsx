import { helperFunctions } from "@/_helper";
import { ProgressiveImg } from "../dynamiComponents";
import Link from "next/link";

const TextAboveImage = ({ categoryData, className, textClassName }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {categoryData.map((item, index) => (
        <div
          key={`text-above-image-${index}-${item?.title}`}
          className={`relative`}
        >
          <ProgressiveImg
            src={item?.image}
            alt={item?.alt}
            className="w-full object-contain"
          />

          <div className="px-4 md:px-0 absolute bottom-16 left-1/2 -translate-x-1/2 w-full lg:bottom-[15%] text-center text-white uppercase">
            <h3
              className={`text-xl md:text-2xl xl:text-2xl tracking-wider font-castoro pb-6 ${textClassName}`}
            >
              {item?.title}
            </h3>
            {item?.btnText ? (
              <Link
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  item?.title
                )}`}
                className="font-semibold text-sm lg:text-base xl:text-lg border-white border py-3 px-4 hover:bg-white hover:border-white hover:text-black"
              >
                {item?.btnText}
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TextAboveImage;
