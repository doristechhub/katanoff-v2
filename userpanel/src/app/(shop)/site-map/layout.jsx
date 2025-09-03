import { generateMetadata } from "@/_utils/metaConfig";

export const metadata = generateMetadata();

export default function SiteMapLayout({ children }) {
  return <div>{children}</div>;
}
