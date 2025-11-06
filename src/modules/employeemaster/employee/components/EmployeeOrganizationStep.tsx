import React, { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { EmployeeStepProps } from "./types";
import employeeApi from "@/services/employeemaster/employee";
import employeeTypeApi from "@/services/employeemaster/employeeType";
import designationsApi from "@/services/masterdata/designation";
import locationsApi from "@/services/masterdata/locations";
import gradesApi from "@/services/masterdata/grades";

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
  // Internal helpers and types
  type Option = { label: string; value: number };

  const mapToOptions = (data: any[], labelField = "name", valueField = "id") =>
    data.map(
      (item: any) =>
        ({
          label: item[labelField] || item.name,
          value: item[valueField],
        } as Option)
    );

  const useDebouncedEffect = (fn: () => void, deps: any[], delay = 300) => {
    useEffect(() => {
      const id = setTimeout(fn, delay);
      return () => clearTimeout(id);
    }, deps);
  };

  // Component state (grouped)
  const [managers, setManagers] = useState<Option[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [managerSearchTerm, setManagerSearchTerm] = useState("");
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState<Option[]>([]);
  const [isLoadingEmployeeTypes, setIsLoadingEmployeeTypes] = useState(false);
  const [employeeTypeSearchTerm, setEmployeeTypeSearchTerm] = useState("");
  const [designationOptions, setDesignationOptions] = useState<Option[]>([]);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(false);
  const [designationSearchTerm, setDesignationSearchTerm] = useState("");
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  // Grades: fallback + server search
  const [localGrades, setLocalGrades] = useState<Option[]>([]);
  const [isLoadingLocalGrades, setIsLoadingLocalGrades] = useState(false);
  const [gradeOptions, setGradeOptions] = useState<Option[]>([]);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [gradeSearchTerm, setGradeSearchTerm] = useState("");

  const loadManagers = useCallback(
    async (searchTerm: string) => {
      setIsLoadingManagers(true);

      try {
        let managerList: { label: string; value: number }[] = [];

        const shouldFetchDefault =
          !searchTerm || searchTerm.trim().length === 0;
        const shouldFetchBySearch = searchTerm.trim().length >= 2;

        if (shouldFetchDefault || shouldFetchBySearch) {
          const response = await employeeApi.getEmployees({
            offset: 1,
            limit: 20,
            search: shouldFetchBySearch ? searchTerm : undefined,
            manager_flag: true,
          });

          if (
            response.data?.success &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            managerList = response.data.data.map((manager: any) => ({
              label: `${manager.firstname_eng} ${manager.lastname_eng} (${manager.emp_no})`,
              value: manager.employee_id,
            }));
          }
        }

        // If there's a selected manager and it's not in the list, add it
        if (formData.manager_id) {
          const hasSelectedManager = managerList.some(
            (m) => m.value === formData.manager_id
          );
          if (!hasSelectedManager) {
            try {
              const response = await employeeApi.getEmployeeById(
                formData.manager_id
              );
              if (response.data?.success && response.data.data) {
                const manager = response.data.data;
                managerList.unshift({
                  label: `${manager.firstname_eng} ${manager.lastname_eng} (${manager.emp_no})`,
                  value: manager.employee_id,
                });
              }
            } catch (error) {
              console.error("Error loading selected manager:", error);
            }
          }
        }

        setManagers(managerList);
      } catch (error) {
        console.error("Error loading managers:", error);
        setManagers([]);
      } finally {
        setIsLoadingManagers(false);
      }
    },
    [formData.manager_id]
  );

  // Initial load: fetch a default manager list so the dropdown isn't empty on first open
  useEffect(() => {
    loadManagers("");
  }, [loadManagers]);

  // Async loader for Employee Types
  const loadEmployeeTypes = useCallback(async (searchTerm: string) => {
    setIsLoadingEmployeeTypes(true);
    try {
      const response = await employeeTypeApi.getEmployeeTypes({
        offset: 1,
        limit: 20,
        search: searchTerm,
      });
      if (response.data?.success && Array.isArray(response.data.data)) {
        setEmployeeTypeOptions(
          response.data.data.map((item: any) => ({
            label: item.employee_type_eng || item.name,
            value: item.employee_type_id,
          }))
        );
      } else {
        setEmployeeTypeOptions([]);
      }
    } catch (error) {
      setEmployeeTypeOptions([]);
    } finally {
      setIsLoadingEmployeeTypes(false);
    }
  }, []);

  // Async loader for Designations
  const loadDesignations = useCallback(async (searchTerm: string) => {
    setIsLoadingDesignations(true);
    try {
      const response = await designationsApi.getDesignations({
        offset: 1,
        limit: 20,
        search: searchTerm,
      });
      if (response.data?.success && Array.isArray(response.data.data)) {
        setDesignationOptions(
          response.data.data.map((item: any) => ({
            label: item.designation_eng || item.name,
            value: item.designation_id,
          }))
        );
      } else {
        setDesignationOptions([]);
      }
    } catch (error) {
      setDesignationOptions([]);
    } finally {
      setIsLoadingDesignations(false);
    }
  }, []);

  // Async loader for Grades (searchable)
  const loadGrades = useCallback(async (searchTerm: string) => {
    setIsLoadingGrades(true);
    try {
      const response = await gradesApi.getGrades({
        offset: 1,
        limit: 20,
        search: searchTerm,
      });
      if (response.data?.success && Array.isArray(response.data.data)) {
        setGradeOptions(
          response.data.data.map((item: any) => ({
            label: item.grade_eng || item.name,
            value: item.grade_id,
          }))
        );
      } else {
        setGradeOptions([]);
      }
    } catch (error) {
      setGradeOptions([]);
    } finally {
      setIsLoadingGrades(false);
    }
  }, []);

  // Load current grade if editing
  useEffect(() => {
    if (formData.grade_id && gradeOptions.length === 0) {
      const loadCurrentGrade = async () => {
        try {
          const response = await gradesApi.getGradeById(formData.grade_id!);
          if (response.data?.success && response.data.data) {
            const item = response.data.data;
            setGradeOptions([
              { label: item.grade_eng || item.name, value: item.grade_id },
            ]);
          }
        } catch (error) {
          console.error("Error loading current grade:", error);
        }
      };
      loadCurrentGrade();
    }
  }, [formData.grade_id, gradeOptions.length]);

  const loadLocations = useCallback(async (searchTerm: string) => {
    setIsLoadingLocations(true);
    try {
      const response = await locationsApi.getLocations({
        offset: 1,
        limit: 20,
        name: searchTerm,
      });
      if (response.data?.success && Array.isArray(response.data.data)) {
        setLocationOptions(
          response.data.data.map((item: any) => ({
            label: item.location_eng || item.name,
            value: item.location_id,
          }))
        );
      } else {
        setLocationOptions([]);
      }
    } catch (error) {
      setLocationOptions([]);
    } finally {
      setIsLoadingLocations(false);
    }
  }, []);

  // Load current employee type if editing
  useEffect(() => {
    if (formData.employee_type_id && employeeTypeOptions.length === 0) {
      const loadCurrentEmployeeType = async () => {
        try {
          const response = await employeeTypeApi.getEmployeeTypeById(
            formData.employee_type_id!
          );
          if (response.data?.success && response.data.data) {
            const item = response.data.data;
            setEmployeeTypeOptions([
              {
                label: item.employee_type_eng || item.name,
                value: item.employee_type_id,
              },
            ]);
          }
        } catch (error) {
          console.error("Error loading current employee type:", error);
        }
      };
      loadCurrentEmployeeType();
    }
  }, [formData.employee_type_id, employeeTypeOptions.length]);

  // Load current designation if editing
  useEffect(() => {
    if (formData.designation_id && designationOptions.length === 0) {
      const loadCurrentDesignation = async () => {
        try {
          const response = await designationsApi.getDesignationById(
            formData.designation_id!
          );
          if (response.data?.success && response.data.data) {
            const item = response.data.data;
            setDesignationOptions([
              {
                label: item.designation_eng || item.name,
                value: item.designation_id,
              },
            ]);
          }
        } catch (error) {
          console.error("Error loading current designation:", error);
        }
      };
      loadCurrentDesignation();
    }
  }, [formData.designation_id, designationOptions.length]);

  // Load current location if editing
  useEffect(() => {
    if (formData.location_id && locationOptions.length === 0) {
      const loadCurrentLocation = async () => {
        try {
          const response = await locationsApi.getLocationById(
            formData.location_id!
          );
          if (response.data?.success && response.data.data) {
            const item = response.data.data;
            setLocationOptions([
              {
                label: item.location_eng || item.name,
                value: item.location_id,
              },
            ]);
          }
        } catch (error) {
          console.error("Error loading current location:", error);
        }
      };
      loadCurrentLocation();
    }
  }, [formData.location_id, locationOptions.length]);
  useEffect(() => {
    loadEmployeeTypes("");
  }, [loadEmployeeTypes]);

  useEffect(() => {
    loadDesignations("");
  }, [loadDesignations]);

  useEffect(() => {
    loadLocations("");
  }, [loadLocations]);

  useEffect(() => {
    let mounted = true;
    const fetchGrades = async () => {
      if (grades && grades.length > 0) return;
      setIsLoadingLocalGrades(true);
      try {
        const res = await gradesApi.getGradesWithoutPagination();
        if (mounted && res.data?.success && Array.isArray(res.data.data)) {
          setLocalGrades(
            res.data.data.map((g: any) => ({
              label: g.grade_eng || g.name,
              value: g.grade_id,
            }))
          );
        }
      } catch (err) {
        console.warn("Failed to load fallback grades:", err);
        setLocalGrades([]);
      } finally {
        setIsLoadingLocalGrades(false);
      }
    };

    fetchGrades();
    return () => {
      mounted = false;
    };
  }, [grades]);

  // Initial load for grades (default options)
  useEffect(() => {
    loadGrades("");
  }, [loadGrades]);
  // Debounced search for grades
  useDebouncedEffect(
    () => {
      loadGrades(gradeSearchTerm);
    },
    [gradeSearchTerm, loadGrades],
    300
  );

  // Initial load for managers when component mounts or manager_id changes
  useEffect(() => {
    if (formData.manager_id) {
      // Load the selected manager
      loadManagers("");
    }
  }, [formData.manager_id, loadManagers]);

  useDebouncedEffect(
    () => {
      loadManagers(managerSearchTerm);
    },
    [managerSearchTerm, loadManagers],
    300
  );

  useDebouncedEffect(
    () => {
      loadEmployeeTypes(employeeTypeSearchTerm);
    },
    [employeeTypeSearchTerm, loadEmployeeTypes],
    300
  );
  useDebouncedEffect(
    () => {
      loadDesignations(designationSearchTerm);
    },
    [designationSearchTerm, loadDesignations],
    300
  );
  useDebouncedEffect(
    () => {
      loadLocations(locationSearchTerm);
    },
    [locationSearchTerm, loadLocations],
    300
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="organization_id" className="text-sm font-medium">
            {t("employeeMaster.employee.organization")} *
          </Label>
          {/* Organization dropdown left as-is, assuming organizations are not huge. If needed, refactor similarly. */}
          <Combobox
            options={organizations}
            value={formData.organization_id}
            onValueChange={(value) =>
              onInputChange(
                "organization_id",
                value ? parseInt(value.toString()) : null
              )
            }
            placeholder={
              isLoadingData
                ? t("common.loading")
                : t("employeeMaster.employee.selectOrganization")
            }
            disabled={isLoadingData}
            className="mt-1"
            emptyMessage={t("employeeMaster.employee.noOrganizationsFound")}
          />
          {errors.organization_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.organization_id}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="designation_id" className="text-sm font-medium">
            {t("employeeMaster.employee.designation")} *
          </Label>
          <Combobox
            options={designationOptions}
            value={formData.designation_id}
            onValueChange={(value) =>
              onInputChange(
                "designation_id",
                value ? parseInt(value.toString()) : null
              )
            }
            onSearch={(query) => setDesignationSearchTerm(query)}
            placeholder={
              isLoadingData
                ? t("common.loading")
                : t("employeeMaster.employee.selectDesignation")
            }
            disabled={isLoadingData}
            isLoading={isLoadingDesignations}
            disableLocalFiltering={true}
            className="mt-1"
            emptyMessage={t("employeeMaster.employee.noDesignationsFound")}
          />
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
          <Combobox
            options={employeeTypeOptions}
            value={formData.employee_type_id}
            onValueChange={(value) =>
              onInputChange(
                "employee_type_id",
                value ? parseInt(value.toString()) : null
              )
            }
            onSearch={(query) => setEmployeeTypeSearchTerm(query)}
            placeholder={
              isLoadingData
                ? t("common.loading")
                : t("employeeMaster.employee.selectEmployeeType")
            }
            disabled={isLoadingData}
            isLoading={isLoadingEmployeeTypes}
            disableLocalFiltering={true}
            className="mt-1"
            emptyMessage={t("employeeMaster.employee.noEmployeeTypesFound")}
          />
          {errors.employee_type_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.employee_type_id}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="grade_id" className="text-sm font-medium">
            {t("employeeMaster.employee.grade")}
          </Label>
          {/* Grade dropdown left as-is, assuming grades are not huge. If needed, refactor similarly. */}
          <Combobox
            options={
              gradeOptions.length
                ? gradeOptions
                : grades && grades.length
                ? grades
                : localGrades
            }
            value={formData.grade_id}
            onValueChange={(value) =>
              onInputChange(
                "grade_id",
                value ? parseInt(value.toString()) : null
              )
            }
            onSearch={(query) => setGradeSearchTerm(query)}
            placeholder={
              isLoadingData
                ? t("common.loading")
                : t("employeeMaster.employee.selectGrade")
            }
            disabled={isLoadingData}
            isLoading={isLoadingData || isLoadingGrades || isLoadingLocalGrades}
            disableLocalFiltering={true}
            className="mt-1"
            emptyMessage={t("employeeMaster.employee.noGradesFound")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location_id" className="text-sm font-medium">
            {t("employeeMaster.employee.location")}
          </Label>
          <Combobox
            options={locationOptions}
            value={formData.location_id}
            onValueChange={(value) =>
              onInputChange(
                "location_id",
                value ? parseInt(value.toString()) : null
              )
            }
            onSearch={(query) => setLocationSearchTerm(query)}
            placeholder={
              isLoadingData
                ? t("common.loading")
                : t("employeeMaster.employee.selectLocation")
            }
            disabled={isLoadingData}
            isLoading={isLoadingLocations}
            disableLocalFiltering={true}
            className="mt-1"
            emptyMessage={t("employeeMaster.employee.noLocationsFound")}
          />
        </div>
        <div>
          <Label htmlFor="manager_id" className="text-sm font-medium">
            {t("employeeMaster.employee.manager")}
          </Label>
          <Combobox
            options={managers}
            value={formData.manager_id}
            onValueChange={(value) =>
              onInputChange(
                "manager_id",
                value ? parseInt(value.toString()) : null
              )
            }
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
