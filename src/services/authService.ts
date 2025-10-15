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
      const envBase =
        typeof process !== "undefined" &&
        process.env &&
        process.env.NEXT_PUBLIC_IDENTRA_BE_URI;
      const baseURL =
        (envBase as string) ||
        apiClient?.defaults?.baseURL ||
        "http://localhost:8000";
      if (typeof window === "undefined") {
        console.error("adlogin() must run in a browser environment");
        throw new Error("adlogin() must be called client-side");
      }

      const loginUrl = `${baseURL.replace(/\/$/, "")}/auth/azure/login`;
      try {
        new URL(loginUrl);
      } catch (urlError) {
        console.error("Invalid login URL:", loginUrl, urlError);
        throw urlError;
      }

      console.info("Redirecting browser to Azure login endpoint:", loginUrl);
      window.location.assign(loginUrl);

      return {
        status: 302,
        data: { message: "Redirecting to Azure AD login", url: loginUrl },
      };
    } catch (error) {
      console.error("AD Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await apiClient.post("/auth/logout", {});

      useUserStore.getState().clearUser();

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      CookieUtils.removeAuthToken();

      return response;
    } catch (error) {
      useUserStore.getState().clearUser();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

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

        localStorage.setItem("token", token);

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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = useUserStore.getState().user;
      return !!(token && user);
    }
    return false;
  }
  changePassword = async (data: {
    old_password: string;
    new_password: string;
  }) => {
    try {
      const response = await apiClient.patch("/auth/change-password", {
        oldPassword: data.old_password,
        newPassword: data.new_password,
      });
      return response;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  };
}

const authService = new AuthService();
export default authService;
