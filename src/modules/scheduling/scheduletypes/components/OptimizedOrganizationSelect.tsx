"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { useQuery } from "@tanstack/react-query";
import {
  SearchCombobox,
  SearchComboboxOption,
} from "@/components/ui/search-combobox";
import organizationsApi from "@/services/masterdata/organizations";

interface Organization {
  organization_id: number;
  organization_code: string;
  organization_eng: string;
  organization_arb: string;
}

interface OptimizedOrganizationSelectProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const OptimizedOrganizationSelect: React.FC<
  OptimizedOrganizationSelectProps
> = ({ value, onValueChange, placeholder, disabled, error }) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: organizationsData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["organizations-dropdown", searchQuery],
    queryFn: () => organizationsApi.getOrganizationDropdownList(),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const organizations: Organization[] = organizationsData?.data?.data || [];

  // Convert organizations to SearchCombobox options
  const options: SearchComboboxOption[] = organizations.map((org) => ({
    label: isRTL ? org.organization_arb : org.organization_eng,
    value: org.organization_id,
  }));

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleValueChange = (newValue: string | number | null) => {
    onValueChange(newValue === null ? undefined : (newValue as number));
  };

  return (
    <div className="w-full">
      <SearchCombobox
        options={options}
        value={value}
        onValueChange={handleValueChange}
        placeholder={
          placeholder || t("scheduling.schedules.selectOrganization")
        }
        disabled={disabled}
        emptyMessage={t("common.noResults")}
        onSearch={handleSearch}
        isLoading={isLoading}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};
