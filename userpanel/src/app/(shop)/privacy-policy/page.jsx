import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { companyEmail } from "@/_helper";

const PrivacyPolicyContent = [
  {
    label: "1. Information We Collect",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We collect both personal and non-personal information from users in a
          variety of ways, including when you browse our website, create an
          account, sign up for our mailing list, place an order, or contact us
          for support.
        </p>
        <p>
          <b>Personal Information </b> may include:
        </p>
        <ul className="ps-5 list-disc">
          <li>Full name</li>
          <li>Email address</li>
          <li>Shipping and billing addresses</li>
          <li>Phone number</li>
          <li>
            Payment information (processed securely through third-party
            providers)
          </li>
          <li>Order history and product preferences</li>
        </ul>
        <p>
          <b>Non-Personal Information</b> may include:
        </p>
        <ul className="ps-5 list-disc">
          <li>IP address</li>
          <li>Browser type and device information</li>
          <li>Geographic location (based on IP)</li>
          <li>
            Browsing behavior, such as the pages visited and time spent on the
            site
          </li>
        </ul>
        <p>
          This information helps us provide a personalized, secure, and
          efficient shopping experience.
        </p>
      </div>
    ),
  },
  {
    label: "2. How We Use Your Information",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Katanoff uses the information we collect in order to operate our
          business effectively, provide excellent customer service, and deliver
          a seamless shopping experience. Specifically, we use your data to:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            Process and fulfill orders, including shipping and delivery
            notifications
          </li>
          <li>
            Communicate order confirmations, product updates, or customer
            service responses
          </li>
          <li>
            Personalize your shopping experience and recommend products based on
            your preferences
          </li>
          <li>
            Improve our website’s functionality, performance, and content based
            on user behavior
          </li>
          <li>Administer promotions, contests, or marketing campaigns</li>
          <li>
            Prevent fraudulent transactions and protect against unauthorized
            access or misuse
          </li>
        </ul>

        <p>
          Your personal information will never be sold or rented to third
          parties. We only share data with trusted partners when it is necessary
          to provide our services to you.
        </p>
      </div>
    ),
  },
  {
    label: "3. Sharing Information with Third Parties",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We may share your personal information with select third parties in
          limited circumstances and only when required to complete essential
          business functions. These third parties include:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            <b>Payment processors </b>to securely handle your transactions
          </li>
          <li>
            <b>Shipping and logistics providers </b>to ensure timely and
            accurate delivery of your orders
          </li>
          <li>
            <b>Marketing and advertising partners </b>(such as email service
            platforms or analytics tools) to help us improve our outreach and
            website experience
          </li>
          <li>
            <b>Legal or regulatory authorities </b> when required by law or to
            protect the rights, safety, or property of Katanoff, our customers,
            or others
          </li>
        </ul>
        <p>
          All third-party partners are carefully vetted and are contractually
          obligated to protect your personal information and use it only for the
          purpose specified.
        </p>
      </div>
    ),
  },
  {
    label: "4. Email Marketing and Communication Preferences",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          If you sign up to receive updates from us, we may send you
          newsletters, promotional offers, or product announcements via email.
          You may unsubscribe from these communications at any time by clicking
          the “unsubscribe” link found at the bottom of every marketing email or
          by contacting us directly.
        </p>
        <p>
          Please note that even if you opt out of promotional emails, we may
          still contact you with essential updates related to your purchases,
          such as order confirmations or shipment tracking.
        </p>
      </div>
    ),
  },
  {
    label: "5. Cookies and Tracking Technologies",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Our website uses cookies and similar technologies to enhance your
          browsing experience, collect analytical data, and personalize content
          and ads. Cookies are small data files stored on your device that help
          remember your preferences and behavior on our site.
        </p>
        <p>We use cookies to:</p>
        <ul className="ps-5 list-disc">
          <li>Recognize you when you return to our website</li>
          <li>Store items in your shopping cart between visits</li>
          <li>
            Analyze traffic patterns and performance through tools like Google
            Analytics
          </li>
          <li>
            Deliver tailored ads via remarketing services such as Facebook Ads
            or Google Ads
          </li>
        </ul>
        <p>
          You can control or disable cookies through your browser settings,
          though doing so may affect the functionality of certain features on
          the site.
        </p>
      </div>
    ),
  },
  {
    label: "6. Data Security",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We take your data security seriously and implement industry-standard
          measures to protect your information from loss, misuse, unauthorized
          access, or disclosure. Our website uses secure socket layer (SSL)
          encryption technology during checkout and data transmission, and we
          partner with PCI-compliant payment gateways for all transactions.
        </p>
        <p>
          While we do our best to safeguard your information, please understand
          that no method of internet transmission or electronic storage is
          completely secure. Therefore, we cannot guarantee absolute security,
          but we continuously monitor and update our systems to ensure your
          privacy is maintained.
        </p>
      </div>
    ),
  },
  {
    label: "7. Data Retention",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We retain your personal data only for as long as necessary to fulfill
          the purposes outlined in this policy or to comply with applicable
          legal, regulatory, or tax requirements. When your information is no
          longer needed, we will securely delete, anonymize, or otherwise
          dispose of it in accordance with industry best practices.
        </p>
      </div>
    ),
  },
  {
    label: "8. Your Rights and Choices",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Depending on where you reside, you may have specific rights under
          local privacy laws, including:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            The right to access or request a copy of the personal information we
            hold about you
          </li>
          <li>
            The right to request correction or deletion of inaccurate or
            outdated information
          </li>
          <li>
            The right to opt out of certain data processing or marketing
            activities
          </li>
          <li>
            The right to request that we limit or restrict how we use your
            information
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{" "}
          <b>{companyEmail}</b>. We will respond to your request in a timely
          manner, in accordance with applicable laws.
        </p>
      </div>
    ),
  },
  {
    label: "9. Children's Privacy",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Our website and services are not intended for use by children under
          the age of 13. We do not knowingly collect personal information from
          anyone under this age. If we become aware that we have inadvertently
          gathered personal data from a child, we will take immediate steps to
          delete the information.
        </p>
      </div>
    ),
  },
  {
    label: "10. Changes to This Policy",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Katanoff reserves the right to update or revise this Privacy Policy at
          any time. Any changes will be posted on this page with a revised
          effective date. We encourage you to review this page periodically to
          stay informed about how we are protecting your information.
        </p>
      </div>
    ),
  },
  {
    label: "11. Contact Us",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          If you have any questions about this Privacy Policy, your personal
          information, or our data practices, please don’t hesitate to contact
          us. We’re here to provide clarity and ensure that your privacy is
          respected at every step.
        </p>
      </div>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-10 md:pt-14">
        <CommonBgHeading
          title="Privacy Policy"
          breadcrumb={true}
          titleClassName="uppercase"
        />
      </div>
      <div className="container mt-4 sm:mt-10">
        <AccordionTabs
          tabs={PrivacyPolicyContent}
          defaultOpenLabel="1. Information We Collect"
          forceResetKey="privacy-policy"
          contentCustomClass="md:text-lg !ps-5"
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
