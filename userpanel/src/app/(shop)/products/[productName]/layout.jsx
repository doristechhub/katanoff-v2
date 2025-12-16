import {
  DIAMOND_SHAPE,
  GOLD_COLOR,
  helperFunctions,
  WebsiteUrl,
} from "@/_helper";
import { productService } from "@/_services";
import { generateMetadata as generateMetaConfig } from "@/_utils/metaConfig";
import { headers } from "next/headers";

const FALLBACK_OG_IMAGE = `${WebsiteUrl}/opengraph-image.png`;

const normalizeVariations = (variations = []) => {
  const keyByName = {};
  const typeByName = {};

  variations.forEach((v) => {
    keyByName[v.variationName] = v.variationId;

    typeByName[v.variationName] = {};
    v.variationTypes.forEach((t) => {
      const normalized = helperFunctions
        .stringReplacedWithUnderScore(t.variationTypeName)
        .toLowerCase()
        .trim();

      typeByName[v.variationName][normalized] = t.variationTypeId;
    });
  });

  return { keyByName, typeByName };
};

const getMediaFromMatchedCombo = ({
  productDetail,
  goldColor,
  diamondShape,
}) => {
  if (!productDetail?.variations?.length) return FALLBACK_OG_IMAGE;

  const { keyByName, typeByName } = normalizeVariations(
    productDetail.variations
  );

  const goldColorTypeId = typeByName[GOLD_COLOR]?.[goldColor] || null;

  const diamondShapeTypeId = typeByName[DIAMOND_SHAPE]?.[diamondShape] || null;

  if (!goldColorTypeId || !diamondShapeTypeId) return FALLBACK_OG_IMAGE;

  const GOLD_COLOR_KEY = keyByName[GOLD_COLOR];
  const DIAMOND_SHAPE_KEY = keyByName[DIAMOND_SHAPE];

  // 🔹 Match combo using Gold Color + Diamond Shape
  const matchedCombo = productDetail.variComboWithQuantity?.find(
    (combo) =>
      combo.combination.some(
        (c) =>
          c.variationId === GOLD_COLOR_KEY &&
          c.variationTypeId === goldColorTypeId
      ) &&
      combo.combination.some(
        (c) =>
          c.variationId === DIAMOND_SHAPE_KEY &&
          c.variationTypeId === diamondShapeTypeId
      )
  );

  let mediaSetId = matchedCombo?.mediaSetId;

  // 🔹 Safe fallback if combo has no mediaSetId
  if (!mediaSetId) {
    mediaSetId = [goldColorTypeId, diamondShapeTypeId].sort().join("_");
  }

  const mediaSet = productDetail.mediaMapping?.find(
    (m) => m.mediaSetId === mediaSetId
  );
  return (
    mediaSet?.thumbnailImage ||
    mediaSet?.images?.[0]?.image ||
    productDetail.mediaMapping[0]?.thumbnailImage ||
    FALLBACK_OG_IMAGE
  );
};

export async function generateMetadata({ params }) {
  try {
    let { productName } = await params;

    const headersList = await headers();
    const completeUrl = headersList.get("x-url") || "";
    const urlObj = new URL(completeUrl);
    const searchParams = urlObj.searchParams;
    const goldColor = searchParams.get("goldColor")?.toLowerCase();
    const diamondShape = searchParams.get("diamondShape")?.toLowerCase();
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

    try {
      const productDetail = await productService.getSingleProduct(
        productNameWithSpace
      );
      if (!productDetail) {
        return {
          title: "Product Not Found | Katanoff Jewelry",
          description:
            "Sorry, this product does not exist or has been removed.",
          robots: "noindex, nofollow",
        };
      }

      const ogImage = getMediaFromMatchedCombo({
        productDetail,
        goldColor,
        diamondShape,
      });

      const diamondShapeVariation = productDetail?.variations?.find(
        (v) => v?.variationName === DIAMOND_SHAPE
      );

      const diamondShapeName =
        diamondShapeVariation?.variationTypes?.[0]?.variationTypeName || "";

      const subCategory = productDetail.subCategoryNames?.[0]?.title || "";

      const canonicalUrl = `${WebsiteUrl}/products/${productNameWithUnderscore}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      const productTypeName =
        productDetail?.productTypeNames?.length &&
        productDetail?.productTypeNames[0]?.title;
      const customMeta = {
        title: `${productDetail.productName} with ${diamondShapeName} Diamonds | Katanoff Fine Jewelry`,
        description:
          `Shop ${productDetail.productName} featuring brilliant ${diamondShapeName} diamonds at Katanoff. Elegant craftsmanship and timeless fine jewelry.` ||
          "Explore the latest jewelry designs with Katanoff. High-quality, beautifully crafted pendants and more.",
        keywords: `${
          productDetail.productName
        }, ${diamondShapeName} Diamond ${subCategory}, Diamond Jewelry, Fine Jewelry, Katanoff, Diamond Jewelry in New York City, New York City, US, United States, ${
          productTypeName ? `Shop ${productTypeName},` : ``
        } ${productTypeName ? `Buy Diamond ${productTypeName}` : ""}`,
        openGraphImage: ogImage,
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

export default function ProductLayout({ children }) {
  return children;
}
