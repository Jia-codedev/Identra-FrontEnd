"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/Checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { IEmployeeGroup } from "../types";
import EmployeeCombobox from "@/components/ui/employee-combobox";
interface EmployeeGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: IEmployeeGroup & {
      schedule?: boolean;
      reportingGroup?: boolean;
      from_date?: string;
      to_date?: string;
      reporting_person?: string;
    }
  ) => void;
  employeeGroup?: IEmployeeGroup | null;
  mode: "add" | "edit";
}

export const EmployeeGroupModal: React.FC<EmployeeGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeGroup,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    employee_group_id: undefined as number | undefined,
    group_code: "",
    group_name_eng: "",
    group_name_arb: "",
    schedule_flag: false,
    reporting_group_flag: false,
    group_start_date: "",
    group_end_date: "",
    reporting_person_id: "",
  });

  // We use EmployeeCombobox for reporting person searching and selection.
  useEffect(() => {
    if (employeeGroup && mode === "edit") {
      setFormData({
        employee_group_id: employeeGroup.employee_group_id || undefined,
        group_code: employeeGroup.group_code || "",
        group_name_eng: employeeGroup.group_name_eng || "",
        group_name_arb: employeeGroup.group_name_arb || "",
        schedule_flag: (employeeGroup as any).schedule_flag || false,
        reporting_group_flag:
          (employeeGroup as any).reporting_group_flag || false,
        group_start_date: (employeeGroup as any).group_start_date
          ? typeof (employeeGroup as any).group_start_date === "string"
            ? (employeeGroup as any).group_start_date
            : (employeeGroup as any).group_start_date
                .toISOString()
                .split("T")[0]
          : "",
        group_end_date: (employeeGroup as any).group_end_date
          ? typeof (employeeGroup as any).group_end_date === "string"
            ? (employeeGroup as any).group_end_date
            : (employeeGroup as any).group_end_date.toISOString().split("T")[0]
          : "",
        reporting_person_id: (employeeGroup as any).reporting_person_id
          ? String((employeeGroup as any).reporting_person_id)
          : "",
      });
    }
  }, [employeeGroup, mode, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // handleClearEmployee only clears the selected reporting_person_id
  const handleClearEmployee = () => {
    setFormData((prev) => ({ ...prev, reporting_person_id: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData: IEmployeeGroup = {
      employee_group_id: formData.employee_group_id,
      group_code: formData.group_code,
      group_name_eng: formData.group_name_eng,
      group_name_arb: formData.group_name_arb,
      schedule_flag: formData.schedule_flag,
      reporting_group_flag: formData.reporting_group_flag,
      group_start_date: formData.group_start_date
        ? new Date(formData.group_start_date)
        : undefined,
      group_end_date: formData.group_end_date
        ? new Date(formData.group_end_date)
        : undefined,
      reporting_person_id: formData.reporting_person_id
        ? Number(formData.reporting_person_id)
        : undefined,
    };

    onSave(submissionData as any);
    setFormData({
      employee_group_id: undefined,
      group_code: "",
      group_name_eng: "",
      group_name_arb: "",
      schedule_flag: false,
      reporting_group_flag: false,
      group_start_date: "",
      group_end_date: "",
      reporting_person_id: "",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-background rounded-lg shadow-lg w-full max-w-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === "add"
                ? t("employeeMaster.employeeGroups.addEmployeeGroup")
                : t("employeeMaster.employeeGroups.editEmployeeGroup")}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Code & Name */}

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <Checkbox
                  checked={formData.schedule_flag}
                  onCheckedChange={(val) =>
                    handleChange("schedule_flag", !!val)
                  }
                />
                <span> {t("employeeMaster.employeeGroups.schedule")} *</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <Checkbox
                  checked={formData.reporting_group_flag}
                  onCheckedChange={(val) =>
                    handleChange("reporting_group_flag", !!val)
                  }
                />
                <span>
                  {t("employeeMaster.employeeGroups.reportingGroup")} *
                </span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">
                  {t("employeeMaster.employeeGroups.employeeGroupCode")} *
                </Label>
                <Input
                  value={formData.group_code}
                  onChange={(e) =>
                    handleChange("group_code", e.target.value.toUpperCase())
                  }
                  placeholder={t(
                    "employeeMaster.employeeGroups.enterEmployeeGroupCode"
                  )}
                  required
                />
              </div>
              {isRTL ? (
                <div>
                  <Label className="mb-2">
                    {t("employeeMaster.employeeGroups.employeeGroupName")} *
                  </Label>
                  <Input
                    value={formData.group_name_arb}
                    onChange={(e) =>
                      handleChange("group_name_arb", e.target.value)
                    }
                    placeholder={t(
                      "employeeMaster.employeeGroups.enterEmployeeGroupName"
                    )}
                    required
                  />
                </div>
              ) : (
                <div>
                  <Label className="mb-2">
                    {t("employeeMaster.employeeGroups.employeeGroupName")} *
                  </Label>
                  <Input
                    value={formData.group_name_eng}
                    onChange={(e) =>
                      handleChange("group_name_eng", e.target.value)
                    }
                    placeholder={t(
                      "employeeMaster.employeeGroups.enterEmployeeGroupName"
                    )}
                    required
                  />
                </div>
              )}
            </div>

            {/* From Date / To Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">
                  {t("employeeMaster.employeeGroups.fromDate")} *
                </Label>
                <DatePicker
                  selected={
                    formData.group_start_date
                      ? new Date(formData.group_start_date)
                      : undefined
                  }
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      const localDate = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .split("T")[0];
                      handleChange("group_start_date", localDate);
                    } else {
                      handleChange("group_start_date", "");
                    }
                  }}
                  placeholder={t(
                    "employeeMaster.employeeGroups.selectFromDate"
                  )}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="mb-2">
                  {t("employeeMaster.employeeGroups.toDate")} *
                </Label>
                <DatePicker
                  selected={
                    formData.group_end_date
                      ? new Date(formData.group_end_date)
                      : undefined
                  }
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      const localDate = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .split("T")[0];
                      handleChange("group_end_date", localDate);
                    } else {
                      handleChange("group_end_date", "");
                    }
                  }}
                  placeholder={t("employeeMaster.employeeGroups.selectToDate")}
                  className="w-full"
                />
              </div>
            </div>

            {/* Reporting Person */}
            {formData.reporting_group_flag && (
              <div>
                <Label className="mb-2">
                  {t("employeeMaster.employeeGroups.reportingPerson")} *
                </Label>
                <div>
                  <EmployeeCombobox
                    value={
                      formData.reporting_person_id
                        ? Number(formData.reporting_person_id)
                        : null
                    }
                    onChange={(val: number | null) => {
                      handleChange(
                        "reporting_person_id",
                        val ? String(val) : ""
                      );
                    }}
                    placeholder={t(
                      "employeeMaster.employeeGroups.searchReportingPerson"
                    )}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" className="flex-1">
                {t("common.save")}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
