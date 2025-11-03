"use client";
import { useModulePrivileges, usePrivileges } from "@/store/usePrivileges";

type SubModulePrivileges = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  tabs: any[];
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
