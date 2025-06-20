import { helperFunctions } from "@/_helper";
import { CustomImg, CustomVideo } from "../dynamiComponents";
import Link from "next/link";

const TextAboveImage = ({ categoryData, className, textClassName }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {categoryData.map((item, index) => (
        <div key={index} className={`relative`}>
          <CustomImg
            srcAttr={item?.image}
            altAttr={item?.altAttr}
            titleAttr={item?.titleAttr}
            className="h-[60vh] sm:h-[85vh] object-cover"
          />

          <div className="px-4 md:px-0 absolute bottom-16 left-1/2 -translate-x-1/2 inline-block lg:bottom-[15%] text-center  text-white gap-4 uppercase">
            <h3
              className={`text-lg md:text-2xl tracking-wider font-castoro pb-6 ${textClassName}`}
            >
              {item?.title}
            </h3>
            {item?.btnText ? (
              <Link
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  item?.title
                )}`}
                className="font-bold text-sm border-white border py-3 px-4 hover:bg-basegray hover:border-basegray"
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
