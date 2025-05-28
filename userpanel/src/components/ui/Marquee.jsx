import Image from "next/image";
import CustomImg from "./custom-img";

const Marquee = ({ items }) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="relative flex w-[250%] animate-marquee">
        {/* Duplicate Items for Infinite Scroll */}
        {[...items, ...items, ...items].map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-8 flex items-center justify-center"
          >
            <div className="w-40 h-24 flex items-center justify-center">
              <CustomImg
                srcAttr={item.image}
                altAttr={`Marquee Item ${item.id}`}
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
