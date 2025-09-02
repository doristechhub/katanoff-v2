import {
  DIAMOND_SHAPE,
  GOLD_COLOR_MAP,
  helperFunctions,
  WebsiteUrl,
} from "@/_helper";
import { productService } from "@/_services";
import { generateMetadata as generateMetaConfig } from "@/_utils/metaConfig";
import { headers } from "next/headers";

export async function generateMetadata({ params }) {
  try {
    let { productName } = params;

    const headersList = headers();
    const completeUrl = headersList.get("x-url") || "";
    const urlObj = new URL(completeUrl);
    const searchParams = urlObj.searchParams;

    const productNameWithUnderscore =
      helperFunctions?.stringReplacedWithUnderScore(productName);

    const productNameWithSpace =
      helperFunctions?.stringReplacedWithSpace(productName);

    if (!productNameWithSpace) {
      return {
        title: "Product Not Found | Katanoff Jewelry",
        description: "This product does not exist or has been removed.",
        robots: "noindex, nofollow",
      };
    }

    const productDetail = await productService.getSingleProduct(
      productNameWithSpace
    );

    if (!productDetail) {
      return {
        title: "Product Not Found | Katanoff Jewelry",
        description: "Sorry, this product does not exist or has been removed.",
        robots: "noindex, nofollow",
      };
    }

    /** ----------------------------
     * DYNAMIC OG IMAGE LOGIC
     * ---------------------------- */
    let ogImage = "";

    // Get selected gold color from query param
    const selectedGoldColor = helperFunctions.stringReplacedWithSpace(
      searchParams.get("goldColor")?.toLowerCase()
    );

    if (selectedGoldColor && GOLD_COLOR_MAP[selectedGoldColor]) {
      const selectedImageKey = GOLD_COLOR_MAP[selectedGoldColor];
      if (productDetail[selectedImageKey]) {
        ogImage = productDetail[selectedImageKey];
      }
    }

    if (!ogImage) {
      const fallbackColors = [
        "yellowGoldImages",
        "roseGoldImages",
        "whiteGoldImages",
      ];
      for (const color of fallbackColors) {
        if (productDetail?.[color]?.[0]?.image) {
          ogImage = productDetail[color][0].image;
          break;
        }
      }

      // Final fallback → placeholder image
      if (!ogImage) {
        ogImage = `${WebsiteUrl}/opengraph-image.png`;
      }
    }

    /** ----------------------------
     * META CONFIGURATION
     * ---------------------------- */
    const diamondShapeVariation = productDetail?.variations?.find(
      (v) => v?.variationName === DIAMOND_SHAPE
    );
    const diamondShape =
      diamondShapeVariation?.variationTypes?.[0]?.variationTypeName || "";
    const subCategory = productDetail.subCategoryNames?.[0]?.title || "";

    const canonicalUrl = `${WebsiteUrl}/${productNameWithUnderscore}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const customMeta = {
      title: `${productDetail.productName} with ${diamondShape} Diamonds | Katanoff Fine Jewelry`,
      description:
        `Shop ${productDetail.productName} featuring brilliant ${diamondShape} diamonds at Katanoff. Elegant craftsmanship and timeless fine jewelry.` ||
        "Explore the latest jewelry designs with Katanoff. High-quality, beautifully crafted pendants and more.",
      keywords: `${productDetail.productName}, ${diamondShape} Diamond ${subCategory}, Diamond Jewelry, Fine Jewelry, Katanoff`,
      openGraphImage: ogImage,
      url: canonicalUrl,
    };

    return generateMetaConfig({ customMeta });
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      title: "Error | Katanoff Jewelry",
      description: "Something went wrong. Please try again later.",
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
