import { META_CONSTANTS } from "@/_helper";
import { generateMetadata } from "@/_utils/metaConfig";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.SITE_MAP],
});

export default function SiteMapLayout({ children }) {
  return <div>{children}</div>;
}
