import gemora from "@/assets/images/home/gemora.webp";
import auralis from "@/assets/images/home/auralis.webp";
import brightborn from "@/assets/images/home/brightborn.webp";
import glowState from "@/assets/images/home/glow-state.webp";
import nuvana from "@/assets/images/home/nuvana.webp";
import veloura from "@/assets/images/home/veloura.webp";
import tennis from "@/assets/images/home/tennis.webp";
import newArrival from "@/assets/images/home/newArrival.webp";
import fashion from "@/assets/images/home/fashion.webp";
import bangle from "@/assets/images/home/bangle.webp";

import CustomImg from "../custom-img";
import Link from "next/link";
import { helperFunctions } from "@/_helper";

const categories = [
  {
    img: tennis,
    title: "Tennis",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: fashion,
    title: "Fashion",
    altAttr: "",

    titleAttr: "",
  },
  {
    img: bangle,
    title: "Bangle",
    altAttr: "",

    titleAttr: "",
  },
  {
    img: newArrival,
    title: "New Arrival",
    altAttr: "",
    titleAttr: "",
  },
];

export default function CategoryGallery() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {categories?.map((category, index) => {
        return (
          <Link
            href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
              category?.title
            )}`}
            key={`category-${index}`}
          >
            <CustomImg
              srcAttr={category?.img}
              titleAttr={category?.titleAttr}
              altAttr={category?.altAttr}
            />
            <p className="uppercase mt-4 text-sm font-medium text-baseblack">
              {category?.title}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
