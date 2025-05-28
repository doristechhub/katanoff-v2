import { CustomImg } from "../dynamiComponents";
import pricing from "@/assets/icons/pricing.svg";
import warranty from "@/assets/icons/warranty.svg";
import returns from "@/assets/icons/returns.svg";
import shipping from "@/assets/icons/shipping.svg";

const features = [
  {
    icon: pricing,
    altAttr: "",
    titleAttr: "",
    title: "Competitive Pricing",
  },
  {
    icon: returns,
    altAttr: "",
    titleAttr: "",
    title: "Free Returns",
  },
  {
    icon: shipping,
    altAttr: "",
    titleAttr: "",
    title: "Free Shipping",
  },
  {
    icon: warranty,
    altAttr: "",
    titleAttr: "",
    title: "Lifetime Warranty",
  },
];

export default function KeyFeatures() {
  return (
    <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-4 text-center md:text-start justify-center gap-6 sm:gap-0">
      {features.map((feature, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center md:items-center"
        >
          <CustomImg
            srcAttr={feature.icon}
            altAttr={feature.title}
            className="w-8 h-8 md:w-12 md:h-12 mb-4"
          />
          <h3 className="text-sm md:text-base font-light">{feature.title}</h3>

          {index < features.length - 1 && (
            <div className="hidden sm:block absolute top-0 right-0 h-full w-px bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}
