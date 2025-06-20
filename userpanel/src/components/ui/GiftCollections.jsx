import React from "react";
import { CustomImg } from "../dynamiComponents";
import Link from "next/link";
import home23 from "@/assets/images/home/home-23.webp";
import home24 from "@/assets/images/home/home-24.webp";
import home25 from "@/assets/images/home/home-25.webp";
import { helperFunctions } from "@/_helper";
const giftCategories = [
  { title: "Anniversary Gifts", image: home24, altAttr: "", titleAttr: "" },
  { title: "Gifts Under $1000", image: home25, altAttr: "", titleAttr: "" },
  { title: "Gifts For Him", image: home23, altAttr: "", titleAttr: "" },
];
export default function GiftCollections({ className }) {
  return (
    <section className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {giftCategories.map((category, index) => (
          <Link
            href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
              category?.title
            )}`}
            key={`gift-collection-${index}`}
            className="group block"
          >
            <CustomImg
              srcAttr={category?.image}
              altAttr={category?.altAttr}
              titleAttr={category?.title}
              className="object-cover w-full"
            />
            <p className="pt-4 text-sm font-semibold uppercase inline-block border-b-2 border-transparent group-hover:border-primary group-hover:text-primary transition-all duration-300">
              {category?.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
