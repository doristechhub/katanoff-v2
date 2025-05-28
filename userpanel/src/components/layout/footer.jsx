import whiteLogo from "@/assets/images/white-logo.webp";

import CustomImg from "../ui/custom-img";
import {
  companyEmail,
  companyPhoneNo,
  facebookUrl,
  instagramUrl,
  pinterestUrl,
  tiktokUrl,
} from "@/_helper";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa6";
import Link from "next/link";
import SubscribeEmail from "../ui/SubscribeEmail";

export default function footer() {
  const mediaLinks = [
    {
      icon: <FaFacebookF />,
      href: facebookUrl,
    },
    {
      icon: <FaInstagram />,
      href: instagramUrl,
    },
    {
      icon: <FaTiktok />,
      href: tiktokUrl,
    },
    {
      icon: <FaPinterest />,
      href: pinterestUrl,
    },
  ];
  const footerLinks = [
    {
      title: "Support",
      navLinks: [
        {
          title: "Returns",
          href: "/return-policy",
        },
        {
          title: "Shipping",
          href: "/shipping-policy",
        },
        {
          title: "Warranty",
          href: "/warranty",
        },
        {
          title: "Track Your Order",
          href: "/track-your-order",
        },
        {
          title: "Track Your Return",
          href: "/track-your-return",
        },
        {
          title: "Payment and Financing",
          href: "/payment-financing",
        },
      ],
    },
    {
      title: "Contact",
      navLinks: [
        {
          title: companyPhoneNo,
          href: `tel:${companyPhoneNo}`,
        },
        {
          title: "Email Us",
          href: `mailto:${companyEmail}`,
        },
        {
          title: "Book an Appointment",
          href: "appointment-and-custom-jewelry",
        },
      ],
    },
    {
      title: "Subscribe",
      subscribe: true,
    },
  ];
  return (
    <footer className="mt-10 md:mt-14 lg:mt-20 2xl:mt-20 bg-primary">
      <div className="p-8 pt-12 md:p-12 md:pt-14 lg:p-16 lg:pt-20 2xl:p-24 2xl:pt-28 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4 ">
            <Link href="/">
              <CustomImg
                srcAttr={whiteLogo}
                altAttr=""
                titleAttr=""
                className="w-60 2xl:w-80 ps-6"
              />
            </Link>
            <div className="bg-offwhite p-4 md:p-6 leading-relaxed">
              <div className="w-full overflow-hidden">
                <video
                  muted
                  autoPlay
                  loop
                  className="w-full h-48 md:h-64 lg:h-52 2xl:h-60 object-cover transform"
                  playsInline
                >
                  <source src={"/videos/footer.mp4"} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <h3 className="uppercase text-black text-lg 2xl:text-xl py-4">
                Watch our new video
              </h3>
              <p className="text-[#888888] text-base 2xl:text-lg">
                On the other hand, we denounce with righteous indignation and
                dislike men who are so beguiled and demoralized by the charms of
                pleasure of the
              </p>
            </div>
          </div>
          <div className="lg:col-span-8 2xl:col-start-6 2xl:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 2xl:gap-0 min-h-[450px] 2xl:min-h-[550px]">
              {footerLinks?.length &&
                footerLinks?.map((link, index) => {
                  return (
                    <div key={`footer-link-${index}`}>
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
                                <li className="py-1 2xl:text-lg">
                                  {nav?.title}
                                </li>
                              </Link>
                            );
                          })}
                        {link?.subscribe ? (
                          <>
                            <h3 className="font-bold 2xl:text-xl">
                              Get on the Guest List
                            </h3>
                            <p className="mt-1 2xl:text-lg">
                              Perks include $100 off your first order* Plus new
                              product launches, store openings, and more!
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
                          </>
                        ) : null}
                      </ul>
                    </div>
                  );
                })}{" "}
              <div className="2xl:col-span-3 2xl:self-end">
                <div className="flex flex-col flex-wrap lg:flex-row 2xl:justify-end gap-2 lg:gap-4 2xl:text-lg">
                  <ul className="md:list-disc">
                    <li>© 2025 Katanoff.com</li>
                  </ul>
                  <Link href={"/terms-and-conditions"}>Terms & Conditions</Link>
                  <Link href={"/privacy-policy"}>Privacy Policy</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
