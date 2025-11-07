"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import rolesApi from "@/services/security/rolesService";
import securityPermissionsApi from "@/services/security/securityPermissions";
import securitySubModulesApi from "@/services/security/securitySubModules";
import apiClient from "@/configs/api/Axios";
import SubModuleTabsComponent from "@/modules/security/access-permissions/components/SubModuleTabs";
import Header from "@/modules/security/access-permissions/components/Header";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  permissions: string[];
  status: "active" | "inactive";
  assignedRoles: number;
  createdAt: string;
  users: number;
}

interface PermissionModule {
  id: string;
  name: string;
  permissions: string[];
}

export default function AccessPermissionsPage() {
  const { t } = useTranslations();

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

  const getTabs = useCallback(
    async (subModuleId: number) => {
      return tabsBySubModule[subModuleId] || [];
    },
    [tabsBySubModule]
  );

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
        } catch (err) {
          console.error(err);
          setSubModulesByModule({});
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load roles or modules");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  // Select first role after roles are loaded
  React.useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0].role_id);
    }
  }, [roles]);

  useEffect(() => {
    // Only run if all data is loaded
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
      } catch (err) {
        console.error(err);
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

  const toggleSubModulePermission = (subModuleId: number, perm: string) => {
    const rolePart = selectedRole ? `_role_${selectedRole}` : "";
    const key = `sub_${subModuleId}_${perm}${rolePart}`;
    setRolePrivileges((prev) => {
      const newMap = { ...prev };
      if (newMap[key]) delete newMap[key];
      else newMap[key] = { sub_module_id: subModuleId, permission: perm };
      return newMap;
    });
  };

  const toggleTabPermission = (
    tabId: number,
    subModuleId: number,
    perm: string
  ) => {
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
  };
  const handleSaveRolePrivileges = async () => {
    if (!selectedRole) return toast.error("Please select a role first");

    try {
      setIsLoading(true);

      // Fetch existing privileges
      const [rolePrivsResp, roleTabPrivsResp] = await Promise.all([
        securityPermissionsApi.getRolePrivileges({
          limit: 1000,
          role_id: selectedRole,
        }),
        apiClient.get(`/secRoleTabPrivilege/all`, {
          params: { roleId: selectedRole, limit: 1000 },
        }),
      ]);

      const existingRolePrivs = rolePrivsResp.data?.data || [];
      const existingRoleTabPrivs = roleTabPrivsResp.data?.data || [];

      // Build UI state from rolePrivileges
      const uiSubModuleFlags: Record<
        number,
        {
          view_flag: boolean;
          create_flag: boolean;
          edit_flag: boolean;
          delete_flag: boolean;
        }
      > = {};

      const uiTabFlags: Record<
        string,
        {
          view_flag: boolean;
          create_flag: boolean;
          edit_flag: boolean;
          delete_flag: boolean;
        }
      > = {};

      // Parse UI selections for submodules
      Object.keys(rolePrivileges).forEach((key) => {
        if (key.startsWith("sub_")) {
          const parts = key.split("_");
          const subId = Number(parts[1]);
          const perm = parts[2];

          if (!isNaN(subId)) {
            if (!uiSubModuleFlags[subId]) {
              uiSubModuleFlags[subId] = {
                view_flag: false,
                create_flag: false,
                edit_flag: false,
                delete_flag: false,
              };
            }

            if (perm === "view") uiSubModuleFlags[subId].view_flag = true;
            if (perm === "create") uiSubModuleFlags[subId].create_flag = true;
            if (perm === "edit") uiSubModuleFlags[subId].edit_flag = true;
            if (perm === "delete") uiSubModuleFlags[subId].delete_flag = true;
          }
        }

        // Parse UI selections for tabs
        // Key format: tab_<tabId>_sub_<subId>_<perm>_role_<roleId>
        if (key.startsWith("tab_")) {
          const parts = key.split("_");
          // parts: ["tab", tabId, "sub", subId, perm, "role", roleId]
          const tabId = Number(parts[1]);
          const subId = Number(parts[3]);
          const perm = parts[4];

          if (!isNaN(tabId) && !isNaN(subId) && perm) {
            const tabKey = `${tabId}_${subId}`;
            if (!uiTabFlags[tabKey]) {
              uiTabFlags[tabKey] = {
                view_flag: false,
                create_flag: false,
                edit_flag: false,
                delete_flag: false,
              };
            }

            if (perm === "view") uiTabFlags[tabKey].view_flag = true;
            if (perm === "create") uiTabFlags[tabKey].create_flag = true;
            if (perm === "edit") uiTabFlags[tabKey].edit_flag = true;
            if (perm === "delete") uiTabFlags[tabKey].delete_flag = true;
          }
        }
      });

      console.log("📊 UI SubModule Flags:", uiSubModuleFlags);
      console.log("📊 UI Tab Flags:", uiTabFlags);

      // ONLY UPDATE existing submodule privileges (no create/delete)
      const updatePromises: Promise<any>[] = [];

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

          // Check if any flag changed
          const changed =
            existingFlags.view_flag !== uiFlags.view_flag ||
            existingFlags.create_flag !== uiFlags.create_flag ||
            existingFlags.edit_flag !== uiFlags.edit_flag ||
            existingFlags.delete_flag !== uiFlags.delete_flag;

          if (changed) {
            const id = r.role_privilege_id || r.role_priv_id || r.id;
            if (id) {
              updatePromises.push(
                apiClient.put(`/secRolePrivilege/edit/${id}`, {
                  view_flag: uiFlags.view_flag,
                  create_flag: uiFlags.create_flag,
                  edit_flag: uiFlags.edit_flag,
                  delete_flag: uiFlags.delete_flag,
                })
              );
            }
          }
        }
      });

      // ONLY UPDATE existing tab privileges (no create/delete)
      existingRoleTabPrivs.forEach((r: any) => {
        const tabKey = `${r.tab_id}_${r.sub_module_id}`;
        console.log(
          `🔍 Checking tab ${r.tab_id} (submodule ${r.sub_module_id}):`,
          {
            tabKey,
            existsInUI: !!uiTabFlags[tabKey],
            uiFlags: uiTabFlags[tabKey],
            existingFlags: {
              view_flag: !!r.view_flag,
              create_flag: !!r.create_flag,
              edit_flag: !!r.edit_flag,
              delete_flag: !!r.delete_flag,
            },
          }
        );

        if (uiTabFlags[tabKey]) {
          const uiFlags = uiTabFlags[tabKey];
          const existingFlags = {
            view_flag: !!r.view_flag,
            create_flag: !!r.create_flag,
            edit_flag: !!r.edit_flag,
            delete_flag: !!r.delete_flag,
          };
          const changed =
            existingFlags.view_flag !== uiFlags.view_flag ||
            existingFlags.create_flag !== uiFlags.create_flag ||
            existingFlags.edit_flag !== uiFlags.edit_flag ||
            existingFlags.delete_flag !== uiFlags.delete_flag;

          console.log(`  ➡️ Changed: ${changed}`, { existingFlags, uiFlags });

          if (changed) {
            const id = r.role_tab_privilege_id;
            if (id) {
              console.log(`  ✅ Adding tab update for ID ${id}`);
              updatePromises.push(
                apiClient.put(`/secRoleTabPrivilege/edit/${id}`, {
                  view_flag: uiFlags.view_flag,
                  create_flag: uiFlags.create_flag,
                  edit_flag: uiFlags.edit_flag,
                  delete_flag: uiFlags.delete_flag,
                })
              );
            }
          }
        }
      });
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        toast.success(
          `Successfully updated ${updatePromises.length} privilege(s)`
        );
        const resp = await apiClient.get(`/secRolePrivilege`, {
          params: { roleId: selectedRole },
        });
        const tree = resp.data?.data || {};
        const map: Record<string, any> = {};
        const tabsMap: Record<number, any[]> = {};

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

            if (Array.isArray(sub.tabs) && resolvedSubModuleId) {
              tabsMap[resolvedSubModuleId] = sub.tabs;
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

        setRolePrivileges(map);
        setTabsBySubModule(tabsMap);
        console.log("🔄 Privileges reloaded after update");
      } else {
        toast.info("No changes detected");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update role privileges");
    } finally {
      setIsLoading(false);
    }
  };

  const PermissionForm = ({
    permission,
    isEdit = false,
    onSubmit,
  }: {
    permission?: Permission;
    isEdit?: boolean;
    onSubmit: (data: any) => void;
  }) => {
    const [formData, setFormData] = useState({
      name: permission?.name || "",
      description: permission?.description || "",
      module: permission?.module || "",
      permissions: permission?.permissions || [],
      status: permission?.status || "active",
    });

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
      permission?.permissions || []
    );

    const handlePermissionToggle = (permissionName: string) => {
      setSelectedPermissions((prev) => {
        const updated = prev.includes(permissionName)
          ? prev.filter((p) => p !== permissionName)
          : [...prev, permissionName];
        setFormData({ ...formData, permissions: updated });
        return updated;
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ ...formData, permissions: selectedPermissions });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">
            {t("security.accessPermissions.permissionName")}
          </Label>
          <input
            id="name"
            className="w-full p-2-md mt-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t("security.accessPermissions.enterPermissionName")}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">{t("common.description")}</Label>
          <input
            id="description"
            className="w-full p-2-md mt-1"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder={t("security.accessPermissions.enterDescription")}
            required
          />
        </div>

        <div>
          <Label htmlFor="module">
            {t("security.accessPermissions.module")}
          </Label>
        </div>

        <div>
          <Label htmlFor="status">{t("common.status")}</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as "active" | "inactive",
              })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t("common.active")}</SelectItem>
              <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">
            {isEdit ? t("common.update") : t("common.create")}{" "}
            {t("security.accessPermissions.permission")}
          </Button>
        </div>
      </form>
    );
  };
  return (
    <div className="w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <Header title={t("security.accessPermissions.title")} />
        <div className="flex justify-end items-end gap-3">
          <div className="w-56">
            <Label>{t("security.accessPermissions.selectRole")}</Label>
            <Select
              value={selectedRole ? String(selectedRole) : ""}
              onValueChange={(v) => setSelectedRole(v ? Number(v) : null)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue
                  placeholder={t("security.accessPermissions.selectRole")}
                />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.role_id} value={String(r.role_id)}>
                    {r.role_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="secondary"
            onClick={handleSaveRolePrivileges}
            disabled={isLoading || !selectedRole}
          >
            {isLoading ? t("common.saving") : t("common.update")}{" "}
            {t("security.accessPermissions.privileges")}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-4 border-0 bg-background">
            <CardContent>
              <div className="space-y-4">
                {modules.map((mod) => (
                  <div key={mod.module_id}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{mod.module_name}</div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-4">
                      <div>
                        <div className="mt-2 space-y-2">
                          {(subModulesByModule[mod.module_id] || []).map(
                            (sub: any) => (
                              <div
                                key={sub.sub_module_id}
                                className="p-2 bg-card border border-border rounded-2xl"
                              >
                                <div className="mt-2">
                                  <SubModuleTabsComponent
                                    subModule={sub}
                                    rolePrivileges={rolePrivileges}
                                    selectedRole={selectedRole}
                                    getTabs={getTabs}
                                    toggleSubModulePermission={
                                      toggleSubModulePermission
                                    }
                                    toggleTabPermission={toggleTabPermission}
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
