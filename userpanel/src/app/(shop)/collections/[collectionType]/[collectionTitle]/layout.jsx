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
  NEW_ARRIVAL,
} from "@/_helper";
import { DEFAULT_META } from "@/_helper/pageMeta";
import { productService } from "@/_services";
import { generateMetadata as generateMetaConfig } from "@/_utils/metaConfig";
import { headers } from "next/headers";

const giftsForHimMobile = "/images/giftsForHimMobile.webp";
const giftsForHerMobile = "/images/giftsForHerMobile.webp";
const giftsUnder1000Mobile = "/images/giftsUnder1000Mobile.webp";
const newArrivalMobile = "/images/newArrivalMobile.webp";

export async function generateMetadata({ params }) {
  try {
    let { collectionType, collectionTitle } = await params;

    const { formatLabel, stringReplacedWithSpace } = helperFunctions;
    let metaTitle = "";
    let metaKeyword = "";
    let metaDesc = "";

    const headersList = await headers();
    const completeUrl = headersList.get("x-url") || "";
    const urlObj = new URL(completeUrl);
    const searchParams = urlObj.searchParams;

    const parentCategorySearchedParams = searchParams.get("parentCategory");
    const parentMainCategorySearchedParams =
      searchParams.get("parentMainCategory");

    const parentCategory = formatLabel(parentCategorySearchedParams);
    const parentMainCategory = formatLabel(parentMainCategorySearchedParams);

    const collectionTitleWithSpace = stringReplacedWithSpace(
      decodeURIComponent(collectionTitle)
    );

    const formatCollectionTitle = formatLabel(
      collectionTitleWithSpace
    )?.toString();
    const collectionTitleForUrl = collectionTitle;

    /** ----------- STATIC BANNER CONFIG ----------- **/
    const STATIC_PROPS = {
      [GIFTS_FOR_HER]: giftsForHerMobile,
      [GIFTS_FOR_HIM]: giftsForHimMobile,
      [GIFTS_UNDER_1000]: giftsUnder1000Mobile,
      [NEW_ARRIVAL]: newArrivalMobile,
    };

    /** ----------- META TITLE / DESC / KEYWORDS ----------- **/

    if ([CATEGORIES, SUB_CATEGORIES].includes(collectionType)) {
      metaTitle = `Shop ${formatCollectionTitle} | Lab Grown Diamond Jewelry | Katanoff`;
      metaDesc = `Explore ${formatCollectionTitle} at Katanoff – luxury lab grown diamond jewelry crafted for everyday elegance, special occasions, and lasting beauty.`;
      metaKeyword = `Shop ${formatCollectionTitle}, Buy ${formatCollectionTitle}, Lab Grown Diamond ${formatCollectionTitle}, Ethical Diamond Jewelry, Katanoff, Diamond Jewelry in New York City, New York City, US, United States, Shop Diamond ${formatCollectionTitle}, Buy Diamond ${formatCollectionTitle}`;
    } else if (collectionType === PRODUCT_TYPES) {
      if (parentCategory === "Men’s Jewelry") {
        metaTitle = `Shop Men's ${formatCollectionTitle} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Explore our collection of men's ${formatCollectionTitle} crafted with lab grown diamonds. Katanoff brings modern style, fine craftsmanship, and sustainable luxury.`;
        metaKeyword = `men's ${formatCollectionTitle}, men's diamond ${formatCollectionTitle}, lab grown diamond men's ${formatCollectionTitle}, sustainable men's jewelry`;
      } else if (
        formatCollectionTitle
          ?.toLowerCase()
          ?.includes(parentCategory?.toLowerCase())
      ) {
        metaTitle = `Shop ${formatCollectionTitle} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Discover our stunning ${formatCollectionTitle} collection, featuring lab grown diamonds set in timeless designs. Shop sustainable, high-quality jewelry at Katanoff.`;
        metaKeyword = `${formatCollectionTitle}, diamond ${formatCollectionTitle}, lab grown diamond ${formatCollectionTitle}, sustainable ${formatCollectionTitle} jewelry`;
      } else {
        metaTitle = `Shop ${formatCollectionTitle} ${parentCategory} | Lab Grown Diamond Jewelry | Katanoff`;
        metaDesc = `Shop elegant ${formatCollectionTitle} ${parentCategory} at Katanoff. Designed with lab grown diamonds, each piece blends brilliance, quality, and sustainability.`;
        metaKeyword = `${formatCollectionTitle} ${parentCategory}, diamond ${formatCollectionTitle} ${parentCategory}, lab grown ${formatCollectionTitle} ${parentCategory}, sustainable ${formatCollectionTitle} jewelry`;
      }
    } else if ([COLLECTION, GENERAL].includes(collectionType)) {
      metaTitle = `${formatCollectionTitle} | Lab Grown Diamond Jewelry Deals | Katanoff`;
      metaDesc = `Discover ${formatCollectionTitle} collection at Katanoff. Featuring lab grown diamond jewelry with timeless design, expert craftsmanship, and exceptional value.`;
      metaKeyword = `${formatCollectionTitle}, Lab Grown Diamond Jewelry, Fine Jewelry, Katanoff Jewelry, Diamond Jewelry in New York City, New York City, US, United States,`;
    }

    /** ----------- BANNER HANDLING ----------- **/
    let openGraphImage = DEFAULT_META.openGraphImage;

    if (collectionType === GENERAL) {
      if (STATIC_PROPS[formatCollectionTitle]) {
        openGraphImage = `${WebsiteUrl}${STATIC_PROPS[formatCollectionTitle]}`;
      }
    } else {
      const collectionDetail = await productService.fetchCollectionBanners({
        collectionCategory: collectionType,
        collectionName: formatCollectionTitle, // <-- Using space for API
        parentSubCategory: parentCategory || "",
        parentMainCategory,
      });
      if (collectionDetail?.mobile) openGraphImage = collectionDetail.mobile;
    }

    /** ----------- CANONICAL URL ----------- **/
    const rawQuery = searchParams.toString();
    const prettyQuery = rawQuery ? rawQuery.replace(/%2F/gi, "/") : "";
    const canonicalUrl = `${WebsiteUrl}/collections/${collectionType}/${collectionTitleForUrl}${
      prettyQuery ? `?${prettyQuery}` : ""
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

export default async function CollectionLayout({ children, params }) {
  const { collectionTitle } = await params;
  const { formatLabel, stringReplacedWithSpace } = helperFunctions;
  const collectionTitleWithSpace = stringReplacedWithSpace(
    decodeURIComponent(collectionTitle)
  );

  const formatCollectionTitle = formatLabel(collectionTitleWithSpace);

  return (
    <>
      <h1 className="hidden">{formatCollectionTitle}</h1>
      {children}
    </>
  );
}
