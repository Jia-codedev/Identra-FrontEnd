"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/separator";

export default function PermissionForm({
  permission,
  permissionModules,
  onSubmit,
  onCancel,
  t,
  isEdit = false,
}: {
  permission?: any;
  permissionModules: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  t: (key: string, params?: Record<string, unknown>) => string;
  isEdit?: boolean;
}) {
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

  const selectedModuleData = permissionModules.find(
    (m: any) => m.id === formData.module
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, permissions: selectedPermissions });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? t("common.update") : t("common.create")}{" "}
          {t("security.accessPermissions.permission")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                {t("security.accessPermissions.permissionName")}
              </Label>
              <Input
                id="name"
                className="mt-1"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="module">
                {t("security.accessPermissions.module")}
              </Label>
              <Select
                value={formData.module}
                onValueChange={(value) =>
                  setFormData({ ...formData, module: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t("security.accessPermissions.selectModule")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {permissionModules.map((module: any) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">{t("common.description")}</Label>
            <Input
              id="description"
              className="mt-1"
              value={formData.description}
              onChange={(e: any) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {selectedModuleData && (
            <div>
              <Label className="mb-2">
                {t("security.accessPermissions.permission")}
              </Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {selectedModuleData.permissions.map((permission: string) => (
                  <label
                    key={permission}
                    className="inline-flex items-center space-x-2 bg-muted/5 px-3 py-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={permission}
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className="rounded border-gray-300"
                    />
                    <span className="capitalize text-sm">
                      {permission.replace("-", " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="status">{t("common.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("common.active")}</SelectItem>
                  <SelectItem value="inactive">
                    {t("common.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">
                {isEdit ? t("common.update") : t("common.create")}{" "}
                {t("security.accessPermissions.permission")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
