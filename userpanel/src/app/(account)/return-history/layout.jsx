import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";
export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.RETURN_HISTORY],
});

export default function ReturnHistoryLayout({ children }) {
    return children;
}
