import { CustomImg } from "../dynamiComponents";
import pricing from "@/assets/icons/pricing.svg";
import warranty from "@/assets/icons/warranty.svg";
import returns from "@/assets/icons/returns.svg";
import shipping from "@/assets/icons/shipping.svg";
import thirtyDaysReturn from "@/assets/icons/30DayReturn.svg";
import freeShipping from "@/assets/icons/freeShipping.svg";
import freeResizing from "@/assets/icons/freeResizing.svg";
import lifeWarranty from "@/assets/icons/lifeWarranty.svg";
import elegantPacking from "@/assets/icons/elegantPacking.svg";
import competitivePricing from "@/assets/icons/competitivePricing.svg";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import { PAGE_CONSTANTS } from "@/_helper";

const features = [
  {
    icon: thirtyDaysReturn,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    title: "15 Days Free Returns",
  },
  {
    icon: elegantPacking,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    title: "Elegant Packing",
  },
  {
    icon: freeResizing,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    title: "Free Resizing",
  },
  {
    icon: competitivePricing,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    title: "Competitive Pricing",
  },
  {
    icon: freeShipping,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    title: "Free Shipping",
  },
  {
    icon: lifeWarranty,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    title: "Lifetime Warranty",
  },
];

export default function KeyFeatures() {
  return (
    <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 text-center md:text-start justify-center gap-6 lg:gap-0">
      {features.map((feature, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center md:items-center"
        >
          <CustomImg
            srcAttr={feature.icon}
            altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
            titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
            className="w-8 h-8 md:w-12 md:h-12 mb-4"
          />
          <h3 className="text-sm lg:text-base xl:text-lg font-light text-baseblack">
            {feature.title}
          </h3>{" "}
        </div>
      ))}
    </div>
  );
}
