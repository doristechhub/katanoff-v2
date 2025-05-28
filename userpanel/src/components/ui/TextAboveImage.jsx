import { helperFunctions } from "@/_helper";
import { CustomImg, CustomVideo } from "../dynamiComponents";
import Link from "next/link";

const TextAboveImage = ({ categoryData, className, textClassName }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {categoryData.map((item, index) => (
        <div key={index} className={`relative`}>
          {item?.videoSrc ? (
            <CustomVideo
              videoSrc={item?.videoSrc}
              thumbnail={item?.thumbnailImage}
            />
          ) : (
            <CustomImg
              srcAttr={item?.image}
              altAttr={item?.altAttr}
              titleAttr={item?.titleAttr}
              className="h-[85vh] object-cover"
            />
          )}
          <div className="px-4 md:px-0 absolute bottom-10 left-1/2 -translate-x-1/2 inline-block lg:bottom-12 text-center  text-white gap-4 z-40">
            <h3
              className={`text-lg md:text-2xl 2xl:text-3xl tracking-wider ${textClassName}`}
            >
              {item?.title}
            </h3>
            {item?.btnText ? (
              <Link
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  item?.title
                )}`}
                className="font-bold text-base lg:text-lg 2xl:text-2xl"
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
