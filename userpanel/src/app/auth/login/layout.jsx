import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.LOGIN],
});

export default function LoginLayout({ children }) {
    return children;
}
