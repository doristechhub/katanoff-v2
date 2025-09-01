import {
  CATEGORIES,
  COLLECTION,
  GENERAL,
  helperFunctions,
  PRODUCT_TYPES,
  SUB_CATEGORIES,
  WebsiteUrl,
  GIFTS_FOR_HER,
  GIFTS_FOR_HIM,
  GIFTS_UNDER_1000,
} from "@/_helper";
import { DEFAULT_META } from "@/_helper/pageMeta";
import { productService } from "@/_services";
import { generateMetadata as generateMetaConfig } from "@/_utils/metaConfig";
import { headers } from "next/headers";

const giftsForHimMobile = "/images/giftsForHimMobile.webp";
const giftsForHerMobile = "/images/giftsForHerMobile.webp";
const giftsUnder1000Mobile = "/images/giftsUnder1000Mobile.webp";

export async function generateMetadata({ params }) {
  try {
    let { collectionType, collectionTitle } = params;
    let metaTitle = "";
    let metaKeyword = "";
    let metaDesc = "";

    const headersList = headers();
    const completeUrl = headersList.get("x-url") || "";
    const urlObj = new URL(completeUrl);
    const searchParams = urlObj.searchParams;

    const parentCategory = searchParams.get("parentCategory") || "";
    const parentMainCategory = searchParams.get("parentMainCategory") || "";

    collectionTitle = helperFunctions.stringReplacedWithUnderScore(
      decodeURIComponent(collectionTitle)
    );

    /** ----------- STATIC BANNER CONFIG ----------- **/
    const STATIC_PROPS = {
      [GIFTS_FOR_HER]: giftsForHerMobile,
      [GIFTS_FOR_HIM]: giftsForHimMobile,
      [GIFTS_UNDER_1000]: giftsUnder1000Mobile,
    };

    /** ----------- META TITLE / DESC / KEYWORDS ----------- **/
    if ([CATEGORIES, SUB_CATEGORIES].includes(collectionType)) {
      metaTitle = `Shop ${collectionTitle} | Lab Grown Diamond Jewelry | Katanoff`;
      metaDesc = `Explore ${collectionTitle} at Katanoff – luxury lab grown diamond jewelry crafted for everyday elegance, special occasions, and lasting beauty.`;
      metaKeyword = `Shop ${collectionTitle}, Buy ${collectionTitle}, Lab Grown Diamond ${collectionTitle}, Ethical Diamond Jewelry, Katanoff`;
    } else if (collectionType === PRODUCT_TYPES) {
      if (parentCategory === "Men’s Jewelry") {
        metaTitle = `Shop Men's ${collectionTitle} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Explore our collection of men's ${collectionTitle} crafted with lab grown diamonds. Katanoff brings modern style, fine craftsmanship, and sustainable luxury.`;
        metaKeyword = `men's ${collectionTitle}, men's diamond ${collectionTitle}, lab grown diamond men's ${collectionTitle}, sustainable men's jewelry`;
      } else if (
        collectionTitle?.toLowerCase()?.includes(parentCategory?.toLowerCase())
      ) {
        metaTitle = `Shop ${collectionTitle} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Discover our stunning ${collectionTitle} collection, featuring lab grown diamonds set in timeless designs. Shop sustainable, high-quality jewelry at Katanoff.`;
        metaKeyword = `${collectionTitle}, diamond ${collectionTitle}, lab grown diamond ${collectionTitle}, sustainable ${collectionTitle} jewelry`;
      } else {
        metaTitle = `Shop ${collectionTitle} ${parentCategory} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Shop elegant ${collectionTitle} ${parentCategory} at Katanoff. Designed with lab grown diamonds, each piece blends brilliance, quality, and sustainability.`;
        metaKeyword = `${collectionTitle} ${parentCategory}, diamond ${collectionTitle} ${parentCategory}, lab grown ${collectionTitle} ${parentCategory}, sustainable ${collectionTitle} jewelry`;
      }
    } else if ([COLLECTION, GENERAL].includes(collectionType)) {
      metaTitle = `${collectionTitle} | Lab Grown Diamond Jewelry Deals | Katanoff`;
      metaDesc = `Discover ${collectionTitle} collection at Katanoff. Featuring lab grown diamond jewelry with timeless design, expert craftsmanship, and exceptional value.`;
      metaKeyword = `${collectionTitle}, Lab Grown Diamond Jewelry, Fine Jewelry, Katanoff Jewelry`;
    }

    /** ----------- BANNER HANDLING ----------- **/
    let openGraphImage = DEFAULT_META.openGraphImage;

    if (collectionType === GENERAL) {
      if (STATIC_PROPS[collectionTitle])
        openGraphImage = `${WebsiteUrl}${STATIC_PROPS[collectionTitle]}`;
    } else {
      const collectionDetail = await productService.fetchCollectionBanners({
        collectionCategory: collectionType,
        collectionName: collectionTitle,
        parentSubCategory: parentCategory || "",
        parentMainCategory,
      });
      if (collectionDetail?.mobile) openGraphImage = collectionDetail?.mobile;
    }

    /** ----------- CANONICAL URL ----------- **/
    const canonicalUrl = `${WebsiteUrl}/collections/${collectionType}/${collectionTitle}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    /** ----------- FINAL META CONFIG ----------- **/
    const customMeta = {
      title: metaTitle,
      keywords: metaKeyword,
      description: metaDesc,
      url: canonicalUrl,
      openGraphImage,
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

export default function collectionLayout({ children }) {
  return children;
}
