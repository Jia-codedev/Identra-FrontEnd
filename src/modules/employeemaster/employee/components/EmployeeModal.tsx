"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, UserPlus, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper, Step } from "@/components/ui/stepper";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";
import { IEmployee } from "../types";
import employeeApi from "@/services/employeemaster/employee";
import countriesApi from "@/services/masterdata/countries";
import organizationsApi from "@/services/masterdata/organizations";
import gradesApi from "@/services/masterdata/grades";
import designationsApi from "@/services/masterdata/designation";
import nationalitiesApi from "@/services/masterdata/nationalities";
import employeeTypeApi from "@/services/employeemaster/employeeType";
import locationsApi from "@/services/masterdata/locations";
import { toast } from "sonner";
import { EmployeeFormFields, DropdownOption } from "./types";
import { EmployeeBasicInfoStep } from "./EmployeeBasicInfoStep";
import { EmployeeOrganizationStep } from "./EmployeeOrganizationStep";
import { EmployeePersonalStep } from "./EmployeePersonalStep";
import { EmployeeEmploymentStep } from "./EmployeeEmploymentStep";
import { EmployeeSettingsStep } from "./EmployeeSettingsStep";
import { EmployeeLoginStep } from "./EmployeeLoginStep";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEmployeeMutations } from "../hooks/useMutations";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IEmployee) => void;
  employee?: IEmployee | null;
  mode: "add" | "edit";
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employee,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const {
    createEmployee,
    updateEmployee,
    createEmployeeMutation,
    updateEmployeeMutation,
  } = useEmployeeMutations();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EmployeeFormFields, string>>
  >({});

  const [organizations, setOrganizations] = useState<DropdownOption[]>([]);
  const [designations, setDesignations] = useState<DropdownOption[]>([]);
  const [nationalities, setNationalities] = useState<DropdownOption[]>([]);
  const [employeeTypes, setEmployeeTypes] = useState<DropdownOption[]>([]);
  const [countries, setCountries] = useState<DropdownOption[]>([]);
  const [grades, setGrades] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);

  const initialForm = React.useMemo<EmployeeFormFields>(
    () => ({
      emp_no: "",
      firstname_eng: "",
      lastname_eng: "",
      firstname_arb: "",
      lastname_arb: "",
      card_number: "",
      pin: "",
      organization_id: null,
      grade_id: null,
      designation_id: null,
      employee_type_id: null,
      location_id: null,
      manager_id: null,
      citizenship_id: null,
      national_id: "",
      national_id_expiry_date: null,
      passport_number: "",
      passport_expiry_date: null,
      passport_issue_country_id: null,
      mobile: "",
      email: "",
      gender: "",
      join_date: null,
      active_date: null,
      inactive_date: null,
      active_flag: true,
      local_flag: false,
      punch_flag: true,
      on_reports_flag: true,
      email_notifications_flag: false,
      include_email_flag: false,
      open_shift_flag: false,
      overtime_flag: false,
      web_punch_flag: false,
      shift_flag: true,
      check_inout_selfie_flag: false,
      calculate_monthly_missed_hrs_flag: false,
      exclude_from_integration_flag: false,
      manager_flag: false,
      inpayroll_flag: true,
      share_roster_flag: false,
      geofence_flag: false,
      login_id: "",
      password: "",
      confirm_password: "",
      remarks: "",
      role_id: null,
    }),
    []
  );

  const [formData, setFormData] = useState<EmployeeFormFields>(initialForm);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setCurrentStep(0);
      setErrors({});
      setIsLoadingData(false);
    }
  }, [isOpen, initialForm]);

  const steps: Step[] = [
    {
      id: "basic",
      title: t("employeeMaster.employee.steps.basicInfo"),
      description: t("employeeMaster.employee.steps.basicInfoDesc"),
    },
    {
      id: "organization",
      title: t("employeeMaster.employee.steps.organizationInfo"),
      description: t("employeeMaster.employee.steps.organizationInfoDesc"),
    },
    {
      id: "personal",
      title: t("employeeMaster.employee.steps.personalInfo"),
      description: t("employeeMaster.employee.steps.personalInfoDesc"),
    },
    {
      id: "employment",
      title: t("employeeMaster.employee.steps.employmentInfo"),
      description: t("employeeMaster.employee.steps.employmentInfoDesc"),
    },
    {
      id: "settings",
      title: t("employeeMaster.employee.steps.settings"),
      description: t("employeeMaster.employee.steps.settingsDesc"),
    },
    ...(mode === "add"
      ? [
        {
          id: "login",
          title: t("employeeMaster.employee.loginCredentials"),
          description: t("employeeMaster.employee.loginCredentialsDesc"),
        },
      ]
      : []),
  ];

  useEffect(() => {
    if (!isOpen) return;

    const fetchDropdownData = async () => {
      setIsLoadingData(true);
      try {
        const [
          orgRes,
          gradeRes,
          designationRes,
          nationalityRes,
          employeeTypeRes,
          locationRes,
          countriesRes
        ] = await Promise.all([
          organizationsApi.getOrganizationsWithoutPagination().catch((err) => {
            console.warn("Organizations API failed:", err);
            return { data: { success: false, data: [] } };
          }),
          gradesApi.getGradesWithoutPagination().catch((err) => {
            console.warn("Grades API failed:", err);
            return { data: { success: false, data: [] } };
          }),
          designationsApi.getDesignationsWithoutPagination().catch((err) => {
            console.warn("Designations API failed:", err);
            return { data: { success: false, data: [] } };
          }),
          nationalitiesApi.getNationalitiesWithoutPagination().catch((err) => {
            console.warn("Nationalities API failed:", err);
            return { data: { success: false, data: [] } };
          }),
          employeeTypeApi.getEmployeeTypesWithoutPagination().catch((err) => {
            console.warn("Employee Types API failed:", err);
            return { data: { success: false, data: [] } };
          }),
          locationsApi.getLocationsWithoutPagination().catch((err) => {
            console.warn("Locations API failed:", err);
            return { data: { success: false, data: [] } };
          }),
          countriesApi.getCountriesWithoutPagination().catch((err) => {
            console.warn("Countries API failed:", err);
            return { data: { success: false, data: [] } };
          }),
        ]);

        if (orgRes.data?.success && Array.isArray(orgRes.data.data)) {
          setOrganizations(
            orgRes.data.data.map((org: any) => ({
              label: isRTL
                ? org.organization_arb || org.organization_eng
                : org.organization_eng,
              value: org.organization_id,
            }))
          );
        } else {
          console.warn("Organizations API response issue:", orgRes.data);
          setOrganizations([]);
        }

        if (gradeRes.data?.success && Array.isArray(gradeRes.data.data)) {
          setGrades(
            gradeRes.data.data.map((grade: any) => ({
              label: isRTL
                ? grade.grade_arb || grade.grade_eng
                : grade.grade_eng,
              value: grade.grade_id,
            }))
          );
        } else {
          console.warn("Grades API response issue:", gradeRes.data);
          setGrades([]);
        }

        if (designationRes.data?.success && Array.isArray(designationRes.data.data)) {
          setDesignations(
            designationRes.data.data.map((des: any) => ({
              label: isRTL
                ? des.designation_arb || des.designation_eng
                : des.designation_eng,
              value: des.designation_id,
            }))
          );
        } else {
          console.warn("Designations API response issue:", designationRes.data);
          setDesignations([]);
        }

        if (nationalityRes.data?.success && Array.isArray(nationalityRes.data.data)) {
          setNationalities(
            nationalityRes.data.data.map((nat: any) => ({
              label: isRTL
                ? nat.citizenship_arb || nat.citizenship_eng
                : nat.citizenship_eng,
              value: nat.citizenship_id,
            }))
          );
        } else {
          console.warn("Nationalities API response issue:", nationalityRes.data);
          setNationalities([]);
        }

        if (countriesRes.data?.success && Array.isArray(countriesRes.data.data)) {
          setCountries(
            countriesRes.data.data.map((country: any) => ({
              label: isRTL
                ? country.country_arb || country.country_eng
                : country.country_eng,
              value: country.country_id,
            }))
          );
        } else {
          console.warn(
            "Countries API response was not successful:",
            countriesRes
          );
          setCountries([]);
        }

        if (employeeTypeRes.data?.success && Array.isArray(employeeTypeRes.data.data)) {
          setEmployeeTypes(
            employeeTypeRes.data.data.map((et: any) => ({
              label: isRTL
                ? et.employee_type_arb || et.employee_type_eng
                : et.employee_type_eng,
              value: et.employee_type_id,
            }))
          );
        } else {
          console.warn("Employee Types API response issue:", employeeTypeRes.data);
          setEmployeeTypes([]);
        }

        if (locationRes.data?.success && Array.isArray(locationRes.data.data)) {
          setLocations(
            locationRes.data.data.map((loc: any) => ({
              label: isRTL
                ? loc.location_arb || loc.location_eng
                : loc.location_eng,
              value: loc.location_id,
            }))
          );
        } else {
          console.warn("Locations API response issue:", locationRes.data);
          setLocations([]);
        }

        if (mode === "edit" && employee) {
          // If we have employee_id, fetch the full employee data
          if (employee.employee_id) {
            try {
              const employeeResponse = await employeeApi.getEmployeeById(employee.employee_id);
              const fullEmployeeData = employeeResponse.data?.data || employee;

              setFormData({
                emp_no: fullEmployeeData.emp_no || "",
                firstname_eng: fullEmployeeData.firstname_eng || "",
                lastname_eng: fullEmployeeData.lastname_eng || "",
                firstname_arb: fullEmployeeData.firstname_arb || "",
                lastname_arb: fullEmployeeData.lastname_arb || "",
                card_number: fullEmployeeData.card_number || "",
                pin: fullEmployeeData.pin || "",
                organization_id: fullEmployeeData.organization_id || null,
                grade_id: fullEmployeeData.grade_id || null,
                designation_id: fullEmployeeData.designation_id || null,
                employee_type_id: fullEmployeeData.employee_type_id || null,
                location_id: fullEmployeeData.location_id || null,
                manager_id: fullEmployeeData.manager_id || null,
                citizenship_id: fullEmployeeData.citizenship_id || null,
                national_id: fullEmployeeData.national_id || "",
                national_id_expiry_date: fullEmployeeData.national_id_expiry_date
                  ? new Date(fullEmployeeData.national_id_expiry_date)
                  : null,
                passport_number: fullEmployeeData.passport_number || "",
                passport_expiry_date: fullEmployeeData.passport_expiry_date
                  ? new Date(fullEmployeeData.passport_expiry_date)
                  : null,
                passport_issue_country_id:
                  fullEmployeeData.passport_issue_country_id || null,
                mobile: fullEmployeeData.mobile || "",
                email: fullEmployeeData.email || "",
                gender: fullEmployeeData.gender || "",
                join_date: fullEmployeeData.join_date
                  ? new Date(fullEmployeeData.join_date)
                  : null,
                active_date: fullEmployeeData.active_date
                  ? new Date(fullEmployeeData.active_date)
                  : null,
                inactive_date: fullEmployeeData.inactive_date
                  ? new Date(fullEmployeeData.inactive_date)
                  : null,
                active_flag: fullEmployeeData.active_flag ?? true,
                local_flag: fullEmployeeData.local_flag ?? false,
                punch_flag: fullEmployeeData.punch_flag ?? true,
                on_reports_flag: fullEmployeeData.on_reports_flag ?? true,
                email_notifications_flag:
                  fullEmployeeData.email_notifications_flag ?? false,
                include_email_flag: fullEmployeeData.include_email_flag ?? false,
                open_shift_flag: fullEmployeeData.open_shift_flag ?? false,
                overtime_flag: fullEmployeeData.overtime_flag ?? false,
                web_punch_flag: fullEmployeeData.web_punch_flag ?? false,
                shift_flag: fullEmployeeData.shift_flag ?? true,
                check_inout_selfie_flag:
                  fullEmployeeData.check_inout_selfie_flag ?? false,
                calculate_monthly_missed_hrs_flag:
                  fullEmployeeData.calculate_monthly_missed_hrs_flag ?? false,
                exclude_from_integration_flag:
                  fullEmployeeData.exclude_from_integration_flag ?? false,
                manager_flag: fullEmployeeData.manager_flag ?? false,
                inpayroll_flag: fullEmployeeData.inpayroll_flag ?? true,
                share_roster_flag: fullEmployeeData.share_roster_flag ?? false,
                geofence_flag: fullEmployeeData.geofence_flag ?? false,
                login_id: "",
                password: "",
                confirm_password: "",
                remarks: fullEmployeeData.remarks || "",
                role_id: null,
              });
            } catch (error) {
              console.error("Error fetching employee data:", error);
              toast.error(t("messages.error.fetchingData"));
              // Fallback to using the passed employee object
              setFormData({
                emp_no: employee.emp_no || "",
                firstname_eng: employee.firstname_eng || "",
                lastname_eng: employee.lastname_eng || "",
                firstname_arb: employee.firstname_arb || "",
                lastname_arb: employee.lastname_arb || "",
                card_number: employee.card_number || "",
                pin: employee.pin || "",
                organization_id: employee.organization_id || null,
                grade_id: employee.grade_id || null,
                designation_id: employee.designation_id || null,
                employee_type_id: employee.employee_type_id || null,
                location_id: employee.location_id || null,
                manager_id: employee.manager_id || null,
                citizenship_id: employee.citizenship_id || null,
                national_id: employee.national_id || "",
                national_id_expiry_date: employee.national_id_expiry_date
                  ? new Date(employee.national_id_expiry_date)
                  : null,
                passport_number: employee.passport_number || "",
                passport_expiry_date: employee.passport_expiry_date
                  ? new Date(employee.passport_expiry_date)
                  : null,
                passport_issue_country_id:
                  employee.passport_issue_country_id || null,
                mobile: employee.mobile || "",
                email: employee.email || "",
                gender: employee.gender || "",
                join_date: employee.join_date
                  ? new Date(employee.join_date)
                  : null,
                active_date: employee.active_date
                  ? new Date(employee.active_date)
                  : null,
                inactive_date: employee.inactive_date
                  ? new Date(employee.inactive_date)
                  : null,
                active_flag: employee.active_flag ?? true,
                local_flag: employee.local_flag ?? false,
                punch_flag: employee.punch_flag ?? true,
                on_reports_flag: employee.on_reports_flag ?? true,
                email_notifications_flag:
                  employee.email_notifications_flag ?? false,
                include_email_flag: employee.include_email_flag ?? false,
                open_shift_flag: employee.open_shift_flag ?? false,
                overtime_flag: employee.overtime_flag ?? false,
                web_punch_flag: employee.web_punch_flag ?? false,
                shift_flag: employee.shift_flag ?? true,
                check_inout_selfie_flag:
                  employee.check_inout_selfie_flag ?? false,
                calculate_monthly_missed_hrs_flag:
                  employee.calculate_monthly_missed_hrs_flag ?? false,
                exclude_from_integration_flag:
                  employee.exclude_from_integration_flag ?? false,
                manager_flag: employee.manager_flag ?? false,
                inpayroll_flag: employee.inpayroll_flag ?? true,
                share_roster_flag: employee.share_roster_flag ?? false,
                geofence_flag: employee.geofence_flag ?? false,
                login_id: "",
                password: "",
                confirm_password: "",
                remarks: employee.remarks || "",
                role_id: null,
              });
            }
          } else {
            // If no employee_id, use the employee object as is
            setFormData({
              emp_no: employee.emp_no || "",
              firstname_eng: employee.firstname_eng || "",
              lastname_eng: employee.lastname_eng || "",
              firstname_arb: employee.firstname_arb || "",
              lastname_arb: employee.lastname_arb || "",
              card_number: employee.card_number || "",
              pin: employee.pin || "",
              organization_id: employee.organization_id || null,
              grade_id: employee.grade_id || null,
              designation_id: employee.designation_id || null,
              employee_type_id: employee.employee_type_id || null,
              location_id: employee.location_id || null,
              manager_id: employee.manager_id || null,
              citizenship_id: employee.citizenship_id || null,
              national_id: employee.national_id || "",
              national_id_expiry_date: employee.national_id_expiry_date
                ? new Date(employee.national_id_expiry_date)
                : null,
              passport_number: employee.passport_number || "",
              passport_expiry_date: employee.passport_expiry_date
                ? new Date(employee.passport_expiry_date)
                : null,
              passport_issue_country_id:
                employee.passport_issue_country_id || null,
              mobile: employee.mobile || "",
              email: employee.email || "",
              gender: employee.gender || "",
              join_date: employee.join_date
                ? new Date(employee.join_date)
                : null,
              active_date: employee.active_date
                ? new Date(employee.active_date)
                : null,
              inactive_date: employee.inactive_date
                ? new Date(employee.inactive_date)
                : null,
              active_flag: employee.active_flag ?? true,
              local_flag: employee.local_flag ?? false,
              punch_flag: employee.punch_flag ?? true,
              on_reports_flag: employee.on_reports_flag ?? true,
              email_notifications_flag:
                employee.email_notifications_flag ?? false,
              include_email_flag: employee.include_email_flag ?? false,
              open_shift_flag: employee.open_shift_flag ?? false,
              overtime_flag: employee.overtime_flag ?? false,
              web_punch_flag: employee.web_punch_flag ?? false,
              shift_flag: employee.shift_flag ?? true,
              check_inout_selfie_flag:
                employee.check_inout_selfie_flag ?? false,
              calculate_monthly_missed_hrs_flag:
                employee.calculate_monthly_missed_hrs_flag ?? false,
              exclude_from_integration_flag:
                employee.exclude_from_integration_flag ?? false,
              manager_flag: employee.manager_flag ?? false,
              inpayroll_flag: employee.inpayroll_flag ?? true,
              share_roster_flag: employee.share_roster_flag ?? false,
              geofence_flag: employee.geofence_flag ?? false,
              login_id: "",
              password: "",
              confirm_password: "",
              remarks: employee.remarks || "",
              role_id: null,
            });
          }
        } else if (mode === "add") {
          setFormData(initialForm);
          setCurrentStep(0);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        
        // Log which specific API calls failed
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        
        // Set empty arrays for all dropdowns as fallback
        setOrganizations([]);
        setGrades([]);
        setDesignations([]);
        setNationalities([]);
        setCountries([]);
        setEmployeeTypes([]);
        setLocations([]);
        
        toast.error(t("messages.error.network") || "Failed to load dropdown data");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDropdownData();
  }, [isOpen, isRTL, mode, employee?.employee_id, initialForm]);

  const handleInputChange = useCallback(
    (field: keyof EmployeeFormFields, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validateCurrentStep = (): boolean => {
    const stepErrors: Partial<Record<keyof EmployeeFormFields, string>> = {};

    switch (currentStep) {
      case 0:
        if (!formData.emp_no.trim()) {
          stepErrors.emp_no = t("validation.required");
        }
        if (isRTL) {
          if (!formData.firstname_arb.trim()) {
            stepErrors.firstname_arb = t("validation.required");
          }
          if (!formData.lastname_arb.trim()) {
            stepErrors.lastname_arb = t("validation.required");
          }
        } else {
          if (!formData.firstname_eng.trim()) {
            stepErrors.firstname_eng = t("validation.required");
          }
          if (!formData.lastname_eng.trim()) {
            stepErrors.lastname_eng = t("validation.required");
          }
        }
        break;

      case 1:
        // Organization step - only validate if in add mode or if values were changed
        // In edit mode, allow empty values as they may be optional
        break;

      case 2:
        if (!formData.citizenship_id) {
          stepErrors.citizenship_id = t("validation.required");
        }

        // Email is optional, but if provided, must be valid
        if (formData.email && formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
          stepErrors.email = t("validation.invalidEmail");
        }
        break;

      case 3:
        if (!formData.join_date) {
          stepErrors.join_date = t("validation.required");
        }
        break;

      case 4:
        break;

      case 5:
        if (mode === "add") {
          if (!formData.role_id) {
            stepErrors.role_id = t("validation.required");
          }
          if (!formData.login_id.trim()) {
            stepErrors.login_id = t("validation.required");
          }
          if (!formData.password.trim()) {
            stepErrors.password = t("validation.required");
          } else {
            const password = formData.password;
            if (password.length < 8) {
              stepErrors.password =
                "Password must be at least 8 characters long";
            } else if (
              !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)
            ) {
              stepErrors.password =
                "Password must contain uppercase, lowercase, number, and special character";
            }
          }
          if (!formData.confirm_password.trim()) {
            stepErrors.confirm_password = t("validation.required");
          } else if (formData.password !== formData.confirm_password) {
            stepErrors.confirm_password = "Passwords do not match";
          }
        }
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Helper function to format dates to ISO string
    const formatDate = (date: Date | null | undefined): string | undefined => {
      if (!date) return undefined;
      try {
        return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
      } catch {
        return undefined;
      }
    };

    const employeeData: any = {
      emp_no: formData.emp_no,
      firstname_eng: formData.firstname_eng || formData.firstname_arb || "",
      lastname_eng: formData.lastname_eng || formData.lastname_arb || "",
      firstname_arb: formData.firstname_arb || formData.firstname_eng || "",
      lastname_arb: formData.lastname_arb || formData.lastname_eng || "",
      card_number: formData.card_number || undefined,
      pin: formData.pin || undefined,
      organization_id: formData.organization_id || undefined,
      grade_id: formData.grade_id || undefined,
      designation_id: formData.designation_id || undefined,
      employee_type_id: formData.employee_type_id || undefined,
      location_id: formData.location_id || undefined,
      manager_id: formData.manager_id || undefined,
      citizenship_id: formData.citizenship_id || undefined,
      passport_issue_country_id: formData.passport_issue_country_id || undefined,
      national_id: formData.national_id || undefined,
      national_id_expiry_date: formatDate(formData.national_id_expiry_date),
      passport_number: formData.passport_number || undefined,
      passport_expiry_date: formatDate(formData.passport_expiry_date),
      mobile: formData.mobile || undefined,
      email: formData.email || undefined,
      gender: formData.gender || undefined,
      join_date: formatDate(formData.join_date),
      active_date: formatDate(formData.active_date),
      inactive_date: formatDate(formData.inactive_date),
      active_flag: formData.active_flag ?? true,
      local_flag: formData.local_flag ?? false,
      punch_flag: formData.punch_flag ?? true,
      on_reports_flag: formData.on_reports_flag ?? true,
      email_notifications_flag: formData.email_notifications_flag ?? false,
      include_email_flag: formData.include_email_flag ?? false,
      open_shift_flag: formData.open_shift_flag ?? false,
      overtime_flag: formData.overtime_flag ?? false,
      web_punch_flag: formData.web_punch_flag ?? false,
      shift_flag: formData.shift_flag ?? true,
      check_inout_selfie_flag: formData.check_inout_selfie_flag ?? false,
      calculate_monthly_missed_hrs_flag: formData.calculate_monthly_missed_hrs_flag ?? false,
      exclude_from_integration_flag: formData.exclude_from_integration_flag ?? false,
      manager_flag: formData.manager_flag ?? false,
      inpayroll_flag: formData.inpayroll_flag ?? true,
      share_roster_flag: formData.share_roster_flag ?? false,
      geofence_flag: formData.geofence_flag ?? false,
      remarks: formData.remarks || undefined,
    };

    if (!employeeData.emp_no || employeeData.emp_no.toString().trim() === "") {
      console.error("Employee number is missing or empty");
      toast.error("Employee number is required");
      return;
    }

    if (!employeeData.firstname_eng || employeeData.firstname_eng.toString().trim() === "") {
      console.error("First name is missing or empty");
      toast.error("First name is required");
      return;
    }

    try {
      if (mode === "add") {
        // Add login credentials for new employees
        if (formData.login_id && formData.password) {
          employeeData.login = formData.login_id;
          employeeData.password = formData.password;
          employeeData.role_id = formData.role_id || undefined;
        }

        const result = await createEmployee(employeeData);
        onSave(result as IEmployee);
        onClose();
      } else if (employee?.employee_id) {
        await updateEmployee({
          id: employee.employee_id,
          employeeData: employeeData,
        });
        onSave(employeeData as IEmployee);
        onClose();
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      // Error is already handled in the mutation hook
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      formData,
      errors,
      onInputChange: handleInputChange,
      organizations,
      designations,
      nationalities,
      employeeTypes,
      countries,
      grades,
      locations,
      isLoadingData,
      isRTL,
      t,
    };

    switch (currentStep) {
      case 0:
        return <EmployeeBasicInfoStep {...stepProps} />;
      case 1:
        return <EmployeeOrganizationStep {...stepProps} />;
      case 2:
        return <EmployeePersonalStep {...stepProps} />;
      case 3:
        return <EmployeeEmploymentStep {...stepProps} />;
      case 4:
        return <EmployeeSettingsStep {...stepProps} />;
      case 5:
        return <EmployeeLoginStep {...stepProps} />;
      default:
        return null;
    }
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
          className="bg-background rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  mode === "add"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                )}
              >
                {mode === "add" ? (
                  <UserPlus className="h-5 w-5" />
                ) : (
                  <UserPen className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {mode === "add"
                    ? t("employeeMaster.employee.addEmployee")
                    : t("employeeMaster.employee.editEmployee")}
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Stepper */}
          <div className="px-6 py-4 border-b bg-muted/5">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              orientation="horizontal"
              compact={true}
              className="max-w-4xl mx-auto"
            />
          </div>

          {/* Form Content */}
          <div className="flex flex-col h-full">
            <div className="pt-4 max-h-[50vh] grid grid-cols-1 grid-rows-10 gap-0 ">
              <div className="space-y-1 px-6 row-span-2 ">
                <h3 className="text-xl font-semibold text-foreground">
                  {steps[currentStep]?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {steps[currentStep]?.description}
                </p>
              </div>
              <ScrollArea className="w-full px-6 row-span-9 py-1">
                {renderStepContent()}
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="flex items-center relative justify-between p-6 border-t bg-muted">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {t("common.step")} {currentStep + 1} {t("common.of")}{" "}
                  {steps.length}
                </div>
                <div className="hidden sm:block w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentStep + 1) / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div
                className={`flex gap-3 ${isRTL ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="min-w-20"
                >
                  {t("common.cancel")}
                </Button>

                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={
                      createEmployeeMutation.isPending ||
                      updateEmployeeMutation.isPending
                    }
                    className="min-w-20"
                  >
                    {isRTL ? (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronLeft className="h-4 w-4 mr-2" />
                    )}
                    {t("common.previous")}
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      createEmployeeMutation.isPending ||
                      updateEmployeeMutation.isPending
                    }
                    className="min-w-20"
                  >
                    {t("common.next")}
                    {isRTL ? (
                      <ChevronLeft className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      createEmployeeMutation.isPending ||
                      updateEmployeeMutation.isPending
                    }
                    className="min-w-20"
                  >
                    {createEmployeeMutation.isPending ||
                      updateEmployeeMutation.isPending
                      ? t("common.saving")
                      : t("common.save")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
