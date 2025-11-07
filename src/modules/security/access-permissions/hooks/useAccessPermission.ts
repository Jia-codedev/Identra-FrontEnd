import { useState, useEffect, useCallback } from "react";
import rolesApi from "@/services/security/rolesService";
import securityPermissionsApi from "@/services/security/securityPermissions";
import securitySubModulesApi from "@/services/security/securitySubModules";
import apiClient from "@/configs/api/Axios";
import { toast } from "sonner";

export function useAccessPermission() {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [subModulesByModule, setSubModulesByModule] = useState<
    Record<string, any[]>
  >({});
  const [rolePrivileges, setRolePrivileges] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [tabsBySubModule, setTabsBySubModule] = useState<Record<number, any[]>>(
    {}
  );

  // Optimized: Get tabs directly from state (already loaded from /secRolePrivilege API)
  const getTabs = useCallback(
    async (subModuleId: number) => {
      return tabsBySubModule[subModuleId] || [];
    },
    [tabsBySubModule]
  );

  // Initial load: roles, modules, submodules
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const [rolesRes, modulesRes] = await Promise.all([
          rolesApi.getRoles({ limit: 1000 }),
          securityPermissionsApi.getModules({ limit: 1000 }),
        ]);
        const loadedRoles = rolesRes.data.data || [];
        setRoles(loadedRoles);
        setModules(modulesRes.data.data || []);
        // Submodules
        try {
          const smResp = await securitySubModulesApi.getSubModules({
            limit: 1000,
            offset: 1,
          });
          const allSub = smResp.data?.data || [];
          const subModulesMap: Record<string, any[]> = {};
          allSub.forEach((s: any) => {
            const mid = s.module_id;
            if (!subModulesMap[mid]) subModulesMap[mid] = [];
            subModulesMap[mid].push(s);
          });
          setSubModulesByModule(subModulesMap);
        } catch {
          setSubModulesByModule({});
        }
      } catch (error) {
        toast.error("Failed to load roles or modules");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Select first role after roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].role_id);
    }
  }, [roles]);

  // Load privileges for selected role
  useEffect(() => {
    if (
      !selectedRole ||
      modules.length === 0 ||
      Object.keys(subModulesByModule).length === 0
    ) {
      setRolePrivileges({});
      return;
    }
    let mounted = true;
    async function loadRolePrivilegesTree() {
      try {
        setIsLoading(true);
        const resp = await apiClient.get(`/secRolePrivilege`, {
          params: { roleId: selectedRole },
        });
        const tree = resp.data?.data || {};
        const map: Record<string, any> = {};
        const tabsMap: Record<number, any[]> = {};

        console.log("🔍 Raw API Response Tree:", tree);

        Object.keys(tree).forEach((moduleName) => {
          const moduleTreeEntry = tree[moduleName];
          if (!moduleTreeEntry || !Array.isArray(moduleTreeEntry.subModules))
            return;
          const moduleObj = modules.find(
            (m: any) => m.module_name === moduleName
          );
          const moduleId = moduleObj?.module_id;
          moduleTreeEntry.subModules.forEach((sub: any) => {
            let resolvedSubModuleId: number | undefined = undefined;
            if (moduleId && subModulesByModule[moduleId]) {
              const found = (subModulesByModule[moduleId] || []).find(
                (s: any) =>
                  String(s.sub_module_name).trim().toLowerCase() ===
                  String(sub.sub_module_name).trim().toLowerCase()
              );
              if (found) resolvedSubModuleId = found.sub_module_id;
            }
            if (!resolvedSubModuleId && sub.sub_module_id) {
              resolvedSubModuleId = sub.sub_module_id;
            }
            if (!resolvedSubModuleId) {
              for (const modKey of Object.keys(subModulesByModule)) {
                const arr = subModulesByModule[modKey] || [];
                const found = arr.find(
                  (s: any) =>
                    String(s.sub_module_name).trim().toLowerCase() ===
                    String(sub.sub_module_name).trim().toLowerCase()
                );
                if (found) {
                  resolvedSubModuleId = found.sub_module_id;
                  break;
                }
              }
            }

            // Store tabs for this submodule
            if (Array.isArray(sub.tabs) && resolvedSubModuleId) {
              tabsMap[resolvedSubModuleId] = sub.tabs;
              console.log(
                `📋 Tabs for submodule ${resolvedSubModuleId} (${sub.sub_module_name}):`,
                sub.tabs
              );
            }

            if (sub.privileges) {
              Object.keys(sub.privileges).forEach((perm) => {
                if (sub.privileges[perm]) {
                  if (resolvedSubModuleId) {
                    const key =
                      `sub_${resolvedSubModuleId}_${perm}` +
                      (selectedRole ? `_role_${selectedRole}` : "");
                    map[key] = {
                      sub_module_id: resolvedSubModuleId,
                      permission: perm,
                    };
                  } else {
                    const nameKey =
                      `sub_${sub.sub_module_name}_${perm}` +
                      (selectedRole ? `_role_${selectedRole}` : "");
                    map[nameKey] = {
                      sub_module_name: sub.sub_module_name,
                      permission: perm,
                    };
                  }
                }
              });
            }
            if (Array.isArray(sub.tabs)) {
              sub.tabs.forEach((tab: any) => {
                if (tab.privileges) {
                  Object.keys(tab.privileges).forEach((perm) => {
                    if (tab.privileges[perm]) {
                      const subIdPart =
                        resolvedSubModuleId || sub.sub_module_name;
                      const key =
                        `tab_${tab.tab_id}_sub_${subIdPart}_${perm}` +
                        (selectedRole ? `_role_${selectedRole}` : "");
                      map[key] = {
                        tab_id: tab.tab_id,
                        permission: perm,
                        sub_module_id: resolvedSubModuleId,
                      };
                    }
                  });
                }
              });
            }
          });
        });

        if (mounted) {
          setRolePrivileges(map);
          setTabsBySubModule(tabsMap);
          console.log("✅ Tabs loaded and stored:", tabsMap);
          console.log(
            "✅ Total tabs count:",
            Object.keys(tabsMap).reduce(
              (sum, key) => sum + tabsMap[Number(key)].length,
              0
            )
          );
        }
      } catch {
        toast.error("Failed to load role privileges");
      } finally {
        setIsLoading(false);
      }
    }
    loadRolePrivilegesTree();
    return () => {
      mounted = false;
    };
  }, [selectedRole, modules, subModulesByModule]);

  // Toggle submodule permission
  const toggleSubModulePermission = useCallback(
    (subModuleId: number, perm: string) => {
      const rolePart = selectedRole ? `_role_${selectedRole}` : "";
      const key = `sub_${subModuleId}_${perm}${rolePart}`;
      setRolePrivileges((prev) => {
        const newMap = { ...prev };
        if (newMap[key]) delete newMap[key];
        else newMap[key] = { sub_module_id: subModuleId, permission: perm };
        return newMap;
      });
    },
    [selectedRole]
  );

  // Toggle tab permission
  const toggleTabPermission = useCallback(
    (tabId: number, subModuleId: number, perm: string) => {
      const rolePart = selectedRole ? `_role_${selectedRole}` : "";
      const key = `tab_${tabId}_sub_${subModuleId}_${perm}${rolePart}`;
      setRolePrivileges((prev) => {
        const newMap = { ...prev };
        if (newMap[key]) delete newMap[key];
        else
          newMap[key] = {
            tab_id: tabId,
            sub_module_id: subModuleId,
            permission: perm,
          };
        return newMap;
      });
    },
    [selectedRole]
  );

  // Save role privileges
  const handleSaveRolePrivileges = useCallback(async () => {
    if (!selectedRole) return toast.error("Please select a role first");
    async function fetchExistingRoleAssignments() {
      const [rolePrivsResp, roleTabPrivsResp] = await Promise.all([
        securityPermissionsApi.getRolePrivileges({
          limit: 1000,
          role_id: selectedRole!,
        }),
        apiClient.get(`/secRoleTabPrivilege/all`, {
          params: { roleId: selectedRole, limit: 1000 },
        }),
      ]);
      const existingRolePrivs = rolePrivsResp.data?.data || [];
      const existingRoleTabPrivs = roleTabPrivsResp.data?.data || [];
      return { existingRolePrivs, existingRoleTabPrivs };
    }

    function parseUiSelections() {
      const uiRolePrivs: {
        role_priv_payloads: any[];
        role_tab_payloads: any[];
      } = {
        role_priv_payloads: [],
        role_tab_payloads: [],
      };
      Object.keys(rolePrivileges).forEach((key) => {
        const v = rolePrivileges[key];
        if (key.startsWith("priv_")) {
          uiRolePrivs.role_priv_payloads.push({
            role_id: selectedRole,
            priv_id: v.priv_id,
          });
        }
        if (key.startsWith("module_")) {
          const parts = key.split("_");
          const moduleId = Number(parts[1]);
          if (!isNaN(moduleId)) {
            const scopeValue = "MODUL";
            uiRolePrivs.role_priv_payloads.push({
              role_id: selectedRole,
              scope: scopeValue,
              access_flag: true,
            });
          }
        }
        if (key.startsWith("sub_")) {
          const parts = key.split("_");
          const subId = Number(parts[1]);
          const perm = parts[2];
          if (!isNaN(subId)) {
            const scopeValue = "SUBMD";
            uiRolePrivs.role_priv_payloads.push({
              role_id: selectedRole,
              sub_module_id: subId,
              scope: scopeValue,
              view_flag: perm === "view",
              create_flag: perm === "create",
              edit_flag: perm === "edit",
              delete_flag: perm === "delete",
            });
          }
        }
        if (key.startsWith("tab_")) {
          const parts = key.split("_");
          const tabId = Number(parts[1]);
          const subId = Number(parts[3]);
          const perm = parts[4];
          if (!isNaN(tabId)) {
            uiRolePrivs.role_tab_payloads.push({
              role_id: selectedRole,
              tab_id: tabId,
              sub_module_id: !isNaN(subId) ? subId : undefined,
              view_flag: perm === "view",
              create_flag: perm === "create",
              edit_flag: perm === "edit",
              delete_flag: perm === "delete",
            });
          }
        }
      });
      return uiRolePrivs;
    }

    try {
      setIsLoading(true);
      const { existingRolePrivs, existingRoleTabPrivs } =
        await fetchExistingRoleAssignments();
      const ui = parseUiSelections();
      const existingRolePrivKeys = new Set<string>();
      existingRolePrivs.forEach((r: any) => {
        if (r.sub_module_id) existingRolePrivKeys.add(`sub_${r.sub_module_id}`);
        else if (r.priv_id) existingRolePrivKeys.add(`priv_${r.priv_id}`);
      });
      const existingTabKeys = new Map<string, any>();
      existingRoleTabPrivs.forEach((r: any) => {
        const key = `tab_${r.tab_id}_sub_${r.sub_module_id}`;
        existingTabKeys.set(key, r);
      });
      const toCreateRolePrivs: any[] = [];
      const uiSubModuleFlags: Record<
        number,
        {
          view_flag?: boolean;
          create_flag?: boolean;
          edit_flag?: boolean;
          delete_flag?: boolean;
        }
      > = {};
      ui.role_priv_payloads.forEach((p) => {
        if (p.sub_module_id) {
          const id = p.sub_module_id;
          if (!uiSubModuleFlags[id])
            uiSubModuleFlags[id] = {
              view_flag: false,
              create_flag: false,
              edit_flag: false,
              delete_flag: false,
            };
          uiSubModuleFlags[id].view_flag =
            uiSubModuleFlags[id].view_flag || !!p.view_flag;
          uiSubModuleFlags[id].create_flag =
            uiSubModuleFlags[id].create_flag || !!p.create_flag;
          uiSubModuleFlags[id].edit_flag =
            uiSubModuleFlags[id].edit_flag || !!p.edit_flag;
          uiSubModuleFlags[id].delete_flag =
            uiSubModuleFlags[id].delete_flag || !!p.delete_flag;
        }
      });
      ui.role_priv_payloads.forEach((p) => {
        if (p.priv_id) {
          if (!existingRolePrivKeys.has(`priv_${p.priv_id}`))
            toCreateRolePrivs.push({ role_id: p.role_id, priv_id: p.priv_id });
        } else if (p.sub_module_id) {
          if (!existingRolePrivKeys.has(`sub_${p.sub_module_id}`))
            toCreateRolePrivs.push({
              role_id: p.role_id,
              sub_module_id: p.sub_module_id,
              scope: "SUB_MODULE",
              view_flag: p.view_flag,
              create_flag: p.create_flag,
              edit_flag: p.edit_flag,
              delete_flag: p.delete_flag,
            });
        }
      });
      // Always update flags for existing sub_module privileges, even if record exists
      const toUpdateRolePrivs: Array<{ id: number; data: any }> = [];
      existingRolePrivs.forEach((r: any) => {
        const subId = r.sub_module_id;
        if (subId && uiSubModuleFlags[subId]) {
          const uiFlags = uiSubModuleFlags[subId];
          const existingFlags = {
            view_flag: !!r.view_flag,
            create_flag: !!r.create_flag,
            edit_flag: !!r.edit_flag,
            delete_flag: !!r.delete_flag,
          };
          const changed =
            existingFlags.view_flag !== !!uiFlags.view_flag ||
            existingFlags.create_flag !== !!uiFlags.create_flag ||
            existingFlags.edit_flag !== !!uiFlags.edit_flag ||
            existingFlags.delete_flag !== !!uiFlags.delete_flag;
          if (changed) {
            const id = r.role_privilege_id || r.role_priv_id || r.id;
            if (id) {
              toUpdateRolePrivs.push({
                id,
                data: {
                  view_flag: uiFlags.view_flag,
                  create_flag: uiFlags.create_flag,
                  edit_flag: uiFlags.edit_flag,
                  delete_flag: uiFlags.delete_flag,
                },
              });
            }
          }
        }
      });
      const toCreateRoleTabPrivs: any[] = [];
      ui.role_tab_payloads.forEach((p) => {
        const key = `tab_${p.tab_id}_sub_${p.sub_module_id}`;
        if (!existingTabKeys.has(key)) toCreateRoleTabPrivs.push(p);
      });
      const toDeleteRolePrivIds: number[] = [];
      existingRolePrivs.forEach((r: any) => {
        if (r.priv_id) {
          const found = ui.role_priv_payloads.find(
            (p) => p.priv_id === r.priv_id
          );
          if (!found)
            toDeleteRolePrivIds.push(
              r.role_privilege_id ||
                r.role_priv_id ||
                r.role_priv_id ||
                r.role_privilege_id
            );
        } else if (r.sub_module_id) {
          const found = ui.role_priv_payloads.find(
            (p) => p.sub_module_id === r.sub_module_id
          );
          if (!found)
            toDeleteRolePrivIds.push(
              r.role_privilege_id || r.role_priv_id || r.role_privilege_id
            );
        } else if (r.scope === "MODULE") {
          return;
        }
      });
      const toDeleteRoleTabIds: number[] = [];
      existingRoleTabPrivs.forEach((r: any) => {
        const key = `tab_${r.tab_id}_sub_${r.sub_module_id}`;
        const found = ui.role_tab_payloads.find(
          (p) => p.tab_id === r.tab_id && p.sub_module_id === r.sub_module_id
        );
        if (!found)
          toDeleteRoleTabIds.push(
            r.role_tab_privilege_id || r.role_tab_privilege_id
          );
      });
      const createPromises: Promise<any>[] = [];
      toCreateRolePrivs.forEach((p) =>
        createPromises.push(securityPermissionsApi.createRolePrivilege(p))
      );
      toUpdateRolePrivs.forEach((u) =>
        createPromises.push(
          apiClient.put(`/secRolePrivilege/edit/${u.id}`, u.data)
        )
      );
      toCreateRoleTabPrivs.forEach((p) =>
        createPromises.push(apiClient.post(`/secRoleTabPrivilege/add`, p))
      );
      const deletePromises: Promise<any>[] = [];
      if (toDeleteRolePrivIds.length > 0) {
        deletePromises.push(
          apiClient
            .delete(`/secRolePrivilege/delete`, {
              data: { ids: toDeleteRolePrivIds },
            })
            .catch(() => {})
        );
      }
      if (toDeleteRoleTabIds.length > 0) {
        deletePromises.push(
          apiClient
            .delete(`/secRoleTabPrivilege/delete`, {
              data: { ids: toDeleteRoleTabIds },
            })
            .catch(() => {})
        );
      }
      await Promise.all([...createPromises, ...deletePromises]);
      toast.success("Role privileges synchronized");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save role privileges");
    } finally {
      setIsLoading(false);
    }
  }, [selectedRole, rolePrivileges]);

  return {
    roles,
    selectedRole,
    setSelectedRole,
    modules,
    subModulesByModule,
    rolePrivileges,
    setRolePrivileges,
    isLoading,
    getTabs,
    toggleSubModulePermission,
    toggleTabPermission,
    handleSaveRolePrivileges,
  };
}
