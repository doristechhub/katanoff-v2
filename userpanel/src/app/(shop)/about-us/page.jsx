import aboutUsDesktop from "@/assets/images/about-us/about-us-desktop.webp";
import aboutUsMobile from "@/assets/images/about-us/about-us-mobile.webp";
import about1 from "@/assets/images/about-us/about-1.webp";
import ringImage from "@/assets/images/about-us/ringImage.webp";
import diamondImage from "@/assets/images/about-us/diamondImage.webp";
import tranperencyImg from "@/assets/images/about-us/transperency.webp";
import SustainImg from "@/assets/images/about-us/sustainability.webp";
import Compassion from "@/assets/images/about-us/compassion.webp";
import Inclusion from "@/assets/images/about-us/inclusion.webp";
import {
  AboutUsCollectionToggle,
  AnimatedSection,
  HeroBanner,
} from "@/components/dynamiComponents";
import { PAGE_CONSTANTS } from "@/_helper";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import CustomImg from "@/components/ui/custom-img";

const aboutUsContent = [
  {
    img: about1,
    altAttr: PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].alt,
    titleAttr: PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].title,
    direction: "RTF",
    title: "Luxury with Integrity",
    description: [
      "At Katanoff, we believe true luxury should be as responsible as it is beautiful. Our promise begins with how we source and continues through every stage of craftsmanship. Each piece is crafted using lab-grown diamonds that are chemically and visually identical to mined ones, yet have a significantly lighter environmental impact. By choosing sustainable and conscious materials, we embrace a vision of beauty that honors not only the wearer but also the world we share.",
      "Our jewelry is designed to make you feel confident, proud, and connected to your values. With uncompromising attention to detail, artistry, and design, every Katanoff creation reflects refined taste and modern responsibility. To us, luxury is not just about brilliance it’s about meaning. That is why our definition of luxury is thoughtful, ethical, and timeless in its beauty.",
    ],
  },
  {
    img: ringImage,
    direction: "LTR",
    altAttr: PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].alt,
    titleAttr: PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].title,
    title: "Our Beginning",
    description: [
      "Katanoff began with a simple belief: luxury can be both beautiful and responsible. Frustrated by the compromises often found in traditional fine jewelry, we set out to create a brand where ethics and elegance go hand in hand. Inspired by the possibilities of lab-grown diamonds, we envisioned a new kind of luxury one that aligns with modern values without sacrificing quality or style.",
      "What started as a vision has grown into a collection of timeless pieces made for those who care about what they wear and how it's made. Every Katanoff design is a reflection of our journey rooted in craftsmanship, shaped by innovation, and driven by purpose. We’re proud to offer jewelry that feels as good as it looks because doing good is always in style.",
    ],
  },
  {
    img: diamondImage,
    altAttr: PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].alt,
    titleAttr: PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].title,
    direction: "RTL",
    title: "Our Value",
    points: [
      {
        title: "1. Ethical Sourcing",
        description:
          "We exclusively use lab-grown diamonds, offering the same brilliance as mined stones without the environmental or ethical cost.",
      },
      {
        title: "2. Conscious Luxury",
        description:
          "Our designs combine timeless elegance with modern responsibility. Sustainability isn’t a trend, it’s our foundation.",
      },
      {
        title: "3. True Craftsmanship",
        description:
          "Every piece is carefully crafted by skilled artisans, with attention to detail, quality, and durability that lasts.",
      },
      {
        title: "4. Meaningful Design",
        description:
          "We create jewelry that tells your story elevated, intentional, and made to celebrate who you are.",
      },
      {
        title: "5. Timeless Over Trend",
        description:
          "Katanoff is not about fast fashion. We design pieces that transcend seasons and stay with you for life.",
      },
    ],
  },
];

const missionPillars = [
  {
    title: "Pure Intent",
    img: tranperencyImg,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    description:
      "Every piece begins with a purpose crafted to reflect values, not just beauty.",
  },
  {
    title: "Mindful Making",
    img: SustainImg,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    description:
      "From lab-grown diamonds to lasting design, we create with care for people and planet.",
  },
  {
    title: "Elevated Standards",
    img: Compassion,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    description:
      "We hold ourselves to the highest level of quality, ethics, and precision.",
  },
  {
    title: "Lasting Connection",
    img: Inclusion,
    altAttr:
      "lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff",
    titleAttr: "Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York",
    description:
      "Our jewelry is made to mean something pieces that stay with you, always.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeroBanner
        staticSrcMobile={aboutUsMobile}
        staticSrcDesktop={aboutUsDesktop}
        isStaticBanner={true}
        altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].alt}
        titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ABOUT_US].title}
        textAlignment="left"
        customClass="text-!left !justify-left !pl-12"
      />
      <section className="mt-12 lg:mt-16 flex flex-col gap-4 text-center container text-base lg:text-lg">
        <p>
          Welcome to Katanoff a world where timeless elegance meets modern
          values. Born from a desire to offer beauty without compromise,
          Katanoff is committed to crafting high-end jewelry that reflects both
          style and purpose. We believe luxury should feel personal,
          responsible, and lasting.
        </p>
        <p>
          Our pieces are designed using only premium lab-grown diamonds,
          offering the same brilliance, structure, and sparkle as mined stones
          without the ethical or environmental toll. Each creation is
          thoughtfully brought to life by skilled artisans who understand that
          true craftsmanship lies in the details.
        </p>
        <p>
          At Katanoff, jewelry isn’t just something you wear it’s a part of your
          story. Whether you're celebrating a milestone or simply treating
          yourself, we’re here to make sure every piece feels as meaningful as
          it looks. Because you deserve luxury that’s beautiful inside and out.
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

      <section className="bg-alabaster py-0.3 px-2 sm:px-8 lg:px-5 lg:mt-24 text-baseblack xxs:mt-12 md:mt-16 leading-relaxed 2xl:pt-10">
        <div className="text-center max-w-4xl px-2 mx-auto py-2">
          <h2 className="text-3xl lg:text-4xl 2xl:text-5xl mb-4 mt-10 lg:mt-12 font-chong-modern">
            What We Stand For
          </h2>
          <p className="font-medium sm:mb-0 xxs:mb-4 lg:mb-0">
            More than just jewelry, Katanoff is built on values that shape every
            design, decision, and detail we deliver.
          </p>
        </div>

        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 py-10 lg:py-20 2xl:py-16">
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
              <h3 className="text-2xl 2xl:text-3xl font-gelasio py-3">
                {pillar.title}
              </h3>
              <p className="font-medium text-base 2xl:text-base">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-12 lg:pt-20">
        <AboutUsCollectionToggle />
      </section>
    </>
  );
}
