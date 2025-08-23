import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.TERMS_AND_CONDITIONS],
});

export default function TermsAndConditionLayout({ children }) {
  return <div>{children}</div>;
}
