"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { SearchCombobox } from "@/components/ui/search-combobox";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import organizationTypesApi from "@/services/masterdata/organizationTypes";
import organizationsApi from "@/services/masterdata/organizations";

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<IOrganization>) => Promise<void>;
  organization?: IOrganization | null;
  mode: "add" | "edit";
  isLoading?: boolean;
}

interface IOrganizationType {
  organization_type_id?: number;
  organization_type_arb?: string;
  organization_type_eng?: string;
  org_type_level?: number;
  created_id?: number;
  created_date?: string;
  last_updated_id?: number;
  last_updated_date?: string;
  organization_types: {
    organization_type_id?: number;
    organization_type_arb?: string;
    organization_type_eng?: string;
    org_type_level?: number;
    created_id?: number;
    created_date?: string;
    last_updated_id?: number;
    last_updated_date?: string;
  };
}

interface IOrganization {
  organization_id: number; // Remove the '?' or '| undefined'
  organization_code?: string;
  organization_arb?: string;
  organization_eng?: string;
  parent_id?: number;
  organization_type_id?: number;
  oraganization_types?: IOrganizationType;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({
  onClose,
  onSave,
  organization,
  mode,
  isLoading = false,
  isOpen,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [organizationTypes, setOrganizationTypes] = useState<
    IOrganizationType[]
  >([]);
  const [organizationList, setOrganizationList] = useState<IOrganization[]>([]);
  const [form, setForm] = useState<Partial<IOrganization>>({
    parent_id: organization?.parent_id ?? undefined,
    organization_code: organization?.organization_code || "",
    organization_arb: organization?.organization_arb || "",
    organization_eng: organization?.organization_eng || "",
    organization_type_id: organization?.organization_type_id ?? undefined,
  });
  const [parentOrgOptions, setParentOrgOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [parentOrgTypeId, setParentOrgTypeId] = useState<number | null>(null);
  const [ParentOrganizationSearch, setParentOrganizationSearch] =
    useState<string>("");
  useEffect(() => {
    const fetchOrganizationTypes = async () => {
      try {
        const response =
          await organizationTypesApi.getOrganizationTypesWithoutPagination();
        setOrganizationTypes(response.data.data);
      } catch (error) {
        console.error("Failed to fetch organization types:", error);
      }
    };
    fetchOrganizationTypes();
  }, []);

  useEffect(() => {
    const fetchParentOrganizations = async () => {
      if (!parentOrgTypeId) {
        setParentOrgOptions([]);
        return;
      }

      try {
        const response =
          await organizationsApi.getOrganizationsWithoutPagination();

        console.log("Organizations response:", response);
        const orgData = response?.data?.data || response?.data || [];

        if (!Array.isArray(orgData)) {
          console.error("Organization data is not an array:", orgData);
          setParentOrgOptions([]);
          return;
        }

        setOrganizationList(orgData);
        const filteredOrgs = orgData
          .filter(
            (org: IOrganization) => org.organization_type_id === parentOrgTypeId
          )
          .map((org: IOrganization) => ({
            label: (isRTL ? org.organization_arb : org.organization_eng) ?? "",
            value: org.organization_id ?? 0,
          }));
        setParentOrgOptions(filteredOrgs);
      } catch (error) {
        console.error("Failed to fetch parent organizations:", error);
        setParentOrgOptions([]);
      }
    };
    fetchParentOrganizations();
  }, [parentOrgTypeId, isRTL]);

  const handleChange = (
    field: keyof IOrganization,
    value: string | number | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value === null ? undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
    onClose();
  };
  const parentOrgOptionsMemo = useMemo(() => {
    if (!parentOrgTypeId) {
      return organizationList.map((org: IOrganization) => ({
        label: (isRTL ? org.organization_arb : org.organization_eng) ?? "",
        value: org.organization_id,
      }));
    }
    const filteredOrgs = organizationList
      .filter(
        (org: IOrganization) => org.organization_type_id === parentOrgTypeId
      )
      .map((org: IOrganization) => ({
        label: (isRTL ? org.organization_arb : org.organization_eng) ?? "",
        value: org.organization_id,
      }));
    return filteredOrgs;
  }, [parentOrgTypeId, organizationList, isRTL]);
  if (!isOpen) return null;
  const getHierarchyByTypeId = (
    typeId: number | null | undefined
  ): number | null => {
    if (!typeId) return null;
    const hierarchy = organizationTypes.find(
      (type) => type.organization_type_id === typeId
    )?.organization_types.org_type_level;
    return typeof hierarchy === "number" ? hierarchy : null;
  };
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
            className="space-y-4 bg-black/5 p-2 rounded-lg dark:bg-white/5"
            onSubmit={handleSubmit}
          >
            <div>
              <Label className="text-sm font-medium">
                {t("masterData.organizations.parentOrganizationType")}
              </Label>
              <Select
                value={parentOrgTypeId?.toString() ?? ""}
                onValueChange={(val) => {
                  const typeId = val ? Number(val) : null;
                  setParentOrgTypeId(typeId);
                  handleChange("parent_id", null);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue
                    placeholder={t(
                      "masterData.organizations.selectParentOrganizationType"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem
                      key={type.organization_type_id}
                      value={type.organization_type_id?.toString() || ""}
                    >
                      {isRTL
                        ? type.organization_type_arb
                        : type.organization_type_eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Parent Organization Combobox */}
            <div>
              <Label htmlFor="parent_id" className="text-sm font-medium">
                {t("masterData.organizations.parentOrganization")}
              </Label>
              <SearchCombobox
                onSearch={() => {
                  const filteredOptions = parentOrgOptionsMemo.filter(
                    (option) =>
                      typeof option.label === "string" &&
                      option.label
                        .toLowerCase()
                        .includes(ParentOrganizationSearch.toLowerCase())
                  );
                  setParentOrgOptions(filteredOptions);
                }}
                onValueChange={(val: string | number | null) =>
                  handleChange("parent_id", val)
                }
                options={parentOrgOptionsMemo}
                value={form.parent_id ?? ""}
                placeholder={t(
                  "masterData.organizations.selectParentOrganization"
                )}
                className="mt-1"
                disabled={isLoading || !parentOrgTypeId}
              />
            </div>

            {/* Organization Type */}
            <div>
              <Label
                htmlFor="organization_type_id"
                className="text-sm font-medium"
              >
                {t("masterData.organizations.organizationType")} *
              </Label>
              <Select
                value={form.organization_type_id?.toString() ?? ""}
                onValueChange={(val) =>
                  handleChange("organization_type_id", val ? Number(val) : null)
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue
                    placeholder={t(
                      "masterData.organizations.selectOrganizationType"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => {
                    if (parentOrgTypeId) {
                      if (
                        Number(type.organization_type_id) <=
                        Number(parentOrgTypeId)
                      ) {
                        return null;
                      }
                    }
                    return (
                      <SelectItem
                        key={type.organization_type_id}
                        value={type.organization_type_id?.toString() || ""}
                      >
                        {isRTL
                          ? type.organization_type_arb
                          : type.organization_type_eng}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Organization Code */}
            <div>
              <Label
                htmlFor="organization_code"
                className="text-sm font-medium"
              >
                {t("masterData.organizations.organizationCode")} *
              </Label>
              <Input
                id="organization_code"
                value={form.organization_code}
                onChange={(e) =>
                  handleChange("organization_code", e.target.value)
                }
                placeholder={t(
                  "masterData.organizations.enterOrganizationCode"
                )}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            {/* Organization Name (Arabic/English based on language) */}
            <div>
              <Label
                htmlFor={isRTL ? "organization_arb" : "organization_eng"}
                className="text-sm font-medium"
              >
                {isRTL
                  ? t("masterData.organizations.organizationNameArabic")
                  : t("masterData.organizations.organizationNameEnglish")}
              </Label>
              <Input
                id={isRTL ? "organization_arb" : "organization_eng"}
                value={isRTL ? form.organization_arb : form.organization_eng}
                onChange={(e) =>
                  handleChange(
                    isRTL ? "organization_arb" : "organization_eng",
                    e.target.value
                  )
                }
                placeholder={
                  isRTL
                    ? t("masterData.organizations.enterOrganizationNameArabic")
                    : t("masterData.organizations.enterOrganizationNameEnglish")
                }
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            {/* Action Buttons */}
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
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
