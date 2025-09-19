import React from "react";

const ImageWithTitle = ({ imageSrc }) => {
  return (
    <section className="w-full py-0 px-0 sm:py-4 md:py-8 lg:py-12 xl:py-8 2xl:py-12">
      <div className="text-center">
        <div className="flex items-center justify-center mb-1">
          <div className="border-t border-gray-200 w-1/6"></div>
          <h2 className="text-center text-3xl sm:text-4xl font-gelasio text-baseblack px-4 sm:px-8 py-8">
            Carat relates to weight, not size
          </h2>
          <div className="border-t border-gray-200 w-1/6"></div>
        </div>

        <div className="w-full mt-4 mb-4 sm:mb-2 md:mb-4 xl:mb-6 2xl:mb-8">
          <img
            src={imageSrc}
            alt="lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff"
            title="Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York"
            className="w-full h-auto object-cover block"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageWithTitle;
