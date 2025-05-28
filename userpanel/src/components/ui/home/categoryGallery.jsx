import gemora from "@/assets/images/home/gemora.webp";
import auralis from "@/assets/images/home/auralis.webp";
import lustera from "@/assets/images/home/lustera.webp";
import brightborn from "@/assets/images/home/brightborn.webp";
import diamora from "@/assets/images/home/diamora.webp";
import glowState from "@/assets/images/home/glow-state.webp";
import nuvana from "@/assets/images/home/nuvana.webp";
import veloura from "@/assets/images/home/veloura.webp";
import CustomImg from "../custom-img";
import Link from "next/link";
import { helperFunctions } from "@/_helper";

const categories = [
  {
    img: lustera,
    title: "Lustera",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: diamora,
    title: "Diamora",
    altAttr: "",

    titleAttr: "",
  },
  {
    img: veloura,
    title: "Veloura",
    altAttr: "",

    titleAttr: "",
  },
  {
    img: glowState,
    title: "Glow State",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: brightborn,
    title: "Brightborn",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: auralis,
    title: "Auralis",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: nuvana,
    title: "Nuvana",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: gemora,
    title: "Gemora",
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
            <p className="uppercase mt-2 font-medium">{category?.title}</p>
          </Link>
        );
      })}
    </div>
  );
}
