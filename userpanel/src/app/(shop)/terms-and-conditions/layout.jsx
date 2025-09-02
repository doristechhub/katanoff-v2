import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.TERMS_AND_CONDITIONS],
});

export default function TermsAndConditionLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms And Conditions",
    url: `${WebsiteUrl}/terms-and-conditions`,
  };
  return (
    <div>
      {children}
      <Script
        id="terms-and-conditions-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
