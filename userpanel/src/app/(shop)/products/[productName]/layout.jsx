import { DIAMOND_SHAPE, helperFunctions, WebsiteUrl } from "@/_helper";
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

    productName = helperFunctions?.stringReplacedWithSpace(productName);

    if (!productName) {
      return {
        title: "Product Not Found | Katanoff Jewelry",
        description: "This product does not exist or has been removed.",
        robots: "noindex, nofollow",
      };
    }

    const productDetail = await productService.getSingleProduct(productName);

    if (!productDetail) {
      return {
        title: "Product Not Found | Katanoff Jewelry",
        description: "Sorry, this product does not exist or has been removed.",
        robots: "noindex, nofollow",
      };
    }

    const ogImage =
      productDetail?.yellowGoldThumbnailImage ||
      productDetail?.roseGoldThumbnailImage ||
      productDetail?.whiteGoldThumbnailImage ||
      productDetail?.roseGoldImages?.[0]?.image ||
      productDetail?.whiteGoldImages?.[0]?.image ||
      productDetail?.yellowGoldImages?.[0]?.image ||
      `${WebsiteUrl}/opengraph-image.png`;

    const diamondShapeVariation = productDetail?.variations?.find(
      (v) => v?.variationName === DIAMOND_SHAPE
    );
    const diamondShape =
      diamondShapeVariation?.variationTypes?.[0].variationTypeName || "";
    const subCategory = productDetail.subCategoryNames[0].title;

    const canonicalUrl = `${WebsiteUrl}/${params.productName}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const customMeta = {
      title: `${productDetail.productName} with ${diamondShape} Diamonds | Katanoff Fine Jewelry`,
      description:
        `Shop ${productDetail.productName} featuring brilliant ${diamondShape} diamonds at Katanoff. Elegant craftsmanship and timeless fine jewelry.` ||
        "Explore the latest jewelry designs with Katanoff. High-quality, beautifully crafted pendants and more.",
      keywords: `${productDetail.productName},  ${diamondShape} Diamond ${subCategory}, Diamond Jewelry, Fine Jewelry, Katanoff`,
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
