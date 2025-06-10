import HeroBanner from "@/components/ui/HeroBanner";
import banner from "@/assets/images/about-us/banner.webp";
import about1 from "@/assets/images/about-us/about-1.webp";
import about2 from "@/assets/images/about-us/about-2.webp";
import about3 from "@/assets/images/about-us/about-3.webp";
import about4 from "@/assets/images/about-us/about-4.webp";
import about5 from "@/assets/images/about-us/about-5.webp";
import about6 from "@/assets/images/about-us/about-6.webp";
import about7 from "@/assets/images/about-us/about-7.webp";
import about8 from "@/assets/images/about-us/about-8.webp";
import about9 from "@/assets/images/about-us/about-9.webp";
import about10 from "@/assets/images/about-us/about-10.webp";

import { AnimatedSection, CustomImg } from "@/components/dynamiComponents";
import { LinkButton } from "@/components/ui/button";
import Link from "next/link";
import { helperFunctions } from "@/_helper";

const animatedContent = [
  {
    img: about1,
    titleAttr: "",
    direction: "RTF",
    altAttr: "",
    title: "Ethical luxury: Our promise",
    description: [
      "Lab-grown diamonds are structurally, chemically, and visually identical to natural stones, all without the ethical or environmental effects of mining. But we’ve taken it one step further. From production to packaging, we are on a continuous journey toward sustainability. Our diamonds are 100% conflict-free, we use 96% recycled gold, and we aim to be 100% recycled gold by 2025, and our packaging is made from 100% recyclable materials.",
      "To learn more about our commitment and path toward sustainability check out our 2023 Sustainability Report Clickhereto open a Sustainability Report in a new webpage.",
    ],

    imgClassName: "lg:!h-[100vh] h-auto w-auto",
    descriptionClassName: "!text-sm lg:!text-sm",
    titleClassName: "!text-2xl xl:!text-3xl lg:!w-[50%] 2xl:!w-[35%]",
  },
  {
    img: about3,
    titleAttr: "",
    direction: "LTR",
    altAttr: "",
    title: "Brilliantly-Set: Our Designs",
    description: [
      "No two people are the same, and only they know what styles make them shine the brightest",
      "Our premade collections are designed by hand, featuring a modern take on classic styles. And our custom pieces are truly custom: from the diamond to the setting, our expert craftspeople will create a stunning piece to exactly your specifications. Because your jewelry should represent you, no one else.",
      "These are diamonds that deserve you.",
    ],
    imgClassName: "lg:!h-full h-auto w-auto",
    descriptionClassName: "!text-sm lg:!text-sm",
    titleClassName: "!text-2xl xl:!text-3xl",
  },
];

const exploreCards = [
  {
    src: about5,
    alt: "Diamond Education",
    label: "Diamond Education",
    href: "/about-us",
  },
  {
    src: about6,
    alt: "Discover Our Blog",
    label: "Discover Our Blog",
    href: "/about-us",
  },
  {
    src: about7,
    alt: "Visit A Store",
    label: "Visit A Store",
    href: "/about-us",
  },
  {
    src: about8,
    alt: "CK Logo",
    label: "Join The KO Team",
    isLogo: true,
    href: "/about-us",
  },
];

const shopSections = [
  {
    href: "/about-us",
    src: about9,
    alt: "Shop Jewelry",
    label: "SHOP JEWELRY",
  },
  {
    href: "/about-us",
    src: about10,
    alt: "Shop Collections",
    label: "SHOP COLLECTIONS",
  },
];
const sustainabilityFeatures = [
  "Carbon-Neutral <br /> Diamond Labs",
  "Fully-Recyclable <br /> Packaging",
  "Recycled <br /> Gold",
];

