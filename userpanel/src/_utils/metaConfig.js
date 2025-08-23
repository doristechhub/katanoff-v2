import { META_CONSTANTS } from "@/_helper";
import { generateCurrentTimeAndDate } from "./common";
import { DEFAULT_META, PAGE_META } from "@/_helper/pageMeta";

export const generateMetadata = ({ pageName = "", customMeta = {} } = {}) => {
  const currentPageMeta =
    PAGE_META[pageName] || PAGE_META[META_CONSTANTS.HOME] || customMeta;
  const meta = { ...DEFAULT_META, ...currentPageMeta };

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
