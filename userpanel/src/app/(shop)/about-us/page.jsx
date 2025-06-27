import HeroBanner from "@/components/ui/HeroBanner";
import aboutUsDesktop from "@/assets/images/about-us/about-us-desktop.webp";
import aboutUsMobile from "@/assets/images/about-us/about-us-mobile.webp";
import about1 from "@/assets/images/about-us/about-1.webp";
import about2 from "@/assets/images/about-us/about-2.webp";
import about9 from "@/assets/images/about-us/about-9.webp";
import about10 from "@/assets/images/about-us/about-10.webp";
import ringImage from "@/assets/images/about-us/ringImage.webp";
import craftingImage from "@/assets/images/about-us/craftingImage.webp";
import diamondImage from "@/assets/images/about-us/diamondImage.webp";
import tranperencyImg from "@/assets/images/about-us/transperency.webp";
import SustainImg from "@/assets/images/about-us/sustainability.webp";
import Compassion from "@/assets/images/about-us/compassion.webp";
import Inclusion from "@/assets/images/about-us/inclusion.webp";
import { AnimatedSection, CustomImg } from "@/components/dynamiComponents";
import Link from "next/link";
import { FLASH_DEALS, helperFunctions } from "@/_helper";

const aboutUsContent = [
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
  },
  {
    img: ringImage,
    titleAttr: "",
    direction: "LTR",
    altAttr: "",
    title: "Our Beginning",
    description: [
      "Jewelry Is More Than Adornment—It’s A Story, A Legacy, A Timeless Connection To Moments That Matter. Our Journey Began With A Passion For Exquisite Craftsmanship And A Love For The Artistry That Turns Precious Metals And Gemstones Into Wearable Treasures.From The Very Beginning, We Set Out To Redefine Elegance, Sourcing Only The Finest Materials And Working With Master Artisans To Create Jewelry That Is Both Luxurious And Enduring. Each Piece In Our Collection Is A Testament To Our Commitment To Quality, Innovation, And Timeless Beauty.",

      "Welcome To Katanoff, Where Craftsmanship Meets Emotion, And Every Piece Of Jewelry Tells A Story. Founded During A Time Of Global Change, We Set Out To Revolutionize How Jewelry Is Experienced Online. Rooted In A Legacy Of Craftsmanship Yet Driven By A Spirit Of Innovation, Katanoff Blends Tradition With Modernity, Creating Timeless Pieces For Every Milestone In Life.",
    ],
  },
  {
    img: craftingImage,
    titleAttr: "",
    altAttr: "",
    direction: "RTL",
    title: "From Legacy To Innovation",
    description: [
      "For Over 10 Years, A Family Deeply Rooted In Jewelry Craftsmanship Has Been Creating Timeless Pieces, Serving Communities Through Offline Stores And Wholesale Operations. During The Pandemic, When The World Came To A Standstill, Their Passion For Connection And Innovation Sparked A New Chapter.",
      "In 2020, Amidst The Challenges Of Lockdown, Katanoff Was Born To Bring Generations Of Expertise And Artistry Directly To Customers’ Homes. Designed As An Online Platform, It Offers Fine Jewelry With The Comfort And Safety Of Shopping From Home—Without Compromising On Quality Or Craftsmanship.",
      "As A Family-Run Operation, Katanoff Ensures Every Piece Reflects A Legacy Of Trust, Meticulous Attention To Detail, And Strong Values. With No Middlemen, Customers Benefit From Better Prices, Ethical Practices, And A Dedication To Excellence Honed Over Decades. Today, Katanoff Bridges Tradition And Modern Convenience, Celebrating Life’s Most Cherished Moments With Jewelry Crafted From The Heart.",
    ],
  },
  {
    img: diamondImage,
    titleAttr: "",
    altAttr: "",
    title: "Our Value",
    pointsDescription: "Rooted in Tradition, Inspired by Tomorrow",
    points: [
      {
        title: "Innovation",
        description:
          "We Embrace Technology To Redefine How You Experience Jewelry Online.",
      },
      {
        title: "Transparency",
        description:
          "From Materials To Pricing, We Believe In Complete Honesty.",
      },
      {
        title: "Connection",
        description:
          "Every Design Fosters A Connection—Between You And Your Cherished Moments, And Between Us And Our Community.",
      },
    ],
  },
];

