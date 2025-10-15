import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import navigationService, {
  NavigationItem,
} from "@/services/navigationService";
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
        set({ isLoading: true, error: null });

        try {
          const finalRoleId = roleId || useUserStore.getState().user?.roleId;
          if (!finalRoleId) {
            throw new Error("No role ID available");
          }

          const response = await navigationService.getNavigationByRole(
            finalRoleId
          );

          if (response && response.success !== false) {
            let navigationData = response.data || response;

            const { mainNav, sidebarNav, footerNav } =
              navigationService.transformNavigationData(navigationData);

            set({
              mainNavigation: mainNav,
              sidebarNavigation: sidebarNav,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(
              response?.message ||
                "Failed to load navigation - API returned unsuccessful response"
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load navigation";

          set({
            isLoading: false,
            error: errorMessage,
            mainNavigation: [],
            sidebarNavigation: [],
          });
        }
      },

      clearNavigation: () =>
        set({
          activeMenuId: null,
          secondaryLinks: [],
          mainNavigation: [],
          sidebarNavigation: [],
          error: null,
        }),
    }),
    {
      name: "user-navbar",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeMenuId: state.activeMenuId,
        secondaryLinks: state.secondaryLinks,
        mainNavigation: state.mainNavigation,
        sidebarNavigation: state.sidebarNavigation,
      }),
    }
  )
);

export const useMainNavigation = () =>
  useUserNavBar((state) => state.mainNavigation);
export const useSidebarNavigation = () =>
  useUserNavBar((state) => state.sidebarNavigation);
export const useNavigationLoading = () =>
  useUserNavBar((state) => state.isLoading);
export const useNavigationError = () => useUserNavBar((state) => state.error);

export type { SecondaryLink, NavigationItem };

