import Image from "next/image";
import ethical from "@/assets/images/education/ethical.webp";
import sustainable from "@/assets/images/education/sustainable.webp";
import costEffective from "@/assets/images/education/cost-effective.webp";
import indistinguishable from "@/assets/images/education/indistinguishable.webp";
import { CustomImg } from "../dynamiComponents";

const features = [
  {
    img: ethical,
    alt: "Ethical and Conflict-Free",
    label: "Ethical and Conflict-Free",
  },
  {
    img: sustainable,
    alt: "Sustainable and Eco-Friendly",
    label: "Sustainable and Eco-Friendly",
  },
  {
    img: costEffective,
    alt: "Cost-Effective Lab Diamond",
    label: "Cost-Effective",
  },
  {
    img: indistinguishable,
    alt: "Indistinguishable from Natural Diamonds",
    label: "Indistinguishable from Natural Diamonds",
  },
];

export default function DiamondInspirationSection() {
  return (
    <section className="container py-12 lg:py-20 2xl:py-20 ">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-y-0 lg:gap-y-0 mb-10">
        <h2 className="text-4xl md:text-6xl 2xl:text-7xl leading-tight font-castoro mb-2 lg:mb-0">
          Lab Diamond
          <br />
          Ring Inspiration
        </h2>

        <div className="max-w-xl mt-1 lg:mt-8">
          <div className="w-90 h-[1px] bg-[#DFDEDB] mb-2"></div>
          <p className="text-sm md:text-base text-baseblack font-medium">
            Get inspired by our custom made engagement rings, individually
            designed with love and crafted by us.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div key={index}>
            <div className="overflow-hidden shadow hover:shadow-lg transition-shadow">
              <CustomImg
                srcAttr={item?.img}
                altAttr={item?.alt}
                className="w-full object-cover"
                layout="responsive"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
