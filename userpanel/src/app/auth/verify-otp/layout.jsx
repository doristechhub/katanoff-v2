import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.VERIFY_OTP],
});

export default function VerifyOTPLayout({ children }) {
    return children;
}
