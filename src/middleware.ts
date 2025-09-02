import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for public assets and Next.js internal files
  const PUBLIC_FILE = /\.(.*)$/;
  const isPublicAsset =
    path.startsWith("/_next/") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/logo1.png") ||
    path.startsWith("/api/") ||
    PUBLIC_FILE.test(path);
  
  if (isPublicAsset) {
    return NextResponse.next();
  }

  // For client-side token management, we can't access localStorage in middleware
  // The authentication will be handled by the axios interceptors and API calls
  // Middleware should only handle basic routing

  // Allow all requests to pass through
  // Authentication will be handled by:
  // 1. Axios interceptors on the client side
  // 2. API responses that redirect on 401 errors
  // 3. Components that check authentication state
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|swc.js|api).*)"],
};
