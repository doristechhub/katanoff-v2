"use client";
import React, { useState } from "react";
import Image from "next/image";
import clarityFL from "@/assets/images/education/flawless.webp";
import clarityVVS from "@/assets/images/education/vvs.webp";
import clarityVS from "@/assets/images/education/vs.webp";
import claritySI from "@/assets/images/education/s.webp";
import clarityI from "@/assets/images/education/included.webp";

const clarityData = {
  FL: {
    title: "Flawless (FL)",
    description:
      "No internal or surface imperfections visible under 10x magnification. Extremely rare, highly prized, and represents the highest clarity a diamond can achieve.",
    img: clarityFL,
  },
  VVS: {
    title: "Very Very Slightly Included (VVS)",
    description:
      "Tiny inclusions that are extremely difficult to detect under magnification. Offers near-flawless clarity with exceptional brilliance and purity, even to trained professionals.",
    img: clarityVVS,
  },
  VS: {
    title: "Very Slightly Included (VS)",
    description: (
      <>
        Minor inclusions that are difficult to see without magnification. High
        clarity with excellent brilliance, Ideal for buyers seeking quality with
        slight savings over VVS.
      </>
    ),
    img: clarityVS,
  },
  SI: {
    title: "Slightly Included (SI)",
    description: (
      <>
        Visible inclusions under 10x magnification, sometimes faintly visible to
        the naked eye. Still beautiful and budget-friendly, especially in
        smaller stones or complex settings.
      </>
    ),
    img: claritySI,
  },
  I: {
    title: "Included (I)",
    description:
      " Inclusions are easily visible and may affect brilliance. Common in commercial-grade diamonds, not usually chosen for high-end fine jewelry due to lower clarity.",
    img: clarityI,
  },
};

const clarityGrades = Object.keys(clarityData);

const ClaritySection = () => {
  const [selected, setSelected] = useState("FL");
  const info = clarityData[selected];

  return (
    <section className="w-full mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
        <div className="border-t border-gray-200 w-1/6"></div>
        <h2 className="text-center text-xl xxs:text-2xl sm:text-3xl md:text-4xl font-castoro text-baseblack px-4">
          Clarity
        </h2>
        <div className="border-t border-gray-200 w-1/6"></div>
      </div>

      <p className="text-center text-xs xxs:text-sm sm:text-base md:text-lg mb-6 md:mb-12 max-w-4xl mx-auto">
        Clarity measures internal flaws or blemishes in a diamond, affecting its
        rarity not always its visible beauty.
      </p>

      <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 ">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 overflow-visible w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px] items-stretch">
          {clarityGrades.map((grade, index) => (
            <button
              key={grade}
              onClick={() => setSelected(grade)}
              className={`
          text-[10px] xxs:text-xs sm:text-sm md:text-base font-medium font-castoro
          transition-transform duration-300 ease-in-out transform
          w-full flex items-center justify-center text-center
          aspect-[6/4] sm:aspect-[5/4] md:aspect-square px-2 sm:px-3 md:px-4
          border border-primary
          ${
            selected === grade
              ? "bg-primary text-white z-20"
              : "text-black hover:bg-primary hover:text-white hover:z-10"
          }
          ${index % 5 !== 4 ? "border-r" : ""}
          ${index >= 5 ? "border-t" : ""}
        `}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row items-start md:items-center gap-8 sm:gap-10 px-2 sm:px-4 md:px-6">
          <div className="w-full md:w-1/2 text-left pt-4 sm:pt-8">
            <h3 className="text-lg xxs:text-xl sm:text-xl md:text-xl lg:text-2xl 2xl:text-3xl font-castoro mb-3 sm:mb-4">
              {info.title}
            </h3>
            <p className="text-sm xxs:text-base sm:text-lg font-medium text-baseblack leading-relaxed">
              {info.description}
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <Image
              src={info.img}
              alt={info.title}
              width={300}
              height={300}
              className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClaritySection;
