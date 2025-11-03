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

  const lastLoadedRoleId = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (user && !isRefreshing && user.roleId) {
      if (!isLoadingRef.current && lastLoadedRoleId.current !== user.roleId) {
        isLoadingRef.current = true;
        lastLoadedRoleId.current = user.roleId;

        loadUserNavigation(user.roleId).finally(() => {
          isLoadingRef.current = false;
        });
      } else {
      }
    }

    if (!user) {
      lastLoadedRoleId.current = null;
      clearNavigation();
    }
  }, [user?.roleId, isRefreshing]);
  useEffect(() => {
    if (
      user &&
      user.roleId &&
      navigationError &&
      !isRefreshing &&
      !isNavigationLoading &&
      !isLoadingRef.current
    ) {
      isLoadingRef.current = true;

      loadUserNavigation(user.roleId).finally(() => {
        isLoadingRef.current = false;
      });
    }
  }, [user?.roleId, navigationError, isRefreshing, isNavigationLoading]);

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
