import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.SIGN_UP],
});

export default function SignUpLayout({ children }) {
    return children;
}
