"use client";
import Cookies from "js-cookie";
import { helperFunctions } from "@/_helper";
import {
  setIsMenuOpen,
  setOpenProfileDropdown,
} from "@/store/slices/commonSlice";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineUser } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { HeaderLinkButton } from "./button";
import { fetchCart } from "@/_actions/cart.action";
import { useEffect } from "react";
export default function ProfileDropdown({ className = "", uniqueId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    if (pathname === "/checkout") {
      localStorage.setItem("postLoginRedirect", "/checkout");
    }
  };
  const { openProfileDropdown, lastScrollY } = useSelector(
    ({ common }) => common
  );
  let currentUser = helperFunctions?.getCurrentUser();

  const isOpen = openProfileDropdown === uniqueId;

  const toggleDropdown = () => {
    if (isOpen) {
      dispatch(setOpenProfileDropdown(null));
    } else {
      dispatch(setOpenProfileDropdown(uniqueId));
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("currentUser");
    Cookies.remove("token");
    dispatch(fetchCart());
    router.push("/");
  };

  useEffect(() => {
    if (
      uniqueId === "desktop-header-profile" &&
      openProfileDropdown === uniqueId
    ) {
      if (lastScrollY > 0) {
        dispatch(setOpenProfileDropdown(null));
      }
    }
  }, [lastScrollY, uniqueId, openProfileDropdown, dispatch]);

  const profileDropDown = [
    { title: "Home", href: "/" },
    { title: "Profile", href: "/profile" },
    { title: "Order History", href: "/order-history" },
    { title: "Return History", href: "/return-history" },
    { title: "Log Out", onClick: logOutHandler },
  ];

  return (
    <div className={`${className}`}>
      {currentUser ? (
        <>
          {/* Mobile */}
          <div className="lg:hidden flex flex-col border-t pt-4">
            <p className="uppercase text-basegray my-1.5 font-semibold text-sm ps-3">
              Profile
            </p>
            <HeaderLinkButton
              className="text-baseblack !px-[10px] hover:text-primary flex justify-between items-center w-full py-2.5"
              onClick={toggleDropdown}
            >
              <div className="flex items-center gap-4">
                <div className="h-7 w-7 rounded-full bg-primary text-white text-xs font-semibold flex justify-center items-center">
                  {helperFunctions?.getNameInitials(
                    currentUser?.firstName,
                    currentUser?.lastName
                  )}
                </div>
                <h3>
                  {currentUser?.firstName} {currentUser?.lastName}
                </h3>
              </div>
              <IoIosArrowDown
                className={`transition-all text-primary duration-300 ease-in-out transform ${
                  isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"
                }`}
              />
            </HeaderLinkButton>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen
                  ? "max-h-96 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <div className="ms-6 flex flex-col">
                {profileDropDown.map((link, index) => (
                  <HeaderLinkButton
                    key={`mobile-dropdown-${index}`}
                    href={link.href || "#"}
                    onClick={() => {
                      if (link.onClick) link.onClick();
                      dispatch(setOpenProfileDropdown(null));
                      dispatch(setIsMenuOpen(false));
                    }}
                    className="py-1 !p-[10px] text-[0.875em] hover:!text-primary"
                  >
                    {link.title}
                  </HeaderLinkButton>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div
            className="hidden lg:flex items-center justify-between gap-0.5 cursor-pointer relative"
            onMouseEnter={() => dispatch(setOpenProfileDropdown(uniqueId))}
            onMouseLeave={() => dispatch(setOpenProfileDropdown(null))}
          >
            <div className="h-7 w-7 rounded-full bg-primary text-white text-xs font-semibold flex justify-center items-center">
              {helperFunctions.getNameInitials(
                currentUser.firstName,
                currentUser.lastName
              )}
            </div>
            <IoIosArrowDown
              className={`transition-all text-primary duration-300 ease-in-out transform ${
                isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"
              }`}
            />
            <div
              className={`absolute top-10 left-1/2 -translate-x-1/2 text-base w-44 2xl:w-52 bg-offwhite shadow-lg uppercase font-light z-50 overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen
                  ? "max-h-96 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <div className="py-1">
                {profileDropDown.map((link, index) => (
                  <HeaderLinkButton
                    key={`desktop-dropdown-${index}`}
                    href={link.href || "#"}
                    onClick={link.onClick || undefined}
                    className="block py-2.5 !px-4 2xl:!px-6 text-baseblack hover:!text-primary hover:!font-semibold border-b hover:bg-gray-200 last:border-b-0"
                  >
                    {link.title}
                  </HeaderLinkButton>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <HeaderLinkButton
            href={"/auth/login"}
            className="hidden lg:block !px-0"
            onClick={handleLoginClick}
          >
            <HiOutlineUser className="text-xl" />
          </HeaderLinkButton>
          <div className="lg:hidden w-full h-[1px] bg-gray-e2 mb-2.5"></div>
          <HeaderLinkButton
            className="!p-[10px] lg:hidden"
            href={"/auth/login"}
            onClick={handleLoginClick}
          >
            Login
          </HeaderLinkButton>
        </>
      )}
    </div>
  );
}
