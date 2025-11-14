"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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
import workflowApi from "@/services/workforce/workflowService";
import {
  SearchCombobox,
  SearchComboboxOption,
} from "@/components/ui/search-combobox";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePermissionTypeMutations from "../hooks/usePermissionTypeMutations";

interface PermissionTypePayload {
  permission_type_code: string;
  permission_type_eng?: string;
  permission_type_arb?: string;
  max_perm_per_day?: number | null;
  max_minutes_per_day?: number | null;
  max_perm_per_month?: number | null;
  max_minutes_per_month?: number | null;
  group_apply_flag?: boolean;
  official_flag?: boolean;
  full_day_permission_flag?: boolean;
  status_flag?: boolean;
  workflow_id?: number | null;
  specific_gender?: string | null;
  medical_pass_flag?: boolean;
  mandatory_comments_flag?: boolean;
  mandatory_attachment_flag?: boolean;
  apply_ramadan_restriction_flag?: boolean;
  minutes_permission_flag?: boolean;
  from_to_time_permission_flag?: boolean;
  weekdays_permission_flag?: boolean;
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
  const { isRTL } = useLanguage();
  const mutations = usePermissionTypeMutations();

  // Basic fields
  const [code, setCode] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [status, setStatus] = useState(true);

  // Numeric limits
  const [maxPermPerDay, setMaxPermPerDay] = useState<number | string>("");
  const [maxMinutesPerDay, setMaxMinutesPerDay] = useState<number | string>("");
  const [maxPermPerMonth, setMaxPermPerMonth] = useState<number | string>("");
  const [maxMinutesPerMonth, setMaxMinutesPerMonth] = useState<number | string>(
    ""
  );
  const [workflowId, setWorkflowId] = useState<number | null>(null);

  // Gender
  const [specificGender, setSpecificGender] = useState<string>("Any");

  // Boolean flags
  const [groupApplyFlag, setGroupApplyFlag] = useState(false);
  const [officialFlag, setOfficialFlag] = useState(false);
  const [fullDayPermissionFlag, setFullDayPermissionFlag] = useState(false);
  const [medicalPassFlag, setMedicalPassFlag] = useState(false);
  const [mandatoryCommentsFlag, setMandatoryCommentsFlag] = useState(false);
  const [mandatoryAttachmentFlag, setMandatoryAttachmentFlag] = useState(false);
  const [applyRamadanRestrictionFlag, setApplyRamadanRestrictionFlag] =
    useState(false);
  const [minutesPermissionFlag, setMinutesPermissionFlag] = useState(false);
  const [fromToTimePermissionFlag, setFromToTimePermissionFlag] =
    useState(false);
  const [weekdaysPermissionFlag, setWeekdaysPermissionFlag] = useState(false);

  const [error, setError] = useState("");

