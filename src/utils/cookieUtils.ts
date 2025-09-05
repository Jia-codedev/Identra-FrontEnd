/**
 * Cookie utility functions for better IIS compatibility
 */

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

export class CookieUtils {
  /**
   * Set a cookie with proper IIS-compatible configuration
   */
  static setCookie(name: string, value: string, options: CookieOptions = {}) {
    if (typeof window === 'undefined') return;

    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieParts = [`${name}=${encodeURIComponent(value)}`];
    
    if (options.expires) {
      cookieParts.push(`expires=${options.expires.toUTCString()}`);
    }
    
    if (options.maxAge) {
      cookieParts.push(`max-age=${options.maxAge}`);
    }
    
    cookieParts.push(`path=${options.path || '/'}`);
    
    if (options.domain) {
      cookieParts.push(`domain=${options.domain}`);
    }
    
    // Use secure flag only in production and when requested
    if (options.secure !== false && isProduction) {
      cookieParts.push('secure');
    }
    
    // Use lax for better IIS compatibility instead of strict
    const sameSite = options.sameSite || 'lax';
    cookieParts.push(`samesite=${sameSite}`);
    
    // HttpOnly should be false for client-side access
    if (options.httpOnly === false) {
      // Don't add httponly flag to allow JavaScript access
    }
    
    document.cookie = cookieParts.join('; ');
  }

  /**
   * Get a cookie value by name
   */
  static getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
    
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    
    return null;
  }

  /**
   * Remove a cookie by setting it to expire in the past
   */
  static removeCookie(name: string, path: string = '/', domain?: string) {
    if (typeof window === 'undefined') return;
    
    const cookieParts = [
      `${name}=`,
      'expires=Thu, 01 Jan 1970 00:00:00 UTC',
      `path=${path}`,
      'samesite=lax'
    ];
    
    if (domain) {
      cookieParts.push(`domain=${domain}`);
    }
    
    document.cookie = cookieParts.join('; ');
  }

  /**
   * Set authentication token with proper expiration
   */
  static setAuthToken(token: string, rememberMe: boolean = false) {
    const expires = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    
    this.setCookie('token', token, {
      expires,
      path: '/',
      secure: false, // Will be set automatically based on environment
      sameSite: 'lax',
      httpOnly: false // Allow JavaScript access
    });
  }

  /**
   * Remove authentication token
   */
  static removeAuthToken() {
    this.removeCookie('token');
  }

  /**
   * Check if cookies are enabled in the browser
   */
  static areCookiesEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    
    const testCookie = 'test_cookie';
    document.cookie = `${testCookie}=test; path=/; samesite=lax`;
    const enabled = document.cookie.indexOf(testCookie) !== -1;
    
    // Clean up test cookie
    if (enabled) {
      this.removeCookie(testCookie);
    }
    
    return enabled;
  }
}
