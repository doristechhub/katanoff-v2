"use client";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
const colorData = [
  {
    label: "D, E, F",
    range: "Colourless",
    appearance:
      "D Is The Whitest Possible Colour, But An Untrained Eye Will Not Notice A Difference Between D, E And F.",
    considerations:
      "These Are Rarest, And Therefore The Most Valued Diamonds. Purists Should Aim For D, E Or F Colour. Metal Setting Choice Should Be Carefully Considered When Selecting A Colourless Diamond As, For Example, A Yellow Gold Setting Will Show Up Through The Diamond Therefore Negating It's Prized Colourlessness.",
    link: "/diamond-color/def",
  },
  {
    label: "G, H, I, J",
    range: "Near Colourless",
    appearance:
      "Extremely Faint Hints Of Colour Are Indiscernible To The Untrained Eye.",
    considerations:
      "These Offer Excellent Value And Are An Ideal Option For Diamond Engagement Rings.",
    link: "/diamond-color/ghij",
  },
  {
    label: "K, L, M",
    range: "Slightly Tinted",
    appearance:
      "Will Show Hints Of Colour To The Naked Eye When Compared Against A Pure White Background.",
    considerations:
      "Traces Of Colour Can Be Enhanced Or Reduced By Metal Choice. A Gold Setting, For Example, Will Increase Yellow Tones That Support An Attractive Vintage Aesthetic. Platinum Or White Gold May Reduce That Same Yellowness. If A Yellow Diamond Is Desired, This Offers Excellent Value As A K Coloured Diamond May Be Up To Half The Price Of A G Diamond.",
    link: "/diamond-color/klm",
  },
  {
    label: "N - T",
    range: "Very Lightly Coloured",
    appearance: "Very Light Yellow Colour.",
    considerations:
      "Because These Diamonds Are More Yellow In Colour They Are Not Eligible For The Forevermark Inscription.",
    link: "/diamond-color/n-t",
  },
  {
    label: "U - Z",
    range: "Lightly Coloured",
    appearance: "Noticeable Light Yellow Colour.",
    considerations:
      "As The Most Natural Yellow In Colour, These Diamonds Are Also Not Eligible For The Forevermark Inscription.",
    link: "/diamond-color/u-z",
  },
  {
    label: "Fancy Colour",
    range: "       ",
    appearance:
      "Green, Blue, Purple Yellow, Brown, Grey, Orange, Pink And Red.",
    considerations:
      "Red Diamonds Are The Rarest Diamonds Of All. Pink And Blue Diamonds Are Also Extremely Highly Valued Of Often Very Coveted.",
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
          <h2 className="text-center px-4 text-2xl xss:text-3xl md:text-4xl font-chong-modern">
            Diamond colour chart
          </h2>
          <div className="border-t border-gray-200 w-1/6 " />
        </div>

        <p className="text-center text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12">
          See below a useful summary table showing the colour scale. Find out
          the differences in diamond colour ranges.
        </p>

        <div className="flex justify-center w-full px-4 sm:px-6 md:px-8 lg:px-20 xl:px-30">
          <div className="inline-grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-0 overflow-visible w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px] items-stretch">
            {colorData.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelected(item)}
                className={`
                              text-[10px] xxs:text-xs sm:text-sm md:text-base font-medium font-chong-modern
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
              <h3 className="text-lg sm:text-xl md:text-2xl font-chong-modern text-baseblack font-medium mb-2">
                {selected.label}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-baseblack font-medium mb-4">
                {selected.range}
              </p>
              <h4 className="text-base sm:text-lg md:text-xl text-baseblack font-medium mb-3 font-chong-modern">
                Diamond Appearance
              </h4>
              <p className="text-sm sm:text-base md:text-lg text-baseblack font-medium leading-relaxed">
                {selected.appearance}
              </p>
            </div>

            <div>
              <h4 className="text-base sm:text-lg md:text-xl ttext-baseblack font-medium mb-3 font-chong-modern">
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
