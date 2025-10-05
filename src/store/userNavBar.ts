import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import navigationService, { NavigationItem } from "@/services/navigationService";
import { useUserStore } from "./userStore";
type SecondaryLink = {
  label: string;
  href: string;
  labelKey?: string;
};

type UserNavBarState = {
  activeMenuId: string | null;
  secondaryLinks: SecondaryLink[];
  mainNavigation: NavigationItem[];
  sidebarNavigation: NavigationItem[];
  footerNavigation: NavigationItem[];
  isLoading: boolean;
  error: string | null;
  setActiveMenu: (id: string | null, links?: SecondaryLink[]) => void;
  loadUserNavigation: (roleId?: number) => Promise<void>;
  clearNavigation: () => void;
};

export const useUserNavBar = create<UserNavBarState>()(
  persist(
    (set, get) => ({
      activeMenuId: null,
      secondaryLinks: [],
      mainNavigation: [],
      sidebarNavigation: [],
      footerNavigation: [],
      isLoading: false,
      error: null,
      
      setActiveMenu: (id, links = []) =>
        set(() => ({ activeMenuId: id, secondaryLinks: links })),

      loadUserNavigation: async (roleId?: number) => {
        console.log('🚀 Starting loadUserNavigation...');
        set({ isLoading: true, error: null });
        
        try {
          const finalRoleId = roleId || useUserStore.getState().user?.roleId;
          console.log('📍 Final roleId:', finalRoleId);
          
          if (!finalRoleId) {
            throw new Error("No role ID available");
          }

          console.log('🔄 Calling navigationService.getNavigationByRole...');
          const response = await navigationService.getNavigationByRole(finalRoleId);
          
          if (response && response.success !== false) {
            let navigationData = response.data || response;
            
            const { mainNav, sidebarNav, footerNav } = navigationService.transformNavigationData(navigationData);
            console.log('📋 Main Navigation Items:', mainNav);
            
            set({
              mainNavigation: mainNav,
              sidebarNavigation: sidebarNav,
              footerNavigation: footerNav,
              isLoading: false,
              error: null
            });
          } else {
            console.error('❌ API response indicates failure:', response);
            throw new Error(response?.message || "Failed to load navigation - API returned unsuccessful response");
          }
        } catch (error) {
          console.error("❌ Error loading user navigation:", error);
          const errorMessage = error instanceof Error ? error.message : "Failed to load navigation";
          console.error("❌ Error message:", errorMessage);
          
          set({
            isLoading: false,
            error: errorMessage,
            mainNavigation: [],
            sidebarNavigation: [],
            footerNavigation: []
          });
        }
      },

      clearNavigation: () => set({
        activeMenuId: null,
        secondaryLinks: [],
        mainNavigation: [],
        sidebarNavigation: [],
        footerNavigation: [],
        error: null
      })
    }),
    {
      name: "user-navbar",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeMenuId: state.activeMenuId,
        secondaryLinks: state.secondaryLinks,
        mainNavigation: state.mainNavigation,
        sidebarNavigation: state.sidebarNavigation,
        footerNavigation: state.footerNavigation
      })
    }
  )
);

// Selector hooks for easier access
export const useMainNavigation = () => useUserNavBar((state) => state.mainNavigation);
export const useSidebarNavigation = () => useUserNavBar((state) => state.sidebarNavigation);
export const useFooterNavigation = () => useUserNavBar((state) => state.footerNavigation);
export const useNavigationLoading = () => useUserNavBar((state) => state.isLoading);
export const useNavigationError = () => useUserNavBar((state) => state.error);

export type { SecondaryLink, NavigationItem };
