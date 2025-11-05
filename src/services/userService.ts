import apiClient from "@/configs/api/Axios";
import { useUserStore } from "@/store/userStore";
import tokenService from "@/configs/api/jwtToken";
import authService from "@/services/authService";
import { CookieUtils } from "@/utils/cookieUtils";

class UserService {
  async restoreUserFromToken(): Promise<boolean> {
    try {
      const response = await apiClient.get(`/secuser/me`);
      if (response.status === 200 && response.data.success) {
        const userData = response.data.data;
        const employeeData = userData.employee_master;
        const user: IUser = {
          roleId: userData.role_id,
          userId: userData.user_id,
          employeename: {
            firsteng: employeeData?.firstname_eng || "",
            lasteng: employeeData?.lastname_eng || "",
            firstarb: employeeData?.firstname_arb || "",
            lastarb: employeeData?.lastname_arb || "",
          },
          employeenumber: employeeData?.employee_id,
          scheduledgeocoordinates:
            employeeData?.scheduled_geo_coordinates || null,
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

      let response = await apiClient.get(`/auth/me`);

      if (response.status === 200 && response.data.success) {
        const userData = response.data.data;
        const employeeData = userData.employee_master;

        const updatedUser: IUser = {
          roleId: userData.role_id,
          userId: userData.user_id,
          employeename: {
            firsteng: employeeData?.firstname_eng || "",
            lasteng: employeeData?.lastname_eng || "",
            firstarb: employeeData?.firstname_arb || "",
            lastarb: employeeData?.lastname_arb || "",
          },
          employeenumber:
            employeeData?.employee_id || currentUser.employeenumber,
          scheduledgeocoordinates:
            employeeData?.scheduled_geo_coordinates || null,
          radius: employeeData?.radius || 0,
          email: employeeData?.email || "",
          isGeofence: employeeData?.geofence_flag || false,
          role: currentUser.role,
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
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");

        if (!token) {
          token = CookieUtils.getCookie("token");
          if (token) {
            localStorage.setItem("token", token);
          }
        }
      }

      if (!token) {
        return;
      }

      const response = await authService.getProfile();

      if (response.status === 200 && response.data.user) {
        const user = response.data.user;
        useUserStore.getState().setUser(user);
      } else {
      }
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        CookieUtils.removeAuthToken();
      }
    }
  }

  clearUser(): void {
    useUserStore.getState().clearUser();
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      CookieUtils.removeAuthToken();
    }
  }
}

const userService = new UserService();
export default userService;
