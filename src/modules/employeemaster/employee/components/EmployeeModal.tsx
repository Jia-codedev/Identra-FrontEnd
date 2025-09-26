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
        const [lookupDataResults, countriesRes] = await Promise.all([
          employeeApi.getEmployeeLookupData(),
          countriesApi.getCountriesWithoutPagination().catch((err) => {
            console.warn("Countries API failed, using fallback:", err);
            return { data: { success: false, data: [] } };
          }),
        ]);

        const [
          orgRes,
          gradeRes,
          designationRes,
          nationalityRes,
          employeeTypeRes,
          locationRes,
        ] = lookupDataResults;

        if (orgRes.data?.success) {
          setOrganizations(
            orgRes.data.data.map((org: any) => ({
              label: isRTL
                ? org.organization_arb || org.organization_eng
                : org.organization_eng,
              value: org.organization_id,
            }))
          );
        }

        if (gradeRes.data?.success) {
          setGrades(
            gradeRes.data.data.map((grade: any) => ({
              label: isRTL
                ? grade.grade_arb || grade.grade_eng
                : grade.grade_eng,
              value: grade.grade_id,
            }))
          );
        }

        if (designationRes.data?.success) {
          setDesignations(
            designationRes.data.data.map((des: any) => ({
              label: isRTL
                ? des.designation_arb || des.designation_eng
                : des.designation_eng,
              value: des.designation_id,
            }))
          );
        }
        if (nationalityRes.data?.success) {
          setNationalities(
            nationalityRes.data.data.map((nat: any) => ({
              label: isRTL
                ? nat.citizenship_arb || nat.citizenship_eng
                : nat.citizenship_eng,
              value: nat.citizenship_id,
            }))
          );
        }

        if (countriesRes.data?.success) {
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

        if (employeeTypeRes.data?.success) {
          setEmployeeTypes(
            employeeTypeRes.data.data.map((et: any) => ({
              label: isRTL
                ? et.employee_type_arb || et.employee_type_eng
                : et.employee_type_eng,
              value: et.employee_type_id,
            }))
          );
        }

        if (locationRes.data?.success) {
          setLocations(
            locationRes.data.data.map((loc: any) => ({
              label: isRTL
                ? loc.location_arb || loc.location_eng
                : loc.location_eng,
              value: loc.location_id,
            }))
          );
        }

        if (mode === "edit" && employee) {
          console.log(
            "Setting form data for edit mode after dropdown data loaded:",
            employee
          );
          console.log(
            "Available organizations:",
            orgRes.data?.data?.map((o: any) => ({
              id: o.organization_id,
              name: o.organization_eng,
            }))
          );
          console.log("Employee organization_id:", employee.organization_id);

          setTimeout(() => {
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
              login_id: (employee as any).login_id || "",
              password: "",
              confirm_password: "",
              remarks: employee.remarks || "",
            });
            console.log("Form data set with values:", {
              organization_id: employee.organization_id,
              designation_id: employee.designation_id,
              employee_type_id: employee.employee_type_id,
              manager_id: employee.manager_id,
              citizenship_id: employee.citizenship_id,
            });
          }, 100);
        } else if (mode === "add") {
          console.log("Resetting form for add mode");
          setFormData(initialForm);
          setCurrentStep(0);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
        toast.error(t("messages.error.network"));
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
        if (!formData.organization_id) {
          stepErrors.organization_id = t("validation.required");
        }
        if (!formData.designation_id) {
          stepErrors.designation_id = t("validation.required");
        }
        if (!formData.employee_type_id) {
          stepErrors.employee_type_id = t("validation.required");
        }
        break;

      case 2:
        if (!formData.citizenship_id) {
          stepErrors.citizenship_id = t("validation.required");
        }

        if (!formData.email || !formData.email.trim()) {
          stepErrors.email = t("validation.required");
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
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
    console.log(
      "handleNext called, currentStep:",
      currentStep,
      "steps.length:",
      steps.length
    );
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
    console.log(
      "handleSubmit called, currentStep:",
      currentStep,
      "mode:",
      mode
    );

    if (!validateCurrentStep()) {
      return;
    }

    const employeeData: Partial<IEmployee> = {
      ...formData,
      organization_id: formData.organization_id || undefined,
      grade_id: formData.grade_id || undefined,
      designation_id: formData.designation_id || undefined,
      employee_type_id: formData.employee_type_id || undefined,
      location_id: formData.location_id || undefined,
      manager_id: formData.manager_id || undefined,
      citizenship_id: formData.citizenship_id || undefined,
      passport_issue_country_id:
        formData.passport_issue_country_id || undefined,
      national_id_expiry_date: formData.national_id_expiry_date || undefined,
      passport_expiry_date: formData.passport_expiry_date || undefined,
      join_date: formData.join_date || undefined,
      active_date: formData.active_date || undefined,
      inactive_date: formData.inactive_date || undefined,
    };

    console.log("Form Data before submission:", formData);
    console.log("Employee Data to be sent:", employeeData);

    if (!employeeData.emp_no || employeeData.emp_no.toString().trim() === "") {
      console.error("Employee number is missing or empty");
      toast.error("Employee number is required");
      return;
    }

    if (
      !employeeData.firstname_eng ||
      employeeData.firstname_eng.toString().trim() === ""
    ) {
      console.error("First name is missing or empty");
      toast.error("First name is required");
      return;
    }

    try {
      if (mode === "add") {
        console.log("Creating employee with data:", {
          ...employeeData,
          login: formData.login_id,
        });
        const result = await createEmployee({
          ...employeeData,
          login: formData.login_id,
          password: formData.password,
        } as IEmployee);

        onSave(employeeData as IEmployee);
      } else if (employee?.employee_id) {
        console.log("Updating employee...");
        await updateEmployee({
          id: employee.employee_id,
          employeeData: employeeData as IEmployee,
        });
        onSave(employeeData as IEmployee);
      }
    } catch (error) {
      console.error("Error saving employee:", error);
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
                className={`flex gap-3 ${
                  isRTL ? "flex-row-reverse" : "flex-row"
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
