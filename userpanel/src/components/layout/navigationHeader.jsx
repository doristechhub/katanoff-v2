"use client";
import { HeaderLinkButton } from "@/components/ui/button";
import {
  setIsMenuOpen,
  setOpenDropdown,
  setOpenDropdownMobile,
} from "@/store/slices/commonSlice";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import jewelry from "@/assets/images/jewelry.webp";
import preDesignedRing from "@/assets/images/pre-designed-ring.webp";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import miniLogo from "@/assets/images/logo-2.webp";
import { CustomImg, ProgressiveImg } from "../dynamiComponents";
import CartPopup from "../ui/CartPopup";
import { helperFunctions } from "@/_helper";
import { ENGAGEMENT, FLASH_DEALS, GOLD_COLOR } from "@/_helper/constants";
import ProfileDropdown from "../ui/ProfileDropdown";
import SkeletonLoader from "../ui/skeletonLoader";
import { usePathname } from "next/navigation";
import { fetchCustomizeProductsVariation } from "@/_actions/customize.action";
import defaultSettingStyle from "@/assets/images/default-setting-style.webp";

const staticLinks = [
  {
    title: "About Katanoff",
    href: "/about-us",
  },
  {
    title: "Education",
    href: "/education",
  },
  {
    title: "Contact",
    href: "/contact-us",
  },
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
  } = useSelector(({ common }) => common);
  const {
    uniqueFilterOptionsForHeader,
    customizeOptionLoading,
    transparenHeadertBg,
  } = useSelector(({ common }) => common);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const hideCartPopup =
    pathname === "/checkout" ||
    pathname === "/shipping" ||
    pathname.startsWith("/payment");

  const closeAllDropdown = useCallback(() => {
    setTimeout(() => {
      dispatch(setOpenDropdown(null));
      dispatch(setOpenDropdownMobile(null));
    }, 200);
  }, [dispatch]);

  const loadData = useCallback(() => {
    dispatch(fetchCustomizeProductsVariation());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
      setIsHeaderVisible(currentScrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <header
      className={`w-full ${
        transparenHeadertBg && !isHeaderVisible ? "bg-offwhite" : "bg-white"
      } ${
        lastScrollY > 100 ? "bg-white" : ""
      } z-40 transition-all duration-500 ease-in-out ${
        isHeaderVisible
          ? "fixed top-0 left-0 "
          : "relative lg:translate-y-[40%]"
      }`}
    >
      {/* Desktop Navigation */}
      <nav
        className={`hidden lg:flex ${
          lastScrollY > 100 ? "justify-between" : "justify-center"
        }  w-full container items-center gap-6`}
      >
        {lastScrollY > 100 ? (
          <Link href={"/"}>
            <CustomImg
              className={` ${
                lastScrollY > 100 ? "block w-28 2xl:w-32" : "hidden"
              }`}
              srcAttr={miniLogo}
            />
          </Link>
        ) : null}

        {menuLoading ? (
          <div
            className={`flex justify-center gap-4 bg-white ${
              lastScrollY > 100 ? "py-2 lg:py-6" : "pb-4"
            }`}
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <SkeletonLoader
                key={index}
                width="w-24 2xl:w-28"
                height="h-4 2xl:h-6"
                className="!px-3 2xl:!px-4"
              />
            ))}
          </div>
        ) : (
          <ul className={`flex`}>
            <li
              className={`relative ${
                lastScrollY > 100 ? "py-2 lg:py-6" : "pb-4"
              }`}
            >
              <HeaderLinkButton
                href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                  FLASH_DEALS
                )}`}
                className="rounded-none flex items-center gap-1 hover:!text-primary"
              >
                {FLASH_DEALS}
              </HeaderLinkButton>
            </li>

            <li
              className={`relative ${
                lastScrollY > 100 ? "py-2 lg:py-6" : "pb-4"
              }`}
              onMouseEnter={() => {
                dispatch(setOpenDropdown(ENGAGEMENT));
              }}
              onMouseLeave={() => {
                dispatch(setOpenDropdown(null));
              }}
            >
              <HeaderLinkButton
                href={"#"}
                className="rounded-none flex items-center gap-1 hover:!text-primary"
                onClick={closeAllDropdown}
              >
                {ENGAGEMENT}
                <div className="text-base 2xl:text-lg pb-0.5">
                  <IoIosArrowDown
                    className={`transition-all duration-300 ease-in-out transform ${
                      openDropdown === ENGAGEMENT
                        ? "rotate-180 scale-110"
                        : "rotate-0 scale-100"
                    }`}
                  />
                </div>
              </HeaderLinkButton>
              {openDropdown === ENGAGEMENT ? (
                <div
                  className={`fixed left-0 right-0 ${
                    isHeaderVisible ? "top-[65px] 2xl:top-[70px]" : "top-[36px]"
                  } bg-white shadow-lg z-50 border-t-[0.5px]`}
                >
                  <div className="container flex justify-between p-6">
                    {customizeOptionLoading ? (
                      <div className="grid grid-cols-12 2xl:gap-y-10 w-full">
                        {/* Left Column Section */}
                        <div className="col-span-2 flex flex-col gap-5">
                          <div className="space-y-3">
                            <SkeletonLoader width="w-3/4" height="h-4" />
                            <SkeletonLoader width="w-2/3" height="h-3" />
                            <SkeletonLoader width="w-1/2" height="h-3" />
                            <SkeletonLoader width="w-1/3" height="h-3" />
                          </div>
                        </div>

                        {/* Center Grid Section */}
                        <div className="col-span-4 px-10 border-x border-gray-e2 mx-10">
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex flex-col items-center gap-2"
                              >
                                <SkeletonLoader
                                  width="w-8"
                                  height="h-8"
                                  rounded="rounded-full"
                                />
                                <SkeletonLoader width="w-3/4" height="h-3" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right-Side Items with Icons */}
                        <div className="col-span-2 border-gray-e2">
                          <div className="space-y-3">
                            <SkeletonLoader width="w-3/4" height="h-4" />
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <SkeletonLoader width="w-10" height="h-10" />
                                <SkeletonLoader width="w-1/2" height="h-3" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rightmost Preview Box */}
                        <div className="col-start-9 2xl:col-start-10 col-span-4 flex flex-col gap-1 ps-10 border-s border-gray-e2">
                          <div className="space-y-3">
                            <SkeletonLoader width="w-3/4" height="h-4" />
                            <SkeletonLoader height="h-[250px] 2xl:h-[300px]" />
                            <SkeletonLoader width="w-1/2" height="h-3" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-12 2xl:gap-y-10  w-full">
                        <div className="flex flex-col gap-5 col-span-2">
                          <div>
                            <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                              Custom Rings
                            </p>
                            <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>

                            <div className="mt-3 flex flex-col gap-1">
                              <HeaderLinkButton
                                href={"/customize/start-with-setting"}
                                className="text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllDropdown();
                                }}
                              >
                                Start with a{" "}
                                <span className="font-bold">Setting</span>
                              </HeaderLinkButton>
                            </div>
                          </div>
                          {uniqueFilterOptionsForHeader?.uniqueVariations
                            ?.length ? (
                            <div>
                              <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                                Shop By Metal
                              </p>
                              <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                              {uniqueFilterOptionsForHeader?.uniqueVariations?.map(
                                (variation, index) => {
                                  return (
                                    <div
                                      className="flex flex-col gap-2 mt-2"
                                      key={`variation-${index}`}
                                    >
                                      {variation.variationName == GOLD_COLOR
                                        ? variation.variationTypes.map(
                                            (item, index) => {
                                              return (
                                                <HeaderLinkButton
                                                  key={`variation-${index}2`}
                                                  href={`/customize/start-with-setting?variationName=${variation?.variationName}&variationTypeName=${item?.variationTypeName}`}
                                                  className="flex items-center gap-2 text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeAllDropdown();
                                                  }}
                                                >
                                                  <div
                                                    className="w-4 h-4 bg-transparent rounded-full"
                                                    style={{
                                                      border: `4px solid ${item?.variationTypeHexCode}`,
                                                    }}
                                                  ></div>{" "}
                                                  {item.variationTypeName}
                                                </HeaderLinkButton>
                                              );
                                            }
                                          )
                                        : null}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          ) : null}
                        </div>
                        {uniqueFilterOptionsForHeader?.uniqueDiamondShapes
                          ?.length ? (
                          <div
                            className={`col-span-4 px-10 ${
                              uniqueFilterOptionsForHeader?.uniqueSettingStyles
                                ?.length == 0
                                ? "border-s"
                                : "border-x"
                            }   border-gray-e2 mx-10`}
                          >
                            <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                              Shop By Diamond Shape
                            </p>
                            <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                            <div className="grid grid-cols-3 gap-4 mt-3 text-center">
                              {uniqueFilterOptionsForHeader?.uniqueDiamondShapes?.map(
                                (item, index) => {
                                  return (
                                    <HeaderLinkButton
                                      key={`diamond-shape-${index}`}
                                      href={`/customize/start-with-setting?diamondShape=${item.id}`}
                                      className="gap-2 text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeAllDropdown();
                                      }}
                                    >
                                      <ProgressiveImg
                                        src={item?.image}
                                        alt={item?.title}
                                        className="w-8 h-8 inline-block"
                                      />
                                      <p className="mt-1">{item?.title}</p>
                                    </HeaderLinkButton>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ) : null}

                        {uniqueFilterOptionsForHeader?.uniqueSettingStyles
                          ?.length ? (
                          <div
                            className={`col-span-2 ${
                              uniqueFilterOptionsForHeader?.uniqueDiamondShapes
                                ?.length == 0
                                ? "border-s ps-10"
                                : ""
                            } border-gray-e2`}
                          >
                            <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                              Shop By Style
                            </p>
                            <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                            <div className="mt-3 flex flex-col gap-1">
                              {uniqueFilterOptionsForHeader?.uniqueSettingStyles.map(
                                (item, index) => {
                                  return (
                                    <HeaderLinkButton
                                      key={`variation-${index}4`}
                                      href={`/customize/start-with-setting?settingStyle=${item.value}`}
                                      className="flex items-center gap-2 text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeAllDropdown();
                                      }}
                                    >
                                      {/* <ProgressiveImg
                                        src={item.image || defaultSettingStyle}
                                        alt={item.title}
                                        className="w-10 h-10 rounded-full"
                                      /> */}
                                      {item?.image ? (
                                        <ProgressiveImg
                                          src={item?.image}
                                          alt={item?.title}
                                          className="w-10 h-10 rounded-full"
                                        />
                                      ) : (
                                        <CustomImg
                                          srcAttr={defaultSettingStyle}
                                          altAttr=""
                                          titleAttr=""
                                          className="w-10 h-10 rounded-full"
                                        />
                                      )}
                                      {item.title}
                                    </HeaderLinkButton>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ) : null}

                        <div className="col-start-9 2xl:col-start-10 col-span-4 flex flex-col gap-1  ps-10 border-s border-gray-e2">
                          <div className="mb-2">
                            <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                              Shop Pre-Designed Rings
                            </p>
                            <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                          </div>
                          <CustomImg srcAttr={preDesignedRing} />
                          <div className="text-sm mt-3">
                            <Link
                              href={"/customize/start-with-setting"}
                              onClick={() => dispatch(setOpenDropdown(null))}
                              className="underline hover:text-primary transition-all duration-300"
                            >
                              Shop Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </li>

            {menuList
              ? menuList.map((item, index) => {
                  const hasSubCategories = item.subCategories?.length > 0;

                  return (
                    <li
                      key={`${item?.id}-${index}`}
                      className={`relative ${
                        lastScrollY > 100 ? "py-2 lg:py-6" : "pb-4"
                      }`}
                      onMouseEnter={() =>
                        hasSubCategories
                          ? dispatch(setOpenDropdown(item.title))
                          : null
                      }
                      onMouseLeave={() => dispatch(setOpenDropdown(null))}
                    >
                      <HeaderLinkButton
                        href={item.href}
                        className="rounded-none flex items-center gap-1 hover:!text-primary"
                        onClick={closeAllDropdown}
                      >
                        {item?.title}
                        {hasSubCategories ? (
                          <div className="text-base 2xl:text-lg pb-0.5">
                            <IoIosArrowDown
                              className={`transition-all duration-300 ease-in-out transform ${
                                openDropdown === item.title
                                  ? "rotate-180 scale-110"
                                  : "rotate-0 scale-100"
                              }`}
                            />
                          </div>
                        ) : null}
                      </HeaderLinkButton>

                      {/* Dropdown for Desktop */}
                      {hasSubCategories && openDropdown === item.title ? (
                        <div
                          className={`fixed left-0 right-0 ${
                            isHeaderVisible
                              ? "top-[65px] 2xl:top-[70px]"
                              : "top-[36px]"
                          } bg-white shadow-lg z-50 border-t-[0.5px]`}
                        >
                          <div className="container flex justify-between p-6">
                            <div className="grid grid-cols-12 gap-5 2xl:gap-x-20 2xl:gap-y-10 h-fit">
                              {item?.subCategories?.length > 0 &&
                                item.subCategories.map((subItem, index) => (
                                  <div
                                    key={`${subItem.title}-${index}`}
                                    className={`col-span-3 relative px-8 ${
                                      index % 4 !== 0
                                        ? "border-l border-gray-200"
                                        : ""
                                    }`}
                                  >
                                    <HeaderLinkButton
                                      href={subItem.href}
                                      className="block !font-semibold text-base capitalize text-primary !px-0 mb-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeAllDropdown();
                                      }}
                                    >
                                      {subItem.title}
                                    </HeaderLinkButton>
                                    <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                                    <div className="mt-3 flex flex-col gap-1">
                                      {subItem.productTypes?.length
                                        ? subItem?.productTypes.map(
                                            (productType, index) => {
                                              return (
                                                <HeaderLinkButton
                                                  key={`${productType.title}-${index}3`}
                                                  href={productType.href}
                                                  className="text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    closeAllDropdown();
                                                  }}
                                                >
                                                  {productType.title}
                                                </HeaderLinkButton>
                                              );
                                            }
                                          )
                                        : null}
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div className="border-s ps-10">
                              <CustomImg
                                srcAttr={jewelry}
                                className="w-80 2xl:w-96"
                              />
                              <div className="text-sm mt-3">
                                <Link
                                  href={item.href}
                                  onClick={() =>
                                    dispatch(setOpenDropdown(null))
                                  }
                                  className="underline hover:text-primary transition-all duration-300"
                                >
                                  Shop Now
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })
              : null}

            {staticLinks?.map((link) => {
              return (
                <li
                  key={`static-link-${link.title}`}
                  className={`relative ${
                    lastScrollY > 100 ? "py-2 lg:py-6 hidden" : "pb-4"
                  } ${openDropdown ? "" : ""}`}
                >
                  <HeaderLinkButton
                    href={link.href}
                    className="rounded-none flex items-center gap-1 hover:!text-primary"
                  >
                    {link.title}
                  </HeaderLinkButton>
                </li>
              );
            })}
          </ul>
        )}
        {lastScrollY > 100 ? (
          <div className="text-xl flex py-6 items-center gap-5">
            <Link href={"/search"}>
              <IoIosSearch />
            </Link>
            {/* <GoHeart /> */}
            {!hideCartPopup ? <CartPopup /> : null}
            <ProfileDropdown
              className={"hidden lg:block"}
              uniqueId={"desktop-nav-profile"}
            />
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
            className="lg:hidden fixed top-[70px] left-0 right-0 bottom-0 bg-white z-50"
          >
            {menuLoading ? (
              <div className="px-4 py-2 flex flex-col">
                {Array.from({ length: 9 }).map((_, index) => (
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
                className="h-full px-4 py-2 flex flex-col gap-3 overflow-y-auto mt-6"
                style={{ maxHeight: "calc(100vh - 60px)" }}
              >
                <HeaderLinkButton
                  href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                    FLASH_DEALS
                  )}`}
                  onClick={() => {
                    dispatch(setIsHeaderVisible(false));
                  }}
                >
                  {FLASH_DEALS}
                </HeaderLinkButton>
                <div>
                  <div
                    className="flex justify-between pt-3.5 border-t"
                    onClick={() =>
                      dispatch(
                        setOpenDropdownMobile(
                          openDropdownMobile === ENGAGEMENT ? null : ENGAGEMENT
                        )
                      )
                    }
                  >
                    <HeaderLinkButton
                      href={"#"}
                      className="text-gray-700 px-0 hover:text-black py-0.5"
                      onClick={() => dispatch(setIsMenuOpen(false))}
                    >
                      {ENGAGEMENT}
                    </HeaderLinkButton>

                    <div className="text-base pb-0.5">
                      <IoIosArrowDown
                        className={`transition-all duration-300 ease-in-out transform ${
                          openDropdownMobile === ENGAGEMENT
                            ? "rotate-180 scale-110"
                            : "rotate-0 scale-100"
                        }`}
                      />
                    </div>
                  </div>

                  {customizeOptionLoading ? (
                    <div className="block lg:hidden animate-pulse">
                      <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-hidden transition-all duration-300 ease-in-out">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex flex-col gap-2 mt-2 ms-4"
                          >
                            <SkeletonLoader width="w-32" height="h-4" />
                            <div className="flex flex-col gap-2 mt-2 ms-3">
                              {[...Array(3)].map((_, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <SkeletonLoader
                                    width="w-4"
                                    height="h-4"
                                    rounded="rounded-full"
                                  />
                                  <SkeletonLoader width="w-24" height="h-4" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Diamond Shape Grid */}
                        <div className="flex flex-col gap-2 mt-2 ms-4">
                          <SkeletonLoader width="w-40" height="h-4" />
                          <div className="grid grid-cols-4 gap-4 mt-3 text-center">
                            {[...Array(4)].map((_, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center gap-1"
                              >
                                <SkeletonLoader
                                  width="w-8"
                                  height="h-8"
                                  rounded="rounded-full"
                                />
                                <SkeletonLoader width="w-12" height="h-3" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-300 ease-in-out  ${
                        openDropdownMobile === ENGAGEMENT
                          ? "max-h-[600px] opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }`}
                    >
                      <div className="flex flex-col gap-2 mt-2 ms-4">
                        <div className="relative">
                          <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                            Custom Rings
                          </p>
                          <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                        </div>
                        <div className="flex flex-col gap-1 ms-3 mt-0.5">
                          <HeaderLinkButton
                            href={"/customize/start-with-setting"}
                            className="text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                            onClick={() => dispatch(setIsMenuOpen(false))}
                          >
                            Start with a{" "}
                            <span className="font-bold">Setting</span>
                          </HeaderLinkButton>
                        </div>
                      </div>
                      {uniqueFilterOptionsForHeader?.uniqueVariations
                        ?.length ? (
                        <div className="flex flex-col gap-2 mt-2 ms-4">
                          <div className="relative">
                            <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                              Shop By Metal
                            </p>
                            <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                          </div>
                          <div className="ms-4 md:w-1/2 mt-1 text-center">
                            {" "}
                            {uniqueFilterOptionsForHeader?.uniqueVariations?.map(
                              (variation, index) => {
                                return (
                                  <div
                                    className="flex flex-col gap-2"
                                    key={`variation-${index}`}
                                  >
                                    {variation.variationName == GOLD_COLOR
                                      ? variation.variationTypes.map(
                                          (item, index) => {
                                            return (
                                              <HeaderLinkButton
                                                key={`variation-${index}2`}
                                                href={`/customize/start-with-setting?variationName=${variation?.variationName}&variationTypeName=${item?.variationTypeName}`}
                                                className="flex items-center gap-2 text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  dispatch(
                                                    setOpenDropdownMobile(
                                                      openDropdownMobile
                                                        ? null
                                                        : ENGAGEMENT
                                                    )
                                                  );
                                                  dispatch(
                                                    setIsMenuOpen(false)
                                                  );
                                                }}
                                              >
                                                <div
                                                  className="w-4 h-4 bg-transparent rounded-full"
                                                  style={{
                                                    border: `4px solid ${item?.variationTypeHexCode}`,
                                                  }}
                                                ></div>{" "}
                                                {item.variationTypeName}
                                              </HeaderLinkButton>
                                            );
                                          }
                                        )
                                      : null}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}
                      {uniqueFilterOptionsForHeader?.uniqueDiamondShapes
                        ?.length ? (
                        <div className="flex flex-col gap-2 mt-2 ms-4">
                          <div className="relative">
                            <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                              Shop By Diamond Shape
                            </p>
                            <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                          </div>
                          <div className="grid grid-cols-4 md:w-1/2 gap-4 mt-3 text-center">
                            {" "}
                            {uniqueFilterOptionsForHeader?.uniqueDiamondShapes.map(
                              (item, index) => {
                                return (
                                  <HeaderLinkButton
                                    key={`variation-${index}1`}
                                    href={`/customize/start-with-setting?diamondShape=${item.id}`}
                                    className="gap-2 text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(
                                        setOpenDropdownMobile(
                                          openDropdownMobile ? null : ENGAGEMENT
                                        )
                                      );
                                      dispatch(setIsMenuOpen(false));
                                    }}
                                  >
                                    <ProgressiveImg
                                      src={item?.image}
                                      alt={item?.title}
                                      className="w-8 h-8 inline-block"
                                    />
                                    <p className="mt-1">{item?.title}</p>
                                  </HeaderLinkButton>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}

                      {uniqueFilterOptionsForHeader?.uniqueSettingStyles
                        ?.length ? (
                        <div className="flex flex-col gap-2 mt-2 ms-4">
                          <div className="relative">
                            <p className="text-sm 2xl:text-base block !font-semibold capitalize text-primary !px-0 mb-1">
                              Shop By Style
                            </p>
                            <div className="w-5 h-[2px] rounded-full bg-primary bottom-0"></div>
                          </div>
                          <div className="flex flex-col gap-1">
                            {uniqueFilterOptionsForHeader?.uniqueSettingStyles.map(
                              (item, index) => {
                                return (
                                  <HeaderLinkButton
                                    key={`variation-${index}4`}
                                    href={`/customize/start-with-setting?settingStyle=${item.value}`}
                                    className="flex items-center gap-2 text-basegray hover:text-baseblack transition-all !px-0 duration-300 capitalize"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(
                                        setOpenDropdownMobile(
                                          openDropdownMobile ? null : ENGAGEMENT
                                        )
                                      );
                                      dispatch(setIsMenuOpen(false));
                                    }}
                                  >
                                    {item?.image ? (
                                      <ProgressiveImg
                                        src={item?.image}
                                        alt={item?.title}
                                        className="w-10 h-10 rounded-full"
                                      />
                                    ) : (
                                      <CustomImg
                                        srcAttr={defaultSettingStyle}
                                        altAttr=""
                                        titleAttr=""
                                        className="w-10 h-10 rounded-full"
                                      />
                                    )}

                                    {item.title}
                                  </HeaderLinkButton>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {menuList.map((item, index) => {
                  const hasSubCategories = item.subCategories?.length > 0;
                  const isDropdownOpen = openDropdownMobile === item.title;

                  return (
                    <div
                      key={`${item.title}-${index}`}
                      className="flex flex-col border-t pt-3"
                    >
                      <div
                        className="flex justify-between"
                        onClick={() =>
                          hasSubCategories
                            ? dispatch(
                                setOpenDropdownMobile(
                                  isDropdownOpen ? null : item.title
                                )
                              )
                            : null
                        }
                      >
                        <HeaderLinkButton
                          href={item.href}
                          className="text-gray-700 px-0 hover:text-black py-0.5"
                          onClick={() => dispatch(setIsMenuOpen(false))}
                        >
                          {item.title}
                        </HeaderLinkButton>
                        {hasSubCategories && (
                          <div className="text-base pb-0.5">
                            <IoIosArrowDown
                              className={`transition-all duration-300 ease-in-out transform ${
                                isDropdownOpen
                                  ? "rotate-180 scale-110"
                                  : "rotate-0 scale-100"
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Dropdown for Mobile */}
                      {hasSubCategories && (
                        <div
                          className={`grid grid-cols-1 gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
                            isDropdownOpen
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-2"
                          }`}
                        >
                          {item.subCategories.map((subItem, index) => (
                            <div
                              className="flex flex-col gap-2 mt-2 ms-4"
                              key={`${subItem.title}-${index}5`}
                            >
                              <div className="relative">
                                <HeaderLinkButton
                                  href={subItem.href}
                                  className="!font-semibold text-primary capitalize"
                                  onClick={() => {
                                    dispatch(setIsMenuOpen(false));
                                    closeAllDropdown();
                                  }}
                                >
                                  {subItem.title}
                                </HeaderLinkButton>
                                <div className="absolute left-3 w-4 h-[2px] bg-primary ms-2"></div>
                              </div>
                              <div className="flex flex-col gap-1 ms-3 mt-0.5">
                                {subItem.productTypes.length
                                  ? subItem.productTypes.map(
                                      (productType, index) => {
                                        return (
                                          <HeaderLinkButton
                                            key={`${productType.title}-${index}6`}
                                            href={productType.href}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              closeAllDropdown();
                                              dispatch(setIsMenuOpen(false));
                                            }}
                                            className="capitalize"
                                          >
                                            {productType.title}
                                          </HeaderLinkButton>
                                        );
                                      }
                                    )
                                  : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {staticLinks?.map((link, index) => {
                  return (
                    <div
                      className="pt-3.5  border-t"
                      key={`static-link-${index}12`}
                    >
                      <HeaderLinkButton
                        onClick={() => {
                          dispatch(setIsMenuOpen(false));
                        }}
                        href={link.href}
                      >
                        {link.title}
                      </HeaderLinkButton>
                    </div>
                  );
                })}
                <ProfileDropdown uniqueId={"mobile-nav-profile"} />
              </nav>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
