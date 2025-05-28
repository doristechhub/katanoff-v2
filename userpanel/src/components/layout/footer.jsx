"use client";

import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTiktok,
} from "react-icons/fa6";
import footerBGShape from "@/assets/images/footer-bg-shape.webp";
import {
  companyEmail,
  companyPhoneNo,
  facebookUrl,
  instagramUrl,
  pinterestUrl,
  tiktokUrl,
} from "@/_helper";
import { CustomImg } from "../dynamiComponents";
import logo from "@/assets/images/footer-logo.webp";
import Link from "next/link";
import SubscribeEmail from "../ui/SubscribeEmail";

const footerLinks = [
  {
    title: "Support",
    navLinks: [
      { title: "Returns", href: "/return-policy" },
      { title: "Shipping", href: "/shipping-policy" },
      { title: "Warranty", href: "/warranty" },
      { title: "Track Your Order", href: "/track-your-order" },
      { title: "Track Your Return", href: "/track-your-return" },
      { title: "Payment and Financing", href: "/payment-financing" },
    ],
  },
  {
    title: "Contact",
    navLinks: [
      { title: companyPhoneNo, href: `tel:${companyPhoneNo}` },
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

  // Static routes to match exactly
  const noMarginStaticRoutes = [];

  const shouldRemoveMargin =
    isProductDetailPage || noMarginStaticRoutes.includes(pathname);

  const footerMarginClass = shouldRemoveMargin
    ? ""
    : "mt-10 md:mt-14 lg:mt-20 2xl:mt-20";

  const mediaLinks = [
    { icon: <FaFacebookF />, href: facebookUrl },
    { icon: <FaInstagram />, href: instagramUrl },
    { icon: <FaPinterestP />, href: pinterestUrl },
    { icon: <FaTiktok />, href: tiktokUrl },
  ];

  return (
    <footer className={`${footerMarginClass} bg-primary relative`}>
      <div className="pt-20 pb-10 2xl:pt-24 2xl:pb-14 text-white px-6 md:px-14 2xl:px-20">
        <div className="z-40 relative grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6 lg:col-span-3">
            <Link href="/" className="inline-block">
              <CustomImg
                srcAttr={logo}
                className="w-32 2xl:w-auto"
                altAttr="katanoff"
                titleAttr="katanoff"
              />
            </Link>
          </div>
          {footerLinks?.length &&
            footerLinks?.map((link, index) => {
              return (
                <div
                  className="md:col-span-6 lg:col-span-2"
                  key={`footer-link-${index}`}
                >
                  <h4 className="text-lg 2xl:text-2xl font-semibold">
                    {link?.title}
                  </h4>

                  <ul className="mt-4">
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
          <div className="md:col-span-6 lg:col-span-5">
            <h4 className="text-lg 2xl:text-2xl font-semibold">Subscribe</h4>
            <h3 className="font-bold 2xl:text-xl mt-4">
              Get on the Guest List
            </h3>
            <p className="w-[70%] md:w-full mt-1 2xl:text-lg">
              Perks include $100 off your first order* Plus new product
              launches, store openings, and more!
            </p>
            <SubscribeEmail />
            <div className="flex gap-5 mt-5 lg:mt-8">
              {mediaLinks?.map((media, index) => {
                return (
                  <Link
                    className="text-2xl"
                    key={`social-media-${index}`}
                    href={media?.href}
                    target="_blank"
                  >
                    {media?.icon}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="lg:h-[30vh] 2xl:h-[35vh] md:flex md:justify-end md:items-end mt-10 md:mt-14 lg:mt-0">
          <div className="flex flex-col flex-wrap md:flex-row 2xl:justify-end gap-2 lg:gap-4 2xl:text-lg">
            <ul className="md:list-disc">
              <li>© 2025 Katanoff.com</li>
            </ul>
            <Link href={"/terms-and-conditions"}>Terms & Conditions</Link>
            <Link href={"/privacy-policy"}>Privacy Policy</Link>
          </div>
        </div>
      </div>
      <CustomImg
        srcAttr={footerBGShape}
        className="hidden lg:block absolute bottom-0 left-0 w-[45%] 2xl:w-[40%]"
        altAttr=""
        titleAttr=""
      />
    </footer>
  );
}
