import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.CUSTOM_JEWELRY_FORM],
});

export default function CustomJewelryFormLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Custom Jewelry Form",
    url: `${WebsiteUrl}/custom-jewelry-form`,
  };
  return (
    <div>
      {children}
      <Script
        id="custom-jewelry-form-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
