import { META_CONSTANTS } from "@/_helper";
import { generateMetadata } from "@/_utils/metaConfig";

export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.ORDER_HISTORY],
});

export default function OrderHistoryLayout({ children }) {
    return children;
}
