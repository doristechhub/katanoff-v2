"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  CartIconInCheckout,
  CartPopup,
  ProfileDropdown,
  NavigationHeader,
  SearchBar,
} from "@/components/dynamiComponents";
import {
  setIsMenuOpen,
  setLastScrollY,
  setIsSearchOpen,
  setIsMobileSearchOpen,
  setIsShowingResults,
  setSearchQuery,
} from "@/store/slices/commonSlice";
import {
  setSearchedProductList,
  setCurrentPage,
} from "@/store/slices/productSlice";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import flagUs from "@/assets/images/flag-us.webp";
import textLogo from "@/assets/images/logo-text.webp";
import diamondIcon from "@/assets/icons/diamond.svg";
import calendarIcon from "@/assets/icons/calendar.svg";
import { usePathname } from "next/navigation";
import { getMenuList } from "@/_actions/home.action";
import { helperFunctions } from "@/_helper";
import miniLogo from "@/assets/images/mini-logo.webp";
import CustomImg from "../ui/custom-img";

export default function Header() {
  const dispatch = useDispatch();
  const { isMenuOpen, lastScrollY, isCartOpen, transparentHeaderBg } =
    useSelector(({ common }) => common);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const searchContainerRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const pathname = usePathname();
  const hideCartPopup = helperFunctions?.shouldHideCartPopup(pathname);

  // Reset search state on route change
  useEffect(() => {
    dispatch(setSearchQuery(""));
    dispatch(setIsSearchOpen(false));
    dispatch(setIsMobileSearchOpen(false));
    dispatch(setIsShowingResults(false));
    dispatch(setCurrentPage(0));
    dispatch(setSearchedProductList([]));
  }, [pathname, dispatch]);

  const toggleMenu = () => dispatch(setIsMenuOpen(!isMenuOpen));

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      dispatch(setLastScrollY(currentScrollY));
      setIsHeaderVisible(currentScrollY > 100);

      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        dispatch(setIsMenuOpen(false));
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, lastScrollY]);

  useEffect(() => {
    dispatch(getMenuList());
  }, [dispatch]);

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

  useEffect(() => {
    if (isCartOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  useEffect(() => {
    return () => {
      dispatch(setIsMenuOpen(false));
    };
  }, [dispatch]);

  return (
    <>
      <div className="bg-primary py-2 text-white text-xs flex justify-between items-center px-6 lg:px-8">
        <div></div>
        <p className="font-castoro">FREE Shipping and FREE Returns.</p>
        <CustomImg srcAttr={flagUs} className="rounded-full w-6" />
      </div>
      <header
        className={`w-full z-50 transition-all duration-700 ease-in-out 
    ${
      isHeaderVisible
        ? // "fixed -top-2 animate-slideDown animate-duration-900 animate-ease-in-out clear-both"
          "fixed -top-0 lg:-top-20 animate-slideDown animate-duration-900 animate-ease-in-out clear-both"
        : ""
    }
    ${
      transparentHeaderBg && !isHeaderVisible ? "lg:bg-offwhite" : "lg:bg-white"
    }
  bg-white`}
      >
        <div className="flex justify-between items-center pt-3 pb-2.5 lg:pb-0 !px-5 lg:pt-[15px] lg:px-0 2xl:px-4 container">
          <div className="items-center gap-6 font-extralight text-[#2B2B2B] text-[14px] 2xl:text-base hidden lg:flex">
            <Link href={"/contact-us"} className="flex items-center gap-1">
              <CustomImg
                srcAttr={diamondIcon}
                className="w-6"
                altAttr=""
                titleAttr=""
              />
              <h3 className="uppercase">CONTACT US</h3>
            </Link>
            <Link
              href={"/book-appointment"}
              className="flex items-center gap-1.5"
            >
              <CustomImg
                className="w-6"
                srcAttr={calendarIcon}
                altAttr=""
                titleAttr=""
              />
              <h3 className="uppercase">Book Appointment</h3>
            </Link>
          </div>
          <div className="ps-2 lg:hidden">
            <button
              className="p-1.5 xxs:p-2 hover:bg-black/10 rounded-full text-black transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <RxCross2 className="w-5 h-5 xxs:w-6 xxs:h-6" />
              ) : (
                <IoMenu className="w-5 h-5 xxs:w-6 xxs:h-6" />
              )}
            </button>
          </div>

          {/* <Link href={"/"}>
            <CustomImg
              srcAttr={textLogo}
              className="w-32 xs:w-48 lg:w-52 2xl:w-64"
            />
          </Link> */}
          <Link href={"/"}>
            <CustomImg
              srcAttr={textLogo}
              // className="hidden lg:block w-32 xs:w-48 lg:w-52 2xl:w-64"
              className="w-[75px] md:w-24 lg:w-36 2xl:w-40"
            />
            {/* <CustomImg srcAttr={miniLogo} className="lg:hidden w-12 2xl:w-12" /> */}
          </Link>

          <div className="text-xl flex items-center gap-3 lg:w-64 justify-end">
            {lastScrollY <= 100 ? (
              <SearchBar
                isMobile={false}
                searchContainerRef={searchContainerRef}
                resultsContainerRef={resultsContainerRef}
                navSearchInputRef={searchInputRef}
                mobileSearchInputRef={mobileSearchInputRef}
                lastScrollY={lastScrollY}
                isHeaderVisible={isHeaderVisible}
              />
            ) : null}
            <ProfileDropdown
              className={"hidden lg:block"}
              uniqueId={"desktop-header-profile"}
            />
            <div className="pe-3.5 lg:pe-0 inline-flex">
              {!hideCartPopup ? <CartPopup /> : <CartIconInCheckout />}
            </div>
          </div>
        </div>
        <SearchBar
          isMobile={true}
          searchContainerRef={searchContainerRef}
          resultsContainerRef={resultsContainerRef}
          mobileSearchInputRef={mobileSearchInputRef}
          lastScrollY={lastScrollY}
          isHeaderVisible={isHeaderVisible}
        />
        <NavigationHeader />
      </header>
    </>
  );
}
