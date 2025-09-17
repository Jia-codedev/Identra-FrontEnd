import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SecondaryLink = {
  label: string;
  href: string;
};

type UserNavBarState = {
  activeMenuId: string | null;
  secondaryLinks: SecondaryLink[];
  setActiveMenu: (id: string | null, links?: SecondaryLink[]) => void;
};

export const useUserNavBar = create<UserNavBarState>()(
  persist(
    (set) => ({
      activeMenuId: null,
      secondaryLinks: [],
      setActiveMenu: (id, links = []) =>
        set(() => ({ activeMenuId: id, secondaryLinks: links })),
    }),
    {
      name: "user-navbar",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export type { SecondaryLink };
