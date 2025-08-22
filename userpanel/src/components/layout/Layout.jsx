"use client";

import axios from "axios";
import { setAuthToken } from "@/interceptors/httpInterceptor";
import Cookies from "js-cookie";
import { apiUrl, helperFunctions } from "@/_helper";
import errorInterceptor from "@/interceptors/errorInterceptor";
import { usePathname, useRouter } from "next/navigation";
import { setTransparentHeaderBg } from "@/store/slices/commonSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  axios.defaults.baseURL = apiUrl;
  setAuthToken();
  errorInterceptor(router);

  useEffect(() => {
    const isCollectionPage = /^\/collections\/[^/]+\/[^/]+$/.test(pathname);
    const isProductPage = /^\/products\/[^/]+$/.test(pathname);
    const isStartWithDiamond = /^\/customize\/[^/]+$/.test(pathname);

    const staticTransparentRoutes = ["/appointment-and-custom-jewelry"];

    const isStaticTransparent = staticTransparentRoutes.includes(pathname);

    dispatch(
      setTransparentHeaderBg(
        isCollectionPage ||
          isProductPage ||
          isStartWithDiamond ||
          isStaticTransparent
      )
    );
  }, [pathname, dispatch]);

  useEffect(() => {
    const token = Cookies.get("token");
    const currentUser = helperFunctions?.getCurrentUser();
    if (!token && currentUser?.token) {
      Cookies.set("token", currentUser?.token);
    }
  }, []);

  return children;
};

export default Layout;
