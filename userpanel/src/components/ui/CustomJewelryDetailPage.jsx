"use client";
import { useEffect, useRef, useState } from "react";
import bannerDesktop from "@/assets/images/custom-jewelry/custom-jewelry-hero-desktop.webp";
import bannerMobile from "@/assets/images/custom-jewelry/custom-jewelry-hero-mobile.webp";
import customJewelry4 from "@/assets/images/custom-jewelry/custom-jewelry-4.webp";
import customJewelry9 from "@/assets/images/custom-jewelry/custom-jewelry-9.webp";
import customJewelry10 from "@/assets/images/custom-jewelry/custom-jewelry-10.webp";
import customJewelry11 from "@/assets/images/custom-jewelry/custom-jewelry-11.webp";
import customJewelry16 from "@/assets/images/custom-jewelry/custom-jewelry-16.webp";
import customJewelry19 from "@/assets/images/custom-jewelry/custom-jewelry-19.webp";
import customJewelry20 from "@/assets/images/custom-jewelry/custom-jewelry-20.webp";
import customJewelry21 from "@/assets/images/custom-jewelry/custom-jewelry-21.webp";
import { AccordionTabs, CustomImg } from "@/components/dynamiComponents";
import { LinkButton } from "@/components/ui/button";
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
            Transform your imagination into a one of a kind necklace that
            reflects your personal style and story. Whether you envision a
            minimalist gold pendant or a detailed diamond-studded design, our
            artisans bring your ideas to life with precision and care. With
            endless customization options, you're free to choose every detail
            from metal type to gemstone arrangement and craft a piece that’s
            truly yours.
          </p>
        </div>
      </>
    ),
  },
];

const step1Images = [
  {
    image: customJewelry4,
    title: "",
    alt: "",
  },
  {
    image: customJewelry9,
    title: "",
    alt: "",
  },
  {
    image: customJewelry10,
    title: "",
    alt: "",
  },
  {
    image: customJewelry11,
    title: "",
    alt: "",
  },
];

