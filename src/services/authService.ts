import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";
import { CookieUtils } from "@/utils/cookieUtils";

class AuthService {
  async login(credentials: IAuth) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      if (
        response.status === 200 &&
        response.data.token &&
        response.data.user
      ) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        CookieUtils.setAuthToken(token, credentials.rememberMe || false);
        useUserStore.getState().setUser(user);
        return response;
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  async adlogin() {
    try {
      console.log("Starting Azure AD login...");

      // Prefer explicit public env var for the backend host so we don't depend on axios defaults
      const envBase = typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_IDENTRA_BE_URI;
      // Use apiClient.baseURL as second option, then fall back to localhost:8000
      const baseURL = (envBase as string) || apiClient?.defaults?.baseURL || "http://localhost:8000";
      console.log("Using backend base URL for AD login:", baseURL);

      // Construct the login URL and perform a browser redirect (OAuth requires a full-browser redirect)
      if (typeof window === "undefined") {
        console.error("adlogin() must run in a browser environment");
        throw new Error("adlogin() must be called client-side");
      }

      const loginUrl = `${baseURL.replace(/\/$/, "")}/auth/azure/login`;
      try {
        // Validate constructed URL
        // eslint-disable-next-line no-new
        new URL(loginUrl);
      } catch (urlError) {
        console.error("Invalid login URL:", loginUrl, urlError);
        throw urlError;
      }

      // Use location.assign to make redirect more explicit in some browsers
      console.info("Redirecting browser to Azure login endpoint:", loginUrl);
      window.location.assign(loginUrl);

      // Return a value for callers who await this (though redirect will unload the page)
      return { status: 302, data: { message: "Redirecting to Azure AD login", url: loginUrl } };
    } catch (error) {
      console.error("AD Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      // Call backend logout endpoint
      const response = await apiClient.post("/auth/logout", {});

      // Clear user data regardless of response status
      useUserStore.getState().clearUser();

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Clear token cookie using utility function
      CookieUtils.removeAuthToken();

      return response;
    } catch (error) {
      // Clear user data even if logout request fails
      useUserStore.getState().clearUser();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Clear token cookie using utility function
      CookieUtils.removeAuthToken();

      console.error("Logout error:", error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await apiClient.get("/auth/me");

      if (response.status === 200 && response.data.user) {
        const { user } = response.data;
        useUserStore.getState().setUser(user);
        return response;
      }

      return response;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await apiClient.post("/auth/refresh", {});

      if (response.status === 200 && response.data.token) {
        const { token } = response.data;

        // Update token in localStorage
        localStorage.setItem("token", token);

        // Update token in cookie using utility function
        CookieUtils.setAuthToken(token, false);
        return response;
      }

      return response;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    // Check if token exists in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = useUserStore.getState().user;
      return !!(token && user);
    }
    return false;
  }
}

const authService = new AuthService();
export default authService;
