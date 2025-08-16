// import createMiddleware from 'next-intl/middleware';
// import { locales, defaultLocale } from './src/i18n/config';

// export default createMiddleware({
//   // A list of all locales that are supported
//   locales: locales,
  
//   // Used when no locale matches
//   defaultLocale: defaultLocale,
  
//   // Always show the locale prefix
//   localePrefix: 'as-needed'
// });

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(ar|en)/:path*']
// }; 

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked async if using await inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const PUBLIC_FILE = /\.(.*)$/;
  const isPublicAsset =
    path.startsWith("/_next/") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/logo") ||
    path.startsWith("/background.png") ||
    path.startsWith("/globals.css") ||
    path.startsWith("/lang/") ||
    path.startsWith("/public/") ||
    path.startsWith("/test") ||
    PUBLIC_FILE.test(path);

  if (isPublicAsset) {
    return NextResponse.next();
  }

  // Only check auth for protected routes (not login page)
  if (path !== "/") {
    // Call backend /secuser/me endpoint to check session
    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"}/secuser/me`, {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      });
      if (apiRes.status === 401) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // If 200, allow
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If on login page and already authenticated, redirect to dashboard
  if (path === "/") {
    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"}/secuser/me`, {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      });
      if (apiRes.status === 200) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    } catch (e) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|favicon.ico|swc.js|api).*)",
  ],
};