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
export function middleware(request: NextRequest) {
  return NextResponse.next()}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [],
}