"use client";
import Link from "next/link";
import flagUs from "@/assets/images/flag-us.webp";
import { useDispatch, useSelector } from "react-redux";
import { getMenuList } from "@/_actions/home.action";
import { useEffect, useRef, useState } from "react";
import {
  CustomImg,
  ProfileNavigationHeader,
  SearchBar,
} from "../../dynamiComponents";
import { setIsMenuOpen, setLastScrollY } from "@/store/slices/commonSlice";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import diamondIcon from "@/assets/icons/diamond.svg";
import calendarIcon from "@/assets/icons/calendar.svg";
import textLogo from "@/assets/images/logo-text.svg";
import CartPopup from "../../ui/CartPopup";
import { fetchCart } from "@/_actions/cart.action";
import ProfileDropdown from "@/components/ui/ProfileDropdown";

export default function Header() {
  const dispatch = useDispatch();
  const { isMenuOpen, lastScrollY, isCartOpen } = useSelector(
    ({ common }) => common
  );

  const searchContainerRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const toggleMenu = () => dispatch(setIsMenuOpen(!isMenuOpen));

  useEffect(() => {
    dispatch(getMenuList());
  }, [dispatch]);

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
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <>
      <div className="bg-primary py-2 text-white text-xs flex justify-between items-center px-6 lg:px-8">
        <div></div>
        <p className="font-castoro">FREE Shipping and FREE Returns.</p>
        <CustomImg srcAttr={flagUs} className="rounded-full w-6" />
      </div>

      <header
        className={`fixed ${
          isHeaderVisible
            ? "left-0 shadow-[0_5px_5px_0_rgba(0,0,0,0.21)] lg:static lg:top-0 lg:left-0"
            : ""
        } ${
          lastScrollY > 50 ? "top-0" : "top-10"
        } lg:static w-full  bg-white z-50 shadow-[0_5px_5px_0_rgba(0,0,0,0.21)] transition-all duration-300`}
      >
        <div className="flex justify-between items-center pt-4 pb-2 !px-5 lg:pt-[30px] lg:px-0 2xl:px-4 container">
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
                srcAttr={calendarIcon}
                className="w-6"
                altAttr=""
                titleAttr=""
              />
              <h3 className="uppercase">Book Appointment</h3>
            </Link>
          </div>
          <button
            className="lg:hidden p-1.5 xxs:p-2 hover:bg-black/10 rounded-full text-black transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <RxCross2 className="w-5 h-5 xxs:w-6 xxs:h-6" />
            ) : (
              <IoMenu className="w-5 h-5 xxs:w-6 xxs:h-6" />
            )}
          </button>
          <Link href={"/"}>
            <CustomImg
              srcAttr={textLogo}
              className="w-32 xs:w-48 lg:w-52 2xl:w-64"
            />{" "}
          </Link>

          <div className="text-xl flex items-center gap-3 lg:w-64 justify-end">
            <SearchBar
              isMobile={false}
              searchContainerRef={searchContainerRef}
              resultsContainerRef={resultsContainerRef}
              navSearchInputRef={searchInputRef}
              mobileSearchInputRef={mobileSearchInputRef}
              lastScrollY={lastScrollY}
              isHeaderVisible={isHeaderVisible}
            />

            <ProfileDropdown
              className={"hidden lg:block"}
              uniqueId={"desktop-header-profile"}
            />

            <div className="pe-3.5 lg:pe-0 inline-flex">
              <CartPopup />
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
        <ProfileNavigationHeader />
      </header>
    </>
  );
}
