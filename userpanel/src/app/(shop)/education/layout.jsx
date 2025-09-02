import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.EDUCATION],
});

export default function EducationLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Jewelry Education",
    url: `${WebsiteUrl}/education`,
    description:
      "Learn about diamonds, engagement rings, and jewelry buying tips.",
  };
  return (
    <div>
      {children}
      <Script
        id="jewelry-education-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
