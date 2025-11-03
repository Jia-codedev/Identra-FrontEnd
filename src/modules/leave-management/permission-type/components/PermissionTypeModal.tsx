"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/Checkbox";
import permissionTypeApi from "@/services/leaveManagement/permissionType";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PermissionTypePayload {
  permission_type_code: string;
  permission_type_eng?: string;
  permission_type_arb?: string;
  status_Flag?: boolean;
  group_apply_flag?: boolean;
  status_flag?: boolean;
}

interface Props {
  open: boolean;
  initialData?:
    | (Partial<PermissionTypePayload> & { permission_type_id?: number })
    | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PermissionTypeModal: React.FC<Props> = ({
  open,
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();
  const isEnglish = currentLocale === "en";
  const [code, setCode] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setCode(initialData.permission_type_code || "");
      setNameEn(initialData.permission_type_eng || "");
      setNameAr(initialData.permission_type_arb || "");
      setStatus(
        typeof (initialData as any).status_Flag === "boolean"
          ? (initialData as any).status_Flag
          : typeof (initialData as any).status_flag === "boolean"
          ? (initialData as any).status_flag
          : true
      );
    } else {
      setCode("");
      setNameEn("");
      setNameAr("");
      setStatus(true);
    }
  }, [initialData, open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    const payload: PermissionTypePayload = {
      permission_type_code: String(code).trim(),
      permission_type_eng: String(nameEn).trim() || undefined,
      permission_type_arb: String(nameAr).trim() || undefined,
      group_apply_flag: false,
      status_flag: !!status,
    };

    try {
      if (initialData && initialData.permission_type_id) {
        await permissionTypeApi.update(
          initialData.permission_type_id,
          payload as any
        );
      } else {
        await permissionTypeApi.create(payload as any);
      }
      onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save permission type"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-lg w-full p-0 bg-background rounded-xl shadow-2xl border border-border text-foreground flex flex-col items-center justify-center">
        <div className="w-full p-2">
          <div className="flex items-center justify-between mb-6 px-2">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {initialData
                ? t("leaveManagement.permissionTypes.actions.edit") ||
                  "Edit Permission Type"
                : t("leaveManagement.permissionTypes.actions.add") ||
                  "Add Permission Type"}
            </DialogTitle>
          </div>
          <ScrollArea className="max-h-[70vh] overflow-y-auto overflow-x-hidden w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-2 mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-primary">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="md:col-span-1 min-w-0">
                    <label className="block mb-2 font-medium text-sm break-words truncate max-w-full">
                      {t("leaveManagement.permissionTypes.fields.code") ||
                        "Code"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={code}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCode(e.target.value)
                      }
                      placeholder="e.g., PH,olate"
                      required
                      className="h-10 truncate"
                    />
                  </div>

                  <div className="md:col-span-1 min-w-0">
                    <label className="block mb-2 font-medium text-sm break-words truncate max-w-full">
                      {t("leaveManagement.permissionTypes.fields.status") ||
                        "Status"}
                    </label>
                    <Select
                      value={String(status)}
                      onValueChange={(v: string) => setStatus(v === "true")}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">
                          {t("common.active") || "Active"}
                        </SelectItem>
                        <SelectItem value="false">
                          {t("common.inactive") || "Inactive"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    isEnglish ? "md:grid-cols-1" : "md:grid-cols-2"
                  } gap-4 md:gap-6`}
                >
                  <div className="min-w-0">
                    <label className="block mb-2 font-medium text-sm break-words truncate max-w-full">
                      {t("leaveManagement.permissionTypes.fields.nameEng") ||
                        "Name (English)"}
                    </label>
                    <Input
                      value={nameEn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNameEn(e.target.value)
                      }
                      placeholder="Permission type name in English"
                      className="h-10 truncate"
                    />
                  </div>

                  {!isEnglish && (
                    <div className="min-w-0">
                      <label className="block mb-2 font-medium text-sm break-words truncate max-w-full">
                        {t("leaveManagement.permissionTypes.fields.nameArb") ||
                          "Name (Arabic)"}
                      </label>
                      <Input
                        value={nameAr}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNameAr(e.target.value)
                        }
                        placeholder="Permission type name in Arabic"
                        className="h-10 truncate"
                      />
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-destructive/10 border-2 border-red-200 dark:border-destructive rounded-xl p-4 shadow-sm">
                  <div className="text-red-700 dark:text-destructive text-sm font-medium flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  {t("common.cancel") || "Cancel"}
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : t("common.save") || "Save"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionTypeModal;
