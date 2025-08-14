import { WebsiteUrl } from "@/_helper";
import { generateCurrentTimeAndDate } from "./common";
const DEFAULT_META = {
  title: "Katanoff | Online Jewelry Store for Fine & Custom Jewelry",
  description:
    "Katanoff is a trusted online jewelry store offering fine jewelry, gold jewelry, diamond rings, and custom designs. Shop engagement rings, necklaces, bracelets, and more with secure online shopping.",
  keywords:
    "Katanoff, online jewelry store, buy jewelry online, fine jewelry, diamond jewelry, gold jewelry, engagement rings, custom jewelry, wedding rings, necklaces, earrings, bracelets, jewelry shop",
  url: WebsiteUrl,
  openGraphImage: "/opengraph-image.png",
  siteName: "Katanoff",
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
      "apple-mobile-web-app-title": "Katanoff",
      "article:modified_time": generateCurrentTimeAndDate(),
      profile: "https://gmpg.org/xfn/11",
      generator:
        "Elementor 3.18.3; features: e_dom_optimization, e_optimized_assets_loading, additional_custom_breakpoints, block_editor_assets_optimize, e_image_loading_optimization; settings: css_print_method-external, google_font-enabled, font_display-auto",
    },
  };
};
