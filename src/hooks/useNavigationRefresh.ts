import { useCallback } from "react";
import { useUserStore } from "@/store/userStore";
import { useUserNavBar } from "@/store/userNavBar";

/**
 * Hook for refreshing navigation data
 * Provides methods to refresh navigation independently or with user data
 */
export const useNavigationRefresh = () => {
  const user = useUserStore((state) => state.user);
  const refreshUser = useUserStore((state) => state.refreshUser);
  const { loadUserNavigation, clearNavigation, isLoading, error } = useUserNavBar();

  /**
   * Refresh only navigation data for current user
   */
  const refreshNavigation = useCallback(async () => {
    if (!user?.roleId) {
      console.warn('⚠️ Cannot refresh navigation: No user or roleId');
      return false;
    }

    try {
      await loadUserNavigation(user.roleId);
      return true;
    } catch (error) {
      return false;
    }
  }, [user?.roleId, loadUserNavigation]);

  const refreshUserAndNavigation = useCallback(async () => {
    try {
      const userRefreshSuccess = await refreshUser();
      if (!userRefreshSuccess) {
        console.error('❌ User refresh failed, skipping navigation refresh');
        return false;
      }

      const updatedUser = useUserStore.getState().user;
      if (!updatedUser?.roleId) {
        console.error('❌ No roleId found after user refresh');
        return false;
      }

      await loadUserNavigation(updatedUser.roleId);
      return true;
    } catch (error) {
      return false;
    }
  }, [refreshUser, loadUserNavigation]);

  /**
   * Force refresh navigation (clears and reloads)
   */
  const forceRefreshNavigation = useCallback(async () => {
    if (!user?.roleId) {
      return false;
    }

    try {
      clearNavigation();
      await new Promise(resolve => setTimeout(resolve, 100));
      await loadUserNavigation(user.roleId);
      return true;
    } catch (error) {
      return false;
    }
  }, [user?.roleId, clearNavigation, loadUserNavigation]);

  const refreshNavigationForRole = useCallback(async (roleId: number) => {
    try {
      await loadUserNavigation(roleId);
      return true;
    } catch (error) {
      return false;
    }
  }, [loadUserNavigation]);

  return {
    // Navigation refresh methods
    refreshNavigation,
    refreshUserAndNavigation,
    forceRefreshNavigation,
    refreshNavigationForRole,
    
    // Clear navigation
    clearNavigation,
    
    // State
    isLoading,
    error,
    hasUser: !!user,
    userRoleId: user?.roleId,
  };
};

export default useNavigationRefresh;