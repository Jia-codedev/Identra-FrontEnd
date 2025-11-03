"use client";

import { useTranslations } from "./use-translations";
import { useUserNavBar } from "@/store/userNavBar";

export const useNavigationState = () => {
  const { t } = useTranslations();
  const {
    mainNavigation,
    sidebarNavigation,
    isLoading,
    error,
    activeMenuId,
    secondaryLinks,
    setActiveMenu,
    loadUserNavigation,
    clearNavigation,
  } = useUserNavBar();

  const PROFILE_LINKS = [
    {
      label: t("mainMenu.profileIcon.items.myAccount"),
      href: "/profile/my-account",
    },
    {
      label: t("mainMenu.profileIcon.items.themeLayout"),
      href: "/theme-layout",
    },
    {
      label: t("settings.updatePassword"),
      href: "/updated-password",
    },
    {
      label: t("common.logout"),
      href: "/logout",
      className: "text-red-600",
    },
  ];
  const debugNavigationPermissions = () => {
    if (
      mainNavigation.length === 0 &&
      sidebarNavigation.length === 0 &&
      !error
    ) {
      console.warn("⚠️ No navigation items found! This could indicate:");
      console.warn(
        "   1. User role has no assigned privileges in the database"
      );
      console.warn('   2. API is returning all modules with "allowed": false');
      console.warn(
        "   3. Navigation hasn't been loaded yet - try calling loadUserNavigation()"
      );
    }
  };

  return {
    NAV_LINKS: mainNavigation,
    SIDEBAR_LINKS: sidebarNavigation,
    PROFILE_LINKS,
    activeMenuId,
    secondaryLinks,
    setActiveMenu,
    isLoading,
    error,
    loadUserNavigation,
    clearNavigation,
    debugNavigationPermissions,
    hasNavigation: mainNavigation.length > 0 || sidebarNavigation.length > 0,
    hasMainNav: mainNavigation.length > 0,
    hasSidebarNav: sidebarNavigation.length > 0,
  };
};

export default useNavigationState;
