import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";
import { CookieUtils } from "@/utils/cookieUtils";

class AuthService {
  async login(credentials: IAuth) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      
      if (response.status === 200 && response.data.token && response.data.user) {
        const { token, user } = response.data;
        
        // Store token in localStorage for Bearer auth
        localStorage.setItem("token", token);
        
        // Store token in cookie using utility function
        CookieUtils.setAuthToken(token, credentials.rememberMe || false);
        
        // Store user data
        useUserStore.getState().setUser(user);
        
        return response;
      }
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
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
