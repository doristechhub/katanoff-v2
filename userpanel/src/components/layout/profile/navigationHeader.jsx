"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosLogOut, IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import miniLogo from "@/assets/images/mini-logo.webp";
import {
  CartPopup,
  CustomImg,
  HeaderLinkButton,
  ProfileDropdown,
} from "../../dynamiComponents";
import { mainHeaderLinks } from "../navigationHeader";
import Cookies from "js-cookie";
import { fetchCart } from "@/_actions/cart.action";
import { useRouter } from "next/navigation";
import { helperFunctions } from "@/_helper";
import { setIsMenuOpen } from "@/store/slices/commonSlice";

export default function NavigationHeader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isMenuOpen } = useSelector(({ common }) => common);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  let currentUser = helperFunctions?.getCurrentUser();

  const logOutHandler = () => {
    localStorage.removeItem("currentUser");
    Cookies.remove("token");
    dispatch(fetchCart());
    setIsHeaderVisible(false);
    router.push("/");
  };
  const handleLoginClick = () => {
    if (pathname === "/checkout") {
      localStorage.setItem("postLoginRedirect", "/checkout");
    }
  };

  const profileLinks = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Order History",
      href: "/order-history",
    },
    {
      title: "Return History",
      href: "/return-history",
    },
  ];
  return (
    <header
      className={`w-full   ${
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
        className={`hidden lg:flex ${
          lastScrollY > 100 ? "justify-between" : "justify-center"
        }  w-full container items-center gap-6`}
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

        <ul className={`flex gap-8 2xl:gap-10`}>
          {profileLinks.map((link, index) => {
            return (
              <li key={`lg-profile-link-${index}`} className={`relative`}>
                <HeaderLinkButton
                  href={link.href}
                  className={`rounded-none flex items-center gap-1 hover:!text-primary hover:!font-semibold  ${
                    lastScrollY > 100 ? "py-2 lg:py-5" : "py-4"
                  }`}
                >
                  {link.title}
                </HeaderLinkButton>
              </li>
            );
          })}
        </ul>

        {lastScrollY > 100 ? (
          <div
            className={`text-xl  ${
              lastScrollY > 100 ? "py-2 lg:py-5" : "py-4"
            } flex items-center gap-3`}
          >
            <Link href={"/search"}>
              <IoIosSearch />
            </Link>
            <ProfileDropdown className={"hidden lg:block"} />
            <CartPopup />
          </div>
        ) : null}
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-[100px] left-0 right-0 bottom-0 bg-white z-50"
          >
            <nav
              className="h-full px-4 py-2 flex flex-col overflow-y-auto mt-3"
              style={{ maxHeight: "calc(100vh - 60px)" }}
            >
              {profileLinks.map((link, index) => {
                return (
                  <div
                    key={`sm-profile-page-link-${index}`}
                    className="border-t py-3.5"
                  >
                    <HeaderLinkButton
                      href={link.href}
                      className="text-baseblack px-[10px] hover:text-primary"
                      onClick={() => {
                        dispatch(setIsMenuOpen(false));
                        setIsHeaderVisible(false);
                      }}
                    >
                      {link.title}
                    </HeaderLinkButton>
                  </div>
                );
              })}
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
                      }}
                    >
                      {item.image ? (
                        <CustomImg
                          srcAttr={item.image}
                          titleAttr=""
                          altAttr=""
                          className="w-6"
                        />
                      ) : item.icon ? (
                        item.icon
                      ) : null}
                      {item.title}
                    </HeaderLinkButton>
                  </div>
                );
              })}
              {currentUser ? (
                <div className="py-3.5 border-t">
                  <HeaderLinkButton
                    href={"#"}
                    className="!text-[14px] !uppercase flex items-center font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !px-[10px] !p-0 duration-300"
                    onClick={logOutHandler}
                  >
                    <IoIosLogOut className="text-2xl text-baseblack" />
                    Log out
                  </HeaderLinkButton>
                </div>
              ) : (
                <div className="py-3.5 border-t">
                  <HeaderLinkButton
                    href={"/auth/login"}
                    onClick={() => {
                      handleLoginClick();
                      dispatch(setIsHeaderVisible(false));
                    }}
                    className="!text-[14px] !uppercase flex items-center font-medium gap-2 text-baseblack transition-all hover:text-primary hover:!font-semibold !px-[10px] !p-0 duration-300"
                  >
                    <CiLogin className="text-2xl text-baseblack" />
                    Login
                  </HeaderLinkButton>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
