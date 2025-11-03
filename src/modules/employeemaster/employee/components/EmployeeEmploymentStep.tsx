import React from "react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/Textarea";
import { EmployeeStepProps } from "./types";

export const EmployeeEmploymentStep: React.FC<EmployeeStepProps> = ({
  formData,
  errors,
  onInputChange,
  t,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="join_date" className="text-sm font-medium">
            {t("employeeMaster.employee.joinDate")} *
          </Label>
          <DatePicker
            selected={formData.join_date || undefined}
            onSelect={(date) => onInputChange("join_date", date)}
            placeholder={t("employeeMaster.employee.selectJoinDate")}
            className={`mt-1 ${errors.join_date ? "border-red-500" : ""}`}
          />
          {errors.join_date && (
            <p className="text-red-500 text-xs mt-1">{errors.join_date}</p>
          )}
        </div>
        <div>
          <Label htmlFor="active_date" className="text-sm font-medium">
            {t("employeeMaster.employee.activeDate")}
          </Label>
          <DatePicker
            selected={formData.active_date || undefined}
            onSelect={(date) => onInputChange("active_date", date)}
            placeholder={t("employeeMaster.employee.selectActiveDate")}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="inactive_date" className="text-sm font-medium">
            {t("employeeMaster.employee.inactiveDate")}
          </Label>
          <DatePicker
            selected={formData.inactive_date || undefined}
            onSelect={(date) => onInputChange("inactive_date", date)}
            placeholder={t("employeeMaster.employee.selectInactiveDate")}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="remarks" className="text-sm font-medium">
          {t("employeeMaster.employee.remarks")}
        </Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => onInputChange("remarks", e.target.value)}
          placeholder={t("employeeMaster.employee.enterRemarks")}
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );
};
