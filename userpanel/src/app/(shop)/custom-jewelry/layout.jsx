import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.CUSTOM_JEWELRY],
});

export default function CustomJewelryLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom Jewelry Design",
    url: `${WebsiteUrl}/custom-jewelry`,
    provider: {
      "@type": "JewelryStore",
      name: "Katanoff Diamonds",
      url: WebsiteUrl,
    },
  };
  return (
    <div>
      {children}
      <Script
        id="custom-jewelry-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
