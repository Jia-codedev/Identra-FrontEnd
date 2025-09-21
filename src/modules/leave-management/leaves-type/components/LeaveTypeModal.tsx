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
import leaveTypeApi from "@/services/leaveManagement/leaveType";
import workflowTypeApi from "@/services/leaveManagement/workflowType";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeaveTypePayload {
  leave_type_code: string;
  leave_type_eng?: string;
  leave_type_arb?: string;
  status_Flag: boolean;
  need_approval_flag?: boolean;
  official_flag?: boolean;
  allow_attachment_flag?: boolean;
  mandatory_justification_flag?: boolean;
  total_entitled_days?: number;
  full_pay_days?: number;
  half_pay_days?: number;
  unpaid_days?: number;
  apply_prior_to_days?: number;
  is_AL_flag?: boolean;
  is_SL_flag?: boolean;
  exclude_holiday_flag?: boolean;
  exclude_weekend_flag?: boolean;
  apply_not_laterthandays_flag?: boolean;
  validation_mandatory_flag?: boolean;
  leave_by_overtime_flag?: boolean;
  carryforward_flag?: boolean;
  specific_gender?: string;
  workflow_Id?: number;
}

interface WorkflowType {
  workflow_id: number;
  workflow_name_eng: string;
  workflow_name_arb: string;
  workflow_code: string;
}

