"use client";
import { CustomImg } from "@/components/dynamiComponents";
import Link from "next/link";
import getToKnowUs1 from "@/assets/images/home/getToKnowUs-1.webp";
import getToKnowUs2 from "@/assets/images/home/getToKnowUs-2.webp";

const CARD_DATA = [
  {
    title: "About Katanoff",
    link: "/about-us",
    image: getToKnowUs1,
  },
  {
    title: "Education",
    link: "/education",
    image: getToKnowUs2,
  },
];

export default function GetToKnowUsSection() {
  return (
    <>
      <div className="text-center mb-6 md:mb-10 lg:mt-10">
        <p className="uppercase text-base md:text-lg  tracking-wider">
          Get to know us
        </p>
        <h2 className="text-2xl md:text-4xl font-castoro mt-2">
          Diamonds That Deserve You
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARD_DATA.map((card, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden ${
              index % 2 === 0 ? "justify-self-end" : "justify-self-start"
            }`}
          >
            <Link href={card.link}>
              <div>
                <CustomImg
                  srcAttr={card.image}
                  altAttr={card.title}
                  className="group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="absolute flex flex-col lg:left-[5%] top-[47%] h-full px-6 text-black">
                <h3
                  className={`text-xl lg:text-3xl 2xl:text-4xl 4xl:text-4xl font-medium mb-4 uppercase`}
                >
                  {card.title}
                </h3>
                <span className="uppercase pt-[2%] md:pt-[4%] text-sm lg:text-base xl:text-lg font-medium tracking-wider underline hover:opacity-80 transition ">
                  Explore
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
