import { companyPhoneNo } from "@/_helper";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import TermsAndPrivacyContent from "@/components/ui/TermsAndPrivacyContent";
const sections = [
  {
    title: "Introduction",
    description:
      "Welcome to Katanoff (“Company,” “we,” “our,” or “us”). These Terms & Conditions govern your use of our website, products, and services. By accessing or using our website, you agree to be bound by these terms. If you do not agree, please refrain from using our website.",
  },
  {
    title: "Eligibility & Use of the Website",
    description:
      "You must be at least 18 years old to use this website. By accessing our site, you confirm that you have the legal authority to enter into these Terms & Conditions. You agree to use the website solely for lawful purposes and in compliance with all applicable laws and regulations.",
  },
  {
    title: "Account Registration & Security",
    description:
      "To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your login credentials. Any activity under your account is your responsibility. If you suspect unauthorized access, notify us immediately.",
  },
  {
    title: "Product Information & Pricing",
    description:
      "We strive to provide accurate product descriptions, pricing, and availability. However, errors may occur, and we reserve the right to correct inaccuracies, update pricing, or cancel orders at our discretion. Prices are subject to change without prior notice.",
  },
  {
    title: "Order Acceptance & Cancellation",
    description:
      "Placing an order on our website constitutes an offer to purchase. We reserve the right to accept or reject any order at our discretion. We may cancel orders due to unavailability, pricing errors, suspected fraud, or other reasons. If payment has been processed for a canceled order, a full refund will be issued.",
  },
  {
    title: "Payment & Billing",
    description:
      "By providing your payment information, you confirm that you are authorized to use the selected payment method. We reserve the right to refuse or cancel transactions in cases of suspected fraud or unauthorized activity. Payments are processed securely through third-party payment providers.",
  },
  {
    title: "Shipping & Delivery",
    description:
      "We strive to process and ship orders promptly. However, shipping times may vary due to factors beyond our control, such as carrier delays, customs processing, or unforeseen circumstances. We are not responsible for delays caused by third-party shipping providers.",
  },
  {
    title: "Returns, Exchanges & Refunds",
    description:
      "We accept returns within [XX] days of delivery, provided the item is in its original condition. Refunds will be issued per our Return Policy. Certain items, such as custom or final sale products, may not be eligible for returns or exchanges.",
  },
  {
    title: "Intellectual Property Rights",
    description:
      "All content on this website, including text, images, logos, graphics, and designs, is our intellectual property or licensed to us. Unauthorized use, reproduction, or distribution of our content is strictly prohibited.",
  },
  {
    title: "User Conduct & Restrictions",
    description:
      "You agree not to:\n• Use the website for unlawful, fraudulent, or malicious activities.\n• Post or distribute harmful, defamatory, or offensive content.\n• Interfere with website functionality, security, or access.\n• Engage in unauthorized data collection or scraping.",
  },
  {
    title: "Disclaimer of Warranties",
    description:
      "Our website, products, and services are provided “as is” and “as available” without warranties of any kind. We do not guarantee uninterrupted access, error-free content, or specific results from using our website.",
  },
  {
    title: "Limitation of Liability",
    description:
      "To the fullest extent permitted by law, Katanoff is not liable for any direct, indirect, incidental, or consequential damages arising from the use of our website, products, or services. Our total liability shall not exceed the amount paid for the specific order in dispute.",
  },
  {
    title: "Indemnification",
    description:
      "You agree to indemnify and hold Katanoff harmless from any claims, damages, or legal actions arising from your use of our website, violation of these Terms & Conditions, or infringement of any rights.",
  },
  {
    title: "Privacy Policy",
    description:
      "Your use of our website is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.",
  },
  {
    title: "Third-Party Links & Services",
    description:
      "Our website may contain links to third-party sites. We are not responsible for the content, privacy policies, or practices of these external sites. Accessing third-party services is at your own risk.",
  },
  {
    title: "Modification of Terms",
    description:
      "We reserve the right to update or modify these Terms & Conditions at any time. Continued use of our website after changes are posted constitutes acceptance of the revised terms.",
  },
  {
    title: "Governing Law & Dispute Resolution",
    description:
      "These Terms & Conditions are governed by the laws of New York, USA. Any disputes shall be resolved in the courts of New York, USA. You agree to resolve disputes through binding arbitration before pursuing legal action.",
  },
  {
    title: "Termination",
    description:
      "We reserve the right to terminate your access to our website and services at any time if you violate these Terms & Conditions or engage in prohibited activities.",
  },
  {
    title: "Force Majeure",
    description:
      "We are not liable for delays or failures due to causes beyond our control, including natural disasters, government actions, labor disputes, or technical failures.",
  },
  {
    title: "Contact Information",
    description:
      `For any questions or concerns regarding these Terms & Conditions, please contact us at: ${companyPhoneNo}`,
  },
];

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col">
      <CommonBgHeading
        title="Terms and Conditions"
        backText="Back To Home"
        backHref="/"
      />
      <div className="container ">
        <TermsAndPrivacyContent sections={sections} />
      </div>
    </div>
  );
};

export default TermsAndConditions;
