import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { companyEmail } from "@/_helper";

const ReturnPolicyContent = [
  {
    label: "Free 30-Day Returns & Exchanges",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          At <b>Katanoff</b>, we believe that buying jewelry should be a joyful
          and worry-free experience. We understand that sometimes an item may
          not be exactly what you envisioned—and that’s okay. That’s why we
          offer <b>free returns and exchanges within 30 days</b> from the date
          of delivery. If you're not fully satisfied with your purchase, we're
          here to help you make it right. We want you to feel confident and
          comfortable with every order you place with us. Whether you’re
          returning a gift, exchanging a ring for a better fit, or simply had a
          change of heart, our return process is designed to be smooth, secure,
          and completely hassle-free.
        </p>
      </div>
    ),
  },
  {
    label: "What Items Are Eligible for Return or Exchange?",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Most jewelry purchased from Katanoff is eligible for a{" "}
          <b>free return or exchange within 30 days</b> of the delivery date. To
          qualify, the item must meet the following conditions:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            The jewelry must be in <b>new, unworn condition</b>, free from any
            signs of wear, damage, or alteration
          </li>
          <li>
            All <b>original packaging</b>, including the jewelry box,
            certificates (such as diamond grading reports), and any paperwork,
            must be returned with the item
          </li>
          <li>
            The return must be initiated within <b>30 days</b> of receiving your
            order
          </li>
          <li>
            The return shipment must be <b>postmarked within 7 days</b> after
            the return label is issued
          </li>
        </ul>
        <p>
          We provide <b>free prepaid return shipping labels</b> for all approved
          returns within the United States, so you don’t have to worry about
          shipping costs or hidden fees.
        </p>
      </div>
    ),
  },
  {
    label: "What Items Are Not Eligible for Return?",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          While we do our best to offer flexible return options, there are
          certain items that are <b>not eligible for return or exchange</b> due
          to their custom nature or final sale status. These include:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            <b>Custom-designed or engraved jewelry</b>, including pieces that
            have been made to your specific size, stone, or metal preferences
          </li>
          <li>
            Any item that has been <b>resized, modified, or altered</b> after
            delivery
          </li>
          <li>
            <b>Final sale</b> or clearance items, which are noted as
            non-returnable at the time of purchase
          </li>
          <li>
            Jewelry that shows any{" "}
            <b>visible signs of wear, misuse, or damage</b>
          </li>
        </ul>
        <p>
          If you're unsure whether your item qualifies for a return or exchange,
          please don’t hesitate to reach out to us before starting the process.
          Our team is happy to review your order and guide you accordingly.
        </p>
      </div>
    ),
  },
  {
    label: "How to Initiate a Return or Exchange",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Returning or exchanging a piece of jewelry at Katanoff is simple and
          secure. Here’s how the process works:
        </p>
        <div className="ps-5 list-decimal flex flex-col gap-3">
          <li>
            <b>Contact Our Support Team</b>
            <br />
            <p className="ps-5">
              Email us at {companyEmail} within 30 days of delivery to let us
              know you'd like to return or exchange your item. Be sure to
              include your order number and reason for the return or exchange in
              your message.
            </p>
          </li>
          <li>
            <b>Receive Your Free Prepaid Return Label</b>
            <br />
            <p className="ps-5">
              Once your return is approved, we’ll send you a prepaid shipping
              label via email. Please print the label and pack your item
              securely using its original packaging, including all documents and
              certificates.
            </p>
          </li>
          <li>
            <b>Ship the Item Back to Us</b>
            <br />
            <p className="ps-5">
              Drop off your package at any approved shipping carrier location.
              We recommend keeping your drop-off receipt and tracking number for
              your records.
            </p>
          </li>
          <li>
            <b>Inspection & Refund/Exchange</b>
            <br />
            <p className="ps-5">
              Once your item arrives, our quality control team will inspect it
              to ensure it meets our return standards. If everything checks out,
              we’ll issue your refund to the original payment method or process
              your exchange within 7–10 business days.
            </p>
          </li>
        </div>
        <p>
          Please note that depending on your bank or credit card provider, the
          refund may take a few additional days to reflect in your account.
        </p>
      </div>
    ),
  },
];

const ReturnPolicy = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-10 md:pt-14">
        <CommonBgHeading title="Return Policy" breadcrumb={true} titleClassName="uppercase"/>
      </div>
      <div className="container mt-10">
        <AccordionTabs
          tabs={ReturnPolicyContent}
          defaultOpenLabel="Free 30-Day Returns & Exchanges"
          forceResetKey="return policy"
          contentCustomClass="md:text-lg !ps-5"
        />
      </div>
    </div>
  );
};

export default ReturnPolicy;
