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
    <section className="pt-8 md:pt-10 lg:pt-12 2xl:pt-16 px-4">
      <div className="text-center mb-10">
        <p className="uppercase text-sm tracking-wider">Get to know us</p>
        <h2 className="text-2xl md:text-4xl font-castoro mt-2">
          Diamonds That Deserve You
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARD_DATA.map((card, index) => (
          <Link
            key={index}
            href={card.link}
            className="group relative h-[450px] md:h-[600px] overflow-hidden"
          >
            <div className="absolute inset-0">
              <CustomImg
                srcAttr={card.image}
                altAttr={card.title}
                className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 flex flex-col left-[5%] top-[47%] h-full px-6 text-black">
              <h3
                className={`text-2xl md:text-3xl 2xl:text-4xl 4xl:text-4xl font-medium mb-4 uppercase`}
              >
                {card.title}
              </h3>
              <span className="uppercase pt-[4%] text-sm md:text-base xl:text-lg font-medium tracking-wider underline hover:opacity-80 transition ">
                Explore
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
