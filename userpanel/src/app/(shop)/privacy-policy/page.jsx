import { companyEmail, companyPhoneNo } from "@/_helper";
import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";

const privacySections = [
  {
    label: "Introduction",
    content: (
      <p>
        Katanoff ("Company", "we", "our", or "us") is committed to safeguarding
        your personal information. This Privacy Policy explains how we collect,
        use, disclose, and protect your data when you visit our website. By
        accessing our website, you consent to the practices described in this
        policy. If you do not agree with these terms, please discontinue the use
        of our website.
      </p>
    ),
  },
  {
    label: "Information We Collect",
    content: (
      <p>
        We collect different types of personal and non-personal information,
        including: Personal Information: Name, email address, phone number,
        billing/shipping address, and payment details (processed securely
        through third-party providers). Account Information: Login credentials
        and preferences for registered users. Transaction Information: Order
        history, purchase details, and payment confirmations. Device & Browsing
        Information: IP address, browser type, operating system, and cookies to
        enhance your website experience. Communications: Customer service
        inquiries, reviews, and survey responses.
      </p>
    ),
  },
  {
    label: "How We Collect Your Information",
    content: (
      <p>
        We collect information through various methods, including: When you
        create an account, place an order, or contact customer support.
        Automatically through cookies and tracking technologies. From
        third-party partners such as payment processors, marketing platforms,
        and analytics providers.
      </p>
    ),
  },
  {
    label: "How We Use Your Information",
    content: (
      <p>
        We use your personal data for the following purposes: Order Processing:
        To process transactions, confirm orders, and arrange shipping. Customer
        Support: To respond to inquiries and provide support. Marketing &
        Promotions: To send personalized offers, newsletters, and promotional
        materials (you can opt out at any time). Website Enhancement: To improve
        user experience, track performance, and analyze trends. Fraud
        Prevention: To detect unauthorized transactions and secure our website.
        Legal Compliance: To meet regulatory requirements and protect our
        business.
      </p>
    ),
  },
  {
    label: "Sharing Your Information",
    content: (
      <p>
        We do not sell your personal information. However, we may share it with:
        Service Providers: Payment processors, shipping companies, IT support,
        and analytics providers. Legal Authorities: If required by law or to
        enforce our policies. Business Transfers: If Katanoff is involved in a
        merger, sale, or acquisition.
      </p>
    ),
  },
  {
    label: "Cookies & Tracking Technologies",
    content: (
      <p>
        We use cookies and similar technologies to: Remember your preferences
        and enhance your browsing experience. Analyze website traffic and user
        behavior. Deliver relevant advertisements and promotions. You can manage
        or disable cookies through your browser settings, but this may affect
        website functionality.
      </p>
    ),
  },
  {
    label: "Data Security",
    content: (
      <p>
        We take security seriously and implement appropriate measures to protect
        your data, including: Encryption of sensitive information. Secure
        payment processing through third-party providers. Regular security
        audits and threat monitoring. However, no method of data transmission is
        100% secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    label: "Your Rights & Choices",
    content: (
      <p>
        You have the right to: Access, update, or correct your personal
        information. Request deletion of your data, subject to legal
        obligations. Opt out of marketing communications at any time. Restrict
        processing of certain data. Withdraw consent for data collection. To
        exercise these rights, contact us at contact@katanoff.com.
      </p>
    ),
  },
  {
    label: "Retention of Information",
    content: (
      <p>
        We retain personal information as long as necessary for business
        operations, legal compliance, and fraud prevention. When no longer
        required, data is securely deleted or anonymized.
      </p>
    ),
  },
  {
    label: "Third-Party Links & Services",
    content: (
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for their privacy policies or content. Please review their
        policies before providing any personal information.
      </p>
    ),
  },
  {
    label: "Children’s Privacy",
    content: (
      <p>
        Our website is not intended for individuals under the age of 18. We do
        not knowingly collect data from minors. If we become aware of such
        collection, we will take appropriate steps to remove the data.
      </p>
    ),
  },
  {
    label: "Changes to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy periodically to reflect changes in our
        practices. Any modifications will be posted on this page with the
        updated date. Continued use of our website constitutes acceptance of the
        revised policy.
      </p>
    ),
  },
  {
    label: "Contact Information",
    content: (
      <p>
        For questions or concerns regarding this Privacy Policy, please contact
        us: <br />
        Phone: {companyPhoneNo} <br />
        Email: {companyEmail}
      </p>
    ),
  },
];

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-12 md:pt-16">
        <CommonBgHeading
          title="Privacy Policy"
          backText="Back To Home"
          backHref="/"
        />
      </div>
      <div className="container mb-10">
        <div className="border-t border-t-grayborder mt-6 md:mt-10 lg:mt-12" />
        <AccordionTabs
          tabs={privacySections}
          defaultOpenLabel="Introduction"
          forceResetKey="warranty"
          contentCustomClass="md:text-lg"
        />
      </div>
    </div>
  );
};

export default TermsAndConditions;
