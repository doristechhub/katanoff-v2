import { generateCurrentTimeAndDate } from "./common";
import { WebsiteUrl } from "./environments";
const DEFAULT_META = {
  title: "Buy & Sell Gold, Jewelry, Coins & Watches in Youngstown, OH",
  description:
    "Buy or sell gold, estate jewelry, rare coins, lab-grown diamonds, and luxury watches in Youngstown, OH. Get top cash for scrap gold, coins, and engagement rings today!",
  keywords:
    "buy gold Youngstown OH, gold buyer Youngstown OH, sell scrap gold Youngstown OH, silver buyer Youngstown OH, buy estate jewelry Youngstown OH, estate jewelry buyer Youngstown OH, coin dealer Youngstown OH, rare coin buyer Youngstown OH, best engagement ring Youngstown OH, buy lab-grown diamond Youngstown OH, buy luxury watches Youngstown OH, buy Rolex watches Youngstown OH",
  url: WebsiteUrl,
  openGraphImage: "/opengraph-image.png",
};

export const generateMetadata = (customMeta = {}) => {
  const meta = { ...DEFAULT_META, ...customMeta };

  return {
    metadataBase: new URL(meta?.url),
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    viewport: "width=device-width, initial-scale=1",
    title: meta?.title,
    description: meta?.description,
    keywords: meta?.keywords,
    alternates: {
      canonical: meta?.url,
    },
    openGraph: {
      locale: "en_US",
      type: "website",
      title: meta?.title,
      description: meta?.description,
      url: meta?.url,
      siteName: meta?.title,
      images: [
        {
          url: meta?.openGraphImage,
          width: 1200,
          height: 630,
          alt: meta?.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.title,
      description: meta?.description,
      images: [meta?.openGraphImage],
    },
    other: {
      "apple-mobile-web-app-title": "Treasure trove",
      "article:modified_time": generateCurrentTimeAndDate(),
      profile: "https://gmpg.org/xfn/11",
      generator:
        "Elementor 3.18.3; features: e_dom_optimization, e_optimized_assets_loading, additional_custom_breakpoints, block_editor_assets_optimize, e_image_loading_optimization; settings: css_print_method-external, google_font-enabled, font_display-auto",
    },
  };
};
