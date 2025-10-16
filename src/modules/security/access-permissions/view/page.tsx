"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";

import { GenericTable } from "@/components/common/GenericTable";
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
  const tabsCacheRef = useRef<Record<number, any[]>>({});
  const allTabsFetchedRef = useRef<boolean>(false);
  const fetchAllTabsOnce = useCallback(async () => {
    if (allTabsFetchedRef.current) return;
    try {
      const res = await apiClient.get(`/secTabs/all`, {
        params: { limit: 1000, offset: 1 },
      });
      const all = res.data?.data || [];
      const map: Record<number, any[]> = {};
      all.forEach((t: any) => {
        const sid = t.sub_module_id;
        if (!map[sid]) map[sid] = [];
        map[sid].push(t);
      });
      tabsCacheRef.current = map;
    } catch (err) {
      console.log(err);
      tabsCacheRef.current = {};
    } finally {
      allTabsFetchedRef.current = true;
    }
  }, []);

  const getTabs = useCallback(
    async (subModuleId: number) => {
      if (tabsCacheRef.current[subModuleId])
        return tabsCacheRef.current[subModuleId];
      await fetchAllTabsOnce();
      return tabsCacheRef.current[subModuleId] || [];
    },
    [fetchAllTabsOnce]
  );
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const [rolesRes, modulesRes] = await Promise.all([
          rolesApi.getRoles({ limit: 1000 }),
          securityPermissionsApi.getModules({ limit: 1000 }),
        ]);

        setRoles(rolesRes.data.data || []);
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

  useEffect(() => {
    if (!selectedRole) {
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

        if (mounted) setRolePrivileges(map);
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
  }, [selectedRole]);

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
          // module_<moduleId>_access[_role_<id>]
          const parts = key.split("_");
          const moduleId = Number(parts[1]);
          if (!isNaN(moduleId)) {
            uiRolePrivs.role_priv_payloads.push({
              role_id: selectedRole,
              scope: "MODULE",
              access_flag: true,
            });
          }
        }
        if (key.startsWith("sub_")) {
          // sub module level: key format sub_<subId>_<perm>[_role_<id>] or sub_<name>_...
          const parts = key.split("_");
          const subId = Number(parts[1]);
          const perm = parts[2];
          if (!isNaN(subId)) {
            uiRolePrivs.role_priv_payloads.push({
              role_id: selectedRole,
              sub_module_id: subId,
              scope: "SUB_MODULE",
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

      console.debug(
        "[AccessPermissions] existingRolePrivs:",
        existingRolePrivs
      );
      console.debug(
        "[AccessPermissions] existingRoleTabPrivs:",
        existingRoleTabPrivs
      );
      console.debug(
        "[AccessPermissions] ui.role_priv_payloads:",
        ui.role_priv_payloads
      );
      console.debug(
        "[AccessPermissions] ui.role_tab_payloads:",
        ui.role_tab_payloads
      );
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
      console.debug(
        "[AccessPermissions] toCreateRolePrivs:",
        toCreateRolePrivs
      );
      console.debug(
        "[AccessPermissions] toCreateRoleTabPrivs:",
        toCreateRoleTabPrivs
      );
      console.debug(
        "[AccessPermissions] toDeleteRolePrivIds:",
        toDeleteRolePrivIds
      );
      console.debug(
        "[AccessPermissions] toDeleteRoleTabIds:",
        toDeleteRoleTabIds
      );

      await Promise.all([...createPromises, ...deletePromises]);

      toast.success("Role privileges synchronized");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to save role privileges");
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
            {t("security.accessPermissions.saveRolePrivileges")}
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
