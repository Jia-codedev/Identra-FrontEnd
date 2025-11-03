import React from "react";
import { Input } from "@/components/ui/Input";;
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { EmployeeStepProps } from "./types";

export const EmployeePersonalStep: React.FC<EmployeeStepProps> = ({
  formData,
  errors,
  onInputChange,
  nationalities,
  countries,
  isLoadingData,
  t,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="citizenship_id" className="text-sm font-medium">
            {t("employeeMaster.employee.nationality")} *
          </Label>
          <Select
            value={formData.citizenship_id ? formData.citizenship_id.toString() : ""}
            onValueChange={(value) => onInputChange("citizenship_id", value ? parseInt(value) : null)}
            disabled={isLoadingData}
          >
            <SelectTrigger className={`w-full mt-1 ${errors.citizenship_id ? "border-red-500" : ""}`}>
              <SelectValue
                placeholder={
                  isLoadingData
                    ? t("common.loading")
                    : t("employeeMaster.employee.selectNationality")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.citizenship_id && (
            <p className="text-red-500 text-xs mt-1">{errors.citizenship_id}</p>
          )}
        </div>
        <div>
          <Label htmlFor="national_id" className="text-sm font-medium">
            {t("employeeMaster.employee.nationalId")}
          </Label>
          <Input
            id="national_id"
            value={formData.national_id}
            onChange={(e) => onInputChange("national_id", e.target.value)}
            placeholder={t("employeeMaster.employee.enterNationalId")}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="national_id_expiry_date" className="text-sm font-medium">
            {t("employeeMaster.employee.nationalIdExpiryDate")}
          </Label>
          <DatePicker
            selected={formData.national_id_expiry_date || undefined}
            onSelect={(date) => onInputChange("national_id_expiry_date", date)}
            placeholder={t("employeeMaster.employee.selectExpiryDate")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="passport_number" className="text-sm font-medium">
            {t("employeeMaster.employee.passportNumber")}
          </Label>
          <Input
            id="passport_number"
            value={formData.passport_number}
            onChange={(e) => onInputChange("passport_number", e.target.value)}
            placeholder={t("employeeMaster.employee.enterPassportNumber")}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="passport_expiry_date" className="text-sm font-medium">
            {t("employeeMaster.employee.passportExpiryDate")}
          </Label>
          <DatePicker
            selected={formData.passport_expiry_date || undefined}
            onSelect={(date) => onInputChange("passport_expiry_date", date)}
            placeholder={t("employeeMaster.employee.selectExpiryDate")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="passport_issue_country_id" className="text-sm font-medium">
            {t("employeeMaster.employee.passportIssueCountry")}
          </Label>
          <Select
            value={formData.passport_issue_country_id ? formData.passport_issue_country_id.toString() : ""}
            onValueChange={(value) => onInputChange("passport_issue_country_id", value ? parseInt(value) : null)}
            disabled={isLoadingData}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue
                placeholder={
                  isLoadingData
                    ? t("common.loading")
                    : t("employeeMaster.employee.selectCountry")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {countries.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mobile" className="text-sm font-medium">
            {t("employeeMaster.employee.mobile")}
          </Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => onInputChange("mobile", e.target.value)}
            placeholder={t("employeeMaster.employee.enterMobile")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            {t("employeeMaster.employee.email")}
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            placeholder={t("employeeMaster.employee.enterEmail")}
            className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};
