import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";
export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.ABOUT_US],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Organization",
    name: "Katanoff Diamonds",
    url: `${WebsiteUrl}/about-us`,
  },
};

export default function AboutLayout({ children }) {
  return (
    <div>
      <h1 className="hidden">About Us</h1>

      {children}
      <Script
        id="jewelry-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
