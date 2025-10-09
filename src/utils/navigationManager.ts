import { useUserStore } from "@/store/userStore";
import { useUserNavBar } from "@/store/userNavBar";

/**
 * Utility functions for managing navigation based on user role changes
 */
export class NavigationManager {
  /**
   * Refresh navigation for current user's role
   */
  static async refreshNavigationForCurrentUser() {
    const user = useUserStore.getState().user;
    if (user?.roleId) {
      await useUserNavBar.getState().loadUserNavigation(user.roleId);
    }
  }

  /**
   * Refresh navigation for specific role
   */
  static async refreshNavigationForRole(roleId: number) {
    await useUserNavBar.getState().loadUserNavigation(roleId);
  }

  /**
   * Clear navigation data
   */
  static clearNavigation() {
    useUserNavBar.getState().clearNavigation();
  }

  /**
   * Check if navigation needs refresh (e.g., when user role changes)
   */
  static shouldRefreshNavigation(previousUser: any, currentUser: any): boolean {
    return previousUser?.roleId !== currentUser?.roleId;
  }
}

/**
 * Hook to manually trigger navigation refresh
 */
export const useNavigationManager = () => {
  const loadUserNavigation = useUserNavBar((state) => state.loadUserNavigation);
  const clearNavigation = useUserNavBar((state) => state.clearNavigation);
  const user = useUserStore((state) => state.user);

  const refreshNavigation = async (roleId?: number) => {
    const finalRoleId = roleId || user?.roleId;
    if (finalRoleId) {
      await loadUserNavigation(finalRoleId);
    }
  };

  const clearUserNavigation = () => {
    clearNavigation();
  };

  return {
    refreshNavigation,
    clearUserNavigation,
    currentRoleId: user?.roleId,
    hasRole: !!user?.roleId
  };
};