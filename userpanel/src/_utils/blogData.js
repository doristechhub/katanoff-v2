import CustomImg from "@/components/ui/custom-img";

import blog1 from "@/assets/images/blogs/blog-1.webp";
import blog2 from "@/assets/images/blogs/blog-2.webp";
import blog3 from "@/assets/images/blogs/blog-3.webp";
import blog4 from "@/assets/images/blogs/blog-4.webp";
import blog5 from "@/assets/images/blogs/blog-5.webp";
import blog6 from "@/assets/images/blogs/blog-6.webp";

import heroTennis from "@/assets/images/blogs/diamond-tennis-braceles-gift/hero.webp";
import gift1Tennis from "@/assets/images/blogs/diamond-tennis-braceles-gift/gift-1.webp";

import heroShiphra from "@/assets/images/blogs/meet-shiphra/meet-hero.webp";
import meet1Shiphra from "@/assets/images/blogs/meet-shiphra/meet-1.webp";

import heroForever from "@/assets/images/blogs/forever-diamonds/forever-hero.webp";
import forever1 from "@/assets/images/blogs/forever-diamonds/forever-1.webp";

//  Ring Size Guide
import heroRingSizeGuideHero from "@/assets/images/blogs/ring-size-guide/hero.webp";
import ringSizeGuide1 from "@/assets/images/blogs/ring-size-guide/image-1.webp";
import paperMethod from "@/assets/images/blogs/ring-size-guide/paper-method.webp";
import usingAnExistingRing from "@/assets/images/blogs/ring-size-guide/using-an-existing-ring.webp";
import professionalRingSizing from "@/assets/images/blogs/ring-size-guide/professional-ring-sizing.webp";

//labgrown diamond buying guide
import labGrownDiamondBuyingGuideHero from "@/assets/images/blogs/lab-grown-diamond-buying-guide/hero.webp";
import labGrownDiamondBuyingGuide1 from "@/assets/images/blogs/lab-grown-diamond-buying-guide/image-1.webp";
import braceleteForMenWomen from "@/assets/images/blogs/lab-grown-diamond-buying-guide/bracelete-for-men-women.webp";
import rightLabGrownDiamond from "@/assets/images/blogs/lab-grown-diamond-buying-guide/right-lab-grown-diamond.webp";

//  engagement ring trends-2026
import engagementRingTrendsGuideHero from "@/assets/images/blogs/engagement-ring-trends-2026/hero.webp";
import engagementRingTrends from "@/assets/images/blogs/engagement-ring-trends-2026/engagement-ring-trends.webp";
import clusterSetting from "@/assets/images/blogs/engagement-ring-trends-2026/cluster-setting.webp";
import bezelSetting from "@/assets/images/blogs/engagement-ring-trends-2026/bezel-setting.webp";
import shopEngagementRing from "@/assets/images/blogs/engagement-ring-trends-2026/shop-engagement-ring.webp";

import Link from "next/link";
import {
  EARRINGS,
  ENGAGEMENT_RINGS,
  helperFunctions,
  PAGE_CONSTANTS,
  WEDDING_RINGS,
} from "@/_helper";
import { LinkButton } from "@/components/ui/button";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";

// ──────────────────────────────
// Short variables – one per blog (just like foreverDiamondsTitleAndAltAttr)
// ──────────────────────────────
const foreverDiamondsTitleAndAltAttr =
  PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.FOREVER_DIAMONDS];
const meetShiphraTitleAndAltAttr =
  PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.MEET_SHIPHRA];
const tennisBraceletGiftTitleAndAltAttr =
  PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.DIAMOND_TENNIS_BRACELET_GIFT];
const ringSizeGuideTitleAndAltAttr =
  PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.RING_SIZE_GUIDE];
const labGrownGuideTitleAndAltAttr =
  PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.LAB_GROWN_DIAMOND_BUYING_GUIDE];
const engagementTrendsTitleAndAltAttr =
  PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.ENGAGEMENT_RING_TRENDS_2026];

