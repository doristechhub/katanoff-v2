import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";
export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.COMPLETE_RING],
});

export default function CompleteRingLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Custom Completed Ring",
    url: `${WebsiteUrl}/customize/complete-ring`,
    category: "Engagement Ring",
  };
  return (
    <div>
      {children}
      <Script
        id="custom-complete-ring-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
