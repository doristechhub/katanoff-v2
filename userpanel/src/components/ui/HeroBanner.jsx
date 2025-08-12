"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CustomImg, ProgressiveImg } from "../dynamiComponents";
import { PrimaryLinkButton } from "./button";
import progressiveMobile from "@/assets/images/progressive-mobile.webp";
import progressiveDesktop from "@/assets/images/progressive-desktop.webp";

const dropdownItems = [
  { title: "Design Your Own", href: `/customize/select-diamond` },
  { title: "Pre Designed", href: `/collections/collection/Engagement_Rings` },
];

/* -------------------- Dropdown Menu Component -------------------- */
const DropdownMenu = ({
  isOpen,
  toggle,
  items,
  variant = "transparentHover",
  fullWidth = false,
}) => (
  <div className="relative">
    <PrimaryLinkButton
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      href="#"
      variant={variant}
      className={`!rounded-none cursor-pointer !text-sm ${
        fullWidth ? "!w-full" : ""
      }`}
    >
      SHOP ENGAGEMENT
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </PrimaryLinkButton>

    {isOpen && (
      <div
        className={`absolute top-full ${
          fullWidth ? "left-1/2 -translate-x-1/2" : "left-0"
        } mt-0 w-full bg-white shadow-md`}
      >
        {items.map((item, index) => (
          <Link
            key={`dropdown-item-${index}`}
            href={item.href}
            className="block px-4 py-3 text-sm text-baseblack font-semibold hover:bg-primary hover:text-white transition-colors duration-150"
            onClick={toggle}
          >
            {item.title}
          </Link>
        ))}
      </div>
    )}
  </div>
);

/* -------------------- Banner Image / Video Component -------------------- */
const BannerImage = ({
  imageSrc,
  imageSrcDesktop,
  imageSrcMobile,
  staticSrcDesktop,
  staticSrcMobile,
  videoSrc,
  isStaticBanner,
  isHomePage,
  altAttr,
  titleAttr,
}) => {
  if (imageSrcDesktop || imageSrcMobile) {
    return (
      <>
        {imageSrcMobile && (
          <ProgressiveImg
            src={imageSrcMobile}
            title={titleAttr}
            alt={altAttr}
            placeholderSrc={progressiveMobile}
            className="object-cover w-full lg:hidden"
            progressiveImgClassName="!object-none w-full"
          />
        )}
        {imageSrcDesktop && (
          <ProgressiveImg
            src={imageSrcDesktop}
            title={titleAttr}
            alt={altAttr}
            placeholderSrc={progressiveDesktop}
            className="object-cover w-full hidden lg:block"
            progressiveImgClassName="!object-none w-full"
          />
        )}
      </>
    );
  }

  if (staticSrcDesktop || staticSrcMobile) {
    return (
      <>
        {staticSrcDesktop && (
          <CustomImg
            src={staticSrcDesktop}
            title={titleAttr}
            alt={altAttr}
            className="object-cover w-full h-full hidden lg:block"
          />
        )}
        {staticSrcMobile && (
          <CustomImg
            src={staticSrcMobile}
            title={titleAttr}
            alt={altAttr}
            className="object-cover w-full h-full lg:hidden"
          />
        )}
      </>
    );
  }

  if (imageSrc) {
    return (
      <CustomImg
        srcAttr={imageSrc}
        altAttr={altAttr}
        titleAttr={titleAttr}
        priority
        className={`w-full ${
          isStaticBanner
            ? "object-cover h-[40vh] lg:h-auto"
            : isHomePage
            ? "object-cover h-full"
            : "h-[18vh] lg:h-auto"
        }`}
      />
    );
  }

  if (videoSrc) {
    return (
      <video
        muted
        preload="none"
        aria-label="Video player"
        playsInline
        autoPlay
        loop
        className="absolute top-0 left-0 w-full h-full"
        style={{ objectFit: "cover", objectPosition: "center" }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    );
  }

  return null;
};

/* -------------------- Main HeroBanner Component -------------------- */
const HeroBanner = (props) => {
  const {
    title,
    description,
    textAlignment = "center",
    isHomePage = false,
    customClass = "justify-center",
  } = props;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <section
      className={`relative md:overflow-hidden ${
        isHomePage ? "flex flex-col gap-6 md:gap-10" : "h-auto"
      }`}
    >
      {isHomePage ? (
        <div className="w-full xl:h-[90vh] 2xl:h-[100vh] text-center">
          <video
            muted
            preload="auto"
            playsInline
            autoPlay
            loop
            className="w-full h-auto object-cover"
          >
            <source src="/videos/home-page-video.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <BannerImage {...props} />
      )}

      {isHomePage ? (
        <div className="md:absolute md:inset-0 flex justify-center md:justify-normal items-center w-full my-6">
          <div className="md:w-[60%] lg:w-[45%] 2xl:w-[40%] text-baseblack md:text-white text-center">
            <h1 className="text-3xl 2xl:text-4xl font-medium leading-tight font-castoro">
              Diamonds that <br /> Deserve You.
            </h1>

            {/* Desktop Dropdown */}
            <div className="hidden md:flex mt-4 flex-col md:flex-row items-center md:justify-center gap-2.5 md:gap-4">
              <DropdownMenu
                isOpen={isDropdownOpen}
                toggle={toggleDropdown}
                items={dropdownItems}
              />
              <PrimaryLinkButton
                href="/collections/categories/Jewelry"
                variant="transparentHover"
                className="!rounded-none !text-sm"
              >
                SHOP ALL JEWELRY
              </PrimaryLinkButton>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden px-2 flex mt-4 flex-col items-center justify-center gap-2.5 md:gap-4">
              <DropdownMenu
                isOpen={isDropdownOpen}
                toggle={toggleDropdown}
                items={dropdownItems}
                variant="blackHover"
                fullWidth
              />
              <PrimaryLinkButton
                href="/collections/categories/Jewelry"
                variant="blackHover"
                className="!rounded-none !text-sm !w-full"
              >
                SHOP ALL JEWELRY
              </PrimaryLinkButton>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`absolute inset-0 flex items-center p-4 ${customClass}`}
        >
          <div
            className={`flex flex-col items-${textAlignment} w-full max-w-[90%] sm:max-w-[70%] lg:max-w-[60%] text-${textAlignment} md:gap-3`}
          >
            {title && description && (
              <>
                <h1 className="text-3xl md:text-5xl 2xl:text-6xl text-white font-castoro capitalize">
                  {title}
                </h1>
                <p className="text-base md:text-lg text-white">{description}</p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
