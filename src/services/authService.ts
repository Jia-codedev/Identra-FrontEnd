import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";

class AuthService {
  async login(credentials: IAuth) {
    const response = await apiClient.post("/auth/login", credentials);
    if (response.status !== 200) {
      return response;
    }
    const token = response.data.token;
    if (!token) {
      throw new Error("Login failed: No token received");
    }
    
    document.cookie = `_authToken=${token}; path=/; max-age=${
      credentials.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60
    }; secure; samesite=strict`;
    
    sessionStorage.setItem("authToken", token);
    
    const { user } = response.data;
    useUserStore.getState().setUser(user);
    console.log("User logged in and stored:", user);
    
    return response;
  }
  
  async logout() {
    const response = await apiClient.post("/auth/logout");
    if (response.status !== 200) {
      return response;
    }
    
    document.cookie = "_authToken=; path=/; max-age=0; secure; samesite=strict";
    sessionStorage.removeItem("authToken");
    
    useUserStore.getState().clearUser();
    console.log("User logged out and cleared from store");
    
    return response;
  }
}

const authService = new AuthService();
export default authService;
