"use client";
import { HeaderLinkButton } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import miniLogo from "@/assets/images/logo-2.webp";
import { CustomImg } from "../../dynamiComponents";
import CartPopup from "../../ui/CartPopup";
import ProfileDropdown from "@/components/ui/ProfileDropdown";
export default function NavigationHeader() {
  const dispatch = useDispatch();
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
      className={`w-full bg-white  z-40 transition-all duration-500 ease-in-out ${
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

        <ul className={`flex gap-10`}>
          {profileLinks.map((link, index) => {
            return (
              <li
                key={`lg-profile-link-${index}`}
                className={`relative ${
                  lastScrollY > 100 ? "py-2 lg:py-6" : "pb-4"
                }`}
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

        {lastScrollY > 100 ? (
          <div className="text-xl flex py-6 items-center gap-5">
            <Link href={"/search"}>
              <IoIosSearch />
            </Link>
            {/* <GoHeart /> */}
            <CartPopup />
            <ProfileDropdown className={"hidden lg:block"} />
          </div>
        ) : null}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-[70px] left-0 right-0 bottom-0 bg-white z-50"
          >
            <nav
              className="h-full px-4 py-2 flex flex-col divide-y divide-gray-200 overflow-y-auto mt-6 "
              style={{ maxHeight: "calc(100vh - 60px)" }}
            >
              {profileLinks.map((link, index) => {
                return (
                  <HeaderLinkButton
                    key={`sm-profile-link-${index}`}
                    href={link.href}
                    className="py-3"
                    onClick={() => {
                      dispatch(setIsHeaderVisible(false));
                    }}
                  >
                    {link.title}
                  </HeaderLinkButton>
                );
              })}
              <ProfileDropdown />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
