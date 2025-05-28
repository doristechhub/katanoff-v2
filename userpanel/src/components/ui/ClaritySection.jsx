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
      "Extremely rare, with no inclusions at all. Flawless diamonds are among the rarest and most expensive.",
    img: clarityFL,
  },
  VVS: {
    title: "Very Very Slightly Included (VVS)",
    description:
      "No visible inclusions to the naked eye, only very minute inclusions are visible to trained experts at 10x magnification. These make a beautiful option for an engagement ring.",
    img: clarityVVS,
  },
  VS: {
    title: "Very Slightly Included (VS)",
    description: (
      <>
        Sub divided into either VS1 and VS2.
        <br />
        No visible inclusions to the naked eye and, again, these are difficult
        to see even by a trained expert at 10x magnification. However, these
        inclusions are bigger, or there may be more of them, than seen in a VVS
        diamond. These diamonds offer good value for someone looking for a
        diamond engagement ring as the inclusions are still not visible to the
        naked eye.
      </>
    ),
    img: clarityVS,
  },
  SI: {
    title: "Slightly Included (SI)",
    description: (
      <>
        Sub divided into either SI1 and SI2.
        <br />
        Diamonds are those whose imperfections are visible at 10x magnification.
        A typical SI diamond might have a cloud, a feather, and an included
        crystal of another mineral. Neither the diamond’s transparency nor face
        up appearance may be affected by these inclusions.
      </>
    ),
    img: claritySI,
  },
  I: {
    title: "Included (I)",
    description:
      "Diamonds that feature blemishes which can be seen by the naked eye and therefore are not eligible for Forevermark.",
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
          Diamond clarity chart
        </h2>
        <div className="border-t border-gray-200 w-1/6"></div>
      </div>

      <p className="text-center text-xs xxs:text-sm sm:text-base md:text-lg mb-6 md:mb-12 max-w-4xl mx-auto">
        See below a useful summary table showing the clarity scale. Find out the
        differences in diamond clarity ranges.
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
