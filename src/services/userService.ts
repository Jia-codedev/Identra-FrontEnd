import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";
import tokenService from "@/configs/api/jwtToken";

class UserService {
  async restoreUserFromToken(): Promise<boolean> {
    try {
      const token = 
        document.cookie
          .split('; ')
          .find(row => row.startsWith('_authToken='))
          ?.split('=')[1] ||
        sessionStorage.getItem('authToken');

      if (!token) {
        console.log("No token found, cannot restore user");
        return false;
      }

      const { id: userId, role } = await tokenService.verifyToken(token);
      console.log("Token verified, user ID:", userId, "role:", role);

      const response = await apiClient.get(`/secuser/get-by-emp-id/${userId}`);
      
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
          employeenumber: employeeData?.employee_id || userId,
          scheduledgeocoordinates: employeeData?.scheduled_geo_coordinates || null,
          radius: employeeData?.radius || 0,
          email: employeeData?.email || "",
          isGeofence: employeeData?.geofence_flag || false,
          role: role,
        };

        useUserStore.getState().setUser(user);
        console.log("User data restored successfully:", user);
        return true;
      } else {
        console.log("Failed to fetch user data from backend");
        return false;
      }
    } catch (error) {
      console.error("Error restoring user from token:", error);
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
      const response = await apiClient.get(`/secuser/get-by-emp-id/${currentUser.employeenumber}`);
      
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
