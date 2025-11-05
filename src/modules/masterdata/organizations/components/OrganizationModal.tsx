"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { IOrganization } from "../types";
import organizationTypesApi from "@/services/masterdata/organizationTypes";
import siteApi from "@/services/masterdata/site";
import organizationsApi from "@/services/masterdata/organizations";

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<IOrganization>) => Promise<void>;
  organization?: IOrganization | null;
  mode: "add" | "edit";
  isLoading?: boolean;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  organization,
  mode,
  isLoading = false,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  type OrganizationFormFields = {
    organization_eng: string | undefined;
    organization_arb: string | undefined;
    organization_code: string;
    organization_type_id: number;
    parent_id?: number;
    location_id?: number;
  };

  const initialForm: OrganizationFormFields = {
    organization_eng: "",
    organization_arb: "",
    organization_code: "",
    organization_type_id: 0,
  };

  const [formData, setFormData] = useState<OrganizationFormFields>(initialForm);
  const [organizationTypes, setOrganizationTypes] = useState<
    { label: string; value: number }[]
  >([]);
  const [locations, setLocations] = useState<
    { label: string; value: number }[]
  >([]);
  const [parentOrganizations, setParentOrganizations] = useState<
    { label: string; value: number }[]
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OrganizationFormFields, string>>
  >({});
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  // Fetch organization types when modal opens
  useEffect(() => {
    const fetchDropdownData = async () => {
      if (!isOpen) return;

      setIsLoadingData(true);
      setDropdownsLoaded(false);
      try {
        // Only fetch organization types (small dataset)
        const orgTypesRes = await organizationTypesApi.getOrganizationTypesWithoutPagination();

        if (orgTypesRes.data?.success) {
          setOrganizationTypes(
            orgTypesRes.data.data.map((ot: any) => ({
              label: isRTL
                ? ot.organization_type_arb || ot.organization_type_eng
                : ot.organization_type_eng,
              value: ot.organization_type_id,
            }))
          );
        }

        setDropdownsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDropdownData();
  }, [isOpen, isRTL]);

  // Initialize form data when modal opens and after dropdowns are loaded
  useEffect(() => {
    if (!isOpen || !dropdownsLoaded) return;

    if (organization && mode === "edit") {
      setFormData({
        organization_eng: organization.organization_eng || "",
        organization_arb: organization.organization_arb || "",
        organization_code: organization.organization_code || "",
        organization_type_id: organization.organization_type_id || 0,
        parent_id: organization.parent_id,
        location_id: organization.location_id,
      });
    } else if (mode === "add") {
      setFormData(initialForm);
    }
    setErrors({});
  }, [organization, mode, isOpen, dropdownsLoaded]);

  // Memoize disable button logic
  const disableButton = React.useMemo(() => {
    // Check if data has changed
    const hasChanges = mode === "add" || (
      formData.organization_type_id !== organization?.organization_type_id ||
      formData.organization_code !== organization?.organization_code ||
      formData.organization_arb !== organization?.organization_arb ||
      formData.organization_eng !== organization?.organization_eng ||
      formData.parent_id !== organization?.parent_id ||
      formData.location_id !== organization?.location_id
    );

    // Check if required fields are filled
    const requiredFieldsFilled = 
      formData.organization_type_id !== 0 &&
      Boolean(formData.organization_code) &&
      (Boolean(formData.organization_arb) || Boolean(formData.organization_eng));

    return !hasChanges || !requiredFieldsFilled;
  }, [formData, organization, mode]);

  // Fetch locations with search and debouncing
  const handleLocationSearch = useCallback((searchQuery: string) => {
    setIsLoadingLocations(true);
    const timer = setTimeout(async () => {
      try {
        const response = await siteApi.getLocationsForDropdown({
          name: searchQuery,
          limit: 50,
        });

        if (response.data?.success && response.data.data) {
          setLocations(
            response.data.data.map((loc: any) => ({
              label: isRTL
                ? loc.location_arb || loc.location_eng
                : loc.location_eng,
              value: loc.location_id,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setIsLoadingLocations(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isRTL]);

  // Fetch parent organizations with search and debouncing
  const handleParentSearch = useCallback((searchQuery: string) => {
    setIsLoadingParents(true);
    const timer = setTimeout(async () => {
      try {
        const response = await organizationsApi.getOrganizationsForDropdown({
          name: searchQuery,
          limit: 50,
        });

        if (response.data?.success) {
          setParentOrganizations(
            response.data.data
              .filter((org: any) =>
                mode === "edit"
                  ? org.organization_id !== organization?.organization_id
                  : true
              )
              .map((org: any) => ({
                label: isRTL
                  ? org.organization_arb || org.organization_eng
                  : org.organization_eng,
                value: org.organization_id,
              }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch parent organizations", error);
      } finally {
        setIsLoadingParents(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isRTL, mode, organization]);

  useEffect(() => {
    if (isOpen) {
      handleLocationSearch("");
      handleParentSearch("");
    }
  }, [isOpen, handleLocationSearch, handleParentSearch]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrganizationFormFields, string>> = {};

    if (!formData.organization_code?.trim()) {
      newErrors.organization_code = t("validation.required");
    }
    if (!formData.organization_eng?.trim()) {
      newErrors.organization_eng = t("validation.required");
    }
    if (!formData.organization_type_id || formData.organization_type_id === 0) {
      newErrors.organization_type_id = t("validation.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData: Partial<IOrganization> = {
        ...formData,
        organization_eng: formData.organization_eng || formData.organization_arb || "",
        organization_arb: formData.organization_arb || formData.organization_eng || "",
      };
      
      // Remove undefined optional fields
      if (!submitData.parent_id) delete submitData.parent_id;
      if (!submitData.location_id) delete submitData.location_id;

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Failed to save organization:", error);
    }
  };

  const handleInputChange = useCallback((
    field: keyof OrganizationFormFields,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

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
          className="bg-background rounded-lg shadow-lg w-full max-w-md p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === "add"
                ? t("masterData.organizations.addOrganization")
                : t("masterData.organizations.editOrganization")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-black/5 p-2 rounded-lg dark:bg-white/5"
          >
            <div>
              <Label
                htmlFor="organization_code"
                className="text-sm font-medium"
              >
                {t("masterData.organizations.organizationCode")} *
              </Label>
              <Input
                id="organization_code"
                value={formData.organization_code}
                onChange={(e) =>
                  handleInputChange(
                    "organization_code",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder={t(
                  "masterData.organizations.enterOrganizationCode"
                )}
                className={`mt-1 ${
                  errors.organization_code ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              {errors.organization_code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.organization_code}
                </p>
              )}
            </div>
            {isRTL ? (
              <div>
                <Label
                  htmlFor="organization_arb"
                  className="text-sm font-medium"
                >
                  {t("masterData.organizations.organizationNameArabic")}
                </Label>
                <Input
                  id="organization_arb"
                  value={formData.organization_arb}
                  onChange={(e) =>
                    handleInputChange("organization_arb", e.target.value)
                  }
                  placeholder={t(
                    "masterData.organizations.enterOrganizationNameArabic"
                  )}
                />
                {errors[isRTL ? "organization_arb" : "organization_eng"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[isRTL ? "organization_arb" : "organization_eng"]}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <Label
                  htmlFor={"organization_eng"}
                  className="text-sm font-medium"
                >
                  {t("masterData.organizations.organizationNameEnglish")}
                </Label>
                <Input
                  id={"organization_eng"}
                  value={formData.organization_eng}
                  onChange={(e) =>
                    handleInputChange("organization_eng", e.target.value)
                  }
                  placeholder={t(
                    "masterData.organizations.enterOrganizationNameEnglish"
                  )}
                />
                {errors["organization_eng"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors["organization_eng"]}
                  </p>
                )}
              </div>
            )}
            <div>
              <Label
                htmlFor="organization_type_id"
                className="text-sm font-medium"
              >
                {t("masterData.organizations.organizationType")} *
              </Label>
              <Select
                value={
                  formData.organization_type_id
                    ? formData.organization_type_id.toString()
                    : ""
                }
                onValueChange={(value) =>
                  handleInputChange("organization_type_id", parseInt(value))
                }
                disabled={isLoading || isLoadingData}
              >
                <SelectTrigger
                  className={`w-full mt-1 ${
                    errors.organization_type_id ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      isLoadingData
                        ? t("common.loading")
                        : t("masterData.organizations.selectOrganizationType")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.organization_type_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.organization_type_id}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="parent_id" className="text-sm font-medium">
                {t("masterData.organizations.parentOrganization")}
              </Label>
              <Combobox
                options={[
                  { label: t("masterData.organizations.root"), value: 0 },
                  ...parentOrganizations,
                ]}
                value={formData.parent_id ?? 0}
                onValueChange={(value) =>
                  handleInputChange(
                    "parent_id",
                    value === 0 ? undefined : (value as number)
                  )
                }
                placeholder={
                  isLoadingParents
                    ? t("common.loading")
                    : t("masterData.organizations.selectParentOrganization")
                }
                disabled={isLoading || isLoadingParents}
                onSearch={handleParentSearch}
                isLoading={isLoadingParents}
                disableLocalFiltering={true}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location_id" className="text-sm font-medium">
                {t("masterData.organizations.location")}
              </Label>
              <Combobox
                options={locations}
                value={formData.location_id ?? null}
                onValueChange={(value) =>
                  handleInputChange(
                    "location_id",
                    value ? (value as number) : undefined
                  )
                }
                placeholder={
                  isLoadingLocations
                    ? t("common.loading")
                    : t("masterData.organizations.selectLocation")
                }
                disabled={isLoading || isLoadingLocations}
                onSearch={handleLocationSearch}
                isLoading={isLoadingLocations}
                disableLocalFiltering={true}
                className="mt-1"
              />
            </div>
            <div
              className={`flex gap-3 pt-4 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || isLoadingData || disableButton}
              >
                {isLoading ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
