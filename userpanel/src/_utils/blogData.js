import CustomImg from "@/components/ui/custom-img";

import blog1 from "@/assets/images/blogs/blog-1.webp";
import blog2 from "@/assets/images/blogs/blog-2.webp";
import blog3 from "@/assets/images/blogs/blog-3.webp";

import heroTennis from "@/assets/images/blogs/diamond-tennis-braceles-gift/hero.webp";
import gift1Tennis from "@/assets/images/blogs/diamond-tennis-braceles-gift/gift-1.webp";

import heroShiphra from "@/assets/images/blogs/meet-shiphra/meet-hero.webp";
import meet1Shiphra from "@/assets/images/blogs/meet-shiphra/meet-1.webp";

import heroForever from "@/assets/images/blogs/forever-diamonds/forever-hero.webp";
import forever1 from "@/assets/images/blogs/forever-diamonds/forever-1.webp";

export const blogData = [
  {
    id: 1,
    slug: "forever-diamonds",
    fullTitle: "The Legacy of Diamonds: Timeless Beauty for Generations",
    title: "forever diamonds",
    subtitle: "Jewelry That Lasts for Generations",
    thumbnailImage: blog1,
    heroImg: heroForever,
    images: [forever1],
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
              titleAttr="Forever Diamond - Timeless Beauty Through Generations"
              altAttr="Classic diamond jewelry symbolizing a timeless legacy"
              className="w-auto h-auto object-contain"
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
    altAttr: "Classic diamond jewelry symbolizing a timeless legacy",
    titleAttr: "Forever Diamond - Timeless Beauty Through Generations",
  },
  {
    id: 2,
    slug: "meet-shiphra",
    fullTitle: "Shiphra: A New Era in Diamond Innovation and Sustainability",
    title: "meet shiphra",
    subtitle: "The 50.25 Carat Lab Grown Diamond That’s Changing Everything",
    thumbnailImage: blog2,
    heroImg: heroShiphra,
    images: [meet1Shiphra],
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
          titleAttr="Meet Shiphra - Diamond Jewelry Designer"
          altAttr="Shiphra jewelry designer portrait"
          className="object-cover w-full h-full"
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
    altAttr: "Shiphra jewelry designer portrait",
    titleAttr: "Meet Shiphra - Diamond Jewelry Designer",
  },
  {
    id: 3,
    slug: "diamond-tennis-bracelet-gift",
    fullTitle: "Why a Diamond Tennis Bracelet Is the Perfect Gift",
    title: "diamond tennis bracelet gift",
    subtitle: "The Classic Accessory for All Celebrations",
    thumbnailImage: blog3,
    heroImg: heroTennis,
    images: [gift1Tennis],
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
          titleAttr="Diamond Tennis Bracelet - Perfect Gift Idea"
          altAttr="Elegant diamond tennis bracelet gift for her"
          className="w-auto h-auto object-contain"
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
    altAttr: "Elegant diamond tennis bracelet gift for her",
    titleAttr: "Diamond Tennis Bracelet - Perfect Gift Idea",
  },
];

export const FOREVER_DIAMONDS = "forever diamonds";
export const MEET_SHIPHRA = "meet shiphra";
export const DIAMOND_TENNIS_BRACELET_GIFT = "diamond tennis bracelet gift";

export const getBlogBySlug = (slug) => {
  return blogData.find((blog) => blog.slug === slug);
};
