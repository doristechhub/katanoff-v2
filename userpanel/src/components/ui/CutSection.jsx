"use client";
import React, { useState } from "react";

import excellent from "@/assets/images/education/excellent.webp";
import veryGood from "@/assets/images/education/verygood.webp";
import good from "@/assets/images/education/good.webp";
import fair from "@/assets/images/education/fair.webp";
import { CustomImg } from "../dynamiComponents";

const cutData = {
  excellent: {
    title: "Excellent",
    description:
      "Reflects nearly all light that enters. Maximum brilliance, fire, and sparkle only 3% of diamonds achieve this superior grade.",
    img: excellent,
    alt: "Excellent Cut",
  },
  veryGood: {
    title: "Very Good",
    description:
      "Reflects most light well with minimal loss. Delivers impressive sparkle, ideal for those who want high beauty with balanced value.",
    img: veryGood,
    alt: "Very Good Cut",
  },
  good: {
    title: "Good",
    description:
      "Reflects light reasonably well. Some brilliance is lost, but still offers a nice appearance at a more affordable price.",
    img: good,
    alt: "Good Cut",
  },
  poor: {
    title: "Fair",
    description:
      "Limited light return. Noticeable dullness or darkness in the stone. Generally not recommended for fine jewelry due to low brilliance.",
    img: fair,
    alt: "Fair Cut",
  },
};

const cutGrades = Object.keys(cutData);

const CutSection = () => {
  const [selectedCut, setSelectedCut] = useState("excellent");
  const cutInfo = cutData[selectedCut];

  return (
    <section className="w-full mx-auto py-4 xss:py-16 sm:py-8 md:py-12 lg:py-16 xl:py-16 px-4 xss:px-6 sm:px-8 md:px-12 lg:px-20 xl:px-24">
      <div className="text-center mb-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="border-t border-gray-200 w-1/5 sm:w-1/4"></div>
          <h2 className="text-center text-2xl xss:text-3xl sm:text-4xl font-castoro text-baseblack px-6 sm:px-12">
            Cut
          </h2>
          <div className="border-t border-gray-200 w-1/5 sm:w-1/4"></div>
        </div>

        <div className="text-sm xss:text-base sm:text-lg md:text-[17px] text-baseblack font-medium leading-relaxed space-y-4 px-2 sm:px-6">
          <p>
            Cut determines how well a diamond reflects light, giving it that
            signature sparkle. It’s not about shape it's about symmetry,
            proportions, and polish.
          </p>
          <p>
            Even a perfectly clear diamond can look dull if poorly cut. A well
            cut diamond will shine brightly, capturing and reflecting light
            beautifully.
          </p>
          <p>
            At Katanoff, we prioritize precision cuts that bring out maximum
            brilliance because cut is what brings a diamond to life.
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-10 px-4 sm:px-6 md:px-8 lg:px-20 xl:px-30">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full sm:max-w-[600px] lg:max-w-[800px] xl:max-w-[600px] 2xl:max-w-[800px] items-stretch relative">
          {cutGrades.map((grade, index) => (
            <div
              key={grade}
              onClick={() => setSelectedCut(grade)}
              className={`
          aspect-[6/4] sm:aspect-[5/4] md:aspect-square w-full flex flex-col items-center justify-center cursor-pointer
          transition-all duration-300 ease-in-out transform
          font-castoro font-medium text-sm xss:text-base sm:text-lg md:text-[17px] text-center min-h-[60px] border border-primary
          ${
            selectedCut === grade
              ? "bg-primary text-white z-20"
              : "text-black  hover:z-10 hover:bg-primary hover:text-white"
          }
          ${index !== cutGrades.length - 1 ? "border-r" : ""}
          ${index >= 4 ? "border-t" : ""}
        `}
            >
              {cutData[grade].title}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1100px] flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-20 items-start md:items-center px-2 xss:px-4 sm:px-6">
          <div className="w-full md:w-1/2 sm:py-4 md:py-6 lg:py-10">
            <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-castoro mb-4">
              {cutInfo.title}
            </h3>
            <p className="text-baseblack text-sm xss:text-base md:text-[17px] leading-relaxed font-medium">
              {cutInfo.description}
            </p>
          </div>
          <div className="w-full md:w-1/2 sm:py-4 md:py-6 lg:py-10">
            <CustomImg
              srcAttr={cutInfo.img}
              altAttr={cutInfo.alt}
              width={500}
              height={350}
              className=" shadow-lg w-full object-cover max-w-[500px] mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CutSection;
