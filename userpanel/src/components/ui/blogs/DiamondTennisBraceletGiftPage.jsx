"use client";

import heroImg from "@/assets/images/blogs/diamond-tennis-braceles-gift/hero.webp";
import gift1 from "@/assets/images/blogs/diamond-tennis-braceles-gift/gift-1.webp";

import CustomImg from "../custom-img";
import { blogData, DIAMOND_TENNIS_BRACELET_GIFT } from "@/_utils/blogData";
import { AccordionTabs, BlogSwipper } from "@/components/dynamiComponents";
import TableOfContents from "../TableOfContents";
import Link from "next/link";
import { helperFunctions } from "@/_helper";

export default function DiamondTennisBraceletGiftPage() {
  const moreBlogs = blogData.filter(
    (x) =>
      x.title?.toLowerCase() !== DIAMOND_TENNIS_BRACELET_GIFT?.toLowerCase()
  );
  const tocSections = [
    { id: "story-behind-the-name", title: "A Story Behind the Name" },
    {
      id: "sparkle-on-the-go",
      title: "Sparkle On the Go",
    },
    {
      id: "symbols-that-matter",
      title: "Symbols That Matter",
    },
    {
      id: "value-meets-brilliance",
      title: "Value Meets Brilliance",
    },
    {
      id: "choosing-the-perfect-gift",
      title: "Choosing the Perfect Gift",
    },
    {
      id: "making-it-personal",
      title: "Making It Personal",
    },
    {
      id: "final-thought",
      title: "Final Thought",
    },
    { id: "faq", title: "FAQ" },
  ];

  const faqContent = [
    {
      label: "What occasions make a diamond tennis bracelet the ideal gift?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            A diamond tennis bracelet shines for{" "}
            <b>
              milestones like anniversaries, birthdays, graduations, or
              promotions
            </b>
            . It's also perfect for heartfelt gestures on Mother's Day or as a
            "just because" treat, symbolizing enduring love and elegance that
            lasts a lifetime.
          </p>
        </div>
      ),
    },
    {
      label: "Why choose lab-grown diamonds for a tennis bracelet?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Lab-grown diamonds offer{" "}
            <b>identical sparkle and durability to mined ones</b> at a more
            accessible price, letting you opt for higher carat or better clarity
            without compromise. At Katanoff, this means ethical, high-quality
            gifts that balance beauty and value.
          </p>
        </div>
      ),
    },
    {
      label:
        "How do I select the right size and style for a tennis bracelet gift?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Measure the wrist for a snug fit (add ¼–½ inch for comfort), and
            consider their style:{" "}
            <b>prong settings for max sparkle, bezel for security</b>. Choose
            metals like white gold for modern looks or yellow gold for warmth
            personalize with engraving for that extra touch.
          </p>
        </div>
      ),
    },
    {
      label: "Can a tennis bracelet be worn every day?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Yes! Its slim, flexible design and secure clasp make it{" "}
            <b>versatile for daily wear</b>, from office attire to evenings out.
            With proper care, like avoiding harsh chemicals, it retains its
            brilliance through everyday adventures.
          </p>
        </div>
      ),
    },
    {
      label: "How does Katanoff ensure quality in tennis bracelets?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Katanoff hand selects{" "}
            <b>
              lab-grown diamonds with superior cut, color (D-E), and clarity
              (VVS-VS)
            </b>{" "}
            for unmatched fire and value. Each bracelet is crafted for heirloom
            durability, blending timeless design with ethical sourcing you can
            trust.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="mx-auto px-4 md:px-0 pt-12 xl:pt-16 2xl:pt-20 leading-relaxed xl:px-12">
        <section className="mb-8 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-semibold mb-4 font-castoro leading-relaxed">
              Why a Diamond Tennis Bracelet Is the Perfect Gift
            </h1>
            <p className="pt-4 text-sm md:text-base xl:text-lg font-medium text-[#686868]">
              Jewelry has its own unique language, and the diamond tennis
              bracelet speaks volumes. With its blend of elegance, sparkle, and
              subtle luxury, it stands as a timeless and thoughtful gift.
            </p>
          </div>
          <CustomImg
            src={heroImg}
            titleAttr="Diamond Tennis Bracelet - Perfect Gift Idea"
            altAttr="Elegant diamond tennis bracelet gift for her"
            className="lg:h-[80vh] md:w-[80%] object-cover mt-6 m-auto"
          />
        </section>

        <div className="mt-6 md:mt-10 xl:mt-12 2xl:mt-16 border-t border-grayborder" />
        <div className="grid lg:grid-cols-[70%_30%] 2xl:grid-cols-[75%_25%] gap-6 lg:gap-10  container1400 pt-8 md:pt-12 xl:pt-16 2xl:pt-20 ">
          <div>
            <section className="flex flex-col gap-4  text-sm lg:text-base">
              <p className="text-[#686868]">
                A diamond tennis bracelet is more than just a beautiful
                accessory. It's a meaningful symbol of elegance, sophistication,
                and timeless love. Here’s why it’s the perfect gift for that
                special someone in your life.
              </p>
              <p className="text-[#686868]">
                A continuous line of diamonds, each one glinting with its own
                sparkle, it stands as a statement piece that transcends trends
                and seasons. From anniversaries to “just because,” this
                bracelet’s timeless appeal makes it an ideal choice for any
                occasion.
              </p>
              <CustomImg
                src={gift1}
                titleAttr="Diamond Tennis Bracelet - Perfect Gift Idea"
                altAttr="Elegant diamond tennis bracelet gift for her"
                className="w-auto h-auto object-contain"
              />
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="story-behind-the-name"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                1. A Story Behind the Name
              </h2>
              <p className="text-[#686868]">
                The “Tennis Bracelet” name carries a charm rooted in history.
                While diamond line bracelets existed long before, the modern
                term gained traction when tennis legend Chris Evert paused a
                match looking for her diamond bracelet. That iconic moment
                turned the tennis bracelet into a cultural symbol, effortlessly
                blending sport with style and sparkle.
              </p>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="sparkle-on-the-go"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                2. Sparkle On the Go
              </h2>
              <p className="text-[#686868]">
                What sets a tennis bracelet apart is its continuous line of
                diamonds — each stone set uniformly, so light glints with every
                movement. This creates an elegant, fluid design that makes the
                bracelet shine whether you're at work or enjoying a night out.
              </p>
              <p className="text-[#686868]">
                Its slim, fluid design effortlessly blends with both casual and
                formal wear, making it the perfect gift that doesn’t feel “too
                dressy” or “too bold.”
              </p>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="symbols-that-matter"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                3. Symbols That Matter
              </h2>
              <p className="text-[#686868]">
                Gifting a tennis bracelet isn’t just about offering sparkle.
                It’s about marking a moment, celebrating love, and acknowledging
                milestones such as:
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
                <li>Anniversaries</li>
                <li>Major birthdays</li>
                <li>Life achievements (Graduation, Promotion)</li>
                <li>Mother’s Day or a “Thank You” gesture</li>
                <li>A “Treat Yourself” moment</li>
              </ul>
              <p className="text-[#686868]">
                For many, a diamond tennis bracelet becomes a cherished
                heirloom, passed down through generations, holding memories and
                sentiment for years to come.
              </p>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="value-meets-brilliance"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                4. Value Meets Brilliance
              </h2>
              <p className="text-[#686868]">
                At Katanoff, we specialize in lab-grown diamonds, which allows
                us to offer exceptional quality at a more accessible price. This
                makes it possible to:
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
                <li>
                  Choose higher carat weight or better clarity without
                  stretching your budget
                </li>
                <li>
                  Have more flexibility in setting design and personalization
                </li>
                <li>
                  Get a gift that balances beauty, ethics, and smart spending
                </li>
              </ul>
              <p className="text-[#686868]">
                Lab-grown diamonds match mined diamonds in all visual and
                physical properties, so you never have to compromise on sparkle
                or durability.
              </p>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="choosing-the-perfect-gift"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                5. Choosing the Perfect Gift
              </h2>
              <p className="text-[#686868]">
                Here are some tips to help you choose the perfect tennis
                bracelet as a gift:
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2 marker:text-baseblack">
                <li>
                  <span className="font-semibold text-baseblack">
                    Carat & Sparkle:
                  </span>{" "}
                  Prioritize cut quality, as brilliance matters most.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Diamond Quality:
                  </span>{" "}
                  Consider D-E Color, VVS–VS clarity for great value.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Setting Style:
                  </span>{" "}
                  Choose between prong, bezel, or pavé settings based on their
                  style preferences.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Metal Choice:
                  </span>{" "}
                  Pick from white gold, rose or yellow gold, or platinum to
                  match their style.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Fit & Length:
                  </span>{" "}
                  Make sure to leave a little room, but avoid too much
                  looseness.
                </li>
                <li>
                  <span className="font-semibold text-baseblack">
                    Personal Touch:
                  </span>{" "}
                  Consider engraving a meaningful date, adding a custom clasp,
                  or gifting it with a heartfelt note.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="making-it-personal"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                6. Making It Personal
              </h2>
              <p className="text-[#686868]">
                A tennis bracelet becomes much more than just a piece of jewelry
                when it carries personal meaning. Here are some ideas for making
                it uniquely yours:
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
                <li>
                  Gift it alongside a handwritten message or personal memory.
                </li>
                <li>
                  Include its “birth date” to commemorate when it became part of
                  your journey.
                </li>
                <li>
                  Stack it with another meaningful bracelet to enhance its
                  significance over time.
                </li>
                <li>
                  Present it in a memorable setting, like a surprise dinner or
                  heartfelt moment.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="final-thought"
            >
              <h2 className="text-lg md:text-xl xl:text-2xl font-medium font-castoro">
                Final Thought
              </h2>
              <p className="text-[#686868]">
                A diamond tennis bracelet is a gift that lives beyond the
                moment. It whispers elegance, speaks of love, and serves as a
                lasting reminder of cherished milestones. At Katanoff, we craft
                tennis bracelets that offer sparkle with purpose, quality you
                can trust, and beauty that lasts.
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
