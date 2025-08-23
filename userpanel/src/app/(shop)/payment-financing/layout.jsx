import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.PAYMENT_FINANCING],
});

export default function PaymentFinancingLayout({ children }) {
  return <div>{children}</div>;
}
