
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked async if using await inside
export function middleware(request: NextRequest) {
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

  // Check for authentication token in cookies
  const tokenCookie = request.cookies.get("token");
  const hasToken = !!tokenCookie?.value;
  
  // For protected routes (not login page)
  if (path !== "/") {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // For login page - redirect to dashboard if already authenticated
  if (path === "/" && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|favicon.ico|swc.js|api).*)",
  ],
};