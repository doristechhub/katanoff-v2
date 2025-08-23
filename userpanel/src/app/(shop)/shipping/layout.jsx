import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.SHIPPING],
});

export default function ShippingLayout({ children }) {
  return <div>{children}</div>;
}
