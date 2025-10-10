"use client";

import forever1 from "@/assets/images/blogs/forever-diamonds/forever-1.webp";
import foreverHero from "@/assets/images/blogs/forever-diamonds/forever-hero.webp";

import CustomImg from "../custom-img";
import { blogData, FOREVER_DIAMONDS } from "@/_utils/blogData";
import { AccordionTabs, BlogSwipper } from "@/components/dynamiComponents";
import TableOfContents from "../TableOfContents";
import Link from "next/link";
import { helperFunctions } from "@/_helper";

export default function ForeverDiamondsGiftPage() {
  const moreBlogs = blogData.filter(
    (x) => x.title?.toLowerCase() !== FOREVER_DIAMONDS?.toLowerCase()
  );
  const tocSections = [
    { id: "solitaire-diamond-rings", title: "Solitaire Diamond Rings" },
    { id: "diamond-bands", title: "Diamond Bands" },
    { id: "diamond-earrings", title: "Diamond Earrings" },
    { id: "diamond-bracelets", title: "Diamond Bracelets" },
    { id: "diamond-necklaces-pendants", title: "Diamond Necklaces & Pendants" },
    { id: "final-thought", title: "Final Thought" },
    { id: "faq", title: "FAQ" },
  ];

  const faqContent = [
    {
      label: "What makes Forever Diamonds unique?",
      content: (
        <div className="flex flex-col gap-3">
          <p>
            Forever Diamonds are crafted to be{" "}
            <b>timeless symbols of love and legacy</b>. Each piece is designed
            not just for beauty today, but to <b>last for generations</b>,
            carrying your story forward with unmatched brilliance and
            durability.
          </p>
        </div>
      ),
    },
    {
      label: "Are Forever Diamonds suitable for everyday wear?",
      content: (
        <div className="flex flex-col gap-3">
          <p>
            Absolutely. With their <b>exceptional hardness</b> and{" "}
            <b>careful craftsmanship</b>, Forever Diamonds are made to withstand
            daily life while retaining their elegance perfect for both everyday
            wear and life’s most cherished moments.
          </p>
        </div>
      ),
    },
    {
      label: "How do Forever Diamonds differ from regular diamonds?",
      content: (
        <div className="flex flex-col gap-4">
          <p>
            While all diamonds are beautiful, Forever Diamonds are hand-selected
            for their <b>unmatched quality, brilliance, and precision cut</b>.
            They’re designed to symbolize{" "}
            <b>enduring love, strength, and heritage</b> values that go beyond
            sparkle.
          </p>
        </div>
      ),
    },
    {
      label: "Why are Forever Diamonds considered heirloom worthy?",
      content: (
        <div className="flex flex-col gap-3">
          <p>
            Every Forever Diamond is crafted to <b>stand the test of time</b>.
            Their beauty doesn’t fade, making them ideal for passing down
            through <b>generations as a family treasure</b>. They’re not just
            jewelry they’re a lasting legacy.
          </p>
        </div>
      ),
    },
    {
      label: "Does Katanoff offer Forever Diamonds?",
      content: (
        <div className="flex flex-col gap-3">
          <p>
            Yes, <b>Katanoff</b> proudly offers Forever Diamonds that embody our
            values of <b>quality, authenticity, and timeless elegance</b>. Each
            diamond is carefully chosen to ensure it will{" "}
            <b>shine for you today and for generations to come</b>.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="mx-auto px-4 md:px-0 pt-12 xl:pt-16 2xl:pt-20 leading-relaxed xl:px-12 ">
        <section className="mb-8 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-6xl font-semibold mb-4  font-castoro leading-relaxed">
              The Legacy of Diamonds: Timeless Beauty for Generations
            </h1>
            <p className="pt-4 text-sm lg:text-base font-medium text-[#686868]">
              In the language of luxury, Forever Diamonds whisper eternity. With
              their unparalleled brilliance and enduring legacy, they stand as
              an exquisite, heartfelt gift that transcends time.
            </p>
          </div>

          <CustomImg
            src={foreverHero}
            titleAttr="Forever Diamond - Timeless Beauty Through Generations"
            altAttr="Classic diamond jewelry symbolizing a timeless legacy"
            className="lg:h-[80vh] md:w-[80%] object-cover mt-6 m-auto"
          />
        </section>

        <div className="mt-6 md:mt-10 xl:mt-12 2xl:mt-16 border-t border-grayborder" />
        <div className="grid lg:grid-cols-[75%_25%] gap-6 lg:gap-10  container1400 pt-8 md:pt-12 xl:pt-16 2xl:pt-20 ">
          <div>
            <section className="flex flex-col gap-4 text-[#686868]  text-sm lg:text-base">
              <p>
                Forever Diamonds are more than exquisite gems they're profound
                emblems of eternal love, resilience, and heritage. Here’s why
                they make an unparalleled gift for those who deserve something
                truly everlasting.
              </p>
              <p>
                Hand selected for superior cut, clarity, and fire, each Forever
                Diamond captures light in a way that defies the years. From
                engagements to legacy pieces, their legacy of brilliance makes
                them a cherished choice for any profound occasion.
              </p>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="solitaire-diamond-rings"
            >
              <CustomImg
                src={forever1}
                titleAttr="Forever Diamond - Timeless Beauty Through Generations"
                altAttr="Classic diamond jewelry symbolizing a timeless legacy"
                className="w-auto h-auto object-contain"
              />
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro  mt-6">
                Solitaire Diamond Rings
              </h2>
              <p className="text-[#686868]">
                A solitaire diamond ring is the epitome of timeless elegance,
                where a single Forever Diamond takes center stage, symbolizing
                unwavering commitment and pure devotion. At Katanoff, our
                solitaire rings are meticulously crafted to showcase the stone's
                inherent brilliance, with settings that enhance rather than
                overshadow its natural fire.
              </p>
              <p className="text-[#686868]">
                Perfect for proposals, anniversaries, or self-celebratory
                moments, these rings whisper promises of forever. Choose from
                classic round brilliants to fancy pear shapes, each one a beacon
                of enduring love that captures the heart's deepest sentiments.
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2 marker:text-baseblack">
                <li>
                  <span className="font-semibold text-baseblack">
                    Versatile Allure:
                  </span>{" "}
                  Effortlessly transitions from day to night.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Heirloom Potential:
                  </span>{" "}
                  Designed to be passed down with stories intact.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Customizable Comfort:
                  </span>{" "}
                  Tailored fits for lifelong wear.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="diamond-bands"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro ">
                Diamond Bands
              </h2>
              <p className="text-[#686868]">
                Diamond bands embody the quiet strength of unity, encircling the
                finger with a continuous ribbon of sparkling Forever Diamonds.
                Ideal for wedding vows or as stackable accents to your favorite
                pieces, these bands at Katanoff are a testament to shared
                journeys and unbreakable bonds.
              </p>
              <p className="text-[#686868]">
                With pavé settings that maximize sparkle or eternity styles for
                full circle symbolism, they offer subtle sophistication that
                builds over time. Gift a band that grows with the story simple,
                yet profoundly meaningful.
              </p>

              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2 marker:text-baseblack">
                <li>
                  <span className="font-semibold text-baseblack">
                    Layering Magic:
                  </span>{" "}
                  Mix and match for personalized expression.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Daily Durability:
                  </span>{" "}
                  Built to withstand the rhythm of life.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Eternal Symbolism:
                  </span>{" "}
                  A loop of light that never fades.
                </li>
              </ul>
            </section>

            <section
              className="space-y-4 mt-6 text-sm lg:text-base"
              id="diamond-earrings"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro  mt-0 md:mt-6">
                Diamond Earrings
              </h2>
              <p className="text-[#686868]">
                Diamond earrings frame the face with effortless grace, drawing
                the eye to smiles and whispers alike. Our Forever Diamond studs
                and drops at Katanoff illuminate every angle, turning ordinary
                conversations into moments of quiet splendor.
              </p>
            </section>

            <section className="mt-4 flex flex-col gap-4 text-sm lg:text-base">
              <p className="text-[#686868]">
                From classic hoops that sway with confidence to chandelier
                designs for evening allure, these earrings are gifts that
                elevate the everyday. They sparkle with the promise of joy,
                adaptable to any mood or occasion.
              </p>

              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2 marker:text-baseblack">
                <li>
                  <span className="font-semibold text-baseblack">
                    Hypoallergenic Security:
                  </span>{" "}
                  Comfort that lasts all day.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Versatile Brilliance:
                  </span>{" "}
                  From subtle studs to statement drops.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Timeless Pairing:
                  </span>{" "}
                  Complements any ensemble seamlessly.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="diamond-bracelets"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                Diamond Bracelets
              </h2>
              <p className="text-[#686868]">
                A diamond bracelet drapes the wrist like a cascade of captured
                starlight, each Forever Diamond a note in a symphony of
                elegance. At Katanoff, our bracelets whether delicate tennis
                styles or bold cuffs encircle the arm with stories of
                achievement and affection.
              </p>
              <p className="text-[#686868]">
                Gift one to celebrate milestones or to adorn with intention;
                their flexibility allows for stacking or solo wear, always
                radiating poise and power.
              </p>

              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2 marker:text-baseblack">
                <li>
                  <span className="font-semibold text-baseblack">
                    Adjustable Fit:
                  </span>{" "}
                  Ensures a whisper-soft embrace.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Mixable Motifs:
                  </span>{" "}
                  Charms and links for personal narratives.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Enduring Glow:
                  </span>{" "}
                  Sparkles that dance with every gesture.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="diamond-necklaces-pendants"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro ">
                Diamond Necklaces & Pendants
              </h2>
              <p className="text-[#686868]">
                Necklaces and pendants lie close to the heart, where Forever
                Diamonds pulse with intimate significance. Katanoff's
                collections feature delicate chains adorned with solitary stones
                or layered designs that tell tales of layered lives.
              </p>
              <p className="text-[#686868]">
                From chokers that command attention to lariats that flow freely,
                these pieces are vessels for vows, memories, and aspirations
                gifts that nestle against the soul.
              </p>

              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2 marker:text-baseblack">
                <li>
                  <span className="font-semibold text-baseblack">
                    Layering Liberty:
                  </span>{" "}
                  Build narratives with multiple strands.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Sentimental Centers:
                  </span>{" "}
                  Pendants engraved with eternal words.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Collarbone Caress:
                  </span>{" "}
                  Subtle shine that draws the gaze inward.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="final-thought"
            >
              <h2 className="text-lg md:text-xl xl:text-2xl font-medium font-castoro ">
                Final Thought
              </h2>
              <p className="text-[#686868]">
                Forever Diamonds are more than gifts they are beacons of
                boundless affection, forged to defy epochs. At Katanoff, we
                steward these treasures with reverence, blending artisanal
                mastery and moral clarity so each facet mirrors not just light,
                but lineage.
              </p>
            </section>
          </div>
          <div className="hidden lg:block sticky top-28 self-start">
            <TableOfContents sections={tocSections} />
            <div className="mt-10">
              <p className="text-lg xl:text-xl font-semibold mb-4 font-castoro">
                More Blogs
              </p>
              <div className="flex flex-col gap-6">
                {moreBlogs?.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${helperFunctions?.stringReplacedWithDash(
                      blog.title
                    )}`}
                    className="flex gap-4 hover:opacity-80 transition"
                  >
                    <div className="w-32 h-24 flex-shrink-0 rounded-md overflow-hidden">
                      <CustomImg
                        src={blog.image}
                        altAttr={blog?.altAttr}
                        titleAttr={blog?.titleAttr}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-2 uppercase">
                        {blog.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <section id="faq" className="mt-4 md:mt-6 xl:mt-8">
            <h3 className="text-xl lg:text-2xl font-semibold font-castoro text-gray-900">
              FAQs
            </h3>
            <div className="border border-gray-border mt-6">
              <AccordionTabs
                tabs={faqContent}
                forceResetKey="warranty"
                contentCustomClass="!ps-5 text-baseblack"
                labelCustomClass="!text-lg md:!text-xl"
                customClass="!py-3"
              />
            </div>
          </section>
        </div>
      </section>

      <section className="mt-8 xl:mt-16 2xl:mt-20 pt-8 md:pt-10 xl:pt-16 bg-alabaster pb-16">
        <div className="px-6 xl:px-12 container">
          <h2 className="text-2xl xl:text-3xl font-medium font-castoro text-baseblack mt-6 pb-8 xl:pb-10 text-center">
            Discover More
          </h2>

          <BlogSwipper blogData={moreBlogs} />
        </div>
      </section>
    </>
  );
}
