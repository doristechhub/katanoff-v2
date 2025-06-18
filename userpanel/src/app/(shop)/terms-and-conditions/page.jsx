import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";

const TermsAndConditionContent = [
  {
    label: "1. General Use of the Website",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          The <b>Katanoff website</b>, including all content, features, and
          services offered through it, is intended for individuals who are 18
          years of age or older, or the legal age of majority in their
          jurisdiction. By using this site, you confirm that you meet this age
          requirement. You agree to use the site only for lawful purposes and in
          a manner that does not infringe upon the rights of others or restrict
          their ability to enjoy the site.
        </p>
        <p>
          All content on this website, including product images, text, logos,
          and designs, is the property of Katanoff and is protected by
          intellectual property laws. Unauthorized use, reproduction, or
          distribution of this content is strictly prohibited without prior
          written consent.
        </p>
      </div>
    ),
  },

  {
    label: "2. Product Availability and Pricing",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We strive to keep our product listings up-to-date and accurate;
          however, all items shown on our website are subject to availability.
          In rare cases, products may become unavailable after an order has been
          placed. In such situations, we will promptly notify you and provide
          alternatives or offer a full refund.
        </p>
        <p>
          Prices listed on the website are in <b>in U.S. Dollars (USD) </b> and
          are subject to change at any time without prior notice. While we make
          every effort to ensure pricing is accurate, errors may occasionally
          occur. If we discover a pricing error after you’ve placed an order, we
          reserve the right to correct it and either cancel the order or provide
          you the option to proceed with the corrected price.
        </p>
      </div>
    ),
  },
  {
    label: "3. Orders and Payments",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          When you place an order on our website, it constitutes an offer to
          purchase the selected items in accordance with these terms. Katanoff
          reserves the right to accept or decline any order at our sole
          discretion, including in cases where payment information cannot be
          verified or shipping restrictions apply.
        </p>
        <p>
          We accept a variety of payment methods including major credit cards,
          PayPal, and buy-now-pay- later services like Klarna or Afterpay. By
          providing your payment details, you represent and warrant that you are
          authorized to use the method and that the information provided is
          complete and accurate.
        </p>
      </div>
    ),
  },
  {
    label: "4. Shipping, Delivery & Risk of Loss",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Katanoff offers free standard shipping within the United States on all
          orders, unless otherwise stated. We work with reputable carriers to
          ensure that your package is delivered securely and on time. Shipping
          timelines may vary depending on product availability, customization,
          and your location.
        </p>
        <p>
          All orders are fully insured during transit and require a signature
          upon delivery. Once an item has been delivered and signed for, the
          risk of loss transfers to the customer. Please inspect your order upon
          receipt and notify us immediately if anything appears to be missing or
          damaged.
        </p>
      </div>
    ),
  },
  {
    label: "5. Returns and Exchanges",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We want you to be completely satisfied with your purchase. Katanoff
          offers a flexible return and exchange policy, details of which can be
          found on our dedicated <b>Returns & Exchanges</b> page. Items eligible
          for return must be in unused, unworn condition and returned within the
          specified time frame along with all original packaging and
          certificates.
        </p>
        <p>
          Custom, engraved, or made-to-order pieces may not be eligible for
          return unless they arrive defective or damaged. Katanoff reserves the
          right to inspect returned items and may deny a refund or exchange if
          the item does not meet our return criteria.
        </p>
      </div>
    ),
  },
  {
    label: "6. Lifetime Warranty and Repairs",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          All eligible jewelry purchases are covered under our{" "}
          <b>Free Lifetime Warranty</b>, which protects against manufacturing
          defects in materials or workmanship. For more information about what
          is covered, exclusions, and how to request a warranty service, please
          refer to our <b>Lifetime Warranty</b> policy page.
        </p>
        <p>
          While the warranty covers craftsmanship-related issues, it does not
          include damage from accidents, normal wear, unauthorized repairs, or
          loss/theft. Customers are responsible for shipping costs associated
          with non-warranty repairs.
        </p>
      </div>
    ),
  },
  {
    label: "7. Promotions and Discount Codes",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          From time to time, Katanoff may offer promotional codes, seasonal
          discounts, or exclusive offers. These promotions are limited-time
          offers and may not be combined with other discounts unless explicitly
          stated. All promotions are subject to terms specific to the offer and
          may be modified or discontinued at our discretion.
        </p>
      </div>
    ),
  },
  {
    label: "8. Privacy and Data Security",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Your privacy is important to us. Katanoff collects and uses your
          personal information in accordance with our <b>Privacy Policy</b>,
          which outlines how we handle data including names, email addresses,
          payment information, and browsing activity. By using our site, you
          consent to the collection and use of this information as described.
        </p>
        <p>
          We use industry-standard security measures to protect your data and
          ensure secure transactions on our website. However, no system is
          completely immune to risk, and you acknowledge that transmission of
          information over the internet is at your own risk.
        </p>
      </div>
    ),
  },
  {
    label: "9. Limitation of Liability",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          To the fullest extent permitted by law, Katanoff shall not be liable
          for any direct, indirect, incidental, or consequential damages that
          arise from your use of this website or purchase of any of our
          products. This includes but is not limited to loss of profits, data,
          or business opportunities, even if we have been advised of such
          potential damages.
        </p>
      </div>
    ),
  },
  {
    label: "10. Governing Law",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          These terms and any transactions conducted with Katanoff shall be
          governed by and interpreted in accordance with the laws of the{" "}
          <b>State of [Insert State, e.g., New York],</b> without regard to its
          conflict of law provisions. Any legal action or proceeding related to
          this website or its terms shall be brought exclusively in the courts
          located in [Insert County or State].
        </p>
      </div>
    ),
  },
  {
    label: "11. Updates to These Terms",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Katanoff reserves the right to modify or update these Terms &amp;
          Conditions at any time, without prior notice. Changes will be
          effective immediately upon posting to the website. We encourage users
          to review this page regularly to stay informed about any updates or
          changes.
        </p>
      </div>
    ),
  },
];

const TermsAndCondition = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-10 md:pt-14">
        <CommonBgHeading
          title="Terms And Condition"
          breadcrumb={true}
          titleClassName="uppercase"
        />
      </div>
      <div className="container mt-4 sm:mt-10">
        <AccordionTabs
          tabs={TermsAndConditionContent}
          defaultOpenLabel="1. General Use of the Website"
          forceResetKey="term-and-condition"
          contentCustomClass="md:text-lg !ps-5"
        />
      </div>
    </div>
  );
};

export default TermsAndCondition;
