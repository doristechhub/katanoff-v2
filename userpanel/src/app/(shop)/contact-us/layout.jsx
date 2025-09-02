import { generateMetadata } from "@/_utils/metaConfig";
import { companyPhoneNo, formatPhoneNumber, META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.CONTACT_US],
});
const { link } = formatPhoneNumber(companyPhoneNo);

export default function ContactUsLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Katanoff Diamonds",
      telephone: link,
      contactType: "customer service",
      areaServed: "US",
      url: `${WebsiteUrl}/contact-us`,
    },
  };
  return (
    <div>
      {children}
      <Script
        id="contact-us-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
