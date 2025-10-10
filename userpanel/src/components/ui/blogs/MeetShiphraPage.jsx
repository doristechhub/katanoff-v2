"use client";

import heroImg from "@/assets/images/blogs/meet-shiphra/meet-hero.webp";
import meet1 from "@/assets/images/blogs/meet-shiphra/meet-1.webp";

import CustomImg from "../custom-img";
import { blogData, MEET_SHIPHRA } from "@/_utils/blogData";
import { AccordionTabs, BlogSwipper } from "@/components/dynamiComponents";
import TableOfContents from "../TableOfContents";
import Link from "next/link";
import { helperFunctions } from "@/_helper";

export default function MeetShiphraPage() {
  const moreBlogs = blogData.filter(
    (x) => x.title?.toLowerCase() !== MEET_SHIPHRA?.toLowerCase()
  );
  const tocSections = [
    { id: "record-breaking-marvel", title: "A Record-Breaking Marvel" },
    { id: "why-this-matters", title: "Why This Matters Now" },
    { id: "behind-the-brilliance", title: "Behind the Brilliance" },
    { id: "katanoff-beliefs", title: "What Katanoff Believes" },
    { id: "faq", title: "FAQ" },
  ];

  const faqContent = [
    {
      label: "What makes Shiphra diamond special?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Shiphra is the world’s <b>largest certified lab-grown diamond</b> at{" "}
            <b>50.25 carats</b>. Certified by the International Gemological
            Institute (IGI), it represents a breakthrough in scale, brilliance,
            and sustainability for the diamond industry.
          </p>
        </div>
      ),
    },
    {
      label: "Is Shiphra a natural or lab-grown diamond?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Shiphra is a <b>lab-grown diamond</b>, created using{" "}
            <b>Chemical Vapor Deposition (CVD)</b> technology. This process
            replicates the natural diamond formation environment in a controlled
            lab, making it eco-friendly and conflict-free.
          </p>
        </div>
      ),
    },
    {
      label: "How does Shiphra compare to natural diamonds?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Lab-grown diamonds like Shiphra are{" "}
            <b>chemically, physically, and optically identical</b> to mined
            diamonds. The main difference lies in their origin lab-grown
            diamonds are more sustainable, ethical, and often more affordable.
          </p>
        </div>
      ),
    },
    {
      label: "Why is this diamond important for the jewelry industry?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            Shiphra demonstrates the{" "}
            <b>advancements in diamond-growing technology</b>. It signals that
            lab-grown diamonds are no longer just small stones for fashion
            jewelry they can compete with the size and brilliance of rare
            natural diamonds, reshaping consumer perception and the future of
            fine jewelry.
          </p>
        </div>
      ),
    },
    {
      label: "Does Katanoff sell lab-grown diamonds like Shiphra?",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-[#686868]">
            At <b>Katanoff</b>, we specialize in{" "}
            <b>natural, earth mined diamonds</b> while also keeping a close eye
            on innovations in the lab-grown space. We respect milestones like
            Shiphra because they push the industry toward{" "}
            <b>higher standards of sustainability and transparency</b>.
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
            <h1 className="text-2xl md:text-4xl xl:text-5xl font-semibold font-castoro leading-snug mb-4">
              Shiphra: A New Era in Diamond Innovation and Sustainability
            </h1>
            <p className="pt-4 text-sm md:text-base xl:text-lg font-medium text-[#686868]">
              Shiphra represents the dawn of a new era in the world of diamonds.
              As the largest certified lab-grown diamond at 50.25 carats,
              Shiphra is a testament to the incredible advancements in diamond
              technology, blending exceptional beauty with sustainability. In a
              world where environmental impact and ethical sourcing are
              paramount, Shiphra offers a responsible and innovative solution
              for those who seek not only the brilliance of a diamond but also
              the assurance that their purchase contributes positively to the
              planet.
            </p>
          </div>
          <CustomImg
            src={heroImg}
            title="Meet Shiphra - Diamond Jewelry Designer"
            alt="Shiphra jewelry designer portrait"
            className="lg:h-[80vh] md:w-[80%] object-cover mt-6 m-auto"
          />
        </section>

        <div className="mt-6 md:mt-10 xl:mt-12 2xl:mt-16 border-t border-grayborder" />
        <div className="grid lg:grid-cols-[70%_30%] 2xl:grid-cols-[75%_25%] gap-6 lg:gap-10  container1400 pt-8 md:pt-12 xl:pt-16 2xl:pt-20 ">
          <div>
            <section className="flex flex-col gap-4  text-sm lg:text-base">
              <p className="text-[#686868]">
                Created using Chemical Vapor Deposition (CVD) technology,
                Shiphra was cultivated in a lab that replicates the natural
                conditions required for diamond formation, but with a
                significantly lower environmental footprint. This makes it not
                only a marvel of modern science but a sustainable choice for
                today’s conscious consumers.
              </p>
              <p className="text-[#686868]">
                Shiphra’s flawless dimensions, pristine clarity, and exceptional
                cut make it not only a record-breaking gem but a powerful symbol
                of how innovation can coexist with ethical responsibility.
                Lab-grown diamonds like Shiphra represent a shift in consumer
                expectations, where beauty and responsibility are no longer
                mutually exclusive. This new era in diamond innovation isn’t
                just about pushing technological boundaries it’s about creating
                a future where luxury, sustainability, and ethics go
                hand-in-hand.
              </p>
              <CustomImg
                src={meet1}
                title="Meet Shiphra - Diamond Jewelry Designer"
                alt="Shiphra jewelry designer portrait"
                className="object-cover w-full h-full"
              />
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="record-breaking-marvel"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                1. A Record-Breaking Marvel
              </h2>
              <p className="text-[#686868]">
                Recently certified by the International Gemological Institute
                (IGI), Shiphra marks the largest lab-grown diamond ever verified
                to date.
              </p>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="why-this-matters"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                2. Why This Matters Now
              </h2>
              <p className="text-[#686868]">
                The rise of lab-grown diamonds is no passing trend, it’s a shift
                in how people view sustainability, value, and ethics.
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
                <li>
                  Public interest in lab-grown diamonds has surged, especially
                  for engagement rings.
                </li>
                <li>
                  In 2022, lab-grown diamonds already accounted for 13.6% of
                  global diamond jewelry sales.
                </li>
                <li>
                  The price gap between lab-grown and mined diamonds is
                  widening, making them even more attractive.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="behind-the-brilliance"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                3. Behind the Brilliance
              </h2>
              <p className="text-[#686868]">
                Shiphra was cultivated using Chemical Vapor Deposition (CVD)
                technology over an eight week period. The diamond was submitted
                by Ethereal Green Diamond LLP, Mumbai, known for pushing the
                envelope in large gem production.
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
                <li>
                  The name “Shiphra” reflects both the diamond and the jewelry
                  house that acquired it.
                </li>
                <li>
                  Ethereal Green Diamond holds an SCS Global sustainability
                  certification, underlining their commitment to eco-friendly
                  and conflict-free practices.
                </li>
              </ul>
            </section>

            <section
              className="mt-10 flex flex-col gap-4 text-sm lg:text-base"
              id="katanoff-beliefs"
            >
              <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro">
                4. What Katanoff Believes
              </h2>
              <p className="text-[#686868]">
                At Katanoff, we see Shiphra as more than a 'first', it’s proof
                that the future of diamond jewelry can be both beautiful and
                responsible. While we specialize in natural, earth mined
                diamonds, we respect innovations in the lab-grown space because
                they push standards, ethics, and consumer expectations forward.
              </p>
              <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
                <li>
                  Shiphra is a powerful reminder: whether natural or lab-grown,
                  diamonds carry stories, values, and possibilities.
                </li>
              </ul>
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
