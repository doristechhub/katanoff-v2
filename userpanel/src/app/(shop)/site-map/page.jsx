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
          href: "/collections/categories/rings",
          subLinks: [
            {
              title: "Diamond Rings",
              href: "/collections/categories/rings/diamond-rings",
            },
            {
              title: "Anniversary Rings",
              href: "/collections/categories/rings/anniversary-rings",
            },
          ],
        },

        // Earrings
        {
          title: "Earrings",
          href: "/collections/categories/earrings",
          subLinks: [
            { title: "Hoops", href: "/collections/categories/earrings/hoops" },
            { title: "Studs", href: "/collections/categories/earrings/studs" },
            {
              title: "Fashion",
              href: "/collections/categories/earrings/fashion",
            },
          ],
        },

        // Necklaces
        {
          title: "Necklaces",
          href: "/collections/categories/necklaces",
          subLinks: [
            {
              title: "Tennis",
              href: "/collections/categories/necklaces/tennis",
            },
            {
              title: "Fashion",
              href: "/collections/categories/necklaces/fashion",
            },
            {
              title: "Pendants",
              href: "/collections/categories/necklaces/pendants",
            },
          ],
        },

        // Bracelets
        {
          title: "Bracelets",
          href: "/collections/categories/bracelets",
          subLinks: [
            {
              title: "Tennis",
              href: "/collections/categories/bracelets/tennis",
            },
            {
              title: "Fashion",
              href: "/collections/categories/bracelets/fashion",
            },
            { title: "Bands", href: "/collections/categories/bracelets/bands" },
          ],
        },

        // Men's Jewelry
        {
          title: "Men’s Jewelry",
          href: "/collections/categories/mens-jewelry",
          subLinks: [
            {
              title: "Chains",
              href: "/collections/categories/mens-jewelry/chains",
            },
            {
              title: "Rings",
              href: "/collections/categories/mens-jewelry/rings",
            },
            {
              title: "Bracelets",
              href: "/collections/categories/mens-jewelry/bracelets",
            },
            {
              title: "Pendants",
              href: "/collections/categories/mens-jewelry/pendants",
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
