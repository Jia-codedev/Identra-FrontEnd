"use client";
import { useModulePrivileges, type Tab } from "@/store/usePrivileges";

type SubModulePrivileges = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  tabs: Tab[];
};

type TabPrivileges = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isAllowed: boolean;
};

export const useSubModulePrivileges = (
  moduleId: string,
  subModulePath: string
): SubModulePrivileges => {
  const modulePrivileges = useModulePrivileges(moduleId);

  console.log("Module Privileges:", modulePrivileges);

  if (!modulePrivileges) {
    console.warn(`No privileges found for module: ${moduleId}`);
    return {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      tabs: [],
    };
  }

  const subModule = modulePrivileges.subModules.find(
    (sub) => sub.path === subModulePath
  );

  console.log("SubModule Data:", subModule);

  if (!subModule || !subModule.privileges.view) {
    console.warn(
      `Access Denied: No view privileges for submodule: ${subModulePath}`
    );
    return {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      tabs: [],
    };
  }

  return {
    canView: true, // Validate only with the view flag
    canCreate: subModule.privileges.create,
    canEdit: subModule.privileges.edit,
    canDelete: subModule.privileges.delete,
    tabs: subModule.tabs,
  };
};

export const useSubModuleTabsPrivileges = (
  moduleId: string,
  subModulePath: string
) => {
  const { tabs } = useSubModulePrivileges(moduleId, subModulePath);
  return tabs;
};

/**
 * Get privileges for a specific tab by tab name
 * @param moduleId - The module identifier (e.g., "workforce")
 * @param subModulePath - The submodule path (e.g., "approvals")
 * @param tabName - The tab name (e.g., "leave-approval")
 * @returns TabPrivileges object with access control flags
 */
export const useTabPrivileges = (
  moduleId: string,
  subModulePath: string,
  tabName: string
): TabPrivileges => {
  const { tabs } = useSubModulePrivileges(moduleId, subModulePath);

  const tab = tabs.find((t) => t.tab_name === tabName);

  if (!tab || !tab.allowed) {
    console.warn(`Tab access denied or not found: ${tabName}`);
    return {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      isAllowed: false,
    };
  }

  return {
    canView: tab.privileges.view,
    canCreate: tab.privileges.create,
    canEdit: tab.privileges.edit,
    canDelete: tab.privileges.delete,
    isAllowed: tab.allowed,
  };
};

export const useTabPrivilegesById = (
  moduleId: string,
  subModulePath: string,
  tabId: number
): TabPrivileges => {
  const { tabs } = useSubModulePrivileges(moduleId, subModulePath);

  const tab = tabs.find((t) => t.tab_id === tabId);

  if (!tab || !tab.allowed) {
    console.warn(`Tab access denied or not found with ID: ${tabId}`);
    return {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      isAllowed: false,
    };
  }

  return {
    canView: tab.privileges.view,
    canCreate: tab.privileges.create,
    canEdit: tab.privileges.edit,
    canDelete: tab.privileges.delete,
    isAllowed: tab.allowed,
  };
};