interface Props {
  open: boolean;
  initialData?: (Partial<LeaveTypePayload> & { leave_type_id?: number }) | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const LeaveTypeModal: React.FC<Props> = ({
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
  const [needApproval, setNeedApproval] = useState(false);
  const [official, setOfficial] = useState(false);
  const [allowAttachment, setAllowAttachment] = useState(false);
  const [mandatoryJustification, setMandatoryJustification] = useState(false);
  const [totalEntitledDays, setTotalEntitledDays] = useState<
    number | undefined
  >(undefined);
  const [fullPayDays, setFullPayDays] = useState<number | undefined>(undefined);
  const [halfPayDays, setHalfPayDays] = useState<number | undefined>(undefined);
  const [unpaidDays, setUnpaidDays] = useState<number | undefined>(undefined);
  const [applyPriorToDays, setApplyPriorToDays] = useState<number | undefined>(
    undefined
  );
  const [isAL, setIsAL] = useState(false);
  const [isSL, setIsSL] = useState(false);
  const [excludeHoliday, setExcludeHoliday] = useState(false);
  const [excludeWeekend, setExcludeWeekend] = useState(false);
  const [applyNotLaterThanDays, setApplyNotLaterThanDays] = useState(false);
  const [validationMandatory, setValidationMandatory] = useState(false);
  const [leaveByOvertime, setLeaveByOvertime] = useState(false);
  const [carryforward, setCarryforward] = useState(false);
  const [specificGender, setSpecificGender] = useState<string>("");
  const [workflowId, setWorkflowId] = useState<number | undefined>(undefined);
  const [workflowTypes, setWorkflowTypes] = useState<WorkflowType[]>([]);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setCode(initialData.leave_type_code || "");
      setNameEn(initialData.leave_type_eng || "");
      setNameAr(initialData.leave_type_arb || "");
      setStatus(
        typeof initialData.status_Flag === "boolean"
          ? initialData.status_Flag
          : true
      );
      setNeedApproval(initialData.need_approval_flag || false);
      setOfficial(initialData.official_flag || false);
      setAllowAttachment(initialData.allow_attachment_flag || false);
      setMandatoryJustification(
        initialData.mandatory_justification_flag || false
      );
      setTotalEntitledDays(initialData.total_entitled_days ?? undefined);
      setFullPayDays(initialData.full_pay_days ?? undefined);
      setHalfPayDays(initialData.half_pay_days ?? undefined);
      setUnpaidDays(initialData.unpaid_days ?? undefined);
      setApplyPriorToDays(initialData.apply_prior_to_days ?? undefined);
      setIsAL(initialData.is_AL_flag || false);
      setIsSL(initialData.is_SL_flag || false);
      setExcludeHoliday(initialData.exclude_holiday_flag || false);
      setExcludeWeekend(initialData.exclude_weekend_flag || false);
      setApplyNotLaterThanDays(
        initialData.apply_not_laterthandays_flag || false
      );
      setValidationMandatory(initialData.validation_mandatory_flag || false);
      setLeaveByOvertime(initialData.leave_by_overtime_flag || false);
      setCarryforward(initialData.carryforward_flag || false);
      setSpecificGender(
        initialData.specific_gender ? initialData.specific_gender : "ALL"
      );
      setWorkflowId(initialData.workflow_Id ?? undefined);
    } else {
      setCode("");
      setNameEn("");
      setNameAr("");
      setStatus(true);
      setNeedApproval(false);
      setOfficial(false);
      setAllowAttachment(false);
      setMandatoryJustification(false);
      setTotalEntitledDays(undefined);
      setFullPayDays(undefined);
      setHalfPayDays(undefined);
      setUnpaidDays(undefined);
      setApplyPriorToDays(undefined);
      setIsAL(false);
      setIsSL(false);
      setExcludeHoliday(false);
      setExcludeWeekend(false);
      setApplyNotLaterThanDays(false);
      setValidationMandatory(false);
      setLeaveByOvertime(false);
      setCarryforward(false);
      setSpecificGender("");
      setWorkflowId(undefined);
    }
  }, [initialData, open]);

  useEffect(() => {
    const fetchWorkflowTypes = async () => {
      setWorkflowLoading(true);
      setWorkflowError(null);
      try {
        const res = await workflowTypeApi.dropdown();
        setWorkflowTypes(res?.data?.data || []);
      } catch (err: any) {
        setWorkflowError(err?.message || "Failed to load workflows");
      } finally {
        setWorkflowLoading(false);
      }
    };

    if (open) fetchWorkflowTypes();
  }, [open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    const payload: LeaveTypePayload = {
      leave_type_code: String(code).trim(),
      leave_type_eng: String(nameEn).trim() || undefined,
      leave_type_arb: String(nameAr).trim() || undefined,
      status_Flag: !!status,
      need_approval_flag: needApproval,
      official_flag: official,
      allow_attachment_flag: allowAttachment,
      mandatory_justification_flag: mandatoryJustification,
      total_entitled_days:
        typeof totalEntitledDays === "number" &&
        !Number.isNaN(totalEntitledDays)
          ? totalEntitledDays
          : undefined,
      full_pay_days:
        typeof fullPayDays === "number" && !Number.isNaN(fullPayDays)
          ? fullPayDays
          : undefined,
      half_pay_days:
        typeof halfPayDays === "number" && !Number.isNaN(halfPayDays)
          ? halfPayDays
          : undefined,
      unpaid_days:
        typeof unpaidDays === "number" && !Number.isNaN(unpaidDays)
          ? unpaidDays
          : undefined,
      apply_prior_to_days:
        typeof applyPriorToDays === "number" && !Number.isNaN(applyPriorToDays)
          ? applyPriorToDays
          : undefined,
      is_AL_flag: isAL,
      is_SL_flag: isSL,
      exclude_holiday_flag: excludeHoliday,
      exclude_weekend_flag: excludeWeekend,
      apply_not_laterthandays_flag: applyNotLaterThanDays,
      validation_mandatory_flag: validationMandatory,
      leave_by_overtime_flag: leaveByOvertime,
      carryforward_flag: carryforward,
      specific_gender: specificGender === "ALL" ? undefined : specificGender,
      workflow_Id:
        typeof workflowId === "number" && !Number.isNaN(workflowId)
          ? workflowId
          : undefined,
    };

    try {
      if (initialData && initialData.leave_type_id) {
        await leaveTypeApi.update(initialData.leave_type_id, payload as any);
      } else {
        await leaveTypeApi.create(payload as any);
      }
      onSuccess();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save leave type"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl w-full p-0 bg-background rounded-xl shadow-2xl border border-border text-foreground flex flex-col items-center justify-center max-h-[90vh]">
        <div className="w-full p-2 sm:p-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">
              {initialData
                ? t("leaveManagement.leaveTypes.actions.edit") ||
                  "Edit Leave Type"
                : t("leaveManagement.leaveTypes.actions.add") ||
                  "Add Leave Type"}
            </DialogTitle>
          </div>
          <ScrollArea className="max-h-[70vh] sm:max-h-[75vh] overflow-y-auto w-full">
            <form onSubmit={handleSubmit} className="px-2 sm:px-4">
              <div className="space-y-4 sm:space-y-6">
                <div className="border-b pb-2 mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-primary">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm break-words">
                      {t("leaveManagement.leaveTypes.fields.code") || "Code"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={code}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCode(e.target.value)
                      }
                      placeholder="e.g., AL, SL, ML"
                      required
                      className="h-9 sm:h-10 text-sm"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm break-words">
                      {t("leaveManagement.leaveTypes.fields.status") ||
                        "Status"}
                    </label>
                    <Select
                      value={String(status)}
                      onValueChange={(v: string) => setStatus(v === "true")}
                    >
                      <SelectTrigger className="h-9 sm:h-10">
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

                  <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm break-words">
                      {t("leaveManagement.leaveTypes.fields.workflowId") ||
                        "Workflow"}
                    </label>
                    <Select
                      value={workflowId ? String(workflowId) : "none"}
                      onValueChange={(v: string) =>
                        setWorkflowId(
                          v && v !== "-1" && v !== "none" ? Number(v) : undefined
                        )
                      }
                    >
                      <SelectTrigger className="h-9 sm:h-10">
                        <SelectValue
                          placeholder={
                            workflowLoading
                              ? "Loading..."
                              : t("common.select") || "Select"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {workflowLoading && (
                          <SelectItem value="-1">Loading...</SelectItem>
                        )}
                        {!workflowLoading && workflowTypes.length === 0 && (
                          <SelectItem value="-1">No workflows</SelectItem>
                        )}
                        {workflowTypes.map((wf) => (
                          <SelectItem
                            key={wf.workflow_id}
                            value={String(wf.workflow_id)}
                          >
                            {wf.workflow_name_eng ||
                              wf.workflow_name_arb ||
                              wf.workflow_code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {workflowError && (
                      <div className="text-xs text-destructive mt-1">
                        {workflowError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm break-words">
                      {t("leaveManagement.leaveTypes.fields.nameEng") ||
                        "Name (English)"}
                    </label>
                    <Input
                      value={nameEn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNameEn(e.target.value)
                      }
                      placeholder="Leave type name in English"
                      className="h-9 sm:h-10 text-sm"
                    />
                  </div>

                  {!isEnglish && (
                    <div className="min-w-0">
                      <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm break-words">
                        {t("leaveManagement.leaveTypes.fields.nameArb") ||
                          "Name (Arabic)"}
                      </label>
                      <Input
                        value={nameAr}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNameAr(e.target.value)
                        }
                        placeholder="Leave type name in Arabic"
                        className="h-9 sm:h-10 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Leave Configuration Section */}
              <div className="space-y-4">
                <div className="border-b pb-2 mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-primary">
                    Leave Configuration
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                      {t(
                        "leaveManagement.leaveTypes.fields.totalEntitledDays"
                      ) || "Total Days"}
                    </label>
                    <Input
                      type="number"
                      value={
                        typeof totalEntitledDays === "number"
                          ? String(totalEntitledDays)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTotalEntitledDays(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="30"
                      className="h-9 sm:h-10 text-sm"
                      min="0"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                      {t("leaveManagement.leaveTypes.fields.fullPayDays") ||
                        "Full Pay"}
                    </label>
                    <Input
                      type="number"
                      value={
                        typeof fullPayDays === "number"
                          ? String(fullPayDays)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFullPayDays(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="30"
                      className="h-9 sm:h-10 text-sm"
                      min="0"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                      {t("leaveManagement.leaveTypes.fields.halfPayDays") ||
                        "Half Pay"}
                    </label>
                    <Input
                      type="number"
                      value={
                        typeof halfPayDays === "number"
                          ? String(halfPayDays)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setHalfPayDays(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="0"
                      className="h-9 sm:h-10 text-sm"
                      min="0"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                      {t("leaveManagement.leaveTypes.fields.unpaidDays") ||
                        "Unpaid"}
                    </label>
                    <Input
                      type="number"
                      value={
                        typeof unpaidDays === "number" ? String(unpaidDays) : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUnpaidDays(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="0"
                      className="h-9 sm:h-10 text-sm"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                      {t(
                        "leaveManagement.leaveTypes.fields.applyPriorToDays"
                      ) || "Apply Prior To Days"}
                    </label>
                    <Input
                      type="number"
                      value={
                        typeof applyPriorToDays === "number"
                          ? String(applyPriorToDays)
                          : ""
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setApplyPriorToDays(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      placeholder="7"
                      className="h-9 sm:h-10 text-sm"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                      {t("leaveManagement.leaveTypes.fields.specificGender") ||
                        "Gender Restriction"}
                    </label>
                    <Select
                      value={specificGender || "ALL"}
                      onValueChange={(value) =>
                        setSpecificGender(value === "ALL" ? "" : value)
                      }
                    >
                      <SelectTrigger className="h-9 sm:h-10">
                        <SelectValue placeholder="Select gender restriction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Approval & Processing Section */}
              <div className="space-y-4">
                <div className="border-b pb-2 mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-primary">
                    Approval & Processing
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="needApproval"
                      checked={needApproval}
                      onCheckedChange={(checked) =>
                        setNeedApproval(checked === true)
                      }
                    />
                    <label
                      htmlFor="needApproval"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.needApproval") ||
                        "Needs Approval"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="official"
                      checked={official}
                      onCheckedChange={(checked) =>
                        setOfficial(checked === true)
                      }
                    />
                    <label
                      htmlFor="official"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.official") ||
                        "Official Leave"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="allowAttachment"
                      checked={allowAttachment}
                      onCheckedChange={(checked) =>
                        setAllowAttachment(checked === true)
                      }
                    />
                    <label
                      htmlFor="allowAttachment"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.allowAttachment") ||
                        "Allow Attachments"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="mandatoryJustification"
                      checked={mandatoryJustification}
                      onCheckedChange={(checked) =>
                        setMandatoryJustification(checked === true)
                      }
                    />
                    <label
                      htmlFor="mandatoryJustification"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t(
                        "leaveManagement.leaveTypes.fields.mandatoryJustification"
                      ) || "Mandatory Justification"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Special Flags Section */}
              <div className="space-y-4">
                <div className="border-b pb-2 mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-primary">
                    Special Flags
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="isAL"
                      checked={isAL}
                      onCheckedChange={(checked) => setIsAL(checked === true)}
                    />
                    <label
                      htmlFor="isAL"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.isAL") ||
                        "Annual Leave"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="isSL"
                      checked={isSL}
                      onCheckedChange={(checked) => setIsSL(checked === true)}
                    />
                    <label
                      htmlFor="isSL"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.isSL") ||
                        "Sick Leave"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="excludeHoliday"
                      checked={excludeHoliday}
                      onCheckedChange={(checked) =>
                        setExcludeHoliday(checked === true)
                      }
                    />
                    <label
                      htmlFor="excludeHoliday"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.excludeHoliday") ||
                        "Exclude Holidays"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="excludeWeekend"
                      checked={excludeWeekend}
                      onCheckedChange={(checked) =>
                        setExcludeWeekend(checked === true)
                      }
                    />
                    <label
                      htmlFor="excludeWeekend"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.excludeWeekend") ||
                        "Exclude Weekends"}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg transition-colors">
                    <Checkbox
                      id="carryforward"
                      checked={carryforward}
                      onCheckedChange={(checked) =>
                        setCarryforward(checked === true)
                      }
                    />
                    <label
                      htmlFor="carryforward"
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-normal break-words leading-tight"
                    >
                      {t("leaveManagement.leaveTypes.fields.carryforward") ||
                        "Carry Forward"}
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 h-9 sm:h-10 text-sm"
                >
                  {t("common.cancel") || "Cancel"}
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 h-9 sm:h-10 text-sm">
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

export default LeaveTypeModal;
