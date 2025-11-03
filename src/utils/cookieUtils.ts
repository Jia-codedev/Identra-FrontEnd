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
    
    if (options.secure !== false && isProduction) {
      cookieParts.push('secure');
    }
    
    const sameSite = options.sameSite || 'lax';
    cookieParts.push(`samesite=${sameSite}`);
    
    if (options.httpOnly === false) {
    }
    
    document.cookie = cookieParts.join('; ');
  }

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


  static setAuthToken(token: string, rememberMe: boolean = false) {
    const expires = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000); 
    
    this.setCookie('token', token, {
      expires,
      path: '/',
      secure: false, 
      sameSite: 'lax',
      httpOnly: false 
    });
  }

  /**
   * Remove authentication token
   */
  static removeAuthToken() {
    this.removeCookie('token');
  }

  static areCookiesEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    
    const testCookie = 'test_cookie';
    document.cookie = `${testCookie}=test; path=/; samesite=lax`;
    const enabled = document.cookie.indexOf(testCookie) !== -1;
    
    if (enabled) {
      this.removeCookie(testCookie);
    }
    
    return enabled;
  }
}
