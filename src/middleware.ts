import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import apiClient from "./configs/api/Axios";

async function isTokenExpired(token?: string): Promise<boolean> {
  if (!token) return true;
  try {
    // Decode token and check exp
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip public assets
  const PUBLIC_FILE = /\.(.*)$/;
  const isPublicAsset =
    path.startsWith("/_next/") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/logo1.png") ||
    path.startsWith("/favicon.ico") ||
    PUBLIC_FILE.test(path);
  if (isPublicAsset) {
    return NextResponse.next();
  }
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (path === "/") {
    console.log("Public asset or route, allowing access");
    console.log("Token:", token);
    console.log("Refresh Token:", refreshToken);
    return NextResponse.next();
  }

  // No tokens at all → force login
  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If access token expired but refresh token exists → refresh
  if (await isTokenExpired(token)) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const res = await apiClient.post("/auth/refresh", { refreshToken });
      if (res.status === 200 && res.data.token) {
        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;

        const response = NextResponse.next();
        response.cookies.set("token", newToken, {
          httpOnly: true,
          secure: true,
        });
        response.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
        });
        return response;
      }
    } catch (e) {
      console.error("Refresh failed:", e);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|swc.js|api).*)"],
};
