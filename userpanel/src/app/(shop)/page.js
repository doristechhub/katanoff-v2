import { companyPhoneNo, formatPhoneNumber, instagramUrl, WebsiteUrl } from "@/_helper";
import Script from "next/script";

const { HomePage } = require("@/components/dynamiComponents");
const { link } = formatPhoneNumber(companyPhoneNo)
const Home = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Katanoff Diamonds",
    "url": WebsiteUrl,
    "logo": `${WebsiteUrl}/opengraph-image.png`,
    "image": `${WebsiteUrl}/opengraph-image.png`, // storefront.jpg
    "telephone": link,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main St",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "openingHours": "Mo-Fr 10:00-18:00",
    "sameAs": [
      instagramUrl,
    ]
  };
  return <>
    <h1 className="hidden">Diamonds That Celebrate Your Unique Style.</h1>
    <HomePage />
    <Script
      id="jewelry-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  </>
};
export default Home;