const shopSections = [
  {
    href: "/collections/categories/Jewelry",
    src: about9,
    alt: "Shop Jewelry",
    label: "SHOP JEWELRY",
  },
  {
    href: `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
      FLASH_DEALS
    )}`,
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

const missionPillars = [
  {
    title: "Transparency",
    img: tranperencyImg,
    altAttr: "",
    titleAttr: "",
    description:
      "We know where our precious metals and gemstones come from and how our jewelry is made.",
  },
  {
    title: "Sustainability",
    img: SustainImg,
    altAttr: "",
    titleAttr: "",
    description:
      "We use recycled and sustainable materials, apply energy-efficient practices, and minimize our carbon footprint.",
  },
  {
    title: "Compassion",
    img: Compassion,
    altAttr: "",
    titleAttr: "",
    description:
      "We care about and are committed to our communities, our employees, and the people who help to bring our jewelry to life.",
  },
  {
    title: "Inclusion",
    img: Inclusion,
    altAttr: "",
    titleAttr: "",
    description:
      "We support and invest in our diverse teams to ensure every employee knows that they belong, and our designs are always crafted with inclusivity in mind..",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeroBanner
        staticSrcMobile={aboutUsMobile}
        staticSrcDesktop={aboutUsDesktop}
        isStaticBanner={true}
        altAttr=""
        titleAttr=""
        textAlignment="left"
        customClass="text-!left !justify-left !pl-12"
      />
      <section className="mt-12 lg:mt-16 flex flex-col gap-4 text-center container text-base lg:text-lg">
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

      <div className="mt-16 lg:mt-28 container">
        {aboutUsContent.map((content, index) => (
          <AnimatedSection
            key={index}
            img={content?.img}
            titleAttr={content?.titleAttr}
            altAttr={content?.altAttr}
            title={content?.title}
            description={content?.description}
            pointsDescription={content?.pointsDescription}
            points={content?.points}
            direction={content?.direction}
          />
        ))}
      </div>

      <section className="-mt-36 sm:-mt-24 3xl:-mt-12">
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
          <div className="border-baseblack xs:border pt-48 sm:pt-48 pb-10 md:pb-12">
            <div className="mx-auto justify-center grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1250px] 4xl:max-w-[1500px]">
              <div className="w-full ">
                <h2 className="text-2xl 2xl:text-3xl font-castoro text-gray-800 leading-tight">
                  Classically-Inspired. Our Story
                </h2>
              </div>
              <div className="w-full flex flex-col gap-2">
                <p className="text-sm lg:text-base leading-relaxed">
                  Grown with love by Nourish Farms, this 1.5 ct. pear-shaped
                  diamond is a celebration of sustainable luxury. Inspired by
                  the terroir of the Okanagan Valley, its brilliance mirrors the
                  region’s sunlit landscapes, transformed through cutting-edge
                  innovation into a timeless gem that radiates elegance and
                  environmental responsibility.
                </p>
                <p className="text-sm lg:text-base leading-relaxed">
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

      <section className="bg-alabaster py-0.3 px-2 sm:px-8 lg:px-5 lg:mt-24 text-baseblack xxs:mt-12 md:mt-16 leading-relaxed 2xl:pt-10">
        <div className="text-center max-w-4xl px-2 mx-auto py-2">
          <h2 className="text-3xl lg:text-4xl 2xl:text-5xl mb-4 mt-10 lg:mt-12 font-chong-modern">
            Our Mission Pillars
          </h2>
          <p className="font-medium sm:mb-0 xxs:mb-4 lg:mb-0">
            Our Mission To Cultivate A More Transparent, Sustainable,
            Compassionate, And Inclusive Jewelry Industry Has Been At The Core
            Of Everything We Do From Day One. It’s In Our DNA.
          </p>
        </div>

        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 py-10 lg:py-20 2xl:py-24">
          {missionPillars.map((pillar, index) => (
            <div
              key={index}
              className="flex flex-col items-center md:items-start text-center lg:text-start"
            >
              <CustomImg
                srcAttr={pillar.img}
                altAttr={pillar.altAttr}
                titleAttr={pillar.titleAttr}
              />
              <h3 className="text-2xl 2xl:text-3xl font-castoro py-3">
                {pillar.title}
              </h3>
              <p className="font-medium text-base 2xl:text-base">
                {pillar.description}
              </p>
            </div>
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
