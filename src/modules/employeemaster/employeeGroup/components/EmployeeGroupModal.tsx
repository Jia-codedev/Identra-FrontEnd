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
import { EmployeeSearchResponse } from "../../employee/types";
import employeeApi from "@/services/employeemaster/employee";
import { debounce } from "lodash";
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
  const [searchResults, setSearchResults] = useState<EmployeeSearchResponse[]>(
    []
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeSearchResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [displayLimit] = useState(10); // Show only 10 results at a time
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Use a form data type with string values for inputs to avoid controlled/uncontrolled issues
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

  // Define searchEmployees function
  const searchEmployees = async (query: string) => {
    const response = await employeeApi.searchEmployees(query);
    return response.data.data;
  };

  // Move all hooks before any conditional logic
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (query && query.length > 1) {
          setIsSearching(true);
          try {
            const results = await searchEmployees(query);
            
            // Ensure results is always an array
            const validResults = Array.isArray(results) ? results : [];
            setTotalResults(validResults.length);
            // Limit the displayed results for better performance
            const limitedResults = validResults.slice(0, displayLimit);
            setSearchResults(limitedResults);
          } catch (error) {
            console.error("Error searching employees:", error);
            setSearchResults([]);
            setTotalResults(0);
          } finally {
            setIsSearching(false);
          }
        } else {
          setSearchResults([]);
          setTotalResults(0);
          setIsSearching(false);
        }
      }, 1000),
    [displayLimit]
  );
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

      // If there's a reporting person ID, set up the search query for display
      if ((employeeGroup as any).reporting_person_id) {
        // You might want to fetch the employee details to show the name
        // For now, just show the ID
        setSearchQuery(
          `Employee ID: ${(employeeGroup as any).reporting_person_id}`
        );
      }
    } else {
      // Reset form when not in edit mode or no employee group
      setSelectedEmployee(null);
      setSearchQuery("");
      setSearchResults([]);
      setTotalResults(0);
      setIsSearching(false);
    }
  }, [employeeGroup, mode, isOpen]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Define event handlers
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmployeeSelect = (employee: EmployeeSearchResponse) => {
    setSelectedEmployee(employee);
    setFormData((prev) => ({
      ...prev,
      reporting_person_id: String(employee.employee_id),
    }));
    setSearchQuery(`${employee.firstname_eng} ${employee.lastname_eng}`);
    setHighlightedIndex(-1);
    // Hide dropdown by clearing search results
    setSearchResults([]);
    setTotalResults(0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
          handleEmployeeSelect(searchResults[highlightedIndex]);
        }
        break;
      case 'Escape':
        setSearchResults([]);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleClearEmployee = () => {
    setSelectedEmployee(null);
    setFormData((prev) => ({
      ...prev,
      reporting_person_id: "",
    }));
    setSearchQuery("");
    setSearchResults([]);
    setTotalResults(0);
    setIsSearching(false);
    setHighlightedIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert form data to the expected IEmployeeGroup format
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
    // Reset search state
    setSelectedEmployee(null);
    setSearchQuery("");
    setSearchResults([]);
    setTotalResults(0);
    setIsSearching(false);
  };

  // Conditional rendering after all hooks
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
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t(
                      "employeeMaster.employeeGroups.searchReportingPerson"
                    )}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHighlightedIndex(-1); // Reset highlight when typing
                      debouncedSearch(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full-md p-2 bg-background pr-8"
                    autoComplete="off"
                  />
                  {selectedEmployee && (
                    <button
                      type="button"
                      onClick={handleClearEmployee}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {/* Loading indicator */}
                  {isSearching && (
                    <div className="absolute z-50 w-full mt-1 bg-white-md shadow-lg">
                      <div className="p-3 text-gray-500 text-sm flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        Searching...
                      </div>
                    </div>
                  )}

                  {/* Show dropdown only when there are search results and not searching */}
                  {!isSearching && Array.isArray(searchResults) && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white-md shadow-lg max-h-72 overflow-hidden">
                      {/* Results counter header */}
                      <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600 font-medium">
                        <div className="flex justify-between items-center">
                          <span>
                            Showing {searchResults.length} of {totalResults} results
                            {totalResults > displayLimit && (
                              <span className="ml-1 text-amber-600">
                                (Type more to narrow down)
                              </span>
                            )}
                          </span>
                          <span className="text-gray-400">
                            ↑↓ Navigate • Enter Select • Esc Close
                          </span>
                        </div>
                      </div>
                      
                      {/* Scrollable results */}
                      <div className="max-h-60 overflow-y-auto">
                        {searchResults.map((person, index) => (
                          <div
                            key={person.employee_id}
                            onClick={() => handleEmployeeSelect(person)}
                            className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors duration-150 ${
                              index === highlightedIndex 
                                ? 'bg-blue-100 border-blue-200' 
                                : 'hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className={`font-medium ${
                                  index === highlightedIndex ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {person.firstname_eng} {person.lastname_eng}
                                </div>
                                <div className={`text-sm ${
                                  index === highlightedIndex ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                  ID: {person.employee_id}
                                </div>
                                {person.firstname_arb && person.lastname_arb && (
                                  <div className={`text-sm mt-1 ${
                                    index === highlightedIndex ? 'text-blue-500' : 'text-gray-400'
                                  }`}>
                                    {person.firstname_arb} {person.lastname_arb}
                                  </div>
                                )}
                              </div>
                              <div className={`text-xs ml-2 ${
                                index === highlightedIndex ? 'text-blue-500' : 'text-gray-400'
                              }`}>
                                #{index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer with more results indicator */}
                      {totalResults > displayLimit && (
                        <div className="px-3 py-2 bg-gray-50 border-t text-xs text-center text-gray-500">
                          {totalResults - displayLimit} more results available. 
                          <br />
                          Type more characters to narrow your search.
                        </div>
                      )}
                    </div>
                  )}
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
