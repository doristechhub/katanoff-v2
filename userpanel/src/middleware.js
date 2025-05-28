import { NextResponse } from "next/server";
export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const currentUserCookie = request.cookies.get("token")?.value;

  // Check authentication via cookie
  const isAuthenticated = !!currentUserCookie;

  // Protected routes that require authentication
  const protectedRoutes = ["/order-history", "/return-history", "/profile"];

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && pathname.startsWith("/auth")) {
    console.log("Redirecting authenticated user from /auth to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users from protected routes to login
  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    console.log("Redirecting unauthenticated user to /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Root redirect to shop (commented out in your code)
  // if (pathname === "/") {
  //   console.log("Redirecting / to /shop");
  //   return NextResponse.redirect(new URL("/shop", request.url));
  // }

  console.log("No redirect, proceeding with NextResponse.next()");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // Root redirect
    "/auth/:path*", // All auth routes
    "/auth/verify-otp", // OTP verification
    "/order-history", // Order history
    "/return-history", // Return history
    "/profile", // Profile
  ],
};
