"use client";

import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';

interface BuildingsHeaderProps {
  search: string;
  statusFilter: boolean | undefined;
  typeFilter: string | undefined;
  cityFilter: string | undefined;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: boolean | undefined) => void;
  onTypeFilterChange: (value: string | undefined) => void;
  onCityFilterChange: (value: string | undefined) => void;
  onAddNew: () => void;
  onDeleteSelected: () => void;
}

export default function BuildingsHeader({
  search,
  statusFilter,
  typeFilter,
  cityFilter,
  selectedCount,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onCityFilterChange,
  onAddNew,
  onDeleteSelected,
}: BuildingsHeaderProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const handleStatusFilterChange = (value: string) => {
    if (value === "all") {
      onStatusFilterChange(undefined);
    } else {
      onStatusFilterChange(value === "true");
    }
  };

  const handleTypeFilterChange = (value: string) => {
    if (value === "all") {
      onTypeFilterChange(undefined);
    } else {
      onTypeFilterChange(value);
    }
  };

  const handleCityFilterChange = (value: string) => {
    if (value === "all") {
      onCityFilterChange(undefined);
    } else {
      onCityFilterChange(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("buildings.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("buildings.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t("common.deleteSelected")} ({selectedCount})
            </Button>
          )}
          
          <Button
            onClick={onAddNew}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("common.add")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search 
            className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${
              isRTL ? 'right-3' : 'left-3'
            }`} 
          />
          <Input
            placeholder={t("buildings.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={isRTL ? 'pr-10' : 'pl-10'}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter === undefined ? "all" : statusFilter.toString()}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("common.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="true">{t("common.active")}</SelectItem>
            <SelectItem value="false">{t("common.inactive")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={typeFilter || "all"}
          onValueChange={handleTypeFilterChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("buildings.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="office">{t("buildings.types.office")}</SelectItem>
            <SelectItem value="warehouse">{t("buildings.types.warehouse")}</SelectItem>
            <SelectItem value="factory">{t("buildings.types.factory")}</SelectItem>
            <SelectItem value="residential">{t("buildings.types.residential")}</SelectItem>
            <SelectItem value="mixed">{t("buildings.types.mixed")}</SelectItem>
          </SelectContent>
        </Select>

        {/* City Filter */}
        <Select
          value={cityFilter || "all"}
          onValueChange={handleCityFilterChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("buildings.city")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="Detroit">Detroit</SelectItem>
            <SelectItem value="Chicago">Chicago</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}