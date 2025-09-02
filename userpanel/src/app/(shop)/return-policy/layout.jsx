import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import { generateMetadata } from "@/_utils/metaConfig";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.RETURN_POLICY],
});

export default function ReturnPolicyLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Return Policy",
    url: `${WebsiteUrl}/return-policy`,
  };
  return (
    <div>
      {children}
      <Script
        id="return-policy-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
