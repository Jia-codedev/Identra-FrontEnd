import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";

class AuthService {
  async login(credentials: IAuth) {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      
      if (response.status === 200 && response.data.token && response.data.user) {
        const { token, user } = response.data;
        
        // Store token in localStorage for Bearer auth
        localStorage.setItem("token", token);
        
        // Store token in cookie as well (with proper expiration)
        const expires = credentials.rememberMe 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
          
        document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
        
        // Store user data
        useUserStore.getState().setUser(user);
        console.log("User logged in and stored:", user);
        console.log("Token stored in localStorage and cookie");
        
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
      
      // Clear token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      console.log("User logged out and cleared from store");
      return response;
    } catch (error) {
      // Clear user data even if logout request fails
      useUserStore.getState().clearUser();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Clear token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
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
        
        // Update token in cookie
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
        
        console.log("Token refreshed successfully");
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
