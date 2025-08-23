import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.COMPLETE_RING],
});

export default function CompleteRingLayout({ children }) {
  return <div>{children}</div>;
}