  const [workflows, setWorkflows] = useState<any[]>([]);
  const [wfLoading, setWfLoading] = useState(false);
  const [wfOptions, setWfOptions] = useState<SearchComboboxOption[]>([]);
  useEffect(() => {
    if (initialData) {
      setCode(initialData.permission_type_code || "");
      setNameEn(initialData.permission_type_eng || "");
      setNameAr(initialData.permission_type_arb || "");
      setStatus(initialData.status_flag ?? true);

      // Numeric fields
      setMaxPermPerDay(initialData.max_perm_per_day ?? "");
      setMaxMinutesPerDay(initialData.max_minutes_per_day ?? "");
      setMaxPermPerMonth(initialData.max_perm_per_month ?? "");
      setMaxMinutesPerMonth(initialData.max_minutes_per_month ?? "");
      setWorkflowId(initialData.workflow_id ?? null);

      // Gender
      setSpecificGender(initialData.specific_gender || "NONE");

      // Boolean flags
      setGroupApplyFlag(initialData.group_apply_flag ?? false);
      setOfficialFlag(initialData.official_flag ?? false);
      setFullDayPermissionFlag(initialData.full_day_permission_flag ?? false);
      setMedicalPassFlag(initialData.medical_pass_flag ?? false);
      setMandatoryCommentsFlag(initialData.mandatory_comments_flag ?? false);
      setMandatoryAttachmentFlag(
        initialData.mandatory_attachment_flag ?? false
      );
      setApplyRamadanRestrictionFlag(
        initialData.apply_ramadan_restriction_flag ?? false
      );
      setMinutesPermissionFlag(initialData.minutes_permission_flag ?? false);
      setFromToTimePermissionFlag(
        initialData.from_to_time_permission_flag ?? false
      );
      setWeekdaysPermissionFlag(initialData.weekdays_permission_flag ?? false);
    } else {
      // Reset all fields
      setCode("");
      setNameEn("");
      setNameAr("");
      setStatus(true);
      setMaxPermPerDay("");
      setMaxMinutesPerDay("");
      setMaxPermPerMonth("");
      setMaxMinutesPerMonth("");
      setWorkflowId(null);
      setSpecificGender("NONE");
      setGroupApplyFlag(false);
      setOfficialFlag(false);
      setFullDayPermissionFlag(false);
      setMedicalPassFlag(false);
      setMandatoryCommentsFlag(false);
      setMandatoryAttachmentFlag(false);
      setApplyRamadanRestrictionFlag(false);
      setMinutesPermissionFlag(false);
      setFromToTimePermissionFlag(false);
      setWeekdaysPermissionFlag(false);
    }
  }, [initialData, open]);

