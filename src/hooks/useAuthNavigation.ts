import { useEffect, useRef } from "react";
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

  // Track the last loaded roleId to prevent unnecessary reloads
  const lastLoadedRoleId = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    console.log('🔄 Auth navigation sync effect triggered:', {
      hasUser: !!user,
      userRoleId: user?.roleId,
      isRefreshing,
      isNavigationLoading,
      lastLoadedRoleId: lastLoadedRoleId.current,
      isLoadingRef: isLoadingRef.current
    });

    if (user && !isRefreshing && user.roleId) {
      // Prevent loading if already loading or if roleId hasn't changed
      if (!isLoadingRef.current && lastLoadedRoleId.current !== user.roleId) {
        console.log('✅ Loading navigation for authenticated user:', user.roleId);
        isLoadingRef.current = true;
        lastLoadedRoleId.current = user.roleId;
        
        loadUserNavigation(user.roleId).finally(() => {
          isLoadingRef.current = false;
        });
      } else {
        console.log('🚫 Skipping navigation load - already loading or same roleId');
      }
    }

    if (!user) {
      console.log('❌ No user found, clearing navigation');
      lastLoadedRoleId.current = null;
      clearNavigation();
    }
  }, [user?.roleId, isRefreshing]); // Remove function dependencies

  // Force navigation reload if there's a navigation error but user exists
  useEffect(() => {
    if (user && user.roleId && navigationError && !isRefreshing && !isNavigationLoading && !isLoadingRef.current) {
      console.log('🔄 Retrying navigation load due to error:', navigationError);
      isLoadingRef.current = true;
      
      loadUserNavigation(user.roleId).finally(() => {
        isLoadingRef.current = false;
      });
    }
  }, [user?.roleId, navigationError, isRefreshing, isNavigationLoading]); // Remove function dependencies

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
