"use client";

import axios from "axios";
import { setAuthToken } from "@/interceptors/httpInterceptor";
import { apiUrl } from "@/_helper";
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

  return (
    <>
      <link
        rel="icon"
        type="image/png"
        href="/favicon/favicon-96x96.png"
        sizes="96x96"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <title>Katanoff | Jewelry</title>
      <meta name="apple-mobile-web-app-title" content="KatanOff" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <main className="h-full">{children}</main>
    </>
  );
};

export default Layout;
