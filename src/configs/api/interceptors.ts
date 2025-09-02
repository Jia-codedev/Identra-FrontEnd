import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

// Extend the AxiosRequestConfig to include _retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function setupInterceptors(client: AxiosInstance) {
  // Request interceptor - Add Bearer token from localStorage or cookies
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage first, then fallback to cookies
      if (typeof window !== "undefined") {
        let token = localStorage.getItem("token");
        
        // If no token in localStorage, try to get from cookies
        if (!token) {
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
          if (tokenCookie) {
            token = tokenCookie.split('=')[1];
            // Store in localStorage for future requests
            localStorage.setItem("token", token);
          }
        }
        
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle 401 errors and token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      // Check if it's a 401 error and not already a retry
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        const errorData = error.response.data as any;

        // Check if it's a token-related error that requires re-authentication
        if (
          errorData?.requireLogin ||
          errorData?.code === "NO_AUTH_HEADER" ||
          errorData?.code === "TOKEN_EXPIRED" ||
          errorData?.code === "INVALID_TOKEN"
        ) {
          // Mark as retry to prevent infinite loops
          originalRequest._retry = true;

          // Clear auth state and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Clear token cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            // Clear user store if available
            try {
              const { useUserStore } = await import("@/store/userStore");
              useUserStore.getState().clearUser();
            } catch (e) {
              console.warn("Could not clear user store:", e);
            }
            // Redirect to login page
            window.location.href = "/";
          }
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
}
