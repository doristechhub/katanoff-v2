import StoreProvider from "@/store/provider";
import "./globals.css";
import { Layout } from "@/components/dynamiComponents";

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
