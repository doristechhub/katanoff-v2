import HeroBanner from "@/components/ui/HeroBanner";
import banner from "@/assets/images/about-us/banner.webp";
import ringImage from "@/assets/images/about-us/ringImage.webp";
import craftingImage from "@/assets/images/about-us/craftingImage.webp";
import diamondImage from "@/assets/images/about-us/diamondImage.webp";
import tranperencyImg from "@/assets/images/about-us/transperency.webp";
import SustainImg from "@/assets/images/about-us/sustainability.webp";
import Compassion from "@/assets/images/about-us/compassion.webp";
import Inclusion from "@/assets/images/about-us/inclusion.webp";

import { AnimatedSection, CustomImg } from "@/components/dynamiComponents";
import GiftCollections from "@/components/ui/GiftCollections";

const aboutUsContent = [
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
        imageSrc={banner}
        title={"About Us"}
        description={"Celebrating Every Shade of You"}
        isStaticBanner={true}
        altAttr=""
        titleAttr=""
      />

      <div className="mt-16 lg:mt-28">
        {aboutUsContent.map((content, index) => (
          <AnimatedSection
            key={index}
            img={content.img}
            titleAttr={content.titleAttr}
            altAttr={content.altAttr}
            title={content.title}
            description={content.description}
            pointsDescription={content.pointsDescription}
            points={content.points}
            direction={content.direction}
          />
        ))}
      </div>

      <section className="bg-alabaster py-0.3 px-2 sm:px-8 lg:px-5 mb-20 lg:mt-36 text-baseblack xxs:mt-14 leading-relaxed 2xl:pt-10">
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
            <div key={index} className="text-center lg:text-start">
              <CustomImg
                srcAttr={pillar.img}
                altAttr={pillar.altAttr}
                titleAttr={pillar.titleAttr}
              />
              <h3 className="text-2xl 2xl:text-3xl font-chong-modern py-3">
                {pillar.title}
              </h3>
              <p className="font-medium text-base 2xl:text-base">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Jewelry Collection Section */}
      <GiftCollections />
    </>
  );
}
