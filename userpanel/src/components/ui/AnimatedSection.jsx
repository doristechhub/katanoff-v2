"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  cardAnimation,
  leftToRightAnimation,
  rightToLeftAnimation,
} from "@/_utils/common";
import { CustomImg } from "../dynamiComponents";

const AnimatedSection = ({
  description = [],
  points = [],
  title = "",
  direction = "LTR",
  img = "",
  titleAttr = "",
  altAttr = "",
  children,
  className = "",
  imgClassName = "",
  titleClassName = "",
  pointsDescription = "",
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const contentAnimation =
    direction === "LTR" ? rightToLeftAnimation : leftToRightAnimation;
  const layoutDirection =
    direction === "LTR" ? "lg:flex-row" : "lg:flex-row-reverse";

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section
      ref={ref}
      className={`overflow-hidden flex flex-col ${layoutDirection} items-center justify-between ${className}`}
    >
      {/* Image Section */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={cardAnimation}
        className="lg:h-[90vh] w-full xxs:w-full lg:w-1/2 aspect-square relative"
      >
        <CustomImg
          fill
          priority
          src={img}
          alt={altAttr}
          title={titleAttr}
          className={`object-cover  ${imgClassName}`}
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>

      {/* Content Section */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={contentAnimation}
        className="w-full lg:w-1/2 flex flex-col text-center lg:justify-center lg:items-center lg:text-left gap-3 xxs:gap-4 sm:gap-7 p-8 md:p-14 lg:p-0"
      >
        <div className="lg:w-[75%]">
          <h2
            className={`text-2xl md:text-4xl mb-4 2xl:text-5xl lg:leading-[50px] font-chong-modern 2xl:leading-[60px] ${titleClassName}`}
          >
            {title}
          </h2>
          <div className="flex flex-col gap-4">
            {description
              ? description?.map((desc, i) => {
                  return (
                    <p
                      key={`description-${i}`}
                      className="text-[14px] font-medium md:text-sm 2xl:text-lg leading-relaxed"
                    >
                      {desc}
                    </p>
                  );
                })
              : null}
          </div>
          <div className="flex flex-col gap-4 text-start">
            <p className="text-[14px] font-medium md:text-sm 2xl:text-lg">
              {pointsDescription}
            </p>
            {points
              ? points.map((point, i) => {
                  return (
                    <p
                      key={`point-${i}`}
                      className="text-[14px] font-medium md:text-sm 2xl:text-lg leading-relaxed"
                    >
                      <span className="font-bold">{point?.title}</span> :{" "}
                      {point?.description}
                    </p>
                  );
                })
              : null}
          </div>
        </div>
        {children}
      </motion.div>
    </section>
  );
};

export default AnimatedSection;
