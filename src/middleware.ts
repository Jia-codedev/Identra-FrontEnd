import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import tokenService from "./configs/api/jwtToken";

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("_authToken")?.value ||
    request.headers.get("Authorization")?.split(" ")[1];

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

  if (!token && path !== "/") {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && path === "/") {
    try {
      const { id, role } = await tokenService.verifyToken(token);
      console.log("JWT Data:", { id, role });
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.log("Token verification failed, staying on login page:", error);
      return NextResponse.next();
    }
  }

  if (token && path !== "/") {
    try {
      const { id, role } = await tokenService.verifyToken(token);
      console.log("JWT Data:", { id, role });
      return NextResponse.next();
    } catch (error) {
      console.log("Token verification failed, redirecting to login:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next/static|favicon.ico|swc.js|api).*)",
  ],
};