export default function AboutPage() {
  return (
    <>
      <HeroBanner
        imageSrc={banner}
        title={"About Us."}
        description={"Celebrating Every Shade of You"}
        isStaticBanner={true}
        altAttr=""
        titleAttr=""
        textAlignment="left"
        customClass="text-!left !justify-left !pl-12"
      />
      <section className="mt-12 lg:mt-16 flex flex-col gap-8 container text-sm">
        <p>
          Diamonds are a celebration, a memento of life’s most brilliant
          moments. The jewelry that represents you should be every bit as
          elegant and unique as yourself. So, that’s what we created - 100%
          conflict-free, lab-grown diamonds, brilliantly set in a range of
          classic designs, modern styles, and design-your-own options to reflect
          your individuality and celebrate your uniqueness.
        </p>
        <p>
          We truly believe that diamonds are personal. They express your style,
          represent your values, and tell your story. Express yourself with
          Grown Brilliance, where we don’t just create diamonds, we create
          diamonds that deserve you
        </p>
      </section>
      <section className="mt-16 lg:mt-20 container">
        <AnimatedSection
          img={animatedContent[0]?.img}
          titleAttr={animatedContent[0]?.titleAttr}
          altAttr={animatedContent[0]?.altAttr}
          title={animatedContent[0]?.title}
          description={animatedContent[0]?.description}
          pointsDescription={animatedContent[0]?.pointsDescription}
          points={animatedContent[0]?.points}
          direction={animatedContent[0]?.direction}
          imgClassName={animatedContent[0]?.imgClassName}
          titleClassName={animatedContent[0]?.titleClassName}
          descriptionClassName={animatedContent[0]?.descriptionClassName}
        />
      </section>

      <section className="mt-12 lg:mt-20 container 2xl:px-24 4xl:px-32">
        <div className="flex flex-col xxs:flex-row divide-y xxs:divide-y-0 xxs:divide-x divide-black">
          {sustainabilityFeatures.map((text, index) => (
            <div
              key={index}
              className="flex-1 py-6 lg:py-8 text-center"
              dangerouslySetInnerHTML={{
                __html: `<p class='text-lg md:text-xl 2xl:text-2xl 4xl:text-3xl font-castoro tracking-wid'>${text}</p>`,
              }}
            />
          ))}
        </div>
      </section>

      <section className="-mt-24 3xl:-mt-12">
        <div className="container mx-auto px-4">
          <div className="relative w-auto h-72 sm:h-96 max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1250px] 4xl:max-w-[1500px] lg:h-[80vh] top-40 px-12 container">
            <CustomImg
              src={about2}
              alt="A person standing in an office setting"
              fill
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="border-baseblack xs:border pt-48 sm:pt-60 pb-20">
            <div className="mx-auto justify-center grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1250px] 4xl:max-w-[1500px]">
              <div className="w-full ">
                <h2 className="text-2xl 2xl:text-3xl font-castoro text-gray-800 leading-tight">
                  Classically-Inspired. Our Story
                </h2>
              </div>
              <div className="w-full">
                <p className="text-sm leading-relaxed">
                  Grown with love by Nourish Farms, this 1.5 ct. pear-shaped
                  diamond is a celebration of sustainable luxury. Inspired by
                  the terroir of the Okanagan Valley, its brilliance mirrors the
                  region’s sunlit landscapes, transformed through cutting-edge
                  innovation into a timeless gem that radiates elegance and
                  environmental responsibility.
                </p>
                <p className="text-sm leading-relaxed">
                  As the only global luxury brand founded by a 5th generation
                  farming family, Nourish Farms is proud to cultivate 100%
                  carbon-neutral diamonds. Grown in Canada, we are committed to
                  bringing you ethically sourced, sustainable luxury that you
                  can feel good about.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 lg:mt-16 container">
        <AnimatedSection
          img={animatedContent[1]?.img}
          titleAttr={animatedContent[1]?.titleAttr}
          altAttr={animatedContent[1]?.altAttr}
          title={animatedContent[1]?.title}
          description={animatedContent[1]?.description}
          pointsDescription={animatedContent[1]?.pointsDescription}
          points={animatedContent[1]?.points}
          direction={animatedContent[1]?.direction}
          imgClassName={animatedContent[1]?.imgClassName}
          titleClassName={animatedContent[1]?.titleClassName}
          descriptionClassName={animatedContent[1]?.descriptionClassName}
        />
      </section>

      <section className="relative w-full h-[90vh] md:h-[80vh] lg:h-[70vh] mt-12 lg:mt-20">
        <CustomImg
          src={about4}
          alt="Sustainability Report"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 md:px-20 lg:px-16">
          <div className="max-w-xl text-white">
            <p className="text-sm uppercase tracking-wider font-semibold mb-2 xl:mb-4 4xl:mb-6">
              Our 2023
            </p>
            <h1 className="text-4xl md:text-5xl 4xl:text-6xl font-medium leading-tight mb-4 4xl:mb-6 font-castoro">
              Sustainability <br /> report
            </h1>
            <p className="text-sm md:text-sm mb-6">
              Grown Brilliance is very proud to be carbon neutral. Our
              commitment to the environment is important to us, and while proud
              of this milestone, there is always more work to be done. Head to
              our report for more about continued environmental commitments.
            </p>
            <LinkButton className="!rounded-none !bg-transparent !w-fit !uppercase !text-sm">
              Read Full Report
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="pt-12 sm:pt-16 lg:pt-20">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide mb-8">
          Explore More
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {exploreCards.map(({ src, alt, label, isLogo }) => (
            <Link href={src} key={helperFunctions?.generateUniqueId()}>
              <div className="group relative hover:opacity-90 transition border border-black hover:cursor-pointer">
                {isLogo ? (
                  <div
                    className={`w-full h-[550px] flex items-center justify-center`}
                  >
                    <CustomImg
                      src={src}
                      alt={alt}
                      className="w-full h-[550px] object-cover"
                    />
                  </div>
                ) : (
                  <CustomImg
                    src={src}
                    alt={alt}
                    className="w-full h-[550px] object-cover"
                  />
                )}

                <div className="relative text-center py-8 lg:py-12 text-sm font-semibold">
                  <span className="relative inline-block after:block after:h-[1.5px] after:bg-black after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                    {label}
                  </span>
                  <span className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-12 lg:pt-20 container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto px-4">
          {shopSections.map(({ href, src, alt, label }, index) => (
            <Link
              key={index}
              href={href}
              className="relative group block overflow-hidden"
            >
              <CustomImg
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 text-white text-lg tracking-wide font-bold">
                {label}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
