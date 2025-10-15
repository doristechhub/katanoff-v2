import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";
export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.MEET_SHIPHRA],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MeetShiphraPage",
  mainEntity: {
    "@type": "Organization",
    name: "Katanoff Diamonds",
    url: `${WebsiteUrl}/blogs/meet-shiphra`,
  },
};

export default function MeetShiphraLayout({ children }) {
  return (
    <div>
      <h1 className="hidden">Meet Shiphra</h1>

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