export const blogData = [
  {
    id: 1,
    slug: "forever-diamonds",
    fullTitle: "The Legacy of Diamonds: Timeless Beauty for Generations",
    title: "forever diamonds",
    subtitle: "Jewelry That Lasts for Generations",
    thumbnailImage: blog1,
    heroImg: heroForever,
    description: [
      "In the language of luxury, Forever Diamonds whisper eternity. With their unparalleled brilliance and enduring legacy, they stand as an exquisite, heartfelt gift that transcends time.",
    ],
    introContent: (
      <div className="flex flex-col gap-4 text-sm lg:text-base">
        <p className="text-[#686868]">
          Forever Diamonds are more than exquisite gems they&apos;re profound
          emblems of eternal love, resilience, and heritage. Here’s why they
          make an unparalleled gift for those who deserve something truly
          everlasting.
        </p>
        <p className="text-[#686868]">
          Hand selected for superior cut, clarity, and fire, each Forever
          Diamond captures light in a way that defies the years. From
          engagements to legacy pieces, their legacy of brilliance makes them a
          cherished choice for any profound occasion.
        </p>
      </div>
    ),
    tocSections: [
      { id: "solitaire-diamond-rings", title: "Solitaire Diamond Rings" },
      { id: "diamond-bands", title: "Diamond Bands" },
      { id: "diamond-earrings", title: "Diamond Earrings" },
      { id: "diamond-bracelets", title: "Diamond Bracelets" },
      {
        id: "diamond-necklaces-pendants",
        title: "Diamond Necklaces & Pendants",
      },
      { id: "final-thought", title: "Final Thought" },
      { id: "faq", title: "FAQ" },
    ],
    sections: [
      {
        id: "solitaire-diamond-rings",
        title: "Solitaire Diamond Rings",
        content: (
          <div className="flex flex-col gap-4">
            <CustomImg
              src={forever1}
              titleAttr={foreverDiamondsTitleAndAltAttr.title}
              altAttr={foreverDiamondsTitleAndAltAttr.alt}
            />
            <p className="text-[#686868]">
              A solitaire diamond ring is the epitome of timeless elegance,
              where a single Forever Diamond takes center stage, symbolizing
              unwavering commitment and pure devotion. At Katanoff, our
              solitaire rings are meticulously crafted to showcase the
              stone&apos;s inherent brilliance, with settings that enhance
              rather than overshadow its natural fire.
            </p>
            <p className="text-[#686868]">
              Perfect for proposals, anniversaries, or self-celebratory moments,
              these rings whisper promises of forever. Choose from classic round
              brilliants to fancy pear shapes, each one a beacon of enduring
              love that captures the heart&apos;s deepest sentiments.
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
          </div>
        ),
      },
      {
        id: "diamond-bands",
        title: "Diamond Bands",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Diamond bands embody the quiet strength of unity, encircling the
              finger with a continuous ribbon of sparkling Forever Diamonds.
              Ideal for wedding vows or as stackable accents to your favorite
              pieces, these bands at Katanoff are a testament to shared journeys
              and unbreakable bonds.
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
          </div>
        ),
      },
      {
        id: "diamond-earrings",
        title: "Diamond Earrings",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Diamond earrings frame the face with effortless grace, drawing the
              eye to smiles and whispers alike. Our Forever Diamond studs and
              drops at Katanoff illuminate every angle, turning ordinary
              conversations into moments of quiet splendor.
            </p>
            <p className="text-[#686868]">
              From classic hoops that sway with confidence to chandelier designs
              for evening allure, these earrings are gifts that elevate the
              everyday. They sparkle with the promise of joy, adaptable to any
              mood or occasion.
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
          </div>
        ),
      },
      {
        id: "diamond-bracelets",
        title: "Diamond Bracelets",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              A diamond bracelet drapes the wrist like a cascade of captured
              starlight, each Forever Diamond a note in a symphony of elegance.
              At Katanoff, our bracelets whether delicate tennis styles or bold
              cuffs encircle the arm with stories of achievement and affection.
            </p>
            <p className="text-[#686868]">
              Gift one to celebrate milestones or to adorn with intention; their
              flexibility allows for stacking or solo wear, always radiating
              poise and power.
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
          </div>
        ),
      },
      {
        id: "diamond-necklaces-pendants",
        title: "Diamond Necklaces & Pendants",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Necklaces and pendants lie close to the heart, where Forever
              Diamonds pulse with intimate significance. Katanoff&apos;s
              collections feature delicate chains adorned with solitary stones
              or layered designs that tell tales of layered lives.
            </p>
            <p className="text-[#686868]">
              From chokers that command attention to lariats that flow freely,
              these pieces are vessels for vows, memories, and aspirations gifts
              that nestle against the soul.
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
          </div>
        ),
      },
      {
        id: "final-thought",
        title: "Final Thought",
        content: (
          <p className="text-[#686868]">
            Forever Diamonds are more than gifts they are beacons of boundless
            affection, forged to defy epochs. At Katanoff, we steward these
            treasures with reverence, blending artisanal mastery and moral
            clarity so each facet mirrors not just light, but lineage.
          </p>
        ),
      },
    ],
    faq: [
      {
        label: "What makes Forever Diamonds unique?",
        content: (
          <div className="flex flex-col gap-3">
            <p className="text-[#686868]">
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
            <p className="text-[#686868]">
              Absolutely. With their <b>exceptional hardness</b> and{" "}
              <b>careful craftsmanship</b>, Forever Diamonds are made to
              withstand daily life while retaining their elegance perfect for
              both everyday wear and life’s most cherished moments.
            </p>
          </div>
        ),
      },
      {
        label: "How do Forever Diamonds differ from regular diamonds?",
        content: (
          <div className="flex flex-col gap-3">
            <p className="text-[#686868]">
              While all diamonds are beautiful, Forever Diamonds are
              hand-selected for their{" "}
              <b>unmatched quality, brilliance, and precision cut</b>. They’re
              designed to symbolize <b>enduring love, strength, and heritage</b>{" "}
              values that go beyond sparkle.
            </p>
          </div>
        ),
      },
      {
        label: "Why are Forever Diamonds considered heirloom worthy?",
        content: (
          <div className="flex flex-col gap-3">
            <p className="text-[#686868]">
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
            <p className="text-[#686868]">
              Yes, <b>Katanoff</b> proudly offers Forever Diamonds that embody
              our values of <b>quality, authenticity, and timeless elegance</b>.
              Each diamond is carefully chosen to ensure it will{" "}
              <b>shine for you today and for generations to come</b>.
            </p>
          </div>
        ),
      },
    ],
    category: "Diamonds",
    titleAttr: foreverDiamondsTitleAndAltAttr.title,
    altAttr: foreverDiamondsTitleAndAltAttr.alt,
  },
  {
    id: 2,
    slug: "meet-shiphra",
    fullTitle: "Shiphra: A New Era in Diamond Innovation and Sustainability",
    title: "meet shiphra",
    subtitle: "The 50.25 Carat Lab Grown Diamond That’s Changing Everything",
    thumbnailImage: blog2,
    heroImg: heroShiphra,
    description: [
      "Shiphra represents the dawn of a new era in the world of diamonds. As the largest certified lab-grown diamond at 50.25 carats, Shiphra is a testament to the incredible advancements in diamond technology, blending exceptional beauty with sustainability. In a world where environmental impact and ethical sourcing are paramount, Shiphra offers a responsible and innovative solution for those who seek not only the brilliance of a diamond but also the assurance that their purchase contributes positively to the planet.",
    ],
    introContent: (
      <div className="flex flex-col gap-4 text-sm lg:text-base">
        <p className="text-[#686868]">
          Created using Chemical Vapor Deposition (CVD) technology, Shiphra was
          cultivated in a lab that replicates the natural conditions required
          for diamond formation, but with a significantly lower environmental
          footprint. This makes it not only a marvel of modern science but a
          sustainable choice for today’s conscious consumers.
        </p>
        <p className="text-[#686868]">
          Shiphra’s flawless dimensions, pristine clarity, and exceptional cut
          make it not only a record-breaking gem but a powerful symbol of how
          innovation can coexist with ethical responsibility. Lab-grown diamonds
          like Shiphra represent a shift in consumer expectations, where beauty
          and responsibility are no longer mutually exclusive. This new era in
          diamond innovation isn’t just about pushing technological boundaries
          it’s about creating a future where luxury, sustainability, and ethics
          go hand-in-hand.
        </p>
        <CustomImg
          src={meet1Shiphra}
          titleAttr={meetShiphraTitleAndAltAttr.title}
          altAttr={meetShiphraTitleAndAltAttr.alt}
        />
      </div>
    ),
    tocSections: [
      { id: "record-breaking-marvel", title: "A Record-Breaking Marvel" },
      { id: "why-this-matters", title: "Why This Matters Now" },
      { id: "behind-the-brilliance", title: "Behind the Brilliance" },
      { id: "katanoff-beliefs", title: "What Katanoff Believes" },
      { id: "faq", title: "FAQ" },
    ],
    sections: [
      {
        id: "record-breaking-marvel",
        title: "1. A Record-Breaking Marvel",
        content: (
          <p className="text-[#686868]">
            Recently certified by the International Gemological Institute (IGI),
            Shiphra marks the largest lab-grown diamond ever verified to date.
          </p>
        ),
      },
      {
        id: "why-this-matters",
        title: "2. Why This Matters Now",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              The rise of lab-grown diamonds is no passing trend, it’s a shift
              in how people view sustainability, value, and ethics.
            </p>
            <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
              <li>
                Public interest in lab-grown diamonds has surged, especially for
                engagement rings.
              </li>
              <li>
                In 2022, lab-grown diamonds already accounted for 13.6% of
                global diamond jewelry sales.
              </li>
              <li>
                The price gap between lab-grown and mined diamonds is widening,
                making them even more attractive.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "behind-the-brilliance",
        title: "3. Behind the Brilliance",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Shiphra was cultivated using Chemical Vapor Deposition (CVD)
              technology over an eight week period. The diamond was submitted by
              Ethereal Green Diamond LLP, Mumbai, known for pushing the envelope
              in large gem production.
            </p>
            <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
              <li>
                The name “Shiphra” reflects both the diamond and the jewelry
                house that acquired it.
              </li>
              <li>
                Ethereal Green Diamond holds an SCS Global sustainability
                certification, underlining their commitment to eco-friendly and
                conflict-free practices.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "katanoff-beliefs",
        title: "4. What Katanoff Believes",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              At Katanoff, we see Shiphra as more than a &apos;first&apos;, it’s
              proof that the future of diamond jewelry can be both beautiful and
              responsible. While we specialize in natural, earth mined diamonds,
              we respect innovations in the lab-grown space because they push
              standards, ethics, and consumer expectations forward.
            </p>
            <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
              <li>
                Shiphra is a powerful reminder: whether natural or lab-grown,
                diamonds carry stories, values, and possibilities.
              </li>
            </ul>
          </div>
        ),
      },
    ],
    faq: [
      {
        label: "What makes Shiphra diamond special?",
        content: (
          <div className="flex flex-col gap-3">
            <p className="text-[#686868]">
              Shiphra is the world’s <b>largest certified lab-grown diamond</b>{" "}
              at <b>50.25 carats</b>. Certified by the International Gemological
              Institute (IGI), it represents a breakthrough in scale,
              brilliance, and sustainability for the diamond industry.
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
              replicates the natural diamond formation environment in a
              controlled lab, making it eco-friendly and conflict-free.
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
              <b>natural, earth mined diamonds</b> while also keeping a close
              eye on innovations in the lab-grown space. We respect milestones
              like Shiphra because they push the industry toward{" "}
              <b>higher standards of sustainability and transparency</b>.
            </p>
          </div>
        ),
      },
    ],
    titleAttr: meetShiphraTitleAndAltAttr.title,
    altAttr: meetShiphraTitleAndAltAttr.alt,
  },
  {
    id: 3,
    slug: "diamond-tennis-bracelet-gift",
    fullTitle: "Why a Diamond Tennis Bracelet Is the Perfect Gift",
    title: "diamond tennis bracelet gift",
    subtitle: "The Classic Accessory for All Celebrations",
    thumbnailImage: blog3,
    heroImg: heroTennis,
    description: [
      "Jewelry has its own unique language, and the diamond tennis bracelet speaks volumes. With its blend of elegance, sparkle, and subtle luxury, it stands as a timeless and thoughtful gift.",
    ],
    introContent: (
      <div className="flex flex-col gap-4 text-sm lg:text-base">
        <p className="text-[#686868]">
          A diamond tennis bracelet is more than just a beautiful accessory.
          It&apos;s a meaningful symbol of elegance, sophistication, and
          timeless love. Here’s why it’s the perfect gift for that special
          someone in your life.
        </p>
        <p className="text-[#686868]">
          A continuous line of diamonds, each one glinting with its own sparkle,
          it stands as a statement piece that transcends trends and seasons.
          From anniversaries to “just because,” this bracelet’s timeless appeal
          makes it an ideal choice for any occasion.
        </p>
        <CustomImg
          src={gift1Tennis}
          titleAttr={tennisBraceletGiftTitleAndAltAttr.title}
          altAttr={tennisBraceletGiftTitleAndAltAttr.alt}
        />
      </div>
    ),
    tocSections: [
      { id: "story-behind-the-name", title: "A Story Behind the Name" },
      { id: "sparkle-on-the-go", title: "Sparkle On the Go" },
      { id: "symbols-that-matter", title: "Symbols That Matter" },
      { id: "value-meets-brilliance", title: "Value Meets Brilliance" },
      { id: "choosing-the-perfect-gift", title: "Choosing the Perfect Gift" },
      { id: "making-it-personal", title: "Making It Personal" },
      { id: "final-thought", title: "Final Thought" },
      { id: "faq", title: "FAQ" },
    ],
    sections: [
      {
        id: "story-behind-the-name",
        title: "1. A Story Behind the Name",
        content: (
          <p className="text-[#686868]">
            The “Tennis Bracelet” name carries a charm rooted in history. While
            diamond line bracelets existed long before, the modern term gained
            traction when tennis legend Chris Evert paused a match looking for
            her diamond bracelet. That iconic moment turned the tennis bracelet
            into a cultural symbol, effortlessly blending sport with style and
            sparkle.
          </p>
        ),
      },
      {
        id: "sparkle-on-the-go",
        title: "2. Sparkle On the Go",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              What sets a tennis bracelet apart is its continuous line of
              diamonds — each stone set uniformly, so light glints with every
              movement. This creates an elegant, fluid design that makes the
              bracelet shine whether you&apos;re at work or enjoying a night
              out.
            </p>
            <p className="text-[#686868]">
              Its slim, fluid design effortlessly blends with both casual and
              formal wear, making it the perfect gift that doesn’t feel “too
              dressy” or “too bold.”
            </p>
          </div>
        ),
      },
      {
        id: "symbols-that-matter",
        title: "3. Symbols That Matter",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Gifting a tennis bracelet isn’t just about offering sparkle. It’s
              about marking a moment, celebrating love, and acknowledging
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
              For many, a diamond tennis bracelet becomes a cherished heirloom,
              passed down through generations, holding memories and sentiment
              for years to come.
            </p>
          </div>
        ),
      },
      {
        id: "value-meets-brilliance",
        title: "4. Value Meets Brilliance",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              At Katanoff, we specialize in lab-grown diamonds, which allows us
              to offer exceptional quality at a more accessible price. This
              makes it possible to:
            </p>
            <ul className="list-disc list-inside text-[#686868] ml-4 mt-2">
              <li>
                Choose higher carat weight or better clarity without stretching
                your budget
              </li>
              <li>
                Have more flexibility in setting design and personalization
              </li>
              <li>
                Get a gift that balances beauty, ethics, and smart spending
              </li>
            </ul>
            <p className="text-[#686868]">
              Lab-grown diamonds match mined diamonds in all visual and physical
              properties, so you never have to compromise on sparkle or
              durability.
            </p>
          </div>
        ),
      },
      {
        id: "choosing-the-perfect-gift",
        title: "5. Choosing the Perfect Gift",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Here are some tips to help you choose the perfect tennis bracelet
              as a gift:
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
                Pick from white gold, rose or yellow gold, or platinum to match
                their style.
              </li>
              <li>
                <span className="font-semibold text-baseblack">
                  Fit & Length:
                </span>{" "}
                Make sure to leave a little room, but avoid too much looseness.
              </li>
              <li>
                <span className="font-semibold text-baseblack">
                  Personal Touch:
                </span>{" "}
                Consider engraving a meaningful date, adding a custom clasp, or
                gifting it with a heartfelt note.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "making-it-personal",
        title: "6. Making It Personal",
        content: (
          <div className="flex flex-col gap-4">
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
          </div>
        ),
      },
      {
        id: "final-thought",
        title: "Final Thought",
        content: (
          <p className="text-[#686868]">
            A diamond tennis bracelet is a gift that lives beyond the moment. It
            whispers elegance, speaks of love, and serves as a lasting reminder
            of cherished milestones. At Katanoff, we craft tennis bracelets that
            offer sparkle with purpose, quality you can trust, and beauty that
            lasts.
          </p>
        ),
      },
    ],
    faq: [
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
              . It&apos;s also perfect for heartfelt gestures on Mother’s Day or
              as a &quot;just because&quot; treat, symbolizing enduring love and
              elegance that lasts a lifetime.
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
              accessible price, letting you opt for higher carat or better
              clarity without compromise. At Katanoff, this means ethical,
              high-quality gifts that balance beauty and value.
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
              <b>versatile for daily wear</b>, from office attire to evenings
              out. With proper care, like avoiding harsh chemicals, it retains
              its brilliance through everyday adventures.
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
              for unmatched fire and value. Each bracelet is crafted for
              heirloom durability, blending timeless design with ethical
              sourcing you can trust.
            </p>
          </div>
        ),
      },
    ],
    titleAttr: tennisBraceletGiftTitleAndAltAttr.title,
    altAttr: tennisBraceletGiftTitleAndAltAttr.alt,
  },
  {
    id: 4,
    slug: "ring-size-guide",
    fullTitle: "Ring Size Guide: Find Your Perfect Fit",
    title: "ring size guide",
    subtitle: "Measure Your Finger for Comfort, Security, and Elegance",
    thumbnailImage: blog4,
    heroImg: heroRingSizeGuideHero,
    description: [
      "Choosing a ring is a meaningful moment, whether it symbolizes love, commitment, or personal celebration. But even the most beautiful diamond engagement ring or wedding ring set for women loses its charm if the fit isn’t right.",
    ],
    introContent: (
      <div className="flex flex-col gap-4 text-sm lg:text-base">
        <p className="text-[#686868]">
          The right size ensures comfort, security, and elegance in every
          moment. This guide will help you measure your ring size accurately and
          understand what makes a perfect fit, so your lab grown diamond jewelry
          feels as special as it looks.
        </p>
        <CustomImg
          src={ringSizeGuide1}
          titleAttr={ringSizeGuideTitleAndAltAttr.title}
          altAttr={ringSizeGuideTitleAndAltAttr.alt}
        />
      </div>
    ),
    tocSections: [
      { id: "what-is-ring-size", title: "What Is Ring Size?" },
      {
        id: "how-to-measure-ring-size-at-home",
        title: "How to Measure Ring Size at Home",
      },
      { id: "professional-ring-sizing", title: "Professional Ring Sizing" },
      { id: "essential-ring-sizing-tips", title: "Essential Ring Sizing Tips" },
      {
        id: "international-ring-size-chart",
        title: "International Ring Size Chart",
      },
      {
        id: "characteristics-of-a-perfect-fit",
        title: "Characteristics of a Perfect Fit",
      },
      { id: "final-thoughts", title: "Final Thoughts" },
      { id: "faq", title: "FAQ" },
    ],
    sections: [
      {
        id: "what-is-ring-size",
        title: "1. What Is Ring Size?",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Ring size refers to the internal circumference or diameter of a
              ring that fits your finger comfortably. Everyone’s finger shape is
              unique, and it can change slightly with temperature, movement, and
              time of day.
            </p>
            <p className="text-[#686868]">
              Understanding your correct size ensures your ring, whether a
              custom engagement ring, diamond wedding band for women, or lab
              grown diamond engagement ring, sits securely without feeling tight
              and can be worn confidently every day.
            </p>
          </div>
        ),
      },
      {
        id: "how-to-measure-ring-size-at-home",
        title: "2. How to Measure Ring Size at Home",
        content: (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center items-center">
              <div className="w-full order-2 lg:order-1">
                <CustomImg
                  src={usingAnExistingRing}
                  titleAttr={ringSizeGuideTitleAndAltAttr.title}
                  altAttr={ringSizeGuideTitleAndAltAttr.alt}
                />
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-baseblack font-semibold">
                  2.1 Using an Existing Ring
                </p>
                <p className="text-[#686868]">
                  If you already have a ring that fits perfectly, it’s one of
                  the easiest ways to find your size. Place the ring flat and
                  measure the inner diameter using a ruler or caliper. Then
                  compare your result with a standard ring size chart. This
                  method works best when the ring is perfectly round and not
                  stretched or bent.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center items-center">
              <div>
                <p className="text-baseblack font-semibold">
                  2.2 Paper or String Method
                </p>
                <p className="text-[#686868]">
                  Wrap a thin strip of paper or string around the base of your
                  finger and mark where the ends meet. Measure that length in
                  millimeters to find your finger’s circumference. Repeat this
                  process twice for accuracy and make sure the strip moves
                  easily over your knuckle. This simple method is helpful when
                  measuring at home.
                </p>
              </div>
              <div className="w-full h-full">
                <CustomImg
                  src={paperMethod}
                  titleAttr={ringSizeGuideTitleAndAltAttr.title}
                  altAttr={ringSizeGuideTitleAndAltAttr.alt}
                />
              </div>
            </div>

            <div>
              <p className="text-baseblack font-semibold">
                2.3 Request a Free Sizing Guide From Katanoff
              </p>
              <p className="text-[#686868]">
                We provide a free sizing guidance service for customers in New
                York and beyond. Contact us, share your measurements or ring
                photo, and our experts will guide you to your correct size.
                Whether you’re planning to design your own engagement ring,
                create a custom lab grown engagement ring, or buy diamond stud
                earrings, precise sizing ensures your jewelry fits perfectly.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "professional-ring-sizing",
        title: "3. Professional Ring Sizing",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              For maximum accuracy, visiting a professional jeweler is always
              recommended. At Katanoff, our specialists in New York measure your
              finger, consider comfort, and help you choose the best fit for
              your ring type and lifestyle.
            </p>
            <p className="text-[#686868]">
              This is especially useful when selecting a luxury engagement ring,
              custom diamond jewelry, or an engagement ring and wedding band
              set. Our goal is to make sure every piece feels as perfect as it
              looks.
            </p>
            <div className="">
              <CustomImg
                src={professionalRingSizing}
                titleAttr={ringSizeGuideTitleAndAltAttr.title}
                altAttr={ringSizeGuideTitleAndAltAttr.alt}
              />
            </div>
          </div>
        ),
      },
      {
        id: "essential-ring-sizing-tips",
        title: "4. Essential Ring Sizing Tips",
        content: (
          <div className="flex flex-col gap-4">
            <ul className="list-disc list-outside pl-5 text-[#686868] ml-4 mt-2 marker:text-baseblack">
              <li>
                Measure your finger in the evening when it’s naturally at its
                largest.
              </li>
              <li>
                Avoid measuring when your hands are cold or right after physical
                activity.
              </li>
              <li>
                Wider bands, such as men’s diamond wedding bands or gold and
                diamond tennis bracelets, may require a slightly larger size for
                comfort.
              </li>
              <li>
                A proper ring should glide on easily and need a gentle pull to
                remove, secure yet comfortable.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "international-ring-size-chart",
        title: "5. International Ring Size Chart",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              This chart makes it easier to find your size when shopping
              internationally for diamond tennis bracelets, diamond hoop
              earrings, or necklaces for women.
            </p>
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-baseblack">
                    US Size
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-baseblack">
                    India
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-baseblack">
                    UK
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-baseblack">
                    EU
                  </th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold text-baseblack">
                    Diameter
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    5
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    9
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    J 1/2
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    49
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    15.7 mm
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    6
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    12
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    L 1/2
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    52
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    16.5 mm
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    7
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    14
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    N 1/2
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    54.5
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    17.3 mm
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    8
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    16
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    P 1/2
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    57
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    18.1 mm
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    9
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    18
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    R 1/2
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    59.5
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    18.9 mm
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
      },
      {
        id: "characteristics-of-a-perfect-fit",
        title: "6. Characteristics of a Perfect Fit",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              A perfectly fitted ring should feel natural and comfortable. It
              should slide over your knuckle with light resistance and stay in
              place without spinning.
            </p>
            <p className="text-[#686868]">
              Whether it’s a diamond solitaire, custom diamond jewelry, or a lab
              grown engagement ring, the right size ensures your ring becomes
              part of your everyday elegance.
            </p>
          </div>
        ),
      },
      {
        id: "final-thoughts",
        title: "Final Thoughts",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Finding your correct ring size ensures lasting comfort and
              confidence. At Katanoff, we help you discover your perfect fit
              while offering a curated collection of lab grown diamond jewelry,
              diamond stud earrings, and engagement rings for her.
            </p>
            <p className="text-[#686868]">
              From custom engagement rings and diamond tennis necklaces to cross
              necklaces for women and men’s diamond earrings in gold, every
              piece is crafted with precision and passion.
            </p>
            <p className="text-[#686868]">
              Explore our full collection in New York to create your engagement
              ring, choose your perfect women’s tennis bracelet, or find the
              ideal heart solitaire pendant that fits beautifully and lasts a
              lifetime.
            </p>
          </div>
        ),
      },
    ],
    faq: [
      {
        label: "Can rings be resized?",
        content: (
          <div className="flex flex-col gap-3">
            <p className="text-[#686868]">
              Yes, most rings can be resized depending on the design and
              material.
            </p>
          </div>
        ),
      },
      {
        label: "What if I’m between sizes?",
        content: (
          <div className="flex flex-col gap-3">
            <p className="text-[#686868]">
              Choosing the slightly larger size is usually more comfortable for
              everyday wear.
            </p>
          </div>
        ),
      },
      {
        label: "How can I find someone’s ring size secretly?",
        content: (
          <div className="flex flex-col gap-3">
            <p className="text-[#686868]">
              Borrow a ring they wear, trace the inside of it, or ask a close
              friend or family member for help.
            </p>
          </div>
        ),
      },
    ],
    category: "Guides",
    titleAttr: ringSizeGuideTitleAndAltAttr.title,
    altAttr: ringSizeGuideTitleAndAltAttr.alt,
  },
  {
    id: 5,
    slug: "lab-grown-diamond-buying-guide",
    fullTitle: "Lab Grown Diamond Buying Guide: Everything You Need to Know",
    title: "lab grown diamond buying guide",
    subtitle: "Real Diamonds with Sparkle, Beauty, and Sustainability",
    thumbnailImage: blog5,
    heroImg: labGrownDiamondBuyingGuideHero,
    description: [
      "Lab grown diamonds are changing the world of fine jewelry. They’re real diamonds with the same sparkle, beauty, and strength as mined diamonds but created through advanced technology that’s better for the planet. From lab grown diamond engagement rings to diamond tennis bracelets, this guide will help you understand everything about these modern gems.",
    ],
    tocSections: [
      {
        id: "what-are-lab-grown-diamonds",
        title: "What Are Lab Grown Diamonds",
      },
      {
        id: "why-choose-lab-grown-diamond-jewelry",
        title: "Why Choose Lab Grown Diamond Jewelry",
      },
      {
        id: "most-popular-lab-grown-diamond-styles",
        title: "Most Popular Lab Grown Diamond Styles",
      },
      {
        id: "custom-diamond-jewelry-at-katanoff",
        title: "Custom Diamond Jewelry at Katanoff",
      },
      {
        id: "how-to-choose-the-right-lab-grown-diamond",
        title: "How to Choose the Right Lab Grown Diamond",
      },
      { id: "the-future-of-luxury", title: "The Future of Luxury" },
    ],
    sections: [
      {
        id: "what-are-lab-grown-diamonds",
        title: "1. What Are Lab Grown Diamonds",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Lab grown diamonds are created in a controlled environment that
              replicates the natural diamond-forming process. They have the same
              chemical and physical properties as mined diamonds, making them
              identical in every way.
            </p>
            <p className="text-[#686868]">
              Each stone is certified for cut, color, clarity, and carat weight,
              giving you the assurance of true diamond quality. When you choose
              lab grown diamond jewelry, you’re investing in brilliance and
              responsibility.
            </p>
            <CustomImg
              src={labGrownDiamondBuyingGuide1}
              titleAttr={labGrownGuideTitleAndAltAttr.title}
              altAttr={labGrownGuideTitleAndAltAttr.alt}
            />
          </div>
        ),
      },
      {
        id: "why-choose-lab-grown-diamond-jewelry",
        title: "2. Why Choose Lab Grown Diamond Jewelry",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Lab grown diamonds offer incredible beauty and value while being
              kind to the earth. Here’s why they’ve become a favorite among
              modern jewelry lovers.
            </p>
            <div>
              <p className="text-baseblack font-semibold mb-1">
                2.1 Ethical and Sustainable
              </p>
              <p className="text-[#686868]">
                Every lab diamond is conflict-free and eco-friendly. Choosing
                them supports responsible jewelry practices and reduces mining
                impact.
              </p>
            </div>
            <div>
              <p className="text-baseblack font-semibold mb-1">
                2.2 Exceptional Value
              </p>
              <p className="text-[#686868]">
                Lab diamonds cost less than mined ones, allowing you to choose
                larger or higher-quality stones. You can upgrade your engagement
                ring and wedding band set or invest in a diamond tennis necklace
                without overspending.
              </p>
            </div>
            <div>
              <p className="text-baseblack font-semibold mb-1">
                2.3 Unmatched Brilliance
              </p>
              <p className="text-[#686868]">
                Lab diamonds display the same fire, sparkle, and clarity as
                mined diamonds. Whether it’s a diamond solitaire, diamond stud
                earrings, or diamond hoop earrings, you’ll see identical beauty
                and shine.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "most-popular-lab-grown-diamond-styles",
        title: "3. Most Popular Lab Grown Diamond Styles",
        content: (
          <div className="flex flex-col gap-4">
            <div>
              <Link
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  ENGAGEMENT_RINGS
                )}`}
              >
                <p className="text-baseblack font-semibold mb-1 hover:text-primary">
                  3.1 Engagement Rings and Wedding Bands
                </p>
              </Link>
              <p className="text-[#686868]">
                Celebrate your love with elegance and meaning. Explore lab grown
                diamond engagement rings, custom lab grown engagement rings, and
                diamond wedding bands for women. You can also design your own
                engagement ring or create your engagement ring for a
                one-of-a-kind look.
              </p>
              <p className="text-[#686868]">
                For a perfect match, our wedding ring sets for women and luxury
                engagement rings bring together style and emotion.&nbsp;{" "}
                <Link
                  href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                    ENGAGEMENT_RINGS
                  )}`}
                >
                  <span className="text-primary hover:underline">
                    Shop Now →
                  </span>
                </Link>
              </p>
            </div>
            <div>
              <Link
                href={`/collections/productTypes/Tennis?parentCategory=Bracelets&parentMainCategory=Jewelry`}
              >
                <p className="text-baseblack font-semibold mb-1 hover:text-primary">
                  3.2 Tennis Jewelry
                </p>
              </Link>
              <p className="text-[#686868]">
                A timeless symbol of sophistication. Choose from our diamond
                tennis bracelet, gold and diamond tennis bracelet, or women’s
                tennis bracelet. Pair it with a diamond tennis necklace for a
                complete, radiant look.&nbsp;{" "}
                <Link
                  href={`/collections/productTypes/Tennis?parentCategory=Bracelets&parentMainCategory=Jewelry`}
                >
                  <span className="text-primary hover:underline">
                    See More →
                  </span>
                </Link>
              </p>
            </div>
            <div>
              <Link
                href={`/collections/subCategories/${helperFunctions.stringReplacedWithUnderScore(
                  EARRINGS
                )}`}
              >
                <p className="text-baseblack font-semibold mb-1 hover:text-primary">
                  3.3 Earrings
                </p>
              </Link>
              <p className="text-[#686868]">
                From everyday essentials to statement pieces, our diamond stud
                earrings, real diamond earrings for women, men&apos;s diamond
                earrings gold, and diamond hoop earrings are made to shine on
                every occasion.&nbsp;
                <Link
                  href={`/collections/subCategories/${helperFunctions.stringReplacedWithUnderScore(
                    EARRINGS
                  )}`}
                >
                  <span className="text-primary hover:underline">
                    See More →
                  </span>
                </Link>
              </p>
            </div>
            <div>
              <Link
                href={`/collections/subCategories/Necklaces?parentMainCategory=Jewelry`}
              >
                <p className="text-baseblack font-semibold mb-1 hover:text-primary">
                  3.4 Pendants and Necklaces
                </p>
              </Link>
              <p className="text-[#686868]">
                Add a touch of charm with our white gold cross pendant, cross
                necklace for women, heart solitaire pendant, or diamond fashion
                pendant. Each piece adds elegance to your collection.&nbsp;
                <Link
                  href={`/collections/subCategories/Necklaces?parentMainCategory=Jewelry`}
                >
                  <span className="text-primary hover:underline">
                    See More →
                  </span>
                </Link>
              </p>
            </div>
            <div>
              <p className="text-baseblack font-semibold mb-1 hover:text-primary">
                <Link
                  href={`/collections/subCategories/Men's_Jewelry?parentMainCategory=Jewelry`}
                >
                  <span>3.5 Bracelets for Men &nbsp;</span>
                </Link>
                <Link href={`/collections/categories/Jewelry`}>
                  <span>and Women</span>
                </Link>
              </p>
              <p className="text-[#686868]">
                Our sleek buy men’s bracelets and buy women’s bracelets are
                designed with refined craftsmanship and subtle sparkle.&nbsp;
                <Link href={`/collections/categories/Jewelry`}>
                  <span className="text-primary hover:underline">
                    Shop Now →
                  </span>
                </Link>
              </p>
            </div>
            <CustomImg
              src={braceleteForMenWomen}
              titleAttr={labGrownGuideTitleAndAltAttr.title}
              altAttr={labGrownGuideTitleAndAltAttr.alt}
            />
          </div>
        ),
      },
      {
        id: "custom-diamond-jewelry-at-katanoff",
        title: "4. Custom Diamond Jewelry at Katanoff",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              At Katanoff, we believe jewelry should tell your story. Our custom
              diamond jewelry service allows you to create designs that reflect
              your personality. From custom engagement rings to custom lab grown
              engagement rings, our artisans bring your ideas to life with
              expert precision and ethical brilliance.
            </p>
            <LinkButton
              href={`/custom-jewelry`}
              className="!w-fit !uppercase !rounded-none !text-white !bg-primary hover:!bg-transparent hover:!text-primary !border !border-primary !px-6 !py-3"
            >
              Let&apos;s Design
            </LinkButton>
          </div>
        ),
      },
      {
        id: "how-to-choose-the-right-lab-grown-diamond",
        title: "5. How to Choose the Right Lab Grown Diamond",
        content: (
          <div className="flex flex-col gap-2">
            <p className="text-[#686868]">
              When selecting your diamond, focus on the 4Cs:
            </p>
            <ul className="list-disc list-inside text-[#686868] ml-4 mt-2 marker:text-baseblack">
              <li>
                <span className="font-semibold text-baseblack">Cut:</span>{" "}
                Determines brilliance and sparkle.
              </li>
              <li>
                <span className="font-semibold text-baseblack">Color:</span>{" "}
                Affects how pure and white the diamond appears.
              </li>
              <li>
                <span className="font-semibold text-baseblack">Clarity:</span>
                Measures internal and external imperfections.
              </li>
              <li>
                <span className="font-semibold text-baseblack">
                  Carat Weight:
                </span>{" "}
                Defines the size and presence of the stone.
              </li>
            </ul>
            <p className="text-[#686868]">
              Whether you’re choosing a diamond engagement ring, diamond
              solitaire, or luxury pendant, the right balance of these factors
              ensures your diamond shines perfectly.
            </p>

            <CustomImg
              src={rightLabGrownDiamond}
              titleAttr={labGrownGuideTitleAndAltAttr.title}
              altAttr={labGrownGuideTitleAndAltAttr.alt}
            />
          </div>
        ),
      },
      {
        id: "the-future-of-luxury",
        title: "6. The Future of Luxury",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Lab grown diamonds represent the new era of fine jewelry where
              innovation meets responsibility. From engagement rings for her to
              men’s diamond wedding bands, they combine elegance, ethics, and
              enduring beauty.
            </p>
            <p className="text-[#686868]">
              Explore lab grown diamond jewelry at Katanoff and discover
              timeless creations that celebrate brilliance with purpose.
            </p>
          </div>
        ),
      },
    ],
    faq: [],
    category: "Guides",
    titleAttr: labGrownGuideTitleAndAltAttr.title,
    altAttr: labGrownGuideTitleAndAltAttr.alt,
  },
  {
    id: 6,
    slug: "engagement-ring-trends-2026",
    fullTitle: "Engagement Ring Trends: What’s New in 2026",
    title: "engagement ring trends 2026",
    subtitle: "Top Trends for Lab Grown Diamond Engagement Rings and More",
    thumbnailImage: blog6,
    heroImg: engagementRingTrendsGuideHero,
    description: [
      "Stay ahead of the curve with the top engagement ring trends for 2026. Whether you’re shopping for a lab grown diamond engagement ring, an engagement ring and wedding band set, or planning to design your own engagement ring, this guide will show you what’s trending, what’s timeless, and how to choose a style that truly reflects you.",
    ],
    tocSections: [
      {
        id: "current-engagement-ring-trends",
        title: "What Are the Current Engagement Ring Trends",
      },
      { id: "sculptural-settings", title: "Sculptural Settings" },
      { id: "substantial-settings", title: "Substantial Settings" },
      { id: "cluster-settings", title: "Cluster Settings" },
      { id: "vintage-inspired-settings", title: "Vintage Inspired Settings" },
      { id: "bezel-settings", title: "Bezel Settings" },
      { id: "fancy-three-stone-settings", title: "Fancy Three Stone Settings" },
      { id: "antique-cut-center-stones", title: "Antique Cut Center Stones" },
      { id: "colored-center-gemstones", title: "Colored Center Gemstones" },
      {
        id: "shop-engagement-rings-at-katanoff",
        title: "Shop Engagement Rings at Katanoff",
      },
    ],
    sections: [
      {
        id: "current-engagement-ring-trends",
        title: "1. What Are the Current Engagement Ring Trends",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              The engagement ring world is evolving with creativity and
              individuality. Instead of only classic solitaires, couples are
              choosing designs that express their personality. Modern styles
              include artistic forms, bold settings, and unique gemstones. From
              custom engagement rings to lab grown diamond jewelry, these trends
              reflect a shift toward personal expression and modern
              craftsmanship.
            </p>
            <div className="flex flex-col gap-4 text-sm lg:text-base">
              <CustomImg
                src={engagementRingTrends}
                titleAttr={engagementTrendsTitleAndAltAttr.title}
                altAttr={engagementTrendsTitleAndAltAttr.alt}
              />
            </div>
          </div>
        ),
      },
      {
        id: "sculptural-settings",
        title: "2. Sculptural Settings",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Sculptural settings are gaining popularity for their architectural
              elegance. These designs feature graceful curves, twists, and
              flowing metalwork that highlight the center diamond beautifully.
              They transform{" "}
              <Link
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  ENGAGEMENT_RINGS
                )}`}
              >
                <span className="text-blue-950 hover:underline">
                  custom lab grown engagement rings{" "}
                </span>
              </Link>
              into true works of art. The focus is not just on the diamond but
              on the entire design.
            </p>
          </div>
        ),
      },
      {
        id: "substantial-settings",
        title: "3. Substantial Settings",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Substantial settings with thicker bands and bold details are
              taking center stage. They provide strength, presence, and a
              luxurious look. These sturdy designs complement diamond wedding
              bands for women and pair perfectly with modern or vintage &nbsp;
              <Link
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  ENGAGEMENT_RINGS
                )}`}
              >
                <span className="text-blue-950 hover:underline">
                  engagement rings{" "}
                </span>
              </Link>
              . They are ideal for those who want a ring that feels as powerful
              as it looks.
            </p>
          </div>
        ),
      },
      {
        id: "cluster-settings",
        title: "4. Cluster Settings",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Cluster settings feature multiple smaller diamonds arranged
              creatively to create sparkle and dimension. This design adds
              brilliance while maintaining a delicate look. It’s a favorite for
              those who love the radiance of a diamond tennis bracelet but
              prefer the charm of a ring. Cluster designs balance elegance with
              uniqueness.
            </p>

            <div>
              <CustomImg
                src={clusterSetting}
                titleAttr={engagementTrendsTitleAndAltAttr.title}
                altAttr={engagementTrendsTitleAndAltAttr.alt}
              />
            </div>
            <LinkButton
              href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                ENGAGEMENT_RINGS
              )}`}
              className="!w-fit !uppercase !rounded-none !text-white !bg-primary hover:!bg-transparent hover:!text-primary !border !border-primary !px-6 !py-3"
            >
              Shop Now
            </LinkButton>
          </div>
        ),
      },
      {
        id: "vintage-inspired-settings",
        title: "5. Vintage Inspired Settings",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Vintage inspired rings bring back the romance of earlier eras.
              They often include intricate metalwork, milgrain details, and
              step-cut diamonds reminiscent of Art Deco and Victorian designs.
              These&nbsp;{" "}
              <Link
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  WEDDING_RINGS
                )}`}
              >
                <span className="text-blue-950 hover:underline"> rings </span>
              </Link>{" "}
              are perfect for those who appreciate timeless beauty and want a
              piece that tells a story while still feeling modern.
            </p>
          </div>
        ),
      },
      {
        id: "bezel-settings",
        title: "6. Bezel Settings",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Bezel settings are loved for their clean lines and modern
              minimalism. The diamond is fully or partially encircled by metal,
              offering protection and a sleek look. This style is both elegant
              and practical, making it an excellent choice for everyday wear. A
              lab grown diamond jewelry piece with a bezel setting shines with
              simplicity and sophistication.
            </p>
            <div>
              <CustomImg
                src={bezelSetting}
                titleAttr={engagementTrendsTitleAndAltAttr.title}
                altAttr={engagementTrendsTitleAndAltAttr.alt}
              />
            </div>
            <LinkButton
              href={`/collections/collection/Engagement_Rings?setting_style=Bezel_Ring/2a56c251e0e&sort_by=date_new_to_old`}
              className="!w-fit !uppercase !rounded-none !text-white !bg-primary hover:!bg-transparent hover:!text-primary !border !border-primary !px-6 !py-3"
            >
              Shop Now
            </LinkButton>
          </div>
        ),
      },
      {
        id: "fancy-three-stone-settings",
        title: "7. Fancy Three Stone Settings",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Three stone rings continue to symbolize past, present, and future
              but are now designed with a creative twist. Modern styles combine
              different shapes, sizes, or even colored stones for a bold effect.
              A custom engagement ring in this setting can beautifully represent
              a couple’s journey together with a personal touch.
            </p>
          </div>
        ),
      },
      {
        id: "antique-cut-center-stones",
        title: "8. Antique Cut Center Stones",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Antique cut diamonds such as Old European, Old Mine, or rose cuts
              are becoming popular again. These cuts have softer sparkle and
              more character than modern styles. They appeal to those who want a
              ring that feels romantic and unique. An antique cut stone in a lab
              grown diamond engagement ring blends history with modern ethics.
            </p>
          </div>
        ),
      },
      {
        id: "colored-center-gemstones",
        title: "9. Colored Center Gemstones",
        content: (
          <div className="flex flex-col gap-4">
            <p className="text-[#686868]">
              Colored gemstones and fancy colored diamonds are making a
              statement in 2026. Sapphires, emeralds, and pink or yellow
              diamonds are now popular alternatives to traditional white
              diamonds. They allow couples to express individuality through
              color. For custom engagement rings, adding a colored gemstone
              makes the design personal and unforgettable.
            </p>
          </div>
        ),
      },
      {
        id: "shop-engagement-rings-at-katanoff",
        title: "Shop Engagement Rings at Katanoff",
        content: (
          <div className="flex flex-col gap-2">
            <p className="text-[#686868]">
              At Katanoff, we bring the latest engagement ring trends to life
              with timeless craftsmanship. From lab grown diamond engagement
              rings to luxury engagement rings and custom diamond jewelry, each
              piece is created with precision and purpose.
            </p>
            <p className="text-[#686868]">
              Explore our collection and find a ring that captures your love,
              your style, and your story.
            </p>
            <div>
              <CustomImg
                src={shopEngagementRing}
                titleAttr={engagementTrendsTitleAndAltAttr.title}
                altAttr={engagementTrendsTitleAndAltAttr.alt}
              />
            </div>
          </div>
        ),
      },
    ],
    faq: [],
    category: "Trends",
    titleAttr: engagementTrendsTitleAndAltAttr.title,
    altAttr: engagementTrendsTitleAndAltAttr.alt,
  },
];

export const getBlogBySlug = (slug) => {
  return blogData.find((blog) => blog.slug === slug);
};
