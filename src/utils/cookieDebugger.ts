/**
 * Cookie debugging utilities for IIS server
 */

export class CookieDebugger {
  /**
   * Test cookie functionality in the current environment
   */
  static testCookies() {
    if (typeof window === 'undefined') {
      console.log('Running on server side - cookies not available');
      return false;
    }

    console.log('=== Cookie Debug Information ===');
    console.log('User Agent:', navigator.userAgent);
    console.log('Current URL:', window.location.href);
    console.log('Protocol:', window.location.protocol);
    console.log('Domain:', window.location.hostname);
    
    // Test basic cookie functionality
    const testCookieName = 'test_cookie_' + Date.now();
    const testValue = 'test_value';
    
    // Set test cookie
    document.cookie = `${testCookieName}=${testValue}; path=/; samesite=lax`;
    
    // Try to read it back
    const cookies = document.cookie.split(';');
    const foundCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${testCookieName}=`)
    );
    
    if (foundCookie) {
      console.log('✅ Basic cookie functionality works');
      // Clean up test cookie
      document.cookie = `${testCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      return true;
    } else {
      console.log('❌ Basic cookie functionality failed');
      return false;
    }
  }

  /**
   * Debug current cookie state
   */
  static debugCurrentCookies() {
    if (typeof window === 'undefined') return;

    console.log('=== Current Cookies ===');
    console.log('Raw cookie string:', document.cookie);
    
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      console.log(`Cookie: ${name} = ${value}`);
    });

    // Check for auth token specifically
    const authToken = cookies.find(cookie => 
      cookie.trim().startsWith('token=')
    );
    
    if (authToken) {
      console.log('✅ Auth token found in cookies:', authToken);
    } else {
      console.log('❌ Auth token not found in cookies');
    }

    // Check localStorage
    if (localStorage.getItem('token')) {
      console.log('✅ Auth token found in localStorage');
    } else {
      console.log('❌ Auth token not found in localStorage');
    }
  }

  /**
   * Log environment information
   */
  static logEnvironment() {
    console.log('=== Environment Information ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Is HTTPS:', window.location.protocol === 'https:');
    console.log('Is localhost:', window.location.hostname === 'localhost');
    console.log('Is file protocol:', window.location.protocol === 'file:');
  }
}

// Auto-run diagnostics in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    CookieDebugger.logEnvironment();
    CookieDebugger.testCookies();
    CookieDebugger.debugCurrentCookies();
  }, 1000);
}
