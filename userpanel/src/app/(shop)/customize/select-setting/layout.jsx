import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.SELECT_SETTING],
});

export default function SelectSettingLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Select a Ring Setting",
    url: `${WebsiteUrl}/customize/select-setting`,
    category: "Ring Setting",
  };

  return (
    <div>
      {children}
      <Script
        id="select-ring-setting-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
