import { META_CONSTANTS } from "@/_helper";
import { generateMetadata } from "@/_utils/metaConfig";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.SEARCH],
});
export default function SearchLayout({ children }) {
  return <div>{children}</div>;
}
