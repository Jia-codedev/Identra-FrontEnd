import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";
import tokenService from "@/configs/api/jwtToken";

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
        console.log("No current user to refresh");
        return false;
      }

      console.log("Refreshing user data for employee ID:", currentUser.employeenumber);
      let response = await apiClient.get(`/secuser/get-by-emp-id/${currentUser.employeenumber}`);
      // If unauthorized, attempt server-side refresh and retry once
      if (response.status === 401) {
        try {
          const refresh = await apiClient.post(`/auth/refresh`, null, { withCredentials: true });
          if (refresh.status === 200 && refresh.data?.token) {
            try {
              localStorage.setItem("token", refresh.data.token);
            } catch {}
            response = await apiClient.get(`/secuser/get-by-emp-id/${currentUser.employeenumber}`);
          }
        } catch (e) {
          console.warn("Refresh attempt failed while refreshing user data", e);
        }
      }

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
        console.log("User data refreshed successfully:", updatedUser);
        return true;
      } else {
        console.log("Failed to refresh user data from backend");
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
      console.log("User already exists in store:", existingUser);
      // Still refresh to get latest data from backend
      await this.refreshUserData();
      return;
    }

    console.log("Attempting to restore user from token...");
    await this.restoreUserFromToken();
  }

  clearUser(): void {
    useUserStore.getState().clearUser();
    // Clear cookies
    document.cookie = "_authToken=; path=/; max-age=0; secure; samesite=strict";
    sessionStorage.removeItem("authToken");
  }
}

const userService = new UserService();
export default userService;
