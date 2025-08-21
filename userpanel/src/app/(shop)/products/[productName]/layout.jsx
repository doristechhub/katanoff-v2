// // products/[productName]/layout.jsx
// import { generateMetadata as buildMeta } from "@/_utils/metaConfig";
// import { WebsiteUrl } from "@/_helper";

// export async function generateMetadata({ params }) {
//   const { productName } = params;

//   // Example: Fetch product details (replace with real API/service)
//   // This could be a DB call, API fetch, etc.
//   const product = await getProductByName(productName);

//   const META_TITLE = `${product.name} | Katanoff Fine Jewelry`;
//   const META_DESCRIPTION =
//     product.description ||
//     `Discover ${product.name} at Katanoff. Exceptional craftsmanship, timeless elegance, and unique designs.`;
//   const META_KEYWORDS = `Katanoff, ${product.name}, fine jewelry, gold jewelry, diamond jewelry, ${product.category}`;
//   const CANONICAL_URL = `${WebsiteUrl}/products/${productName}`;

//   return buildMeta({
//     title: META_TITLE,
//     description: META_DESCRIPTION,
//     keywords: META_KEYWORDS,
//     url: CANONICAL_URL,
//     openGraphImage: product.image || "/opengraph-image.png",
//   });
// }

export default function ProductLayout({ children }) {
  return <div>{children}</div>;
}

// Example mock fetcher (replace with real data)
// async function getProductByName(productName) {
//   return {
//     name: productName.replace("-", " "),
//     description: "This is a sample product description.",
//     category: "rings",
//     image: "/sample-product.png",
//   };
// }
