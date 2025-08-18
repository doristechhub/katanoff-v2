import StoreProvider from "@/store/provider";
import "./globals.css";
import { Layout } from "@/components/dynamiComponents";
import { generateMetadata } from "@/_utils/metaConfig";
import { googleAnalyticsId, googleSiteVerificationId } from "@/_helper";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = generateMetadata();
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content={googleSiteVerificationId}
        />
      </head>
      <body>
        <StoreProvider>
          <Layout>{children}</Layout>
        </StoreProvider>
      </body>
      <GoogleAnalytics gaId={googleAnalyticsId} />
    </html>
  );
}
