import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import userService from "@/services/userService";

interface UserState {
  user: IUser | null;
  isRefreshing: boolean;
  setUser: (user: IUser) => void;
  clearUser: () => void;
  refreshUser: () => Promise<boolean>;
  getUserRole: () => string | null;
  getUserId: () => number | null;
  isLoggedIn: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isRefreshing: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      refreshUser: async () => {
        set({ isRefreshing: true });
        try {
          const success = await userService.refreshUserData();
          return success;
        } catch (error) {
          console.error("Error refreshing user data:", error);
          return false;
        } finally {
          set({ isRefreshing: false });
        }
      },
      getUserRole: () => get().user?.role || null,
      getUserId: () => get().user?.employeenumber || null,
      isLoggedIn: () => get().user !== null,
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage), 
      partialize: (state) => ({ user: state.user }), 
    }
  )
);

export const useUserRole = () => useUserStore((state) => state.user?.role || null);
export const useUserId = () => useUserStore((state) => state.user?.employeenumber || null);
export const useIsLoggedIn = () => useUserStore((state) => state.user !== null);
export const useIsRefreshing = () => useUserStore((state) => state.isRefreshing);
export const useRefreshUser = () => useUserStore((state) => state.refreshUser);
export const useUserName = () => useUserStore((state) => {
  const user = state.user;
  if (!user?.employeename) return null;
  return {
    english: `${user.employeename.firsteng} ${user.employeename.lasteng}`,
    arabic: `${user.employeename.firstarb} ${user.employeename.lastarb}`
  };
});
