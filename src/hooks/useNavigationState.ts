"use client";

import { useTranslations } from "./use-translations";
import { useUserNavBar } from "@/store/userNavBar";

/**
 * Primary navigation hook that uses navigation state from userNavBar store
 * This should be used by all navigation components
 */
export const useNavigationState = () => {
  const { t } = useTranslations();
  const {
    mainNavigation,
    sidebarNavigation,
    footerNavigation,
    isLoading,
    error,
    activeMenuId,
    secondaryLinks,
    setActiveMenu,
    loadUserNavigation,
    clearNavigation
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
      href: "/updated-password" 
    },
    { 
      label: t("common.logout"), 
      href: "/logout", 
      className: "text-red-600" 
    },
  ];
  // Debug function for permissions
  const debugNavigationPermissions = () => {
    console.log('🔍 Navigation Debug Info:');
    console.log('📊 Navigation counts:', {
      main: mainNavigation.length,
      sidebar: sidebarNavigation.length,
      footer: footerNavigation.length
    });
    console.log('📋 Navigation items:', {
      mainNavigation,
      sidebarNavigation,
      footerNavigation
    });
    console.log('⚠️ Error state:', error);
    console.log('🔄 Loading state:', isLoading);
    
    if (mainNavigation.length === 0 && sidebarNavigation.length === 0 && footerNavigation.length === 0 && !error) {
      console.warn('⚠️ No navigation items found! This could indicate:');
      console.warn('   1. User role has no assigned privileges in the database');
      console.warn('   2. API is returning all modules with "allowed": false');
      console.warn('   3. Navigation hasn\'t been loaded yet - try calling loadUserNavigation()');
    }
  };

  return {
    // Navigation data from state
    NAV_LINKS: mainNavigation,
    SIDEBAR_LINKS: sidebarNavigation,
    FOOTER_LINKS: footerNavigation,
    PROFILE_LINKS,
    
    // Active menu state
    activeMenuId,
    secondaryLinks,
    setActiveMenu,
    
    // Loading and error states
    isLoading,
    error,
    
    // Navigation management functions
    loadUserNavigation,
    clearNavigation,
    debugNavigationPermissions,
    
    // Status flags
    hasNavigation: mainNavigation.length > 0 || sidebarNavigation.length > 0 || footerNavigation.length > 0,
    hasMainNav: mainNavigation.length > 0,
    hasSidebarNav: sidebarNavigation.length > 0,
    hasFooterNav: footerNavigation.length > 0,
  };
};

export default useNavigationState;