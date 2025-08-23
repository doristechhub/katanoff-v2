import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.SHIPPING_POLICY],
});
export default function ShipingPolicyLayout({ children }) {
  return <div>{children}</div>;
}
