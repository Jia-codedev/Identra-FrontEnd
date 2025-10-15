import { useEffect, useCallback, useRef } from "react";
import {
  useUserStore,
  useIsRefreshing,
  useRefreshUser,
  useIsLoggedIn,
} from "@/store/userStore";
import { useUserNavBar } from "@/store/userNavBar";

export const useUserRefresh = () => {
  const refreshUser = useRefreshUser();
  const isRefreshing = useIsRefreshing();
  const isLoggedIn = useIsLoggedIn();
  const { loadUserNavigation } = useUserNavBar();

  const refreshUserData = useCallback(async () => {
    if (isRefreshing) return false;

    try {
      const success = await refreshUser();
      if (success) {
        const updatedUser = useUserStore.getState().user;
        if (updatedUser?.roleId) {
          await loadUserNavigation(updatedUser.roleId);
        }
      } else {
      }
      return success;
    } catch (error) {
      return false;
    }
  }, [refreshUser, isRefreshing]); // Remove loadUserNavigation from dependencies

  useEffect(() => {
    if (isLoggedIn) {
      refreshUserData();
    }
  }, []);

  return {
    refreshUserData,
    isRefreshing,
  };
};

export const useManualUserRefresh = () => {
  const refreshUser = useRefreshUser();
  const isRefreshing = useIsRefreshing();
  const { loadUserNavigation } = useUserNavBar();

  const manualRefresh = useCallback(async () => {
    if (isRefreshing) return false;

    try {
      const success = await refreshUser();

      if (success) {
        const updatedUser = useUserStore.getState().user;
        if (updatedUser?.roleId) {
          await loadUserNavigation(updatedUser.roleId);
        }
      }

      return success;
    } catch (error) {
      console.error("❌ Manual refresh error:", error);
      return false;
    }
  }, [refreshUser, isRefreshing]); // Remove loadUserNavigation from dependencies

  return {
    manualRefresh,
    isRefreshing,
  };
};

export const useUserRefreshOnFocus = (enabled: boolean = true) => {
  const refreshUser = useRefreshUser();
  const isLoggedIn = useIsLoggedIn();
  const isRefreshing = useIsRefreshing();
  const { loadUserNavigation } = useUserNavBar();
  const lastRefreshTime = useRef<number>(0);

  const refreshOnFocus = useCallback(async () => {
    if (!enabled || !isLoggedIn || isRefreshing) return;

    const now = Date.now();
    if (now - lastRefreshTime.current < 30000) return;

    lastRefreshTime.current = now;

    try {
      const success = await refreshUser();

      if (success) {
        const updatedUser = useUserStore.getState().user;
        if (updatedUser?.roleId) {
          await loadUserNavigation(updatedUser.roleId);
        }
      }
    } catch (error) {
      console.error("❌ Error refreshing user data on focus:", error);
    }
  }, [enabled, isLoggedIn, isRefreshing, refreshUser]); // Remove loadUserNavigation from dependencies

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("focus", refreshOnFocus);

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [refreshOnFocus, enabled]);

  return {
    refreshOnFocus,
    isRefreshing,
  };
};
