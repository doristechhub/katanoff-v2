import { CustomImg } from "../dynamiComponents";
import pricing from "@/assets/icons/pricing.svg";
import warranty from "@/assets/icons/warranty.svg";
import returns from "@/assets/icons/returns.svg";
const features = [
  {
    icon: pricing,
    altAttr: "",
    titleAttr: "",
    title: "Competitive Pricing",
    description:
      "At Red Stone Pawn, we offer fair and competitive pricing on all our products. Whether you’re buying, selling, or trading, our expert team ensures you get the best value for your money",
  },
  {
    icon: returns,
    altAttr: "",
    titleAttr: "",
    title: "Returns",
    description:
      "We stand by the quality of our products and want you to shop worry-free. If you're not completely satisfied with your purchase, return it hassle-free!",
  },
  {
    icon: warranty,
    altAttr: "",
    titleAttr: "",
    title: "Lifetime Warranty",
    description:
      "Shop with confidence knowing that your investment is backed by our commitment to excellence.",
  },
];
export default function KeyFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-12 2xl:gap-44 gap-y-8 lg:gap-y-1 text-center md:text-start justify-center">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center md:items-start">
          <CustomImg
            srcAttr={feature.icon}
            altAttr={feature.title}
            className="w-12 h-12 mb-4"
          />
          <h3 className="text-xl xl:text-2xl 2xl:text-3xl text-baseblack font-chong-modern">
            {feature.title}
          </h3>
          <p className="text-baseblack text-base font-normal 2xl:text-lg mt-4 w-[90%] md:w-full">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
