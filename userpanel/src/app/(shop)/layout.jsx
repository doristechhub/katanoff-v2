import { Footer, Header } from "@/components/dynamiComponents";
import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS } from "@/_helper";
export const metadata = generateMetadata({
  pageName: [META_CONSTANTS.HOME],
});

export default function ShopLayout({ children }) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
}
