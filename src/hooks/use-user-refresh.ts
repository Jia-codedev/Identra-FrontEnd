import { useEffect, useCallback, useRef } from "react";
import { useUserStore, useIsRefreshing, useRefreshUser, useIsLoggedIn } from "@/store/userStore";

export const useUserRefresh = () => {
  const refreshUser = useRefreshUser();
  const isRefreshing = useIsRefreshing();
  const isLoggedIn = useIsLoggedIn();

  const refreshUserData = useCallback(async () => {
    if (isRefreshing) return false;
    
    try {
      const success = await refreshUser();
      if (success) {
        console.log("User data refreshed successfully");
      } else {
        console.log("Failed to refresh user data");
      }
      return success;
    } catch (error) {
      console.error("Error during user refresh:", error);
      return false;
    }
  }, [refreshUser, isRefreshing]);

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

  const manualRefresh = useCallback(async () => {
    if (isRefreshing) return false;
    
    try {
      const success = await refreshUser();
      return success;
    } catch (error) {
      console.error("Manual refresh error:", error);
      return false;
    }
  }, [refreshUser, isRefreshing]);

  return {
    manualRefresh,
    isRefreshing,
  };
};

export const useUserRefreshOnFocus = (enabled: boolean = true) => {
  const refreshUser = useRefreshUser();
  const isLoggedIn = useIsLoggedIn();
  const isRefreshing = useIsRefreshing();
  const lastRefreshTime = useRef<number>(0);

  const refreshOnFocus = useCallback(async () => {
    if (!enabled || !isLoggedIn || isRefreshing) return;
    
    const now = Date.now();
    if (now - lastRefreshTime.current < 30000) return;
    
    lastRefreshTime.current = now;
    
    try {
      await refreshUser();
      console.log("User data refreshed on window focus");
    } catch (error) {
      console.error("Error refreshing user data on focus:", error);
    }
  }, [enabled, isLoggedIn, isRefreshing, refreshUser]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('focus', refreshOnFocus);
    
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [refreshOnFocus, enabled]);

  return {
    refreshOnFocus,
    isRefreshing,
  };
};
