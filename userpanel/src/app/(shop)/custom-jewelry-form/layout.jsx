import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.CUSTOM_JEWELRY_FORM],
});

export default function CustomJewelryFormLayout({ children }) {
  return <div>{children}</div>;
}
