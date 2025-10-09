"use client";

import { usePathname } from "next/navigation";
import {
  // FaFacebookF,
  FaInstagram,
  // FaPinterestP,
  // FaTiktok,
} from "react-icons/fa6";
// import footerBGShape from "@/assets/images/footer-bg-shape.webp";
import footerDiamondShape from "@/assets/images/footer-shape-diamond.webp";
import {
  companyEmail,
  CURRENT_YEAR,
  // facebookUrl,
  instagramUrl,
  // pinterestUrl,
  // tiktokUrl,
} from "@/_helper";
import { SubscribeEmail } from "../dynamiComponents";
import footerLogo from "@/assets/images/footer-logo-name.webp";
import Link from "next/link";
import CustomImg from "../ui/custom-img";

const footerLinks = [
  {
    title: "Support",
    navLinks: [
      { title: "Returns", href: "/return-policy" },
      { title: "Shipping", href: "/shipping-policy" },
      { title: "Warranty", href: "/warranty" },
      { title: "Blog", href: "/blogs" },
      { title: "Track Your Order", href: "/track-your-order" },
      { title: "Track Your Return", href: "/track-your-return" },
      { title: "Payment and Financing", href: "/payment-financing" },
    ],
  },
  {
    title: "Contact",
    navLinks: [
      {
        title: "Call Us",
        href: "/contact-us",
      },
      { title: "Email Us", href: `mailto:${companyEmail}` },
      { title: "Book an Appointment", href: "/book-appointment" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  // Match dynamic /products/[productname] (but NOT /products)
  const isProductDetailPage =
    pathname.startsWith("/products/") && pathname.split("/").length === 3;
  const customizePage = pathname.startsWith("/customize/complete-ring");
  // Static routes to match exactly
  const noMarginStaticRoutes = [];

  const shouldRemoveMargin =
    customizePage ||
    isProductDetailPage ||
    noMarginStaticRoutes.includes(pathname);

  const footerMarginClass = shouldRemoveMargin
    ? ""
    : "mt-10 md:mt-14 lg:mt-20 2xl:mt-20";

  const mediaLinks = [
    // { icon: <FaFacebookF />, href: facebookUrl },
    { icon: <FaInstagram />, href: instagramUrl, name: "#katanoff_luxury" },
    // { icon: <FaPinterestP />, href: pinterestUrl },
    // { icon: <FaTiktok />, href: tiktokUrl },
  ];

  return (
    <footer className={`${footerMarginClass} bg-primary relative`}>
      <div className="pt-6 md:pt-10 pb-10 xl:pt-10 2xl:pb-14 text-white px-6 md:px-14 2xl:px-20">
        <div className="flex justify-center">
          <CustomImg
            srcAttr={footerLogo}
            altAttr="lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff"
            titleAttr="Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York"
            className="w-44 md:w-56 2xl:w-64"
          />
        </div>
        <div className="container z-10 pt-8 md:pt-10 xl:pt-6 relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
          {footerLinks?.length &&
            footerLinks?.map((link, index) => {
              return (
                <div key={`footer-link-${index}`}>
                  <h4 className="text-lg 2xl:text-xl font-medium">
                    {link?.title}
                  </h4>

                  <ul className="mt-2 md:mt-4 2xl:mt-6">
                    {link?.navLinks?.length &&
                      link?.navLinks?.map((nav, index) => {
                        return (
                          <Link
                            href={nav.href || "#"}
                            target={nav?.target}
                            key={`nav-${index}`}
                          >
                            <li className="py-1 2xl:text-lg">{nav?.title}</li>
                          </Link>
                        );
                      })}
                  </ul>
                </div>
              );
            })}
          <div className="max-w-md">
            <h4 className="text-lg 2xl:text-xl font-medium">Sign me Up</h4>
            <p className="md:w-full mt-2 md:mt-4 2xl:mt-6 2xl:text-lg">
              Unlock early access to launches, special invitations, and
              exclusive perks made for you.
            </p>
            <SubscribeEmail />
            <div className="flex gap-5 mt-4">
              {mediaLinks?.map((media, index) => {
                return (
                  <Link
                    className="text-2xl flex items-center gap-2 px-4 py-1 bg-[#313C66] rounded-md"
                    key={`social-media-${index}`}
                    href={media?.href}
                    target="_blank"
                  >
                    {media?.icon}
                    <span className="text-lg">{media?.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:h-[15vh] 2xl:h-[10vh] flex justify-center items-end mt-10 md:mt-14 lg:mt-0">
          <div className="flex flex-wrap 2xl:justify-end gap-2 lg:gap-4 2xl:text-lg text-center w-full justify-center">
            <ul className="">
              <li>© {CURRENT_YEAR} Katanoff.com</li>
            </ul>
            <Link href="/terms-and-conditions" className="hover:underline">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/site-map" className="hover:underline">
              Site Map
            </Link>
          </div>
        </div>
      </div>
      <CustomImg
        srcAttr={footerDiamondShape}
        className="hidden lg:block absolute bottom-0 left-0 w-[20%] 2xl:w-[15%]"
        altAttr="lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff"
        titleAttr="Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York"
      />
    </footer>
  );
}
