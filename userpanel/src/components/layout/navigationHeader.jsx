"use client";
import {
  setIsMenuOpen,
  setLastScrollY,
  setOpenDropdown,
  setOpenDropdownMobile,
} from "@/store/slices/commonSlice";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import jewelry from "@/assets/images/jewelry.webp";
import { useCallback, useEffect, useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import miniLogo from "@/assets/images/mini-logo.webp";
import diamondIcon from "@/assets/icons/diamond.svg";
import flashDeal from "@/assets/images/flash-deal.webp";
import engagementHeader from "@/assets/images/engagement-header.webp";
import {
  CartIconInCheckout,
  CartPopup,
  HeaderLinkButton,
  ProfileDropdown,
  ProgressiveImg,
  SearchBar,
} from "@/components/dynamiComponents";
import {
  DIAMOND_SHAPE,
  ENGAGEMENT,
  ENGAGEMENT_RINGS,
  FLASH_DEALS,
  GOLD_COLOR,
  WEDDING,
  WEDDING_RINGS,
} from "@/_helper/constants";
import SkeletonLoader from "../ui/skeletonLoader";
import { usePathname } from "next/navigation";
import {
  fetchEngagementCollectionsTypeWiseProduct,
  fetchWeddingCollectionsTypeWiseProduct,
} from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import calendarIcon from "@/assets/icons/calendar.svg";
import CustomImg from "../ui/custom-img";

const headingClass =
  "font-castoro text-[0.9375em] leading-[1.0625em] mb-4 pb-2 border-b border-baseblack";
const staticLinks = [
  {
    title: "Custom",
    href: "/custom-jewelry",
  },
  {
    title: "About Katanoff",
    href: "/about-us",
  },
];

export const mainHeaderLinks = [
  { image: diamondIcon, href: "/contact-us", title: "contact us" },
  {
    icon: <HiOutlineShoppingBag className="text-xl" />,
    href: "/cart",
    title: "my cart",
  },
  // { image: calendarIcon, href: "/book-appointment", title: "book appointment" },
];

export default function NavigationHeader() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const {
    menuList,
    openDropdown,
    isMenuOpen,
    openDropdownMobile,
    menuLoading,
    weddingHeaderUniqueFilterOptions,
    customizeOptionLoading,
    transparentHeaderBg,
    weddingHeaderLoader,
    engagementHeaderLoader,
    lastScrollY,
    engagementHeaderUniqueFilterOptions,
  } = useSelector(({ common }) => common);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeNestedMobile, setActiveNestedMobile] = useState(null);
  const navSearchContainerRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const navSearchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const hideCartPopup = helperFunctions?.shouldHideCartPopup(pathname);

  const closeAllDropdown = useCallback(() => {
    setTimeout(() => {
      dispatch(setOpenDropdown(null));
      dispatch(setOpenDropdownMobile(null));
      dispatch(setIsMenuOpen(false));
    }, 200);
  }, [dispatch]);

  const loadData = useCallback(() => {
    dispatch(fetchWeddingCollectionsTypeWiseProduct());
    dispatch(fetchEngagementCollectionsTypeWiseProduct());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      dispatch(setLastScrollY(currentScrollY));
      setIsHeaderVisible(currentScrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, lastScrollY]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`w-full  ${
        transparentHeaderBg && !isHeaderVisible ? "bg-offwhite" : "bg-white"
      } ${
        // lastScrollY > 100 ? "bg-white shadow-lg" : "lg:pt-4"
        lastScrollY > 100 ? "bg-white shadow-lg" : "lg:pt-2"
      } z-40 transition-all duration-500 ease-in-out ${
        isHeaderVisible
          ? "fixed top-0 left-0 clear-both"
          : "relative  lg:opacity-100 lg:transform lg:translate-y-0"
      }`}
    >
      {/* Desktop Navigation */}
      <nav
        className={`hidden lg:flex  ${
          lastScrollY > 100 ? "justify-between" : "justify-center"
        } w-full container items-center gap-6`}
      >
        {lastScrollY > 100 ? (
          <Link href={"/"}>
            <CustomImg
              className={` ${
                lastScrollY > 100 ? "block w-12 2xl:w-12" : "hidden"
              }`}
              srcAttr={miniLogo}
            />
          </Link>
        ) : null}

        {menuLoading ? (
          <div
            className={`flex justify-center gap-12 ${
              transparentHeaderBg && !isHeaderVisible
                ? "bg-offwhite"
                : "bg-white"
            } ${lastScrollY > 100 ? "py-2 lg:py-5" : "py-4"}`}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader
                key={index}
                width="w-24 2xl:w-28"
                height="h-4 2xl:h-6"
                className="!px-5 2xl:!px-6"
              />
            ))}
          </div>
        ) : (
          <ul className={`flex`}>
            <li className={`relative`}>
              <HeaderLinkButton
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  FLASH_DEALS
                )}`}
                className={`rounded-none flex items-center gap-1 hover:!text-primary hover:!font-semibold  ${
                  lastScrollY > 100 ? "py-2 lg:py-5" : "py-4"
                }`}
                onClick={closeAllDropdown}
              >
                {FLASH_DEALS}
              </HeaderLinkButton>
            </li>
            <li
              className={`relative`}
              onMouseEnter={() => dispatch(setOpenDropdown(ENGAGEMENT))}
              onMouseLeave={() => dispatch(setOpenDropdown(null))}
            >
              <HeaderLinkButton
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  ENGAGEMENT_RINGS
                )}`}
                className={`rounded-none flex items-center gap-1 hover:!text-primary hover:!font-semibold ${
                  lastScrollY > 100 ? "py-2 lg:py-5" : "py-4"
                }`}
                onClick={closeAllDropdown}
              >
                {ENGAGEMENT}
              </HeaderLinkButton>
              {openDropdown === ENGAGEMENT ? (
                <div
                  className={`fixed left-0 right-0 ${
                    isHeaderVisible
                      ? "top-[54px] 2xl:top-[63px]"
                      : "2xl:top-full"
                  } bg-white shadow-lg z-50 border-t-[0.5px] border-primary`}
                >
                  {engagementHeaderLoader ? (
                    <div className="container grid grid-cols-2 py-[30px] gap-[30px] text-baseblack">
                      {/* Left Column Skeleton */}
                      <div>
                        <SkeletonLoader width="w-1/3" height="h-5" />{" "}
                        {/* PRE-DESIGNED RINGS title */}
                        <div className="grid grid-cols-12 gap-4 mb-[1.5rem] mt-4">
                          {/* Shop by Style */}
                          <div className="col-span-3 space-y-3">
                            <SkeletonLoader width="w-1/2" height="h-4" />
                            {[...Array(4)].map((_, i) => (
                              <SkeletonLoader
                                key={`style-${i}`}
                                width="w-full"
                                height="h-4"
                              />
                            ))}
                          </div>

                          {/* Shop by Shape */}
                          <div className="col-span-6">
                            <SkeletonLoader width="w-1/2" height="h-4" />
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              {[...Array(6)].map((_, i) => (
                                <div
                                  key={`shape-${i}`}
                                  className="flex items-center gap-3"
                                >
                                  <SkeletonLoader
                                    width="w-5"
                                    height="h-5"
                                    rounded="rounded-full"
                                  />
                                  <SkeletonLoader width="w-3/4" height="h-4" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shop by Metal */}
                          <div className="col-span-3 space-y-3">
                            <SkeletonLoader width="w-1/2" height="h-4" />
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={`metal-${i}`}
                                className="flex items-center gap-2"
                              >
                                <SkeletonLoader
                                  width="w-6"
                                  height="h-6"
                                  className="rounded-full"
                                />
                                <SkeletonLoader width="w-3/4" height="h-4" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <SkeletonLoader width="w-full" height="h-10" />{" "}
                      </div>

                      {/* Right Column Skeleton */}
                      <div>
                        <SkeletonLoader
                          width="w-1/3"
                          height="h-5"
                          className="mb-5"
                        />
                        <SkeletonLoader
                          height="h-[180px]"
                          className="mb-5 w-full"
                        />
                        <div className="flex justify-center">
                          <SkeletonLoader width="w-1/3" height="h-10" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="container grid grid-cols-2 py-[30px] gap-[30px] text-baseblack">
                      <div>
                        <h3 className={headingClass}>PRE-DESIGNED RINGS</h3>
                        <div className="grid grid-cols-12 text-sm gap-4 mb-[1.5rem]">
                          {engagementHeaderUniqueFilterOptions
                            ?.uniqueSettingStyles?.length ? (
                            <div className={`col-span-3`}>
                              <h3 className="font-semibold p-[10px]">
                                Shop by Style
                              </h3>
                              <div className="flex flex-col">
                                {engagementHeaderUniqueFilterOptions?.uniqueSettingStyles.map(
                                  (item, index) => (
                                    <HeaderLinkButton
                                      key={`variation-${index}4`}
                                      href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                        ENGAGEMENT_RINGS
                                      )}?setting_style=${helperFunctions.stringReplacedWithUnderScore(
                                        item.title
                                      )}`}
                                      // href={`/customize/start-with-setting?settingStyle=${item.value}`}
                                      className="!text-[12px] 2xl:!text-[13px] font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeAllDropdown();
                                      }}
                                    >
                                      {item.title}
                                    </HeaderLinkButton>
                                  )
                                )}
                              </div>
                            </div>
                          ) : null}

                          {engagementHeaderUniqueFilterOptions?.uniqueVariations
                            ?.length ? (
                            <div className="col-span-6">
                              <h3 className="font-semibold p-[10px]">
                                Shop by Shape
                              </h3>
                              <div className="grid grid-cols-2 text-center">
                                {engagementHeaderUniqueFilterOptions.uniqueVariations
                                  .filter(
                                    (variation) =>
                                      variation.variationName === DIAMOND_SHAPE
                                  )
                                  .flatMap((variation) =>
                                    variation.variationTypes.map(
                                      (item, index) => (
                                        <HeaderLinkButton
                                          key={`diamond-shape-${index}`}
                                          href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                            ENGAGEMENT_RINGS
                                          )}?Diamond_Shape=${helperFunctions.stringReplacedWithUnderScore(
                                            item.variationTypeName
                                          )}`}
                                          className="flex !text-[12px] 2xl:!text-[13px] font-medium items-center gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            closeAllDropdown();
                                          }}
                                        >
                                          {" "}
                                          {item?.variationTypeImage ? (
                                            <ProgressiveImg
                                              src={item?.variationTypeImage}
                                              alt={item?.variationTypeName}
                                              className="w-7 h-7 inline-block"
                                              width={28}
                                              height={28}
                                            />
                                          ) : null}
                                          {item.variationTypeName}
                                        </HeaderLinkButton>
                                      )
                                    )
                                  )}
                              </div>
                            </div>
                          ) : null}
                          {engagementHeaderUniqueFilterOptions?.uniqueVariations
                            ?.length ? (
                            <div className="col-span-3">
                              {" "}
                              <h3 className="font-semibold p-[10px]">
                                Shop by Metal
                              </h3>
                              {engagementHeaderUniqueFilterOptions?.uniqueVariations?.map(
                                (variation, index) => (
                                  <div
                                    className="flex flex-col"
                                    key={`variation-${index}`}
                                  >
                                    {variation.variationName === GOLD_COLOR
                                      ? variation.variationTypes.map(
                                          (item, index) => (
                                            <HeaderLinkButton
                                              key={`variation-${index}2`}
                                              href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                                ENGAGEMENT_RINGS
                                              )}?Gold_Color=${helperFunctions.stringReplacedWithUnderScore(
                                                item.variationTypeName
                                              )}`}
                                              className="flex !text-[12px]  2xl:!text-[13px] font-medium items-center gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                closeAllDropdown();
                                              }}
                                            >
                                              <div
                                                className="w-5 h-5 rounded-full"
                                                style={{
                                                  background:
                                                    item?.variationTypeHexCode,
                                                }}
                                              ></div>{" "}
                                              {item.variationTypeName}
                                            </HeaderLinkButton>
                                          )
                                        )
                                      : null}
                                  </div>
                                )
                              )}
                            </div>
                          ) : null}
                        </div>
                        {engagementHeaderUniqueFilterOptions
                          ?.uniqueSettingStyles?.length ||
                        engagementHeaderUniqueFilterOptions?.uniqueVariations
                          ?.length ? (
                          <HeaderLinkButton
                            href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                              ENGAGEMENT_RINGS
                            )}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              closeAllDropdown();
                            }}
                            className={`transition-all !text-baseblack duration-300 capitalize mt-2 !py-2 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack`}
                          >
                            View All
                          </HeaderLinkButton>
                        ) : null}
                      </div>
                      <div className=" ">
                        <h3 className={headingClass}>DESIGN YOUR RING</h3>
                        <CustomImg
                          srcAttr={engagementHeader}
                          altAttr=""
                          titleAttr=""
                          className="mb-[22px] w-full"
                        />
                        <div className="flex justify-center">
                          <HeaderLinkButton
                            href={"/customize/select-diamond"}
                            onClick={closeAllDropdown}
                            className={`transition-all !text-baseblack duration-300 capitalize mt-2 !py-2 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack`}
                          >
                            DESIGN WITH DIAMOND
                          </HeaderLinkButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </li>
            <li
              className={`relative`}
              onMouseEnter={() => dispatch(setOpenDropdown(WEDDING))}
              onMouseLeave={() => dispatch(setOpenDropdown(null))}
            >
              <HeaderLinkButton
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  WEDDING_RINGS
                )}`}
                className={`rounded-none flex items-center gap-1 hover:!text-primary hover:!font-semibold ${
                  lastScrollY > 100 ? "py-2 lg:py-5" : "py-4"
                }`}
                onClick={closeAllDropdown}
              >
                {WEDDING}
              </HeaderLinkButton>
              {openDropdown === WEDDING ? (
                <div
                  className={`fixed left-0 right-0 ${
                    isHeaderVisible
                      ? "top-[54px] 2xl:top-[63px]"
                      : "2xl:top-full"
                  } bg-white shadow-lg z-50 border-t-[0.5px] border-primary`}
                >
                  {weddingHeaderLoader ? (
                    <div className="container grid grid-cols-12 py-[30px] text-baseblack">
                      {/* Left Column Skeleton */}
                      <div className="col-span-7 pe-[30px] 2xl:pe-12">
                        <SkeletonLoader width="w-1/3" height="h-5" />{" "}
                        {/* PRE-DESIGNED RINGS title */}
                        <div className="grid grid-cols-12 gap-4 mb-[1.5rem] mt-4">
                          {/* Shop by Style */}
                          <div className="col-span-3 space-y-3">
                            <SkeletonLoader width="w-1/2" height="h-4" />
                            {[...Array(8)].map((_, i) => (
                              <SkeletonLoader
                                key={`style-${i}`}
                                width="w-full"
                                height="h-4"
                              />
                            ))}
                          </div>

                          {/* Shop by Shape */}
                          <div className="col-span-6">
                            <SkeletonLoader width="w-1/2" height="h-4" />
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              {[...Array(6)].map((_, i) => (
                                <div
                                  key={`shape-${i}`}
                                  className="flex items-center gap-3"
                                >
                                  <SkeletonLoader
                                    width="w-5"
                                    height="h-5"
                                    rounded="rounded-full"
                                  />
                                  <SkeletonLoader width="w-3/4" height="h-4" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shop by Metal */}
                          <div className="col-span-3 space-y-3">
                            <SkeletonLoader width="w-1/2" height="h-4" />
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={`metal-${i}`}
                                className="flex items-center gap-2"
                              >
                                <SkeletonLoader
                                  width="w-6"
                                  height="h-6"
                                  className="rounded-full"
                                />
                                <SkeletonLoader width="w-3/4" height="h-4" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <SkeletonLoader width="w-full" height="h-10" />{" "}
                      </div>

                      {/* Right Column Skeleton */}
                      <div className="col-span-5">
                        <div className="grid grid-cols-12 gap-8">
                          <div className="col-span-5">
                            <SkeletonLoader width="w-1/3" height="h-5" />{" "}
                            <div className="col-span-3 space-y-3 mt-4">
                              <SkeletonLoader width="w-1/2" height="h-4" />
                              {[...Array(3)].map((_, i) => (
                                <SkeletonLoader
                                  key={`style-${i}`}
                                  width="w-full"
                                  height="h-4"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="col-span-7">
                            <SkeletonLoader width="w-1/3" height="h-5" />{" "}
                            <SkeletonLoader
                              width="w-full"
                              height="h-40"
                              className="mt-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="container grid grid-cols-12 py-[30px] text-baseblack">
                      <div className="col-span-7 pe-[30px] 2xl:pe-12">
                        <h3 className={headingClass}>WOMEN</h3>
                        <div className="grid grid-cols-12 text-sm mb-[1.5rem]">
                          {weddingHeaderUniqueFilterOptions?.femaleFilters
                            ?.settingStyles?.length ? (
                            <div className={`col-span-3`}>
                              <h3 className="font-semibold p-[10px]">
                                Shop by Style
                              </h3>
                              <div className="flex flex-col">
                                {weddingHeaderUniqueFilterOptions?.femaleFilters?.settingStyles?.map(
                                  (item, index) => (
                                    <HeaderLinkButton
                                      key={`variation-${index}4`}
                                      href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                                        WEDDING_RINGS
                                      )}?setting_style=${helperFunctions?.stringReplacedWithUnderScore(
                                        item.title
                                      )}&gender=female`}
                                      className="!text-[12px]  2xl:!text-[13px] font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeAllDropdown();
                                      }}
                                    >
                                      {item.title}
                                    </HeaderLinkButton>
                                  )
                                )}
                              </div>
                            </div>
                          ) : null}

                          {weddingHeaderUniqueFilterOptions?.femaleFilters
                            ?.variations?.length ? (
                            <div className="col-span-6">
                              <h3 className="font-semibold p-[10px]">
                                Shop by Shape
                              </h3>
                              <div className="grid grid-cols-2 text-center">
                                {weddingHeaderUniqueFilterOptions?.femaleFilters?.variations
                                  ?.filter(
                                    (variation) =>
                                      variation.variationName === DIAMOND_SHAPE
                                  )
                                  .flatMap((variation) =>
                                    variation.variationTypes.map(
                                      (item, index) => (
                                        <HeaderLinkButton
                                          key={`diamond-shape-${index}`}
                                          href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                                            WEDDING_RINGS
                                          )}?Diamond_Shape=${helperFunctions?.stringReplacedWithUnderScore(
                                            item?.variationTypeName
                                          )}&gender=female`}
                                          className="flex !capitalize !text-[12px] 2xl:!text-[13px] font-medium items-center gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            closeAllDropdown();
                                          }}
                                        >
                                          {" "}
                                          {item?.variationTypeImage ? (
                                            <ProgressiveImg
                                              src={item?.variationTypeImage}
                                              alt={item?.variationTypeName}
                                              className="w-7 h-7 inline-block"
                                              width={28}
                                              height={28}
                                            />
                                          ) : null}
                                          {item.variationTypeName}
                                        </HeaderLinkButton>
                                      )
                                    )
                                  )}
                              </div>
                            </div>
                          ) : null}

                          {weddingHeaderUniqueFilterOptions?.femaleFilters
                            ?.variations?.length
                            ? weddingHeaderUniqueFilterOptions?.femaleFilters?.variations?.map(
                                (variation, index) => {
                                  if (variation.variationName !== GOLD_COLOR)
                                    return null; // Only render "Gold Color"

                                  return (
                                    <div
                                      className="flex flex-col col-span-3"
                                      key={`variation-${index}`}
                                    >
                                      <h3 className="font-semibold p-[10px]">
                                        Shop by Metal
                                      </h3>
                                      {variation.variationTypes.map(
                                        (item, index) => (
                                          <HeaderLinkButton
                                            key={`variation-${index}2`}
                                            href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                                              WEDDING_RINGS
                                            )}?Gold_Color=${helperFunctions?.stringReplacedWithUnderScore(
                                              item?.variationTypeName
                                            )}&gender=female`}
                                            className="flex !text-[12px]  2xl:!text-[13px] font-medium items-center gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              closeAllDropdown();
                                            }}
                                          >
                                            <div
                                              className="w-5 h-5 rounded-full"
                                              style={{
                                                background:
                                                  item?.variationTypeHexCode,
                                              }}
                                            ></div>{" "}
                                            {item.variationTypeName}
                                          </HeaderLinkButton>
                                        )
                                      )}
                                    </div>
                                  );
                                }
                              )
                            : null}
                        </div>
                        <HeaderLinkButton
                          href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                            WEDDING_RINGS
                          )}?gender=female`}
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllDropdown();
                          }}
                          className={`transition-all !text-baseblack duration-300 capitalize mt-2 !py-2 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack`}
                        >
                          View All
                        </HeaderLinkButton>
                      </div>
                      <div className="col-span-5">
                        <div className="grid grid-cols-12 gap-8">
                          <div className="col-span-5">
                            <h3 className={headingClass}>MEN</h3>
                            {weddingHeaderUniqueFilterOptions?.maleFilters
                              ?.settingStyles?.length ? (
                              <div className={`col-span-3`}>
                                <h3 className="font-semibold p-[10px]">
                                  Shop by Style
                                </h3>
                                <div className="flex flex-col">
                                  {weddingHeaderUniqueFilterOptions?.maleFilters?.settingStyles?.map(
                                    (item, index) => (
                                      <HeaderLinkButton
                                        key={`variation-${index}4`}
                                        href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                                          WEDDING_RINGS
                                        )}?setting_style=${helperFunctions?.stringReplacedWithUnderScore(
                                          item.title
                                        )}&gender=male`}
                                        className="!text-[12px]  2xl:!text-[13px] font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          closeAllDropdown();
                                        }}
                                      >
                                        {item.title}
                                      </HeaderLinkButton>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : null}
                            <HeaderLinkButton
                              href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                                WEDDING_RINGS
                              )}?gender=male`}
                              onClick={(e) => {
                                e.stopPropagation();
                                closeAllDropdown();
                              }}
                              className={`transition-all !text-baseblack duration-300 capitalize mt-2 !py-2 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack`}
                            >
                              View All
                            </HeaderLinkButton>
                          </div>
                          <div className="col-span-7">
                            <h3
                              className={`${headingClass} uppercase !border-0`}
                            >
                              {FLASH_DEALS}
                            </h3>
                            <CustomImg srcAttr={flashDeal} />{" "}
                            <div className="flex justify-center pt-3">
                              <HeaderLinkButton
                                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                  FLASH_DEALS
                                )}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllDropdown();
                                }}
                                className={`transition-all w-fit !text-baseblack duration-300 capitalize mt-2 !py-2 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack`}
                              >
                                View All
                              </HeaderLinkButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </li>
            {menuList?.map((item, index) => {
              const hasSubCategories = item.subCategories?.length > 0;

              return (
                <li
                  key={`${item?.id}-${index}`}
                  className={`relative`}
                  onMouseEnter={() =>
                    hasSubCategories
                      ? dispatch(setOpenDropdown(item.title))
                      : null
                  }
                  onMouseLeave={() => dispatch(setOpenDropdown(null))}
                >
                  <HeaderLinkButton
                    href={item.href}
                    className={`rounded-none flex items-center gap-1 hover:!text-primary hover:!font-semibold ${
                      lastScrollY > 100 ? "!py-2 lg:!py-5" : "!py-4"
                    }`}
                    onClick={closeAllDropdown}
                  >
                    {item?.title}
                  </HeaderLinkButton>

                  {/* Dropdown for Desktop */}
                  {hasSubCategories && openDropdown === item.title ? (
                    <div
                      className={`fixed left-0 right-0 ${
                        isHeaderVisible
                          ? "top-[54px] 2xl:top-[63px]"
                          : "2xl:top-full"
                      } bg-white shadow-lg z-50 border-t-[0.5px] border-primary`}
                    >
                      <div className="px-[100px] flex justify-between p-6 w-full">
                        <div className="w-[70%] flex justify-start flex-wrap lg:gap-14 2xl:gap-18 h-fit">
                          {item?.subCategories?.length > 0 &&
                            item.subCategories.map((subItem, index) => (
                              <div
                                key={`${subItem.title}-${index}`}
                                className={`w-[14%] relative`}
                              >
                                <HeaderLinkButton
                                  href={subItem.href}
                                  className="block text-sm !font-semibold capitalize !p-[10px]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    closeAllDropdown();
                                  }}
                                >
                                  {subItem.title}
                                </HeaderLinkButton>
                                <div className="flex flex-col">
                                  {subItem?.productTypes?.length
                                    ? subItem?.productTypes.map(
                                        (productType, index) => (
                                          <HeaderLinkButton
                                            key={`${productType.title}-${index}`}
                                            href={productType.href}
                                            className="!text-[12px] 2xl:!text-[13px] !leading-[1em] font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              closeAllDropdown();
                                            }}
                                          >
                                            {productType.title}
                                          </HeaderLinkButton>
                                        )
                                      )
                                    : null}
                                  <HeaderLinkButton
                                    href={subItem.href}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeAllDropdown();
                                    }}
                                    className={`transition-all duration-300 w-full capitalize mt-2 !px-3 !py-1.5 hover:text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack`}
                                  >
                                    View All
                                  </HeaderLinkButton>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="ps-10 w-[30%]">
                          <HeaderLinkButton
                            href={`/collections/collection/Special_Buys`}
                            className="block text-sm !font-semibold capitalize !py-[10px] !px-0 mb-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeAllDropdown();
                            }}
                          >
                            Special buys
                          </HeaderLinkButton>
                          <CustomImg
                            srcAttr={jewelry}
                            className="w-full"
                            altAttr=""
                            titleAttr=""
                          />
                          <div className="text-sm flex justify-center pt-5">
                            <Link
                              href={`/collections/collection/Special_Buys`}
                              onClick={(e) => {
                                e.stopPropagation();
                                closeAllDropdown();
                              }}
                              className="px-4 py-1.5 w-fit flex justify-center items-center border border-baseblack hover:text-white hover:bg-[#393939] transition-all duration-300"
                            >
                              View All
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}

            {staticLinks?.map((link) => (
              <li key={`static-link-${link.title}`} className={`relative `}>
                <HeaderLinkButton
                  href={link.href}
                  className={`rounded-none hover:!font-semibold flex items-center gap-1 hover:!text-primary ${
                    lastScrollY > 100 ? "py-2 lg:py-5" : "py-4"
                  }`}
                >
                  {link.title}
                </HeaderLinkButton>
              </li>
            ))}
          </ul>
        )}
        {lastScrollY > 100 ? (
          <div className="text-xl flex py-4 items-center gap-3">
            <SearchBar
              isMobile={false}
              searchContainerRef={navSearchContainerRef}
              resultsContainerRef={resultsContainerRef}
              navSearchInputRef={navSearchInputRef}
              mobileSearchInputRef={mobileSearchInputRef}
              lastScrollY={lastScrollY}
              isHeaderVisible={isHeaderVisible}
            />
            <ProfileDropdown
              className={"hidden lg:block"}
              uniqueId={"desktop-nav-profile"}
            />
            {!hideCartPopup ? <CartPopup /> : <CartIconInCheckout />}
          </div>
        ) : null}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-[100px] left-0 right-0 bottom-0 bg-white z-50"
          >
            {menuLoading ? (
              <div className="px-4 py-2 flex flex-col">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-3.5 ${
                      index < 8 ? "border-b" : ""
                    }`}
                  >
                    <SkeletonLoader width="w-1/2" height="h-6" />
                    <SkeletonLoader width="w-6" height="h-6" />
                  </div>
                ))}
              </div>
            ) : (
              <nav
                className="h-full px-4 py-2 flex flex-col overflow-y-auto mt-3"
                style={{ maxHeight: "calc(100vh - 60px)" }}
              >
                <div className="border-t py-3.5">
                  <HeaderLinkButton
                    href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                      FLASH_DEALS
                    )}`}
                    className="text-baseblack px-[10px] hover:text-primary"
                    onClick={() => dispatch(setIsMenuOpen(false))}
                  >
                    {FLASH_DEALS}
                  </HeaderLinkButton>
                </div>
                <div>
                  <div
                    className={`flex justify-between py-3.5 ${
                      openDropdownMobile === ENGAGEMENT ? "pb-0" : ""
                    } border-t`}
                    onClick={() =>
                      dispatch(
                        setOpenDropdownMobile(
                          openDropdownMobile === ENGAGEMENT ? null : ENGAGEMENT
                        )
                      )
                    }
                  >
                    <HeaderLinkButton
                      href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                        ENGAGEMENT_RINGS
                      )}`}
                      className="text-baseblack px-[10px] hover:text-primary py-0.5"
                      onClick={() => dispatch(setIsMenuOpen(false))}
                    >
                      {ENGAGEMENT}
                    </HeaderLinkButton>
                    <div className="text-base px-[10px] pb-0.5">
                      <IoIosArrowDown
                        className={`transition-all duration-300 ease-in-out transform ${
                          openDropdownMobile === ENGAGEMENT
                            ? "rotate-180 scale-110"
                            : "rotate-0 scale-100"
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out mt-1 ${
                      openDropdownMobile === ENGAGEMENT
                        ? "max-h-fit opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-2"
                    }`}
                  >
                    {/* PRE-DESIGNED RINGS Section */}
                    <div className="ps-3">
                      <button
                        onClick={() =>
                          setActiveNestedMobile(
                            activeNestedMobile === "predesigned"
                              ? null
                              : "predesigned"
                          )
                        }
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <h3 className="text-sm font-castoro p-[8px]">
                              PRE-DESIGNED RINGS
                            </h3>
                          </div>
                        </div>

                        <div className="px-[20px]">
                          {" "}
                          <IoIosArrowDown
                            className={`transition-all duration-300 ease-in-out transform ${
                              activeNestedMobile === "predesigned"
                                ? "rotate-180 scale-110"
                                : "rotate-0 scale-100"
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          activeNestedMobile === "predesigned"
                            ? "max-h-fit opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {engagementHeaderLoader ? (
                          <>
                            <div className="flex flex-col gap-2">
                              <SkeletonLoader
                                height="h-4"
                                className="ms-[10px]"
                                width="!w-[80px]"
                              />

                              {[...Array(6)].map((_, idx) => (
                                <SkeletonLoader
                                  height="h-3.5"
                                  key={idx}
                                  className="ms-[10px]"
                                  width="!w-[130px]"
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            {engagementHeaderUniqueFilterOptions
                              ?.uniqueSettingStyles?.length ||
                            engagementHeaderUniqueFilterOptions
                              ?.uniqueVariations?.length ? (
                              <Link
                                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                  ENGAGEMENT_RINGS
                                )}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllDropdown();
                                }}
                                className="border-b border-baseblack hover:border-b-primary text-[0.875em] mx-3"
                              >
                                View All
                              </Link>
                            ) : null}
                            {/* Mobile Setting Style */}
                            {engagementHeaderUniqueFilterOptions
                              ?.uniqueSettingStyles?.length ? (
                              <div>
                                <h3 className="font-semibold text-[14px] p-[10px] uppercase">
                                  Shop by Style
                                </h3>
                                <div className="ps-3 flex flex-col gap-1">
                                  {engagementHeaderUniqueFilterOptions?.uniqueSettingStyles.map(
                                    (item, index) => (
                                      <HeaderLinkButton
                                        key={`variation-${index}4`}
                                        href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                          ENGAGEMENT_RINGS
                                        )}?setting_style=${helperFunctions.stringReplacedWithUnderScore(
                                          item.title
                                        )}`}
                                        className="!text-[14px] font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          closeAllDropdown();
                                        }}
                                      >
                                        {item.title}
                                      </HeaderLinkButton>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : null}

                            {/* Mobile Diamond Shape */}
                            {engagementHeaderUniqueFilterOptions
                              ?.uniqueVariations?.length ? (
                              <div>
                                <h3 className="font-semibold text-[14px] p-[10px] uppercase">
                                  Shop by Shape
                                </h3>
                                <div className="ps-3 grid grid-cols-2 ">
                                  {engagementHeaderUniqueFilterOptions.uniqueVariations
                                    .filter(
                                      (variation) =>
                                        variation.variationName ===
                                        DIAMOND_SHAPE
                                    )
                                    .flatMap((variation) =>
                                      variation.variationTypes.map(
                                        (item, index) => (
                                          <HeaderLinkButton
                                            key={`mobile-variation-${index}`}
                                            href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                              ENGAGEMENT_RINGS
                                            )}?Diamond_Shape=${helperFunctions.stringReplacedWithUnderScore(
                                              item.variationTypeName
                                            )}`}
                                            className="!text-[14px] font-medium flex items-center !gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              closeAllDropdown();
                                            }}
                                          >
                                            {" "}
                                            {item?.variationTypeImage ? (
                                              <ProgressiveImg
                                                src={item?.variationTypeImage}
                                                alt={item?.variationTypeName}
                                                className="w-5 h-5 inline-block"
                                              />
                                            ) : null}
                                            {item.variationTypeName}
                                          </HeaderLinkButton>
                                        )
                                      )
                                    )}
                                </div>
                              </div>
                            ) : null}

                            {/* Mobile Shop by Metal */}
                            {engagementHeaderUniqueFilterOptions
                              ?.uniqueSettingStyles?.length ? (
                              <div>
                                <h3 className="font-semibold text-[14px] p-[10px] uppercase">
                                  Shop by Metal
                                </h3>
                                <div className="ps-3 flex flex-col gap-1">
                                  {engagementHeaderUniqueFilterOptions?.uniqueVariations?.map(
                                    (variation, index) => (
                                      <div
                                        className="flex flex-col"
                                        key={`sm-variation-${index}-parent`}
                                      >
                                        {variation.variationName === GOLD_COLOR
                                          ? variation.variationTypes.map(
                                              (item, index) => (
                                                <HeaderLinkButton
                                                  key={`sm-variation-${index}-child`}
                                                  href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                                                    ENGAGEMENT_RINGS
                                                  )}?Gold_Color=${helperFunctions.stringReplacedWithUnderScore(
                                                    item.variationTypeName
                                                  )}`}
                                                  className="!text-[14px] flex items-center font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !p-[10px] hover:bg-[#F3F3F4] duration-300 capitalize"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeAllDropdown();
                                                    dispatch(
                                                      setIsMenuOpen(false)
                                                    );
                                                  }}
                                                >
                                                  <div
                                                    className="w-5 h-5 rounded-full"
                                                    style={{
                                                      background:
                                                        item?.variationTypeHexCode,
                                                    }}
                                                  ></div>{" "}
                                                  {item.variationTypeName}
                                                </HeaderLinkButton>
                                              )
                                            )
                                          : null}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>

                    {/* DESIGN YOUR RING Section */}
                    <div className="ps-3">
                      <button
                        onClick={() =>
                          setActiveNestedMobile(
                            activeNestedMobile === "design" ? null : "design"
                          )
                        }
                        className="w-full flex items-center justify-between "
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <h3 className="text-sm font-castoro p-[8px]">
                              DESIGN YOUR RING
                            </h3>
                          </div>
                        </div>

                        <div className="px-[20px]">
                          {" "}
                          <IoIosArrowDown
                            className={`transition-all duration-300 ease-in-out transform ${
                              activeNestedMobile === "design"
                                ? "rotate-180 scale-110"
                                : "rotate-0 scale-100"
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          activeNestedMobile === "design"
                            ? "max-h-fit opacity-100 pt-2 pb-4"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {/* Shop By Metal Nested Section */}
                        <CustomImg
                          srcAttr={engagementHeader}
                          altAttr=""
                          titleAttr=""
                          className="w-full h-[150px] object-cover ps-[10px] pe-[20px]"
                        />
                        <div className="ps-[10px] pe-[20px] mt-4">
                          {" "}
                          <HeaderLinkButton
                            href={"/customize/select-diamond"}
                            onClick={(e) => {
                              e.stopPropagation();
                              closeAllDropdown();
                            }}
                            className={` transition-all !text-baseblack duration-300 capitalize mt-2 !py-2 hover:!text-white hover:!bg-[#393939] flex justify-center items-center border border-baseblack`}
                          >
                            DESIGN WITH DIAMOND
                          </HeaderLinkButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col border-t py-3.5">
                  <div
                    className="flex justify-between"
                    onClick={() =>
                      dispatch(
                        setOpenDropdownMobile(
                          openDropdownMobile === WEDDING ? null : WEDDING
                        )
                      )
                    }
                  >
                    <HeaderLinkButton
                      href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                        WEDDING_RINGS
                      )}`}
                      className="text-baseblack !px-[10px] hover:primary py-0.5"
                      onClick={() => dispatch(setIsMenuOpen(false))}
                    >
                      {WEDDING}
                    </HeaderLinkButton>
                    <div className="text-base px-[10px] pb-0.5">
                      <IoIosArrowDown
                        className={`transition-all duration-300 ease-in-out transform ${
                          openDropdownMobile === WEDDING
                            ? "rotate-180 scale-110"
                            : "rotate-0 scale-100"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Dropdown for Mobile */}
                  <div
                    className={`grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdownMobile === WEDDING
                        ? "max-h-fit opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-2"
                    }`}
                  >
                    <div className="flex flex-col mt-2 ps-3">
                      <HeaderLinkButton
                        href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                          WEDDING_RINGS
                        )}?gender=female`}
                        className="!font-semibold !p-[10px] !text-[0.875em] leading-[1em] text-baseblack capitalize"
                        onClick={() => {
                          closeAllDropdown();
                        }}
                      >
                        WOMEN
                      </HeaderLinkButton>
                      <HeaderLinkButton
                        href={`/collections/collection/${helperFunctions?.stringReplacedWithUnderScore(
                          WEDDING_RINGS
                        )}?gender=male`}
                        className="!font-semibold !p-[10px] !text-[0.875em] leading-[1em] text-baseblack capitalize"
                        onClick={() => {
                          closeAllDropdown();
                        }}
                      >
                        MEN
                      </HeaderLinkButton>
                    </div>
                  </div>
                </div>

                {menuList.map((item, index) => {
                  const hasSubCategories = item.subCategories?.length > 0;
                  const isDropdownOpen = openDropdownMobile === item.title;

                  return (
                    <div
                      key={`${item.title}-${index}`}
                      className="flex flex-col border-t py-3.5"
                    >
                      <div
                        className="flex justify-between"
                        onClick={() =>
                          dispatch(
                            setOpenDropdownMobile(
                              isDropdownOpen ? null : item.title
                            )
                          )
                        }
                      >
                        <HeaderLinkButton
                          href={item.href}
                          className="text-baseblack !px-[10px] hover:text-primary py-0.5"
                          onClick={() => dispatch(setIsMenuOpen(false))}
                        >
                          {item.title}
                        </HeaderLinkButton>
                        <div className="text-base px-[10px] pb-0.5">
                          <IoIosArrowDown
                            className={`transition-all duration-300 ease-in-out transform ${
                              isDropdownOpen
                                ? "rotate-180 scale-110"
                                : "rotate-0 scale-100"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Dropdown for Mobile */}
                      {hasSubCategories && (
                        <div
                          className={`grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out ${
                            isDropdownOpen
                              ? "max-h-fit opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-2"
                          }`}
                        >
                          <div className="p-[10px] pb-0">
                            {" "}
                            <Link
                              href={item.href}
                              onClick={(e) => {
                                e.stopPropagation();
                                closeAllDropdown();
                              }}
                              className="border-b w-fit border-baseblack hover:border-b-primary text-[0.875em] mx-3"
                            >
                              View All
                            </Link>
                          </div>
                          {item.subCategories.map((subItem, index) => (
                            <div
                              className="flex flex-col mt-2 ps-3"
                              key={`${subItem.title}-${index}5`}
                            >
                              <div className="relative">
                                <HeaderLinkButton
                                  href={subItem.href}
                                  className="!font-semibold !p-[10px] !text-[0.875em] leading-[1em] text-baseblack capitalize"
                                  onClick={() => {
                                    closeAllDropdown();
                                  }}
                                >
                                  {subItem.title}
                                </HeaderLinkButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {staticLinks?.map((link, index) => (
                  <div
                    className="py-3.5 border-t"
                    key={`static-link-${index}12`}
                  >
                    <HeaderLinkButton
                      onClick={() => dispatch(setIsMenuOpen(false))}
                      href={link.href}
                      className="!px-[10px]"
                    >
                      {link.title}
                    </HeaderLinkButton>
                  </div>
                ))}
                {mainHeaderLinks?.map((item, index) => {
                  return (
                    <div
                      className="py-3.5 border-t"
                      key={`header-static-link-${index}`}
                    >
                      <HeaderLinkButton
                        href={item.href}
                        className="!text-[14px] !uppercase flex items-center font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !px-[10px] !p-0 duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAllDropdown();
                        }}
                      >
                        {item.image ? (
                          <CustomImg
                            srcAttr={item.image}
                            titleAttr=""
                            className="w-6"
                            altAttr=""
                          />
                        ) : item.icon ? (
                          item.icon
                        ) : null}
                        {item.title}
                      </HeaderLinkButton>
                    </div>
                  );
                })}
                <ProfileDropdown
                  className={"block lg:hidden"}
                  uniqueId={"mobile-nav-profile"}
                />
              </nav>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
