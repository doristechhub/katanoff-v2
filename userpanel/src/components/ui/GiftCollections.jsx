import React from "react";
import { CustomImg } from "../dynamiComponents";
import Link from "next/link";
import home23 from "@/assets/images/home/home-23.webp";
import home24 from "@/assets/images/home/home-24.webp";
import home25 from "@/assets/images/home/home-25.webp";
import { helperFunctions } from "@/_helper";
const giftCategories = [
  { title: "Gifts Under $500", image: home23, altAttr: "", titleAttr: "" },
  { title: "Gifts For Her", image: home24, altAttr: "", titleAttr: "" },
  { title: "Gifts For Him", image: home25, altAttr: "", titleAttr: "" },
];
export default function GiftCollections({ className }) {
  return (
    <section
      className={`container mx-auto pt-16 lg:pt-20 2xl:pt-28 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center ">
        {giftCategories.map((category, index) => (
          <Link
            href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
              category?.title
            )}`}
            key={`gift-collection-${index}`}
          >
            <CustomImg
              srcAttr={category?.image}
              altAttr={category?.altAttr}
              titleAttr={category?.title}
              className="object-cover w-full "
            />
            <p className="pt-4 md:pt-6 text-lg md:text-xl 2xl:text-2xl font-normal uppercase">
              {category?.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
