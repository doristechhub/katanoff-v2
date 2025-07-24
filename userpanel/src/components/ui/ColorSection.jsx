"use client";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
const colorData = [
  {
    label: "D, E, F",
    range: "Colorless",
    appearance:
      "D Is The Whitest Possible Color, But An Untrained Eye Will Not Notice A Difference Between D, E And F.",
    considerations:
      "These are the highest-quality color grades available. D is absolutely colorless, while E and F show virtually no detectable hue even under magnification. These diamonds are incredibly rare and prized for their icy white brilliance, making them ideal for platinum or white gold settings where purity and sparkle are everything.",
    link: "/diamond-color/def",
  },
  {
    label: "G, H, I, J",
    range: "Near Colorless",
    appearance:
      "Extremely Faint Hints Of Color Are Indiscernible To The Untrained Eye.",
    considerations:
      "These diamonds appear colorless to most eyes, especially once set in jewelry. G and H display just a hint of warmth, while I and J may show a soft tint under close inspection. They offer excellent value while maintaining a bright, clean appearance perfect for those seeking both beauty and budget balance",
    link: "/diamond-color/ghij",
  },
  {
    label: "K, L, M",
    range: "Slightly Tinted",
    appearance:
      "Will Show Hints Of Color To The Naked Eye When Compared Against A Pure White Background.",
    considerations:
      "Diamonds in this range display a faint yellow or warm tone that’s more visible to the naked eye. While they’re not considered colorless, they can still look beautiful especially when set in yellow or rose gold, where the metal complements and masks the tint, giving the piece a harmonious, vintage-inspired warmth.",
    link: "/diamond-color/klm",
  },
  {
    label: "N - T",
    range: "Very Lightly Colored",
    appearance: "Very Light Yellow Color.",
    considerations:
      "These diamonds show noticeable color, usually pale yellow or brown. While not common in luxury fine jewelry, they may be used for those who prefer a distinct character in their stone or are working within a specific budget. Their softer hue can work in antique settings or for artistic, custom pieces.",
    link: "/diamond-color/n-t",
  },
  {
    label: "U - Z",
    range: "Lightly Colored",
    appearance: "Noticeable Light Yellow Color.",
    considerations:
      "Diamonds graded U through Z have clearly visible yellow or brown coloring that impacts their brilliance and sparkle. They are typically not selected for traditional engagement rings or fine settings, but may be chosen for unconventional, bold, or design-driven pieces with a specific creative vision in mind.",
    link: "/diamond-color/u-z",
  },
  {
    label: "Fancy Color",
    range: "       ",
    appearance:
      "Green, Blue, Purple Yellow, Brown, Grey, Orange, Pink And Red.",
    considerations:
      "Fancy color diamonds like pink, blue, green, and intense yellow are graded on a completely different scale. Rather than penalizing color, these stones are valued for their hue, saturation, and rarity. Lab-grown fancy color diamonds offer a sustainable, accessible way to own something uniquely vibrant, luxurious, and expressive.",
    link: "/diamond-color/u-z",
  },
];
const DiamondColorChartSection = () => {
  const [selected, setSelected] = useState(colorData[0]);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  return (
    <section
      ref={ref}
      className="w-full mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
          <div className="border-t border-gray-200 w-1/6 " />
          <h2 className="text-center px-4 text-2xl xss:text-3xl md:text-4xl font-castoro">
            Color
          </h2>
          <div className="border-t border-gray-200 w-1/6 " />
        </div>

        <p className="text-center text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12">
          Diamond color refers to the presence of any hue within the stone, with
          truly colorless diamonds being the rarest. The less color a diamond
          shows, the higher its value and brilliance. Lab-grown diamonds are
          graded on the same scale as natural ones—from colorless to lightly
          tinted, and even rare fancy hues.
        </p>

        <div className="flex justify-center w-full px-4 sm:px-6 md:px-8 lg:px-20 xl:px-30">
          <div className="inline-grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-0 overflow-visible w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px] items-stretch">
            {colorData.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelected(item)}
                className={`
                              text-[10px] xxs:text-xs sm:text-sm md:text-base font-medium font-castoro
                              transition-transform duration-300 ease-in-out transform
                              w-full flex flex-col items-center justify-center text-center
                              aspect-[6/4] sm:aspect-[5/4] md:aspect-square px-2 sm:px-3 md:px-4
                              border border-primary
                              ${
                                selected?.label === item.label
                                  ? "bg-primary text-white z-20"
                                  : "text-black hover:bg-primary hover:text-white  hover:z-10"
                              }
                              ${index % 6 !== 5 ? "border-r " : ""}
                              ${index >= 6 ? "border-t " : ""}
                            `}
              >
                <p className="text-sm sm:text-base">{item.label}</p>
                <p className="text-[9px] sm:text-xs mt-1 sm:mt-1.5 opacity-80">
                  {item.range}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-center px-4 sm:px-6 md:px-8 lg:px-20 xl:px-30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 py-8 sm:py-10 md:py-12 w-full sm:max-w-[600px] lg:max-w-[800px] xl:max-w-[800px] 2xl:max-w-[1000px] mt-8">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-castoro text-baseblack font-medium mb-2">
                {selected.label}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-baseblack font-medium mb-4">
                {selected.range}
              </p>
              <h4 className="text-base sm:text-lg md:text-xl text-baseblack font-medium mb-3 font-castoro">
                Diamond Appearance
              </h4>
              <p className="text-sm sm:text-base md:text-lg text-baseblack font-medium leading-relaxed">
                {selected.appearance}
              </p>
            </div>

            <div>
              <h4 className="text-base sm:text-lg md:text-xl ttext-baseblack font-medium mb-3 font-castoro">
                Diamond Considerations
              </h4>
              <p className="text-sm sm:text-base md:text-lg text-baseblack font-medium leading-relaxed">
                {selected.considerations}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiamondColorChartSection;
