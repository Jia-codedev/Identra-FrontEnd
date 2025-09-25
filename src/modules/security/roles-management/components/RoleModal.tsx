"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { SecRole } from "@/services/security/securityRoles";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { role_name: string; editable_flag: boolean }) => void;
  role?: SecRole | null;
  mode: "add" | "edit";
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role,
  mode,
}) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    role_name: "",
    editable_flag: true,
  });

  useEffect(() => {
    if (role && mode === "edit") {
      setFormData({
        role_name: role.role_name || "",
        editable_flag: role.editable_flag ?? true,
      });
    } else {
      setFormData({ role_name: "", editable_flag: true });
    }
  }, [role, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {mode === "add"
              ? t("security.roles.addRole") || "Add Role"
              : t("security.roles.editRole") || "Edit Role"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            ×
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="role_name" className="text-sm font-medium">
              {t("security.roles.roleName") || "Role Name"} *
            </Label>
            <Input
              id="role_name"
              value={formData.role_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, role_name: e.target.value }))}
              placeholder={t("security.roles.enterRoleName") || "Enter role name"}
              required
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editable_flag"
              checked={formData.editable_flag}
              onChange={(e) => setFormData((prev) => ({ ...prev, editable_flag: e.target.checked }))}
            />
            <Label htmlFor="editable_flag" className="text-sm font-medium">
              {t("security.roles.editable") || "Editable"}
            </Label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button type="submit" className="flex-1">
              {t("common.save") || "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
