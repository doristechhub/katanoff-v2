import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { companyEmail } from "@/_helper";

const warrantyContent = [
  {
    label: "Free Lifetime Warranty",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          At <b>Katanoff</b>, we stand behind the craftsmanship and quality of
          every piece of jewelry we create. Each item is designed and made with
          exceptional care, using high-quality materials and precise techniques
          to ensure beauty, strength, and lasting value. Because we’re committed
          to your long- term satisfaction, we proudly offer a{" "}
          <b>Free Lifetime Warranty</b> on all Katanoff jewelry. This warranty
          is our promise that your investment in fine jewelry will be protected
          for years to come.
        </p>
      </div>
    ),
  },
  {
    label: "What Our Lifetime Warranty Covers",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We understand how important it is for your jewelry to stand the test
          of time—not just in appearance, but in durability and structural
          integrity. That’s why our lifetime warranty covers{" "}
          <b>manufacturing defects</b> and issues related to{" "}
          <b>workmanship or materials</b> under normal wear. If you experience
          any such issues, we will repair or replace the item at no cost to you.
        </p>
        <p>Covered services under our warranty include:</p>

        <ul className="ps-5 list-disc">
          <li>
            Tightening or re-tipping of prongs that have become loose due to
            normal usage over time
          </li>
          <li>
            Repair or replacement of small accent stones (also known as melee
            diamonds) that have come loose or fallen out due to craftsmanship
            flaws
          </li>
          <li>
            Adjustments or repairs to clasps, links, or chains that malfunction
            under normal wear
          </li>
          <li>
            Corrections to any design or construction flaw resulting from how
            the piece was originally made
          </li>
        </ul>
        <p>
          This warranty reflects our belief that jewelry should not only look
          beautiful but also remain dependable and structurally sound with
          everyday wear
        </p>
      </div>
    ),
  },
  {
    label: "What the Warranty Does Not Cover",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          While we are proud to offer a generous and comprehensive lifetime
          warranty, it is important to note that there are limitations to what
          is included. This warranty does not cover damage caused by{" "}
          <b>accidental impact, improper use, excessive force,</b> or{" "}
          <b> neglect.</b> Additionally, it does not include:
        </p>
        <ul className="ps-5 list-disc">
          <li>Loss or theft of the jewelry, whether partial or complete</li>
          <li>
            Damage resulting from unauthorized repairs or services completed by
            third-party jewelers
          </li>
          <li>
            Surface wear such as scratches, dents, or fading that naturally
            occur over time
          </li>
          <li>
            Resizing requests that go beyond the range of what the setting can
            safely accommodate
          </li>
          <li>
            Damage caused by exposure to chemicals, rough handling, or other
            external elements
          </li>
        </ul>
        <p>
          To keep your warranty valid, we recommend that all maintenance,
          repairs, and cleaning services be performed through Katanoff or an
          authorized service partner only.
        </p>
      </div>
    ),
  },
  {
    label: "Complimentary Jewelry Cleaning and Maintenance",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          In addition to warranty protection, we’re pleased to offer{" "}
          <b>complimentary jewelry care services </b> to help you maintain the
          brilliance and structural condition of your piece over time. This
          includes thorough inspections of prongs and settings, professional
          steam cleaning, polishing, and general upkeep. We encourage customers
          to take advantage of these services periodically, especially if the
          item is worn daily.
        </p>
        <p>
          To access these complimentary services, simply contact our support
          team. While the cleaning itself is free of charge, we kindly ask that
          you cover the cost of shipping the item to us. Once the service is
          completed, we will return your jewelry with{" "}
          <b>free insured shipping, </b> along with a refreshed sparkle and
          peace of mind.
        </p>
      </div>
    ),
  },
  {
    label: "How to Request Warranty Repair or Jewelry Maintenance",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          If you believe your piece is experiencing an issue covered by our
          lifetime warranty or if you would like to schedule routine maintenance
          or professional cleaning, please follow the steps below:
        </p>
        <div className="ps-5 list-decimal flex flex-col gap-3">
          <li>
            Reach out to us by sending an email to <b>{companyEmail}.</b> Please
            include your order number, a detailed description of the issue, and
            clear photos that show the area of concern. The more information you
            provide, the faster we can assist you.
          </li>
          <li>
            Once our customer care team has reviewed your request, we will
            confirm whether the issue is covered under the warranty or recommend
            the appropriate service. If your request is approved, we will
            provide you with a <b>prepaid, fully insured shipping label </b>so
            you can safely send the item to our service center.
          </li>
          <li>
            Upon receiving your jewelry, our in-house team of expert jewelers
            will conduct a careful inspection and begin the necessary repair or
            care process. You will be updated once the work is completed and
            your item is ready for return shipment.
          </li>
        </div>
        <p>
          Most repair and cleaning services are completed within{" "}
          <b>7 to 14 business days,</b> depending on the complexity of the work
          and the condition of the piece.
        </p>
      </div>
    ),
  },
  {
    label: "Consider Insuring Your Jewelry Separately",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          While our lifetime warranty provides excellent coverage for
          manufacturing-related issues and maintenance, it does not cover
          accidental damage, loss, or theft. For complete peace of mind, we
          recommend protecting your investment with a separate jewelry insurance
          policy through your homeowners’ or renters’ insurance provider, or
          through a specialized jewelry insurer.
        </p>
      </div>
    ),
  },
  {
    label: "We're Always Here for You",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Your experience with Katanoff doesn’t end once your jewelry arrives—it
          continues for life. We are committed to helping you care for your
          jewelry and supporting you through every stage of ownership. If you
          ever have questions about your piece, need assistance with a service,
          or want to schedule a cleaning or repair, our dedicated customer care
          team is always ready to help.
        </p>
      </div>
    ),
  },
];

const Warranty = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-10 md:pt-14">
        <CommonBgHeading
          title="Warranty"
          breadcrumb={true}
          titleClassName="uppercase"
        />
      </div>
      <div className="container mt-4 sm:mt-10">
        <AccordionTabs
          tabs={warrantyContent}
          defaultOpenLabel="Free Lifetime Warranty"
          forceResetKey="warranty"
          contentCustomClass="md:text-lg !ps-5"
        />
      </div>
    </div>
  );
};

export default Warranty;
