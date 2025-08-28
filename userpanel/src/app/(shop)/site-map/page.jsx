import { HeaderLinkButton } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import Link from "next/link";

export default function SiteMapPage() {
  const siteMapData = [
    {
      title: "About Katanoff",
      links: [
        { title: "About Us", href: "/about-us" },
        { title: "Education", href: "/education" },
        { title: "Custom Jewelry", href: "/custom-jewelry" },
      ],
    },
    {
      title: "Jewelry",
      href: "/collections/categories/Jewelry",
      links: [
        // Rings
        {
          title: "Rings",
          href: "/collections/subCategories/rings?parentMainCategory=Jewelry",
          subLinks: [
            {
              title: "High Jewelry",
              href: "/collections/productTypes/High_Jewelry?parentCategory=Rings&parentMainCategory=Jewelry",
            },
            {
              title: "Fashion Rings",
              href: "/collections/productTypes/Fashion_Rings?parentCategory=Rings&parentMainCategory=Jewelry",
            },
            {
              title: "Diamond Rings",
              href: "/collections/productTypes/Diamond_Rings?parentCategory=Rings&parentMainCategory=Jewelry",
            },
            {
              title: "Anniversary Rings",
              href: "/collections/productTypes/Anniversary_Rings?parentCategory=Rings&parentMainCategory=Jewelry",
            },
          ],
        },

        // Earrings
        {
          title: "Earrings",
          href: "/collections/subCategories/earrings?parentMainCategory=Jewelry",
          subLinks: [
            {
              title: "Hoops",
              href: "/collections/productTypes/Hoops?parentCategory=Earrings&parentMainCategory=Jewelry",
            },
            {
              title: "Studs",
              href: "/collections/productTypes/Studs?parentCategory=Earrings&parentMainCategory=Jewelry",
            },
            {
              title: "Fashion",
              href: "/collections/productTypes/Fashion?parentCategory=Earrings&parentMainCategory=Jewelry",
            },
          ],
        },

        // Necklaces
        {
          title: "Necklaces",
          href: "/collections/subCategories/Necklaces?parentMainCategory=Jewelry",
          subLinks: [
            {
              title: "Fashion",
              href: "/collections/productTypes/Fashion?parentCategory=Necklaces&parentMainCategory=Jewelry",
            },

            {
              title: "Pendants",
              href: "/collections/productTypes/Pendants?parentCategory=Necklaces&parentMainCategory=Jewelry",
            },
          ],
        },

        // Bracelets
        {
          title: "Bracelets",
          href: "/collections/subCategories/Bracelets?parentMainCategory=Jewelry",
          subLinks: [
            {
              title: "Tennis",
              href: "/collections/productTypes/Tennis?parentCategory=Bracelets&parentMainCategory=Jewelry",
            },
            {
              title: "Fashion",
              href: "/collections/productTypes/Fashion?parentCategory=Bracelets&parentMainCategory=Jewelry",
            },
          ],
        },

        // Men's Jewelry
        {
          title: "Men’s Jewelry",
          href: "/collections/subCategories/Men's_Jewelry?parentMainCategory=Jewelry",
          subLinks: [
            {
              title: "Rings",
              href: "/collections/productTypes/Rings?parentCategory=Men%27s+Jewelry&parentMainCategory=Jewelry",
            },
            {
              title: "Bracelets",
              href: "/collections/productTypes/Bracelets?parentCategory=Men%27s+Jewelry&parentMainCategory=Jewelry",
            },
            {
              title: "Pendants",
              href: "/collections/productTypes/Pendants?parentCategory=Men%27s+Jewelry&parentMainCategory=Jewelry",
            },
          ],
        },
      ],
    },
    {
      title: "Collections",
      links: [
        { title: "Flash Deals", href: "/collections/collection/Flash_Deals" },
        { title: "Special buys", href: "/collections/collection/Special_Buys" },
        { title: "New Arrival", href: "/collections/collection/New_Arrival" },
        { title: "Tennis", href: "/collections/collection/Tennis" },
        { title: "Fashion", href: "/collections/collection/Fashion" },
        {
          title: "Trending Collections",
          href: "/collections/collection/Trending_Collections",
        },
        {
          title: "Quick Ship Gifts",
          href: "/collections/collection/Quick_Ship_Gifts",
        },
        {
          title: "Gifts For Her",
          href: "/collections/collection/Gifts_For_Her",
        },
        {
          title: "Gifts For Him",
          href: "/collections/collection/Gifts_For_Him",
        },
        {
          title: "Anniversary Gifts",
          href: "/collections/collection/Anniversary Gifts",
        },
        {
          title: "Gifts Under $1000",
          href: "/collections/collection/Gifts_Under_$1000",
        },
      ],
    },
    {
      title: "Lab Grown Diamonds",
      href: "/customize/select-diamond",
      links: [
        {
          title: "Round Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=round",
        },
        {
          title: "Princess Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=princess",
        },
        {
          title: "Cushion Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=cushion",
        },
        {
          title: "Asscher Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=asscher",
        },
        {
          title: "Heart Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=heart",
        },
        {
          title: "Emerald Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=emerald",
        },
        {
          title: "Pear Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=pear",
        },
        {
          title: "Oval Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=oval",
        },
        {
          title: "Radiant Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=radiant",
        },
        {
          title: "Marquise Lab Grown Diamonds",
          href: "/customize/select-diamond?shape=marquise",
        },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { title: "Contact us", href: "/contact-us" },
        { title: "Book an Appointment", href: "/book-appointment" },
        { title: "Shipping", href: "/shipping-policy" },
        { title: "Returns", href: "/return-policy" },
        { title: "Warranty", href: "/warranty" },
        { title: "Track Your Order", href: "/track-your-order" },
        { title: "Track Your Return", href: "/track-your-return" },
        { title: "Payment and Financing", href: "/payment-financing" },
        { title: "Terms & Conditions", href: "/terms-and-conditions" },
        { title: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
  ];

  return (
    <div className="container">
      {/* Page Heading */}
      <div className="pt-4 pb-8 md:py-12">
        <CommonBgHeading title="Site Map" breadcrumb={true} />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {siteMapData.map((category, idx) => (
          <div key={`category-${idx}`} className="space-y-3">
            {/* Category Title */}
            {category?.href ? (
              <Link
                href={category.href}
                className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 block hover:text-primary transition-colors"
              >
                {category.title}
              </Link>
            ) : (
              <span className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 block">
                {category.title}
              </span>
            )}

            {/* Category Links */}
            <div className="flex flex-col gap-2">
              {category?.links.map((link, index) => (
                <HeaderLinkButton
                  key={`link-${idx}-${index}`}
                  href={link?.href}
                  className="rounded-none flex items-center gap-1 text-sm md:text-base !capitalize !font-medium 
                 before:content-['•'] before:text-gray-800 before:mr-2 before:text-lg !px-2 2xl:!px-4"
                >
                  {link?.title}
                </HeaderLinkButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
