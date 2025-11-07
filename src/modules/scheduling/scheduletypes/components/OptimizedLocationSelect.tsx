"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { useQuery } from "@tanstack/react-query";
import {
  SearchCombobox,
  SearchComboboxOption,
} from "@/components/ui/search-combobox";
import locationsApi from "@/services/masterdata/locations";

interface Location {
  location_id: number;
  location_code: string;
  location_eng: string;
  location_arb: string;
  city?: string;
  region_name?: string;
}

interface OptimizedLocationSelectProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const OptimizedLocationSelect: React.FC<
  OptimizedLocationSelectProps
> = ({ value, onValueChange, placeholder, disabled, error }) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: locationsData,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["locations-dropdown", searchQuery],
    queryFn: () =>
      locationsApi.getLocationsForDropdown({
        name: searchQuery,
        limit: 50,
        offset: 0,
      }),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const locations: Location[] = locationsData?.data?.data || [];

  // Convert locations to SearchCombobox options with additional info
  const options: SearchComboboxOption[] = locations.map((location) => {
    const locationName = isRTL ? location.location_arb : location.location_eng;
    const details = [
      location.location_code,
      location.city,
      location.region_name,
    ]
      .filter(Boolean)
      .join(" • ");

    return {
      label: details ? `${locationName} (${details})` : locationName,
      value: location.location_id,
    };
  });

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
        placeholder={placeholder || t("scheduling.schedules.selectLocation")}
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
