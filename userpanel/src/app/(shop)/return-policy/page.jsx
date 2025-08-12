import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { companyEmail, companyPhoneNo, formatPhoneNumber } from "@/_helper";
import Link from "next/link";

const { display, link } = formatPhoneNumber(companyPhoneNo);
const ReturnPolicyContent = [
  {
    label: "Return Shipping",
    content: (
      <div className="flex flex-col gap-3">
        <ul className="ps-5 list-disc">
          <li>
            All return shipping costs are the <b>customer’s responsibility</b>.
          </li>
          <li>
            We do <b>not</b> provide prepaid shipping labels.
          </li>
          <li>
            We recommend using a <b>reliable, trackable, and insured</b>{" "}
            shipping method to ensure your item reaches us safely.
          </li>
        </ul>
      </div>
    ),
  },
  {
    label: "Return Eligibility",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          To be considered for a return, the following conditions must be met:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            The item must be <b>unused, unworn,</b> and in the{" "}
            <b> original condition</b> in which it was delivered.
          </li>
          <li>
            All <b>original packaging, certificates, and documentation</b> must
            accompany the return.
          </li>
        </ul>
      </div>
    ),
  },
  {
    label: "How to Return ?",
    content: (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xl font-medium">
            If you have an account on our website:
          </p>
          <ul className="ps-8 list-decimal mt-3">
            <li>
              <b>Log In</b> – Sign in to your account and locate the order you
              wish to return.
            </li>
            <li>
              <b>Request a Return</b> – Submit your return request through your
              account. Once approved, you may proceed with shipping the item
              back to us.
            </li>
          </ul>
        </div>
        <div>
          {" "}
          <p className="text-xl font-medium">
            If you have an account on our website:
          </p>
          <ul className="ps-8 list-decimal mt-3">
            <li>
              <b>Contact Us</b> – Email us at{" "}
              <Link
                href={`mailto:${companyEmail}`}
                className="text-primary font-medium underline"
              >
                {companyEmail}
              </Link>
              .com or call us at{" "}
              <Link
                href={`tel:${link}`}
                className="text-primary font-medium underline"
              >
                {display}
              </Link>{" "}
              with your order number and reason for return.
            </li>
            <li>
              Once approved, you may proceed with shipping the item back to us.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    label: "Preparing Your Return",
    content: (
      <ul className="ps-5 list-decimal">
        <li>
          Include all original packaging, your return packing slip (if
          available), and any diamond certificates.
        </li>
        <li>
          Place the jewelry item(s) securely inside the original jewelry box.
        </li>
        <li>
          Place the jewelry box inside a sturdy shipping box. You may reuse the
          original shipping box from your order or use a similar protective box.
        </li>
        <li>
          Ensure the package is securely sealed to prevent any movement or
          damage during transit.
        </li>
        <li>
          For security purposes, please do not write words like “jewelry” or
          “diamonds” anywhere on the package.
        </li>
        <li>
          Customers are responsible for arranging shipping via a trackable and
          insured method and for retaining proof of shipment.
        </li>
      </ul>
    ),
  },
  {
    label: "Refund Process",
    content: (
      <ul className="ps-5 list-disc">
        <li>
          Refunds are issued only after the returned item passes inspection and
          is approved by our quality assurance team.
        </li>
        <li>
          If any wear, alteration, or damage is found, we will contact you via
          phone or email with a detailed report and the deduction amount, and
          proceed only after your confirmation.
        </li>
        <li>
          Refunds are processed to the <b>original payment method</b> within{" "}
          <b> 7 business days</b> of approval.
        </li>
        <li>
          Shipping charges (if applicable) are <b>non-refundable</b>.
        </li>
      </ul>
    ),
  },
  {
    label: "Non-Returnable Items",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          The following items are not eligible for return under any
          circumstances:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            <b>Custom-made or personalized jewelry</b> – including pieces
            designed to your specifications, engraved items, or items altered in
            size or style at your request.
          </li>
          <li>
            <b>Special order items</b> – pieces sourced or created specifically
            for your order that are not part of our regular stock.
          </li>
        </ul>
      </div>
    ),
  },
];

const ReturnPolicy = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-10 md:pt-14">
        <CommonBgHeading
          title="Return Policy"
          breadcrumb={true}
          titleClassName="uppercase"
        />
      </div>
      <div className="container mt-4 sm:mt-10">
        <p className="mb-4 text-base lg:text-lg">
          We want you to be completely satisfied with your purchase. If, for any
          reason, you are not, you may return your item within{" "}
          <b>15 days of delivery</b> for a refund, subject to the terms outlined
          below.
        </p>
        <AccordionTabs
          tabs={ReturnPolicyContent}
          forceResetKey="return policy"
          contentCustomClass="md:text-lg !ps-5"
        />

        <div className="py-8">
          <h3 className="text-xl  font-castoro font-semibold text-primary">
            Important Note
          </h3>
          <p className="py-2.5 text-base lg:text-lg">
            While return shipping and packaging are the customer’s
            responsibility, our team is always available to guide you and answer
            any questions to ensure your return process is smooth and
            transparent.
          </p>

          <div className="flex flex-col gap-1">
            <p>
              📧 Email:{" "}
              <Link
                href={`mailto:${companyEmail}`}
                className="text-primary font-medium underline"
              >
                {companyEmail}
              </Link>
            </p>
            <p>
              {" "}
              📞 Phone:{" "}
              <Link
                href={`tel:${link}`}
                className="text-primary font-medium underline"
              >
                {display}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
