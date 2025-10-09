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
      console.log('🔄 Refreshing navigation for roleId:', user.roleId);
      await loadUserNavigation(user.roleId);
      console.log('✅ Navigation refresh completed');
      return true;
    } catch (error) {
      console.error('❌ Navigation refresh failed:', error);
      return false;
    }
  }, [user?.roleId, loadUserNavigation]);

  /**
   * Refresh both user data and navigation
   */
  const refreshUserAndNavigation = useCallback(async () => {
    try {
      console.log('🔄 Refreshing user and navigation...');
      
      // First refresh user data
      const userRefreshSuccess = await refreshUser();
      if (!userRefreshSuccess) {
        console.error('❌ User refresh failed, skipping navigation refresh');
        return false;
      }

      // Get the updated user data
      const updatedUser = useUserStore.getState().user;
      if (!updatedUser?.roleId) {
        console.error('❌ No roleId found after user refresh');
        return false;
      }

      // Then refresh navigation with updated roleId
      await loadUserNavigation(updatedUser.roleId);
      console.log('✅ User and navigation refresh completed');
      return true;
    } catch (error) {
      console.error('❌ Combined refresh failed:', error);
      return false;
    }
  }, [refreshUser, loadUserNavigation]);

  /**
   * Force refresh navigation (clears and reloads)
   */
  const forceRefreshNavigation = useCallback(async () => {
    if (!user?.roleId) {
      console.warn('⚠️ Cannot force refresh navigation: No user or roleId');
      return false;
    }

    try {
      console.log('🔄 Force refreshing navigation...');
      
      // Clear current navigation
      clearNavigation();
      
      // Small delay to ensure store is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reload navigation
      await loadUserNavigation(user.roleId);
      console.log('✅ Force navigation refresh completed');
      return true;
    } catch (error) {
      console.error('❌ Force navigation refresh failed:', error);
      return false;
    }
  }, [user?.roleId, clearNavigation, loadUserNavigation]);

  /**
   * Refresh navigation for specific roleId
   */
  const refreshNavigationForRole = useCallback(async (roleId: number) => {
    try {
      console.log('🔄 Refreshing navigation for specific roleId:', roleId);
      await loadUserNavigation(roleId);
      console.log('✅ Role-specific navigation refresh completed');
      return true;
    } catch (error) {
      console.error('❌ Role-specific navigation refresh failed:', error);
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