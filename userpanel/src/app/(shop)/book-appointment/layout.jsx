import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";
export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.BOOK_APPOINTMENT],
});

export default function BookAppointmentLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Jewelry Consultation Appointment",
    url: `${WebsiteUrl}/book-appointment`,
    provider: {
      "@type": "JewelryStore",
      name: "Katanoff Diamonds",
    },
  };
  return (
    <div>
      {children}
      <Script
        id="book-appointment-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
