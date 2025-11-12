import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import privilegeService from "@/services/privilegeService";
type Privilege = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
};

type Tab = {
  tab_id: number;
  tab_name: string;
  allowed: boolean;
  privileges: Privilege;
};

type SubModule = {
  path: string;
  sub_module_name: string;
  allowed: boolean;
  privileges: Privilege;
  tabs: Tab[];
};

type Module = {
  allowed: boolean;
  is_sidebar: boolean | null;
  subModules: SubModule[];
};

type PrivilegesState = {
  modules: Record<string, Module>;
  isLoading: boolean;
  error: string | null;
  loadPrivileges: (roleId?: number) => Promise<void>;
  clearPrivileges: () => void;
};

export const usePrivileges = create<PrivilegesState>()(
  persist(
    (set, get) => ({
      modules: {},
      isLoading: false,
      error: null,

      loadPrivileges: async (roleId?: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await privilegeService.getPrivilegesByRole(roleId);

          if (response) {
            set({ modules: response, isLoading: false, error: null });
          } else {
            throw new Error("Failed to load privileges - No data returned");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load privileges";

          console.error("Error loading privileges:", errorMessage);
          set({ isLoading: false, error: errorMessage, modules: {} });
        }
      },

      clearPrivileges: () => set({ modules: {}, error: null }),
    }),
    {
      name: "user-privileges",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ modules: state.modules }),
    }
  )
);

export const useModulePrivileges = (moduleId: string) =>
  usePrivileges((state) => state.modules[moduleId]);
export const usePrivilegesLoading = () =>
  usePrivileges((state) => state.isLoading);
export const usePrivilegesError = () => usePrivileges((state) => state.error);

export type { Privilege, SubModule, Module, Tab };