const CustomJewelryDetailPage = () => {
  const sectionRef = useRef(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
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
      <section ref={sectionRef} className="relative">
        <CustomImg
          src={bannerMobile}
          alt="Custom Jewelry"
          className="w-full h-full lg:hidden"
        />
        <CustomImg
          src={bannerDesktop}
          alt="Custom Jewelry"
          className="w-full h-full lg:block hidden"
        />

        <div className="top-[5%] absolute w-full h-full flex items-center justify-start px-6 md:px-16">
          <div className="text-baseblack flex flex-col gap-2 md:gap-4">
            <p className="text-base font-semibold uppercase tracking-wide">
              Truly Custom Diamond
            </p>
            <h2 className="text-4xl md:text-5xl xl:text-6xl 4xl:text-7xl font-castoro font-semibold">
              Custom jewelry
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              <LinkButton
                href="/custom-jewelry-form"
                className="!text-white !uppercase !font-medium w-fit !py-4 md:!py-6 !bg-baseblack !text-base hover:!border-[#202A4E] hover:!bg-transparent hover:!text-baseblack !border-black !border !rounded-none"
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

      <section className="pt-16 xl:pt-20 2xl:pt-28 container mx-auto px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-baseblack font-castoro font-medium text-3xl md:text-4xl lg:text-5xl 2xl:text-5xl 4xl:text-6xl uppercase">
            The Journey
          </h2>
        </div>
        <div className=" mx-auto justify-center flex text-center pt-4 xs:pt-6">
          <p className="text-sm lg:text-md mx-auto lg:w-[70%] 2xl:w-[60%]">
            Our expert craftspeople will recreate the necklace you’re seeking,
            based on a sketch, photo or reference. From imagination to reality
            in as little as 14 days. If you can dream it, we’ll create it.
          </p>
        </div>
      </section>

      <section className="relative pt-16 sm:pt-20 lg:pt-24 2xl:pt-32">
        <h2 className="hidden sm:block absolute top-10 lg:top-28 left-[42%] lg:left-1/2 -translate-x-1/2 text-6xl md:text-8xl 2xl:text-9xl font-extrabold text-whitesmoke z-0">
          STEP ONE
        </h2>

        <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-10">
          <div className="flex xss:flex-row sm:flex-col gap-4 justify-center items-center">
            {[0, 2].map((startIndex) => (
              <div key={startIndex} className="flex gap-4">
                {step1Images
                  .slice(startIndex, startIndex + 2)
                  .map((item, i) => (
                    <div
                      key={i + startIndex}
                      className="w-12 xxs:w-16 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 aspect-square overflow-hidden hover:scale-105 transition bg-[#F6F5F0] rounded-md"
                    >
                      <CustomImg
                        srcAttr={item.image}
                        altAttr={item.alt}
                        className="object-contain w-full h-full p-1 lg:p-4"
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="relative sm:hidden">
            <h2 className="absolute top-10 translate-x-[10%] xss::translate-x-[25%] xs:translate-x-[40%] -translate-y-1/2 text-4xl xxs:text-6xl font-extrabold text-whitesmoke z-0">
              STEP ONE
            </h2>
            <div className="relative z-10">
              <CustomImg
                srcAttr={customJewelry16}
                altAttr="Ring"
                className="w-96 h-auto mx-auto"
              />
            </div>
          </div>

          <div className="hidden sm:block">
            <CustomImg
              srcAttr={customJewelry16}
              altAttr="Ring"
              className="w-[320px] md:h-[350px] lg:w-[350px] lg:h-[400px] xl:h-[450px] 2xl:w-[454px] 2xl:h-[544px] mx-auto"
            />
          </div>

          <div className="sm:max-w-md text-center sm:text-left">
            <h3 className="text-xl lg:text-3xl xl:text-4xl mb-4 font-castoro">
              Describe Your Custom Jewelry
            </h3>
            <p className="text-sm lg:text-base 2xl:text-xl text-baseblack font-semibold">
              Provide details such as gold karat and color, desired timeframe
              for completion, type of jewelry (ring, pendant, etc.), materials
              (diamond, solid gold, enamel, etc.), and your budget.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 md:mt-20 xl:mt-20 2xl:mt-24 pt-12 sm:pt-24 lg:pt-24 xl:pt-28 pb-8 sm:pb-16 lg:pb-20 xl:pb-24 bg-[#F2F2F2]">
        <h2 className="sm:hidden text-5xl xxs:text-6xl xs:text-7xl px-4 font-extrabold text-whitesmoke">
          STEP TWO
        </h2>
        <div className="relative grid grid-cols-1 md:grid-cols-[35%_65%]  mx-auto container px-4 lg:px-8 gap-8">
          <h2 className="hidden sm:block absolute -top-8 md:-top-6 left-8 text-7xl lg:text-8xl 2xl:text-9xl tracking-wide  font-extrabold text-whitesmoke">
            STEP TWO
          </h2>
          <div className="hidden md:flex flex-col justify-between relative pl-8">
            <div className="z-10 relative mt-32 lg:mt-40 xl:mt-52">
              <h3 className="text-xl lg:text-3xl xl:text-4xl mb-4 font-castoro">
                Upload Reference Images
              </h3>
              <p className="text-sm lg:text-base 2xl:text-xl text-baseblack font-semibold max-w-md">
                Upload any reference images for the design of your custom
                jewelry.
              </p>
            </div>
          </div>
          <div className="relative">
            <CustomImg
              src={customJewelry19}
              alt="Custom Jewelry Step"
              className="hidden sm:block w-full h-auto"
            />
            <CustomImg
              src={customJewelry20}
              alt="Custom Jewelry Step Mobile"
              className="block sm:hidden w-full h-auto"
            />
          </div>

          <div className="md:hidden">
            <h3 className="text-xl lg:text-3xl xl:text-4xl mb-4 font-castoro">
              Upload Reference Images
            </h3>
            <p className="text-sm lg:text-base 2xl:text-xl text-baseblack font-semibold mb-6">
              Upload any reference images for the design of your custom jewelry.
            </p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 pt-12 xl:pt-20 4xl:pt-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl xxs:text-5xl md:text-6xl xl:text-7xl 4xl:text-8xl font-extrabold text-whitesmoke">
            STEP THREE
          </h2>
          <div className="flex flex-col items-center pt-6 lg:pt-8">
            <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-castoro mb-4 text-baseblack">
              Review & Submit
            </h3>
            <p className="text-sm md:text-base xl:text-lg 2xl:text-xl text-baseblack font-semibold max-w-3xl mx-auto">
              Double-check your details and submit your request for approval. We
              will contact you for confirmation within 24-48 hours.
            </p>
          </div>
        </div>
        <div className="flex justify-center pt-6">
          <CustomImg
            src={customJewelry21}
            alt="Custom Jewelry Step Three"
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      <section className="pt-2 md:pt-12 xl:pt-16 4xl:pt-20 container mx-auto px-4 pb-12">
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
