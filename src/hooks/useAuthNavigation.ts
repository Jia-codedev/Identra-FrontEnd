import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useUserNavBar } from "@/store/userNavBar";

export const useAuthNavigationSync = () => {
  const user = useUserStore((state) => state.user);
  const isRefreshing = useUserStore((state) => state.isRefreshing);
  const {
    loadUserNavigation,
    clearNavigation,
    isLoading: isNavigationLoading,
    error: navigationError,
  } = useUserNavBar();

  useEffect(() => {
    console.log('🔄 Auth navigation sync effect triggered:', {
      hasUser: !!user,
      userRoleId: user?.roleId,
      isRefreshing,
      isNavigationLoading
    });

    if (user && !isRefreshing && user.roleId) {
      console.log('✅ Loading navigation for authenticated user:', user.roleId);
      loadUserNavigation(user.roleId);
    }

    if (!user) {
      console.log('❌ No user found, clearing navigation');
      clearNavigation();
    }
  }, [user, isRefreshing, loadUserNavigation, clearNavigation]);

  // Force navigation reload if there's a navigation error but user exists
  useEffect(() => {
    if (user && user.roleId && navigationError && !isRefreshing && !isNavigationLoading) {
      console.log('🔄 Retrying navigation load due to error:', navigationError);
      loadUserNavigation(user.roleId);
    }
  }, [user, navigationError, isRefreshing, isNavigationLoading, loadUserNavigation]);

  return {
    isLoading: isRefreshing || isNavigationLoading,
    hasUser: !!user,
    hasNavigation: !!user && !isNavigationLoading && !navigationError,
    navigationError,
  };
};

export const useRefreshUserSession = () => {
  const refreshUser = useUserStore((state) => state.refreshUser);
  const loadUserNavigation = useUserNavBar((state) => state.loadUserNavigation);
  const user = useUserStore((state) => state.user);

  const refreshSession = async () => {
    const userRefreshed = await refreshUser();

    if (userRefreshed && user?.roleId) {
      await loadUserNavigation(user.roleId);
    }

    return userRefreshed;
  };

  return refreshSession;
};
