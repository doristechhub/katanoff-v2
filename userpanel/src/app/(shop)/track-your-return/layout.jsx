import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.TRACK_YOUR_RETURN],
});

export default function TrackYourReturnLayout({ children }) {
  return children;
}
