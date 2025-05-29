import { CustomImg } from "../dynamiComponents";

const CustomJewelryCommon = ({
  imageSrc,
  imageAlt,
  step = "Step One",
  title,
  description,
  imageOnRight = false,
}) => {
  const imageSideClass = imageOnRight ? "md:flex-row-reverse" : "md:flex-row";
  const lineLeft = imageOnRight ? "right-[6%]" : "left-[6%]";
  const lineTranslate = imageOnRight ? "translate-x-full" : "-translate-x-full";
  const textPadding = imageOnRight
    ? "md:pr-[20px] lg:pr-[80px]"
    : "md:pl-[20px] lg:pl-[80px]";

  return (
    <div
      className={`flex flex-col ${imageSideClass} items-center gap-8 relative lg:h-[80vh] pt-6`}
    >
      {/* Image */}
      <div className="lg:w-[80%] 2xl:w-[90%] w-full relative md:h-[35vh] lg:h-[75vh]">
        <CustomImg
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Text Content */}
      <div className="lg:w-1/2 w-full">
        <div className="flex items-start relative">
          {/* Decorative Line */}
          <div
            className={`
              hidden md:block absolute top-16 
              ${lineLeft} 
              ${lineTranslate}
              w-[100px] lg:w-[160px] h-[4px] bg-baseblack
            `}
          />

          {/* Text Block */}
          <div className={`flex flex-col gap-y-4 ${textPadding}`}>
            <p className="uppercase text-sm md:text-base tracking-widest text-baseblack">
              {step}
            </p>
            <h2 className="text-2xl md:text-3xl font-medium text-baseblack font-castoro 4xl:w-[90%]">
              {title}
            </h2>
            <p className="text-baseblack font-medium text-sm md:text-base max-w-md">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomJewelryCommon;
