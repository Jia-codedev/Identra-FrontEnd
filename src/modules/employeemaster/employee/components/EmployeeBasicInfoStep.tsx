import React from "react";
import { Input } from "@/components/ui/Input";;
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeStepProps } from "./types";

export const EmployeeBasicInfoStep: React.FC<EmployeeStepProps> = ({
  formData,
  errors,
  onInputChange,
  isRTL,
  t,
}) => {
  return (
    <div className="space-y-6">
      {/* Employee Identification */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          {t("employeeMaster.employee.employeeIdentification")}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emp_no" className="text-sm font-medium">
              {t("employeeMaster.employee.empNo")} *
            </Label>
            <Input
              id="emp_no"
              value={formData.emp_no}
              onChange={(e) => onInputChange("emp_no", e.target.value)}
              placeholder={t("employeeMaster.employee.enterEmpNo")}
              className={`mt-1 ${errors.emp_no ? "border-red-500" : ""}`}
            />
            {errors.emp_no && (
              <p className="text-red-500 text-xs mt-1">{errors.emp_no}</p>
            )}
          </div>
          <div>
            <Label htmlFor="card_number" className="text-sm font-medium">
              {t("employeeMaster.employee.cardNumber")}
            </Label>
            <Input
              id="card_number"
              value={formData.card_number}
              onChange={(e) => onInputChange("card_number", e.target.value)}
              placeholder={t("employeeMaster.employee.enterCardNumber")}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Employee Names */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          {t("employeeMaster.employee.employeeNames")}
        </h4>
        {isRTL ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname_arb" className="text-sm font-medium">
                {t("employeeMaster.employee.firstNameArb")} *
              </Label>
              <Input
                id="firstname_arb"
                value={formData.firstname_arb}
                onChange={(e) => onInputChange("firstname_arb", e.target.value)}
                placeholder={t("employeeMaster.employee.enterFirstNameArb")}
                className={`mt-1 ${errors.firstname_arb ? "border-red-500" : ""}`}
                dir="rtl"
              />
              {errors.firstname_arb && (
                <p className="text-red-500 text-xs mt-1">{errors.firstname_arb}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastname_arb" className="text-sm font-medium">
                {t("employeeMaster.employee.lastNameArb")} *
              </Label>
              <Input
                id="lastname_arb"
                value={formData.lastname_arb}
                onChange={(e) => onInputChange("lastname_arb", e.target.value)}
                placeholder={t("employeeMaster.employee.enterLastNameArb")}
                className={`mt-1 ${errors.lastname_arb ? "border-red-500" : ""}`}
                dir="rtl"
              />
              {errors.lastname_arb && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname_arb}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname_eng" className="text-sm font-medium">
                {t("employeeMaster.employee.firstNameEng")} *
              </Label>
              <Input
                id="firstname_eng"
                value={formData.firstname_eng}
                onChange={(e) => onInputChange("firstname_eng", e.target.value)}
                placeholder={t("employeeMaster.employee.enterFirstNameEng")}
                className={`mt-1 ${errors.firstname_eng ? "border-red-500" : ""}`}
              />
              {errors.firstname_eng && (
                <p className="text-red-500 text-xs mt-1">{errors.firstname_eng}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastname_eng" className="text-sm font-medium">
                {t("employeeMaster.employee.lastNameEng")} *
              </Label>
              <Input
                id="lastname_eng"
                value={formData.lastname_eng}
                onChange={(e) => onInputChange("lastname_eng", e.target.value)}
                placeholder={t("employeeMaster.employee.enterLastNameEng")}
                className={`mt-1 ${errors.lastname_eng ? "border-red-500" : ""}`}
              />
              {errors.lastname_eng && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname_eng}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          {t("employeeMaster.employee.additionalInformation")}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pin" className="text-sm font-medium">
              {t("employeeMaster.employee.pin")}
            </Label>
            <Input
              id="pin"
              value={formData.pin}
              onChange={(e) => onInputChange("pin", e.target.value)}
              placeholder={t("employeeMaster.employee.enterPin")}
              className="mt-1"
              type="password"
            />
          </div>
          <div>
            <Label htmlFor="gender" className="text-sm font-medium">
              {t("employeeMaster.employee.gender")}
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => onInputChange("gender", value)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue
                  placeholder={t("employeeMaster.employee.selectGender")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">
                  {t("employeeMaster.employee.male")}
                </SelectItem>
                <SelectItem value="F">
                  {t("employeeMaster.employee.female")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
