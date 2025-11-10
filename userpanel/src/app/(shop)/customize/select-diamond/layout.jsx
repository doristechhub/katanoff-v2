import { generateMetadata as generateMetaConfig } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import { headers } from "next/headers";
import { PAGE_META } from "@/_helper/pageMeta";
import Script from "next/script";

// export const metadata = generateMetadata({
//   pageName: [META_CONSTANTS.SELECT_DIAMOND],
// });

export async function generateMetadata({ params }) {
  const headersList = await headers();
  const completeUrl = headersList.get("x-url") || "";
  const urlObj = new URL(completeUrl);
  const searchParams = urlObj.searchParams;
  /** ----------- CANONICAL URL ----------- **/
  let selectDiamondPage = PAGE_META[META_CONSTANTS.SELECT_DIAMOND];
  const canonicalUrl = `${WebsiteUrl}/customize/select-diamond${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;
  selectDiamondPage.url = canonicalUrl;

  return generateMetaConfig({
    customMeta: selectDiamondPage,
  });
}

export default function SelectDiamondLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Select a Diamond",
    url: `${WebsiteUrl}/customize/select-diamond`,
    category: "Diamond",
  };
  return (
    <div>
      {children}
      <Script
        id="select-diamond-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
