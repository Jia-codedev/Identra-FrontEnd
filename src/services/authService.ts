import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";

class AuthService {
  async login(credentials: IAuth) {
    const response = await apiClient.post("/auth/login", credentials, { withCredentials: true });
    if (response.status !== 200) {
      return response;
    }
    const { user } = response.data;
    useUserStore.getState().setUser(user);
    localStorage.setItem("token", response.data.token);
    console.log("User logged in and stored:", user);
    return response;
  }
  
  async logout() {
    const response = await apiClient.post("/auth/logout");
    if (response.status !== 200) {
      return response;
    }
    useUserStore.getState().clearUser();
    console.log("User logged out and cleared from store");
    
    return response;
  }
}

const authService = new AuthService();
export default authService;
