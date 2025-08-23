import { META_CONSTANTS } from "@/_helper";
import { generateMetadata } from "@/_utils/metaConfig";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.CART],
});

export default function cartLayout({ children }) {
  return <div>{children}</div>;
}
