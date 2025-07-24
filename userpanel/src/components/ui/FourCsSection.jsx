import frame1 from "@/assets/images/education/Frame1.webp";
import frame2 from "@/assets/images/education/Frame2.webp";
import frame3 from "@/assets/images/education/Frame3.webp";
import frame4 from "@/assets/images/education/Frame4.webp";
import { CustomImg } from "../dynamiComponents";

const FourCsSection = () => {
  return (
    <section className="container py-6 xss:py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-20 ">
      <div className="flex items-center justify-center mb-10">
        <div className="border-t border-gray-200 w-1/6"></div>
        <h2 className="px-4 py-4 text-center text-2xl xss:text-3xl sm:text-4xl font-castoro text-baseblack">
          What Defines Diamond Quality
        </h2>
        <div className="border-t border-gray-200 w-1/6 "></div>
      </div>
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-10 lg:gap-16 2xl:gap-20">
        {/* First Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-8 md:gap-y-16 items-center">
          {/* Cut Section */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-castoro">
              Cut
            </h3>
            <p className="text-base 2xl:text-lg mt-2 lg:mt-4">
              The way a diamond is shaped and faceted, affecting its brilliance
              and sparkle.
            </p>
          </div>
          <CustomImg srcAttr={frame1} className="order-1 md:order-1" />

          {/* Clarity Section */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-castoro">
              Clarity
            </h3>
            <p className="text-base 2xl:text-lg mt-2 lg:mt-4">
              Refers to internal or surface flaws; fewer inclusions mean higher
              clarity and rarity.
            </p>
          </div>
          <CustomImg srcAttr={frame3} className="order-2 md:order-2" />
        </div>

        {/* Second Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-8 md:gap-y-16 items-center">
          {/* Color Section */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-castoro">
              Color
            </h3>
            <p className="text-base 2xl:text-lg mt-2 lg:mt-4">
              Measures how colorless a diamond is the less color, the more
              valuable and radiant.
            </p>
          </div>
          <CustomImg srcAttr={frame2} className="order-1 md:order-1" />

          {/* Carat Section */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-castoro">
              Carat
            </h3>
            <p className="text-base 2xl:text-lg mt-2 lg:mt-4">
              Indicates the diamond's weight not always size but plays a big
              role in value.
            </p>
          </div>
          <CustomImg srcAttr={frame4} className="order-2 lg:order-2" />
        </div>
      </div>
    </section>
  );
};

export default FourCsSection;
