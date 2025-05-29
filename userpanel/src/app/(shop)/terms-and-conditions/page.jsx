import { companyPhoneNo } from "@/_helper";
import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
const sections = [
  {
    label: "Introduction",
    content: (
      <p>
        Welcome to Katanoff (“Company,” “we,” “our,” or “us”). These Terms &
        Conditions govern your use of our website, products, and services. By
        accessing or using our website, you agree to be bound by these terms. If
        you do not agree, please refrain from using our website.
      </p>
    ),
  },
  {
    label: "Eligibility & Use of the Website",
    content: (
      <p>
        You must be at least 18 years old to use this website. By accessing our
        site, you confirm that you have the legal authority to enter into these
        Terms & Conditions. You agree to use the website solely for lawful
        purposes and in compliance with all applicable laws and regulations.
      </p>
    ),
  },
  {
    label: "Account Registration & Security",
    content: (
      <p>
        To access certain features, you may be required to create an account.
        You are responsible for maintaining the confidentiality of your login
        credentials. Any activity under your account is your responsibility. If
        you suspect unauthorized access, notify us immediately.
      </p>
    ),
  },
  {
    label: "Product Information & Pricing",
    content: (
      <p>
        We strive to provide accurate product descriptions, pricing, and
        availability. However, errors may occur, and we reserve the right to
        correct inaccuracies, update pricing, or cancel orders at our
        discretion. Prices are subject to change without prior notice.
      </p>
    ),
  },
  {
    label: "Order Acceptance & Cancellation",
    content: (
      <p>
        Placing an order on our website constitutes an offer to purchase. We
        reserve the right to accept or reject any order at our discretion. We
        may cancel orders due to unavailability, pricing errors, suspected
        fraud, or other reasons. If payment has been processed for a canceled
        order, a full refund will be issued.
      </p>
    ),
  },
  {
    label: "Payment & Billing",
    content: (
      <p>
        By providing your payment information, you confirm that you are
        authorized to use the selected payment method. We reserve the right to
        refuse or cancel transactions in cases of suspected fraud or
        unauthorized activity. Payments are processed securely through
        third-party payment providers.
      </p>
    ),
  },
  {
    label: "Shipping & Delivery",
    content: (
      <p>
        We strive to process and ship orders promptly. However, shipping times
        may vary due to factors beyond our control, such as carrier delays,
        customs processing, or unforeseen circumstances. We are not responsible
        for delays caused by third-party shipping providers.
      </p>
    ),
  },
  {
    label: "Returns, Exchanges & Refunds",
    content: (
      <p>
        We accept returns within [XX] days of delivery, provided the item is in
        its original condition. Refunds will be issued per our Return Policy.
        Certain items, such as custom or final sale products, may not be
        eligible for returns or exchanges.
      </p>
    ),
  },
  {
    label: "Intellectual Property Rights",
    content: (
      <p>
        All content on this website, including text, images, logos, graphics,
        and designs, is our intellectual property or licensed to us.
        Unauthorized use, reproduction, or distribution of our content is
        strictly prohibited.
      </p>
    ),
  },
  {
    label: "User Conduct & Restrictions",
    content: (
      <p>
        You agree not to:
        <br />• Use the website for unlawful, fraudulent, or malicious
        activities.
        <br />• Post or distribute harmful, defamatory, or offensive content.
        <br />• Interfere with website functionality, security, or access.
        <br />• Engage in unauthorized data collection or scraping.
      </p>
    ),
  },
  {
    label: "Disclaimer of Warranties",
    content: (
      <p>
        Our website, products, and services are provided “as is” and “as
        available” without warranties of any kind. We do not guarantee
        uninterrupted access, error-free content, or specific results from using
        our website.
      </p>
    ),
  },
  {
    label: "Limitation of Liability",
    content: (
      <p>
        To the fullest extent permitted by law, Katanoff is not liable for any
        direct, indirect, incidental, or consequential damages arising from the
        use of our website, products, or services. Our total liability shall not
        exceed the amount paid for the specific order in dispute.
      </p>
    ),
  },
  {
    label: "Indemnification",
    content: (
      <p>
        You agree to indemnify and hold Katanoff harmless from any claims,
        damages, or legal actions arising from your use of our website,
        violation of these Terms & Conditions, or infringement of any rights.
      </p>
    ),
  },
  {
    label: "Privacy Policy",
    content: (
      <p>
        Your use of our website is also governed by our Privacy Policy, which
        outlines how we collect, use, and protect your personal information.
      </p>
    ),
  },
  {
    label: "Third-Party Links & Services",
    content: (
      <p>
        Our website may contain links to third-party sites. We are not
        responsible for the content, privacy policies, or practices of these
        external sites. Accessing third-party services is at your own risk.
      </p>
    ),
  },
  {
    label: "Modification of Terms",
    content: (
      <p>
        We reserve the right to update or modify these Terms & Conditions at any
        time. Continued use of our website after changes are posted constitutes
        acceptance of the revised terms.
      </p>
    ),
  },
  {
    label: "Governing Law & Dispute Resolution",
    content: (
      <p>
        These Terms & Conditions are governed by the laws of New York, USA. Any
        disputes shall be resolved in the courts of New York, USA. You agree to
        resolve disputes through binding arbitration before pursuing legal
        action.
      </p>
    ),
  },
  {
    label: "Termination",
    content: (
      <p>
        We reserve the right to terminate your access to our website and
        services at any time if you violate these Terms & Conditions or engage
        in prohibited activities.
      </p>
    ),
  },
  {
    label: "Force Majeure",
    content: (
      <p>
        We are not liable for delays or failures due to causes beyond our
        control, including natural disasters, government actions, labor
        disputes, or technical failures.
      </p>
    ),
  },
  {
    label: "Contact Information",
    content: (
      <p>
        For any questions or concerns regarding these Terms & Conditions, please
        contact us at: {companyPhoneNo}
      </p>
    ),
  },
];

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-12 md:pt-16">
        <CommonBgHeading
          title="Terms and Conditions"
          backText="Back To Home"
          backHref="/"
        />
      </div>
      <div className="container mb-10">
        <div className="border-t border-t-grayborder mt-6 md:mt-10 lg:mt-12" />
        <AccordionTabs
          tabs={sections}
          defaultOpenLabel="Introduction"
          forceResetKey="warranty"
          contentCustomClass="md:text-lg"
        />
      </div>
    </div>
  );
};

export default TermsAndConditions;
