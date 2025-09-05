import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";
import tokenService from "@/configs/api/jwtToken";
import authService from "@/services/authService";

class UserService {
  async restoreUserFromToken(): Promise<boolean> {
    try {
      // Instead of checking for a token in JS, always try to fetch user data from backend
      // The backend will use its own cookies for authentication
      const response = await apiClient.get(`/secuser/me`); // You may need to implement this endpoint
      if (response.status === 200 && response.data.success) {
        const userData = response.data.data;
        const employeeData = userData.employee_master;
        const user: IUser = {
          employeename: {
            firsteng: employeeData?.firstname_eng || "",
            lasteng: employeeData?.lastname_eng || "",
            firstarb: employeeData?.firstname_arb || "",
            lastarb: employeeData?.lastname_arb || "",
          },
          employeenumber: employeeData?.employee_id,
          scheduledgeocoordinates: employeeData?.scheduled_geo_coordinates || null,
          radius: employeeData?.radius || 0,
          email: employeeData?.email || "",
          isGeofence: employeeData?.geofence_flag || false,
          role: userData.role || "Employee",
        };
        useUserStore.getState().setUser(user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async refreshUserData(): Promise<boolean> {
    try {
      const currentUser = useUserStore.getState().user;
      if (!currentUser?.employeenumber) {
        return false;
      }

      let response = await apiClient.get(`/secuser/get-by-emp-id/${currentUser.employeenumber}`, { 
        withCredentials: true 
      });
      
      // The axios interceptor will handle 401 errors and automatic token refresh
      // We don't need manual token handling here since we're using HttpOnly cookies

      if (response.status === 200 && response.data.success) {
        const userData = response.data.data;
        const employeeData = userData.employee_master;
        
        const updatedUser: IUser = {
          employeename: {
            firsteng: employeeData?.firstname_eng || "",
            lasteng: employeeData?.lastname_eng || "",
            firstarb: employeeData?.firstname_arb || "",
            lastarb: employeeData?.lastname_arb || "",
          },
          employeenumber: employeeData?.employee_id || currentUser.employeenumber,
          scheduledgeocoordinates: employeeData?.scheduled_geo_coordinates || null,
          radius: employeeData?.radius || 0,
          email: employeeData?.email || "",
          isGeofence: employeeData?.geofence_flag || false,
          role: currentUser.role, // Keep existing role
        };

        useUserStore.getState().setUser(updatedUser);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return false;
    }
  }

  async initializeUser(): Promise<void> {
    const existingUser = useUserStore.getState().user;
    
    if (existingUser) {
      await this.refreshUserData();
      return;
    }

    await this.restoreUserFromSession();
  }

  async restoreUserFromSession(): Promise<void> {
    try {
      // Check if token exists in localStorage or cookies
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
        
        // If no token in localStorage, try cookies
        if (!token) {
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
          if (tokenCookie) {
            token = tokenCookie.split('=')[1];
            localStorage.setItem("token", token);
          }
        }
      }
      
      if (!token) {
        return;
      }
      
      // Try to get user profile from backend using Bearer token
      const response = await authService.getProfile();
      
      if (response.status === 200 && response.data.user) {
        const user = response.data.user;
        useUserStore.getState().setUser(user);
      } else {
      }
    } catch (error) {
      // Clear invalid tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }
  }

  clearUser(): void {
    useUserStore.getState().clearUser();
    // Clear tokens from both localStorage and cookies
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }
}

const userService = new UserService();
export default userService;
