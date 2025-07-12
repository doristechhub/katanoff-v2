import React from "react";
import { ProgressiveImg } from "../dynamiComponents";
import Link from "next/link";
import { helperFunctions } from "@/_helper";
export default function GiftCollections({ giftCategories = [], className }) {
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
            <ProgressiveImg
              src={category?.image}
              alt={category?.alt}
              className="w-full object-contain"
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
