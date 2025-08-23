import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.CHECKOUT],
});

export default function checkoutLayout({ children }) {
  return <div>{children}</div>;
}
