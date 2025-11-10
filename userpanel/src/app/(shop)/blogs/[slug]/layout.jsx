import { WebsiteUrl } from "@/_helper";
import { PAGE_META } from "@/_helper/pageMeta";
import { generateMetadata as generateMetaConfig } from "@/_utils/metaConfig";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return {
        title: "Blog Not Found | Katanoff Jewelry",
        description: "This blog does not exist or has been removed.",
        robots: "noindex, nofollow",
      };
    }

    try {
      const blogMetaDetail = PAGE_META[slug];
      if (!blogMetaDetail) {
        return {
          title: "Blog Not Found | Katanoff Jewelry",
          description: "Sorry, this blog does not exist or has been removed.",
          robots: "noindex, nofollow",
        };
      }

      /** ----------------------------
       * META CONFIGURATION
       * ---------------------------- */

      const canonicalUrl = `${WebsiteUrl}/blogs/${slug}`;

      const customMeta = {
        ...blogMetaDetail,
        url: canonicalUrl,
      };

      return generateMetaConfig({ customMeta });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      title: "Error | Katanoff Jewelry",
      description: "Something went wrong. Please try again later.",
    };
  }
}

export default function DynamicBlogLayout({ children }) {
  return children;
}
