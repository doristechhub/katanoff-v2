import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";

export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.SELECT_SETTING],
});

export default function SelectSettingLayout({ children }) {
  return <div>{children}</div>;
}
