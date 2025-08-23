import { META_CONSTANTS } from "@/_helper";
import { generateMetadata } from "@/_utils/metaConfig";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.RETURN_POLICY],
});

export default function ReturnPolicyLayout({ children }) {
  return <div>{children}</div>;
}
