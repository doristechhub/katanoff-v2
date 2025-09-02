import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.PRIVACY_POLICY],
});

export default function PrivacyPolicyLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: `${WebsiteUrl}/privacy-policy`,
  };
  return (
    <div>
      {children}
      <Script
        id="privacy-policy-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
