import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";
export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.ABOUT_US],
});

export default function AboutLayout({ children }) {
  return <div>{children}</div>;
}
