import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const PUBLIC_FILE = /\.(.*)$/;
  const isPublicAsset =
    path.startsWith("/_next/") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/logo") ||
    path.startsWith("/background.png") ||
    path.startsWith("/globals.css") ||
    path.startsWith("/language/") ||
    path.startsWith("/public/") ||
    PUBLIC_FILE.test(path);
  if (isPublicAsset) {
    return NextResponse.next();
  }
  const tokenCookie = request.cookies.get("token");
  const hasToken = !!tokenCookie?.value;
  if (path !== "/") {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  if (path === "/" && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|favicon.ico|swc.js|api).*)"],
};
