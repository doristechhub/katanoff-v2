"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ProgressiveImg } from "../dynamiComponents";
import { PrimaryLinkButton } from "./button";
import progressiveMobile from "@/assets/images/progressive-mobile.webp";
import progressiveDesktop from "@/assets/images/progressive-desktop.webp";
import CustomImg from "./custom-img";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import slide1 from "@/assets/images/home/slide-1.webp";
import slide2 from "@/assets/images/home/slide-2.webp";
import slide3 from "@/assets/images/home/slide-3.webp";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import { PAGE_CONSTANTS } from "@/_helper";
const dropdownItems = [
  { title: "Build Your Own", href: `/customize/select-diamond` },
  { title: "Pre Designed", href: `/collections/collection/Engagement_Rings` },
];

const sliderImages = [{ src: slide1 }, { src: slide2 }, { src: slide3 }];

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
      Find Your Ring
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
        <div className="relative w-full h-[70vh] md:h-screen">
          {/* Swiper Slider */}
          <Swiper
            modules={[Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            className="w-full h-full"
          >
            {sliderImages.map((img, index) => (
              <SwiperSlide key={index}>
                <CustomImg
                  srcAttr={img?.src}
                  altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
                  titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dark Overlay Layer (above slider, below content) */}
          <div className="absolute inset-0 bg-black/30 z-20"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center lg:items-start text-center z-20 px-4 md:px-20">
            <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-medium leading-tight font-gelasio text-white">
              Diamonds That Celebrate <br /> Your Unique Style.
            </h1>

            {/* Desktop Dropdown */}
            <div className="hidden md:flex mt-4 flex-col md:flex-row items-center md:justify-start gap-2.5 md:gap-4">
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
                Explore Jewelry
              </PrimaryLinkButton>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden flex mt-6 items-center gap-3 px-5">
              <DropdownMenu
                isOpen={isDropdownOpen}
                toggle={toggleDropdown}
                items={dropdownItems}
                // variant="blackHover"
                fullWidth
              />
              <PrimaryLinkButton
                href="/collections/categories/Jewelry"
                variant="transparentHover"
                className="!rounded-none !text-sm"
              >
                Explore Jewelry
              </PrimaryLinkButton>
            </div>
          </div>
        </div>
      ) : (
        <BannerImage {...props} />
      )}

      <div className={`absolute inset-0 flex items-center p-4 ${customClass}`}>
        <div
          className={`flex flex-col items-${textAlignment} w-full max-w-[90%] sm:max-w-[70%] lg:max-w-[60%] text-${textAlignment} md:gap-3`}
        >
          {title && description && (
            <>
              <h1 className="text-3xl md:text-5xl 2xl:text-6xl text-white font-gelasio capitalize">
                {title}
              </h1>
              <p className="text-base md:text-lg text-white">{description}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
