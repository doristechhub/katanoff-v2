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

    // Keep both versions
    const collectionTitleWithUnderscore =
      helperFunctions.stringReplacedWithUnderScore(
        decodeURIComponent(collectionTitle)
      );
    const collectionTitleWithSpace = helperFunctions.stringReplacedWithSpace(
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
      metaTitle = `Shop ${collectionTitleWithSpace} | Lab Grown Diamond Jewelry | Katanoff`;
      metaDesc = `Explore ${collectionTitleWithSpace} at Katanoff – luxury lab grown diamond jewelry crafted for everyday elegance, special occasions, and lasting beauty.`;
      metaKeyword = `Shop ${collectionTitleWithSpace}, Buy ${collectionTitleWithSpace}, Lab Grown Diamond ${collectionTitleWithSpace}, Ethical Diamond Jewelry, Katanoff, Diamond Jewelry in New York City, New York City, US, United States, Shop Diamond ${collectionTitleWithSpace}, Buy Diamond ${collectionTitleWithSpace}`;
    } else if (collectionType === PRODUCT_TYPES) {
      if (parentCategory === "Men’s Jewelry") {
        metaTitle = `Shop Men's ${collectionTitleWithSpace} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Explore our collection of men's ${collectionTitleWithSpace} crafted with lab grown diamonds. Katanoff brings modern style, fine craftsmanship, and sustainable luxury.`;
        metaKeyword = `men's ${collectionTitleWithSpace}, men's diamond ${collectionTitleWithSpace}, lab grown diamond men's ${collectionTitleWithSpace}, sustainable men's jewelry`;
      } else if (
        collectionTitleWithSpace
          ?.toLowerCase()
          ?.includes(parentCategory?.toLowerCase())
      ) {
        metaTitle = `Shop ${collectionTitleWithSpace} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Discover our stunning ${collectionTitleWithSpace} collection, featuring lab grown diamonds set in timeless designs. Shop sustainable, high-quality jewelry at Katanoff.`;
        metaKeyword = `${collectionTitleWithSpace}, diamond ${collectionTitleWithSpace}, lab grown diamond ${collectionTitleWithSpace}, sustainable ${collectionTitleWithSpace} jewelry`;
      } else {
        metaTitle = `Shop ${collectionTitleWithSpace} ${parentCategory} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Shop elegant ${collectionTitleWithSpace} ${parentCategory} at Katanoff. Designed with lab grown diamonds, each piece blends brilliance, quality, and sustainability.`;
        metaKeyword = `${collectionTitleWithSpace} ${parentCategory}, diamond ${collectionTitleWithSpace} ${parentCategory}, lab grown ${collectionTitleWithSpace} ${parentCategory}, sustainable ${collectionTitleWithSpace} jewelry`;
      }
    } else if ([COLLECTION, GENERAL].includes(collectionType)) {
      metaTitle = `${collectionTitleWithSpace} | Lab Grown Diamond Jewelry Deals | Katanoff`;
      metaDesc = `Discover ${collectionTitleWithSpace} collection at Katanoff. Featuring lab grown diamond jewelry with timeless design, expert craftsmanship, and exceptional value.`;
      metaKeyword = `${collectionTitleWithSpace}, Lab Grown Diamond Jewelry, Fine Jewelry, Katanoff Jewelry, Diamond Jewelry in New York City, New York City, US, United States,`;
    }

    /** ----------- BANNER HANDLING ----------- **/
    let openGraphImage = DEFAULT_META.openGraphImage;

    if (collectionType === GENERAL) {
      if (STATIC_PROPS[collectionTitleWithSpace]) {
        openGraphImage = `${WebsiteUrl}${STATIC_PROPS[collectionTitleWithSpace]}`;
      }
    } else {
      const collectionDetail = await productService.fetchCollectionBanners({
        collectionCategory: collectionType,
        collectionName: collectionTitleWithSpace, // <-- Using space for API
        parentSubCategory: parentCategory || "",
        parentMainCategory,
      });
      if (collectionDetail?.mobile) openGraphImage = collectionDetail.mobile;
    }

    /** ----------- CANONICAL URL ----------- **/
    const canonicalUrl = `${WebsiteUrl}/collections/${collectionType}/${collectionTitleWithUnderscore}${
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

export default function CollectionLayout({ children }) {
  return children;
}
