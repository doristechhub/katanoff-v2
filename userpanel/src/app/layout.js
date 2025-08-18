import StoreProvider from "@/store/provider";
import "./globals.css";
import { Layout } from "@/components/dynamiComponents";
import { generateMetadata } from "@/_utils/metaConfig";

export const metadata = generateMetadata()
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Layout>{children}</Layout>
        </StoreProvider>
      </body>
    </html>
  );
}
