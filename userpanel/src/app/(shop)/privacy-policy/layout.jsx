import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.PRIVACY_POLICY],
});

export default function PrivacyPolicyLayout({ children }) {
  return <div>{children}</div>;
}
