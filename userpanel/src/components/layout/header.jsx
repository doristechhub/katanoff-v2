"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getMenuList } from "@/_actions/home.action";
import { useEffect, useState } from "react";
import { CustomImg, NavigationHeader } from "../dynamiComponents";
import { setIsMenuOpen, setLastScrollY } from "@/store/slices/commonSlice";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import logo from "@/assets/images/logo-2.webp";
import diamondIcon from "@/assets/icons/diamond.svg";
import CartPopup from "../ui/CartPopup";
import { fetchCart } from "@/_actions/cart.action";
import { IoIosSearch } from "react-icons/io";
import { GoHeart } from "react-icons/go";
import ProfileDropdown from "../ui/ProfileDropdown";
import { usePathname } from "next/navigation";

export default function Header() {
  const dispatch = useDispatch();
  const { isMenuOpen, lastScrollY, isCartOpen, transparenHeadertBg } =
    useSelector(({ common }) => common);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const toggleMenu = () => dispatch(setIsMenuOpen(!isMenuOpen));

  useEffect(() => {
    dispatch(getMenuList());
  }, [dispatch]);

  const pathname = usePathname();
  const hideCartPopup =
    pathname === "/checkout" ||
    pathname === "/shipping" ||
    pathname.startsWith("/payment");

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

  useEffect(() => {
    return () => {
      dispatch(setIsMenuOpen(false));
    };
  }, []);

  return (
    <header
      className={`${
        isHeaderVisible
          ? "fixed top-0 left-0 shadow-lg lg:static lg:top-0 lg:left-0"
          : ""
      } fixed lg:static w-full ${
        transparenHeadertBg ? "lg:bg-offwhite" : "lg:bg-white"
      } bg-white z-50 shadow transition-all duration-300`}
    >
      <div className="flex justify-between items-center py-4 lg:pt-4 lg:pb-0 px-6 lg:px-20">
        <Link
          href={"/appointment-and-custom-jewelry"}
          className="hidden lg:flex gap-1 lg:w-64"
        >
          <CustomImg
            srcAttr={diamondIcon}
            className="w-6"
            altAttr=""
            titleAttr=""
          />
          <h3 className="text-base">Appointment & Custom Jewelry</h3>
        </Link>
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
          <CustomImg srcAttr={logo} className="w-28 lg:w-40" />
        </Link>

        <div className="text-xl flex items-center gap-5 lg:w-64 justify-end">
          <Link href={"/search"} onClick={() => dispatch(setIsMenuOpen(false))}>
            <IoIosSearch />
          </Link>
          {/* <GoHeart /> */}
          {!hideCartPopup && <CartPopup />}
          <ProfileDropdown
            className={"hidden lg:block"}
            uniqueId={"desktop-header-profile"}
          />
        </div>
      </div>

      <NavigationHeader />
    </header>
  );
}
