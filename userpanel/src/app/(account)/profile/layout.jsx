import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";
export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.PROFILE],
});

export default function ProfileLayout({ children }) {
    return children;
}
