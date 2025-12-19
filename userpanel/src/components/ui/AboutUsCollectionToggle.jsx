"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import collection1 from "@/assets/images/about-us/about-collection-1.webp";
import collection2 from "@/assets/images/about-us/about-collection-2.webp";
import CustomImg from "./custom-img";
import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { LinkButton } from "./button";

const collections = [
  {
    key: "signature",
    name: "Signature Collection",
    image: collection1,
  },
  {
    key: "lustra",
    name: "Lustra Collection",
    image: collection2,
  },
];

const AboutUsCollectionToggle = () => {
  const [active, setActive] = useState("signature");
  const [hovered, setHovered] = useState(null);
  const router = useRouter();

  const currentActive = hovered || active;

  return (
    <div className="flex flex-col lg:flex-row w-full h-[70vh] lg:h-[85vh] 2xl:h-[85vh] gap-2">
      {collections.map(({ key, name, image }) => (
        <div
          key={key}
          onClick={() => setActive(key)}
          onMouseEnter={() => setHovered(key)}
          onMouseLeave={() => setHovered(null)}
          className={`relative transition-all duration-500 overflow-hidden 
          ${currentActive === key ? "flex-[2]" : "flex-[1]"}`}
        >
          <div>
            <CustomImg src={image} alt={name} fill className="object-cover" />
          </div>
          <div className="px-2 absolute bottom-4 cursor-pointer lg:bottom-24 left-1/2 -translate-x-1/2 w-full text-center">
            <Link
              className="text-center uppercase italic font-castoro text-white text-lg md:text-2xl 2xl:text-4xl font-medium w-fit"
              href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                name
              )}`}
            >
              {name}
            </Link>
            <div className="flex justify-center">
              <div className="pt-4">
                <LinkButton
                  href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                    name
                  )}`}
                  className="!w-fit !uppercase !rounded-none !text-white hover:!text-white !bg-primary !border-primary hover:!bg-transparent hover:!border-white"
                  aria-label="Shop Deals of the Week"
                >
                  Shop Now
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutUsCollectionToggle;