  useEffect(() => {
    // Fetch initial workflows for combobox when modal opens
    if (!open) return;
    let mounted = true;
    const fetch = async () => {
      setWfLoading(true);
      try {
        const res = await workflowApi.getWorkflows({
          offset: 1,
          limit: 10,
          search: "",
        });
        const items = res?.data?.data || [];
        if (mounted) {
          setWorkflows(items);
          const opts = items.map((w: any) => ({
            label: isRTL
              ? w.workflow_name_arb || w.workflow_name_eng
              : w.workflow_name_eng || w.workflow_name_arb,
            value: w.workflow_id,
          }));
          setWfOptions(opts);
        }
      } catch (err) {
        console.error("Failed to load workflows", err);
      } finally {
        if (mounted) setWfLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, [open, isRTL]);

  const handleSearchWorkflows = async (query: string) => {
    setWfLoading(true);
    try {
      const res = await workflowApi.getWorkflows({
        offset: 1,
        limit: 20,
        search: query,
      });
      const items = res?.data?.data || [];
      setWorkflows(items);
      const opts = items.map((w: any) => ({
        label: isRTL
          ? w.workflow_name_arb || w.workflow_name_eng
          : w.workflow_name_eng || w.workflow_name_arb,
        value: w.workflow_id,
      }));
      setWfOptions(opts);
    } catch (err) {
      console.error("Workflow search failed", err);
      setWfOptions([]);
    } finally {
      setWfLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    const payload: PermissionTypePayload = {
      permission_type_code: String(code).trim(),
      permission_type_eng: String(nameEn).trim() || undefined,
      permission_type_arb: String(nameAr).trim() || undefined,
      max_perm_per_day: maxPermPerDay ? Number(maxPermPerDay) : null,
      max_minutes_per_day: maxMinutesPerDay ? Number(maxMinutesPerDay) : null,
      max_perm_per_month: maxPermPerMonth ? Number(maxPermPerMonth) : null,
      max_minutes_per_month: maxMinutesPerMonth
        ? Number(maxMinutesPerMonth)
        : null,
      workflow_id: workflowId ? Number(workflowId) : null,
      specific_gender:
        specificGender && specificGender !== "NONE" ? specificGender : null,
      group_apply_flag: groupApplyFlag,
      official_flag: officialFlag,
      full_day_permission_flag: fullDayPermissionFlag,
      status_flag: status,
      medical_pass_flag: medicalPassFlag,
      mandatory_comments_flag: mandatoryCommentsFlag,
      mandatory_attachment_flag: mandatoryAttachmentFlag,
      apply_ramadan_restriction_flag: applyRamadanRestrictionFlag,
      minutes_permission_flag: minutesPermissionFlag,
      from_to_time_permission_flag: fromToTimePermissionFlag,
      weekdays_permission_flag: weekdaysPermissionFlag,
    };

    try {
      if (initialData && initialData.permission_type_id) {
        await mutations.update.mutateAsync({
          id: initialData.permission_type_id,
          data: payload,
        });
      } else {
        await mutations.create.mutateAsync(payload);
      }
      onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save permission type"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl w-full p-0 bg-background rounded-xl shadow-2xl border border-border text-foreground flex flex-col items-center justify-center">
        <div className="w-full p-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {initialData
                ? t("leaveManagement.permissionTypes.actions.edit") ||
                  "Edit Permission Type"
                : t("leaveManagement.permissionTypes.actions.add") ||
                  "Add Permission Type"}
            </DialogTitle>
          </div>
          <ScrollArea className="h-[60vh] w-full">
            <div className="p-2 pr-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="border-b pb-2 mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-primary">
                      {t("common.basicInformation") || "Basic Information"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t("leaveManagement.permissionTypes.fields.code") ||
                          "Code"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCode(e.target.value)
                        }
                        placeholder="e.g., PH"
                        required
                        className="h-10"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t("leaveManagement.permissionTypes.fields.status") ||
                          "Status"}
                      </label>
                      <Select
                        value={String(status)}
                        onValueChange={(v: string) => setStatus(v === "true")}
                      >
                        <SelectTrigger className=" w-full h-10">
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

                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t(
                          "leaveManagement.permissionTypes.fields.specificGender"
                        ) || "Specific Gender"}
                      </label>
                      <Select
                        value={specificGender || "NONE"}
                        onValueChange={(v: string) => setSpecificGender(v)}
                      >
                        <SelectTrigger className=" w-full h-10">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">
                            {t("common.any") || "Any"}
                          </SelectItem>
                          <SelectItem value="M">
                            {t("common.male") || "Male"}
                          </SelectItem>
                          <SelectItem value="F">
                            {t("common.female") || "Female"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    {isRTL ? (
                      <div>
                        <label className="block mb-2 font-medium text-sm">
                          {t(
                            "leaveManagement.permissionTypes.fields.nameArb"
                          ) || "Name (Arabic)"}
                        </label>
                        <Input
                          value={nameAr}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNameAr(e.target.value)
                          }
                          placeholder="اسم نوع الإذن بالعربية"
                          className="h-10"
                          dir="rtl"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block mb-2 font-medium text-sm">
                          {t(
                            "leaveManagement.permissionTypes.fields.nameEng"
                          ) || "Name (English)"}
                        </label>
                        <Input
                          value={nameEn}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNameEn(e.target.value)
                          }
                          placeholder="Permission type name in English"
                          className="h-10"
                          dir="ltr"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Limits Section */}
                <div className="space-y-4">
                  <div className="border-b pb-2 mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-primary">
                      {t("leaveManagement.permissionTypes.sections.limits") ||
                        "Permission Limits"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t(
                          "leaveManagement.permissionTypes.fields.maxPermPerDay"
                        ) || "Max Permissions Per Day"}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={maxPermPerDay}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setMaxPermPerDay(e.target.value)
                        }
                        placeholder="e.g., 2"
                        className="h-10"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t(
                          "leaveManagement.permissionTypes.fields.maxMinutesPerDay"
                        ) || "Max Minutes Per Day"}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={maxMinutesPerDay}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setMaxMinutesPerDay(e.target.value)
                        }
                        placeholder="e.g., 120"
                        className="h-10"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t(
                          "leaveManagement.permissionTypes.fields.maxPermPerMonth"
                        ) || "Max Permissions Per Month"}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={maxPermPerMonth}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setMaxPermPerMonth(e.target.value)
                        }
                        placeholder="e.g., 10"
                        className="h-10"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t(
                          "leaveManagement.permissionTypes.fields.maxMinutesPerMonth"
                        ) || "Max Minutes Per Month"}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={maxMinutesPerMonth}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setMaxMinutesPerMonth(e.target.value)
                        }
                        placeholder="e.g., 600"
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Workflow & Configuration Section */}
                <div className="space-y-4">
                  <div className="border-b pb-2 mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-primary">
                      {t(
                        "leaveManagement.permissionTypes.sections.configuration"
                      ) || "Configuration"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-medium text-sm">
                        {t(
                          "leaveManagement.permissionTypes.fields.workflowId"
                        ) || "Workflow"}
                      </label>
                      <SearchCombobox
                        options={wfOptions}
                        value={workflowId ? String(workflowId) : ""}
                        onValueChange={(v: string | number | null) => {
                          setWorkflowId(v ? Number(v) : null);
                        }}
                        onSearch={handleSearchWorkflows}
                        placeholder={
                          t(
                            "leaveManagement.permissionTypes.fields.workflowPlaceholder"
                          ) || "Search workflow..."
                        }
                        emptyMessage={
                          t("common.noResults") || "No workflows found"
                        }
                        isLoading={wfLoading}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Flags Section */}
                <div className="space-y-4">
                  <div className="border-b pb-2 mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-primary">
                      {t("leaveManagement.permissionTypes.sections.flags") ||
                        "Permission Flags"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="groupApplyFlag"
                        checked={groupApplyFlag}
                        onCheckedChange={(checked) =>
                          setGroupApplyFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="groupApplyFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.groupApplyFlag"
                        ) || "Group Apply"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="officialFlag"
                        checked={officialFlag}
                        onCheckedChange={(checked) =>
                          setOfficialFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="officialFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.officialFlag"
                        ) || "Official"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fullDayPermissionFlag"
                        checked={fullDayPermissionFlag}
                        onCheckedChange={(checked) =>
                          setFullDayPermissionFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="fullDayPermissionFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.fullDayPermissionFlag"
                        ) || "Full Day Permission"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medicalPassFlag"
                        checked={medicalPassFlag}
                        onCheckedChange={(checked) =>
                          setMedicalPassFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="medicalPassFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.medicalPassFlag"
                        ) || "Medical Pass"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mandatoryCommentsFlag"
                        checked={mandatoryCommentsFlag}
                        onCheckedChange={(checked) =>
                          setMandatoryCommentsFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="mandatoryCommentsFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.mandatoryCommentsFlag"
                        ) || "Mandatory Comments"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mandatoryAttachmentFlag"
                        checked={mandatoryAttachmentFlag}
                        onCheckedChange={(checked) =>
                          setMandatoryAttachmentFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="mandatoryAttachmentFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.mandatoryAttachmentFlag"
                        ) || "Mandatory Attachment"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="applyRamadanRestrictionFlag"
                        checked={applyRamadanRestrictionFlag}
                        onCheckedChange={(checked) =>
                          setApplyRamadanRestrictionFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="applyRamadanRestrictionFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.applyRamadanRestrictionFlag"
                        ) || "Apply Ramadan Restriction"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="minutesPermissionFlag"
                        checked={minutesPermissionFlag}
                        onCheckedChange={(checked) =>
                          setMinutesPermissionFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="minutesPermissionFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.minutesPermissionFlag"
                        ) || "Minutes Permission"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fromToTimePermissionFlag"
                        checked={fromToTimePermissionFlag}
                        onCheckedChange={(checked) =>
                          setFromToTimePermissionFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="fromToTimePermissionFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.fromToTimePermissionFlag"
                        ) || "From-To Time Permission"}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="weekdaysPermissionFlag"
                        checked={weekdaysPermissionFlag}
                        onCheckedChange={(checked) =>
                          setWeekdaysPermissionFlag(!!checked)
                        }
                      />
                      <label
                        htmlFor="weekdaysPermissionFlag"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(
                          "leaveManagement.permissionTypes.fields.weekdaysPermissionFlag"
                        ) || "Weekdays Permission"}
                      </label>
                    </div>
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
              </form>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="border-t w-full py-2 flex items-center justify-center">
          <div className="flex gap-3 w-full px-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={mutations.isCreating || mutations.isUpdating}
              className="flex-1"
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={mutations.isCreating || mutations.isUpdating}
              className="flex-1"
            >
              {mutations.isCreating || mutations.isUpdating
                ? "Saving..."
                : t("common.save") || "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionTypeModal;
