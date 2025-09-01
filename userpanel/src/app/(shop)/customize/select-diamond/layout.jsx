import { generateMetadata as generateMetaConfig } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import { headers } from "next/headers";

// export const metadata = generateMetadata({
//   pageName: [META_CONSTANTS.SELECT_DIAMOND],
// });

export async function generateMetadata({ params }) {
  const headersList = headers();
  const completeUrl = headersList.get("x-url") || "";
  const urlObj = new URL(completeUrl);
  const searchParams = urlObj.searchParams;

  /** ----------- CANONICAL URL ----------- **/
  let selectDiamondPage = [META_CONSTANTS.SELECT_DIAMOND];
  const canonicalUrl = `${WebsiteUrl}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;
  selectDiamondPage.url = canonicalUrl;

  return generateMetaConfig({
    customMeta: selectDiamondPage,
  });
}

export default function SelectDiamondLayout({ children }) {
  return <div>{children}</div>;
}
