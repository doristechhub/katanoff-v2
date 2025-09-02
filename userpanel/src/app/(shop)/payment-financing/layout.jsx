import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.PAYMENT_FINANCING],
});

export default function PaymentFinancingLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: "Jewelry Financing Options",
    url: `${WebsiteUrl}/payment-financing`,
    provider: {
      "@type": "JewelryStore",
      name: "Katanoff Diamonds",
    },
  };
  return (
    <div>
      {children}
      <Script
        id="financing-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
