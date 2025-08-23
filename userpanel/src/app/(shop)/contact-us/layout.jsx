import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.CONTACT_US],
});

export default function ContactUsLayout({ children }) {
  return <div>{children}</div>;
}
