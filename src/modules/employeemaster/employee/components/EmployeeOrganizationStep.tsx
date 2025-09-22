import React, { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { EmployeeStepProps } from "./types";
import employeeApi from "@/services/employeemaster/employee";

export const EmployeeOrganizationStep: React.FC<EmployeeStepProps> = ({
  formData,
  errors,
  onInputChange,
  organizations,
  designations,
  employeeTypes,
  grades,
  locations,
  isLoadingData,
  t,
}) => {
  const [managers, setManagers] = useState<{ label: string; value: number }[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [managerSearchTerm, setManagerSearchTerm] = useState("");

  const loadManagers = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setManagers([]);
      return;
    }

    setIsLoadingManagers(true);
    
    try {
      const response = await employeeApi.getEmployees({
        offset: 1,
        limit: 20,
        search: searchTerm,
        manager_flag: true
      });
      
      if (response.data?.success && response.data.data && Array.isArray(response.data.data)) {
        const managerList = response.data.data.map((manager: any) => ({
          label: `${manager.firstname_eng} ${manager.lastname_eng} (${manager.emp_no})`,
          value: manager.employee_id,
        }));
        
        setManagers(managerList);
      } else {
        setManagers([]);
      }
    } catch (error) {
      console.error("Error loading managers:", error);
      setManagers([]);
    } finally {
      setIsLoadingManagers(false);
    }
  }, []);

  useEffect(() => {
    if (formData.manager_id && managers.length === 0) {
      const loadCurrentManager = async () => {
        try {
          const response = await employeeApi.getEmployeeById(formData.manager_id!);
          if (response.data?.success && response.data.data) {
            const manager = response.data.data;
            setManagers([{
              label: `${manager.firstname_eng} ${manager.lastname_eng} (${manager.emp_no})`,
              value: manager.employee_id,
            }]);
          }
        } catch (error) {
          console.error("Error loading current manager:", error);
        }
      };
      loadCurrentManager();
    }
  }, [formData.manager_id, managers.length]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadManagers(managerSearchTerm);
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [managerSearchTerm, loadManagers]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="organization_id" className="text-sm font-medium">
            {t("employeeMaster.employee.organization")} *
          </Label>
          <Select
            value={formData.organization_id ? formData.organization_id.toString() : ""}
            onValueChange={(value) => onInputChange("organization_id", value ? parseInt(value) : null)}
            disabled={isLoadingData}
          >
            <SelectTrigger className={`w-full mt-1 ${errors.organization_id ? "border-red-500" : ""}`}>
              <SelectValue
                placeholder={
                  isLoadingData
                    ? t("common.loading")
                    : t("employeeMaster.employee.selectOrganization")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organization_id && (
            <p className="text-red-500 text-xs mt-1">{errors.organization_id}</p>
          )}
        </div>
        <div>
          <Label htmlFor="designation_id" className="text-sm font-medium">
            {t("employeeMaster.employee.designation")} *
          </Label>
          <Select
            value={formData.designation_id ? formData.designation_id.toString() : ""}
            onValueChange={(value) => onInputChange("designation_id", value ? parseInt(value) : null)}
            disabled={isLoadingData}
          >
            <SelectTrigger className={`w-full mt-1 ${errors.designation_id ? "border-red-500" : ""}`}>
              <SelectValue
                placeholder={
                  isLoadingData
                    ? t("common.loading")
                    : t("employeeMaster.employee.selectDesignation")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {designations.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.designation_id && (
            <p className="text-red-500 text-xs mt-1">{errors.designation_id}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employee_type_id" className="text-sm font-medium">
            {t("employeeMaster.employee.employeeType")} *
          </Label>
          <Select
            value={formData.employee_type_id ? formData.employee_type_id.toString() : ""}
            onValueChange={(value) => onInputChange("employee_type_id", value ? parseInt(value) : null)}
            disabled={isLoadingData}
          >
            <SelectTrigger className={`w-full mt-1 ${errors.employee_type_id ? "border-red-500" : ""}`}>
              <SelectValue
                placeholder={
                  isLoadingData
                    ? t("common.loading")
                    : t("employeeMaster.employee.selectEmployeeType")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {employeeTypes.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employee_type_id && (
            <p className="text-red-500 text-xs mt-1">{errors.employee_type_id}</p>
          )}
        </div>
        <div>
          <Label htmlFor="grade_id" className="text-sm font-medium">
            {t("employeeMaster.employee.grade")}
          </Label>
          <Select
            value={formData.grade_id ? formData.grade_id.toString() : ""}
            onValueChange={(value) => onInputChange("grade_id", value ? parseInt(value) : null)}
            disabled={isLoadingData}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue
                placeholder={
                  isLoadingData
                    ? t("common.loading")
                    : t("employeeMaster.employee.selectGrade")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {grades.map((option) => (
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
          <Label htmlFor="location_id" className="text-sm font-medium">
            {t("employeeMaster.employee.location")}
          </Label>
          <Select
            value={formData.location_id ? formData.location_id.toString() : ""}
            onValueChange={(value) => onInputChange("location_id", value ? parseInt(value) : null)}
            disabled={isLoadingData}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue
                placeholder={
                  isLoadingData
                    ? t("common.loading")
                    : t("employeeMaster.employee.selectLocation")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {locations.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="manager_id" className="text-sm font-medium">
            {t("employeeMaster.employee.manager")}
          </Label>
          <Combobox
            options={managers}
            value={formData.manager_id}
            onValueChange={(value) => onInputChange("manager_id", value ? parseInt(value.toString()) : null)}
            onSearch={(query) => setManagerSearchTerm(query)}
            placeholder={
              isLoadingData
                ? t("common.loading")
                : t("employeeMaster.employee.selectManager")
            }
            disabled={isLoadingData}
            isLoading={isLoadingManagers}
            disableLocalFiltering={true}
            className="mt-1"
            emptyMessage={t("employeeMaster.employee.noManagersFound")}
          />
        </div>
      </div>
    </div>
  );
};
