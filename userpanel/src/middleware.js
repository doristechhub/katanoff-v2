import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  const isAuthenticated = !!token;

  const protectedRoutes = [
    "/order-history",
    "/return-history",
    "/return-request",
    "/profile",
  ];


  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !isAuthenticated &&
    isProtected
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // Root redirect
    "/auth/:path*", // All auth routes
    "/auth/verify-otp", // OTP verification
    "/order-history", // Order history
    "/order-history/:path*", // Order detail
    "/return-history", // Return history
    "/return-history/:path*", // Return detail
    "/return-request", // Return Request
    "/return-request/:path*", // Return Request detail
    "/profile", // Profile
  ],
};
