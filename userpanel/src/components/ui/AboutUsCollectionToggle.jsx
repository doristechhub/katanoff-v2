"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import collection1 from "@/assets/images/about-us/about-collection-1.webp";
import collection2 from "@/assets/images/about-us/about-collection-2.webp";
import CustomImg from "./custom-img";
import { helperFunctions } from "@/_helper";
import Link from "next/link";

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
          <Link
            className="absolute bottom-4  cursor-pointer lg:bottom-12 left-1/2 -translate-x-1/2 text-center uppercase italic font-castoro text-white text-lg md:text-2xl 2xl:text-4xl font-medium"
            href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
              name
            )}`}
          >
            {name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AboutUsCollectionToggle;
