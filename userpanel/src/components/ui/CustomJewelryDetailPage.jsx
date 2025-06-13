"use client";

import { useEffect, useRef, useState } from "react";
import banner from "@/assets/images/custom-jewelry/custom-jewelry-hero.webp";
import customJewelry1 from "@/assets/images/custom-jewelry/custom-jewelry-1.webp";
import customJewelry2 from "@/assets/images/custom-jewelry/custom-jewelry-2.webp";
import customJewelry3 from "@/assets/images/custom-jewelry/custom-jewelry-3.webp";
import { AccordionTabs, CustomImg } from "@/components/dynamiComponents";
import { LinkButton } from "@/components/ui/button";
import CustomJewelryCommon from "@/components/ui/CustomJewelryCommon";
import breadCrumb from "@/assets/icons/breadCrumbBigArrow.svg";

const accordianContent = [
  {
    label: "Frequently Asked Questions",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            Have questions about creating your own custom jewelry? We're here to
            help. From understanding how the design process works, to choosing
            the right materials, timeline, and budget, our FAQ section covers
            everything you need to know. Whether you're wondering about
            resizing, warranty, or how to get started, our goal is to make your
            experience smooth, transparent, and enjoyable from concept to
            creation.
          </p>
        </div>
      </>
    ),
  },
  {
    label: "Unleash Your Creativity with Truly Custom Necklaces",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            Transform your imagination into a one-of-a-kind necklace that
            reflects your personal style and story. Whether you envision a
            minimalist gold pendant or a detailed diamond-studded design, our
            artisans bring your ideas to life with precision and care. With
            endless customization options, you're free to choose every detail —
            from metal type to gemstone arrangement — and craft a piece that’s
            truly yours.
          </p>
        </div>
      </>
    ),
  },
];

const CustomJewelryDetailPage = () => {
  const sectionRef = useRef(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If section is in view, hide sticky
        setShowStickyButton(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full h-[90vh] md:h-[80vh] overflow-hidden"
      >
        <CustomImg
          src={banner}
          alt="Custom Jewelry"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Content on Top */}
        <div className="relative z-10 w-full h-full flex items-center justify-start px-6 md:px-16">
          <div className="text-baseblack flex flex-col gap-4">
            <p className="text-base font-semibold uppercase tracking-wide">
              Truly Custom Diamond
            </p>
            <h2 className="text-4xl md:text-5xl xl:text-6xl 4xl:text-7xl font-castoro font-semibold">
              Custom jewelry
            </h2>

            <div className="mt-4 flex flex-col md:flex-row gap-6">
              <LinkButton
                href="/custom-jewelry-form"
                className="!text-white !uppercase !font-medium w-fit !py-6 !bg-baseblack !text-base hover:!border-[#202A4E] hover:!bg-transparent hover:!text-baseblack !border-black !border !rounded-none"
              >
                Start Creating
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40 flex">
          <div className="flex items-center gap-4 px-6 xss:justify-between container py-2">
            <p className="hidden xss:block text-3xl font-semibold">
              Custom Jewelry
            </p>
            <div className="hidden lg:flex gap-3 font-medium text-black">
              <div className="flex gap-1.5 items-center">
                <span className="text-4xl 2xl:text-5xl text-gray-66 font-semibold">
                  1
                </span>
                <h4 className="text-xs 2xl:text-sm">
                  Describe Your <br /> Custom Jewelry
                </h4>
              </div>
              <CustomImg
                srcAttr={breadCrumb}
                className="w-24"
                altAttr=""
                titleAttr=""
              />
              <div className="flex gap-1.5 items-center">
                <span className="text-4xl 2xl:text-5xl text-gray-66 font-semibold">
                  2
                </span>
                <h4 className="text-xs 2xl:text-sm">
                  Upload Reference <br /> Images
                </h4>
              </div>
              <CustomImg
                srcAttr={breadCrumb}
                className="w-24"
                altAttr=""
                titleAttr=""
              />
              <div className="flex gap-1.5 items-center">
                <span className="text-4xl 2xl:text-5xl text-gray-66 font-semibold">
                  3
                </span>
                <h4 className="text-xs 2xl:text-sm">Review & Submit</h4>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mx-auto xss:mx-0">
              <LinkButton
                href="/custom-jewelry-form"
                className="!text-white !uppercase !font-medium  w-fit !py-6 !bg-baseblack !text-base hover:!border-[#202A4E] hover:!bg-transparent hover:!text-baseblack !border-black !border !rounded-none"
              >
                Start Creating
              </LinkButton>
            </div>
          </div>
        </div>
      )}
      <section className="pt-12 md:pt-16 xl:pt-20 container">
        <div className=" mx-auto justify-center flex text-center">
          <p className="text-sm md:text-base lg:text-lg mx-auto lg:w-[80%]">
            Our expert craftspeople will recreate the necklace you’re seeking,
            based on a sketch, photo or reference. From imagination to reality
            in as little as 14 days. If you can dream it, we’ll create it.
          </p>
        </div>
      </section>
      <section className="pt-12 md:pt-16 xl:pt-20 container mx-auto px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-baseblack font-castoro font-medium text-2xl md:text-3xl lg:text-4xl uppercase">
            The Journey
          </h2>
        </div>

        <CustomJewelryCommon
          imageSrc={customJewelry1}
          imageAlt="Custom Jewelry Step"
          step="Step One"
          title="Describe Your Custom Jewelry"
          description="Provide details such as gold karat and color, desired timeframe for completion, type of jewelry (ring, pendant, etc.), materials (diamond, solid gold, enamel, etc.), and your budget."
          imageOnRight={false} // or true if you want image on right
        />
      </section>
      <section className="pt-10 md:pt-12 xl:pt-16 container mx-auto px-4">
        <CustomJewelryCommon
          imageSrc={customJewelry2}
          imageAlt="Custom Jewelry Step"
          step="Step Two"
          title="Upload Reference Images"
          description="Upload any reference images for the design of your custom jewelry."
          imageOnRight={true} // or true if you want image on right
        />
      </section>
      <section className="pt-10 md:pt-12 xl:pt-16 container mx-auto px-4">
        <CustomJewelryCommon
          imageSrc={customJewelry3}
          imageAlt="Custom Jewelry Step"
          step="Step three"
          title="Review & Submit"
          description="Double-check your details and submit your request for approval. We will contact you for confirmation within 24-48 hours."
          imageOnRight={false} // or true if you want image on right
        />
      </section>
      <section className="pt-10 md:pt-12 xl:pt-16 container mx-auto px-4 pb-12">
        <div className="flex border-b border-grayborder pb-10 text-lg" />
        <AccordionTabs
          tabs={accordianContent}
          forceResetKey="return"
          contentCustomClass="md:text-lg"
        />
      </section>
    </>
  );
};

export default CustomJewelryDetailPage;
