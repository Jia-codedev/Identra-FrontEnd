import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const PUBLIC_FILE = /\.(.*)$/;
  const isPublicAsset =
    path.startsWith("/_next/") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/logo1.png") ||
    PUBLIC_FILE.test(path);
  if (isPublicAsset) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (token) {
    if (path === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }
  if (!token) {
    if (path === "/") {
      return NextResponse.next();
    }
  }
  if (path === "/" && !refreshToken) {
    return NextResponse.next();
  }
  if (!refreshToken) {
    if (path === "/") {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|swc.js|api).*)"],
};
