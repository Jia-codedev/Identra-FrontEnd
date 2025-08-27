"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Building2,
  ToggleLeft,
  ToggleRight,
  Moon,
  Sun,
  Calendar,
} from "lucide-react";
import { ScheduleFilters } from "../types";

interface SchedulesHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAddSchedule: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  filters: ScheduleFilters;
  onFiltersChange: (filters: Partial<ScheduleFilters>) => void;
}

export const SchedulesHeader: React.FC<SchedulesHeaderProps> = ({
  search,
  onSearchChange,
  onAddSchedule,
  selectedCount,
  onDeleteSelected,
  filters,
  onFiltersChange,
}) => {
  const { t } = useTranslations();
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount =
    Object.values(filters).filter(
      (value) => value !== undefined && value !== "" && value !== null
    ).length - 1; // Subtract 1 for the search filter which is always present

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      code: undefined,
      organization_name: undefined,
      organization_id: undefined,
      status_flag: undefined,
      open_shift_flag: undefined,
      night_shift_flag: undefined,
      ramadan_flag: undefined,
    });
  };

  const handleStatusFilter = (status: string) => {
    const value = status === "all" ? undefined : status === "active";
    onFiltersChange({ status_flag: value });
  };

  const handleShiftTypeFilter = (shiftType: string) => {
    switch (shiftType) {
      case "all":
        onFiltersChange({
          open_shift_flag: undefined,
          night_shift_flag: undefined,
        });
        break;
      case "open":
        onFiltersChange({ open_shift_flag: true, night_shift_flag: undefined });
        break;
      case "night":
        onFiltersChange({ night_shift_flag: true, open_shift_flag: undefined });
        break;
      case "regular":
        onFiltersChange({ open_shift_flag: false, night_shift_flag: false });
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 px-6">
      {/* Header Title and Subtitle */}
      <div className="py-6">
        <h1 className="text-4xl text-primary font-bold  ">
          {t("scheduling.schedules.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("scheduling.schedules.subtitle")}
        </p>
      </div>
      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("scheduling.schedules.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Button */}
          <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                {t("common.filters")}
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 min-w-5 text-xs px-1.5"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
              <DropdownMenuLabel>{t("common.filters")}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Schedule Code Filter */}
              <div className="p-2">
                <label className="text-sm font-medium mb-2 block">
                  {t("scheduling.schedules.scheduleCode")}
                </label>
                <Input
                  placeholder={t("scheduling.schedules.filterByCode")}
                  value={filters.code || ""}
                  onChange={(e) =>
                    onFiltersChange({ code: e.target.value || undefined })
                  }
                  className="h-8"
                />
              </div>

              {/* Organization Filter */}
              <div className="p-2">
                <label className="text-sm font-medium mb-2 block">
                  {t("common.organization")}
                </label>
                <Input
                  placeholder={t("scheduling.schedules.filterByOrganization")}
                  value={filters.organization_name || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      organization_name: e.target.value || undefined,
                    })
                  }
                  className="h-8"
                />
              </div>

              {/* Status Filter */}
              <div className="p-2">
                <label className="text-sm font-medium mb-2 block">
                  {t("common.status")}
                </label>
                <Select
                  value={
                    filters.status_flag === undefined
                      ? "all"
                      : filters.status_flag
                      ? "active"
                      : "inactive"
                  }
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="active">{t("common.active")}</SelectItem>
                    <SelectItem value="inactive">
                      {t("common.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Shift Type Filter */}
              <div className="p-2">
                <label className="text-sm font-medium mb-2 block">
                  {t("scheduling.schedules.shiftType")}
                </label>
                <Select
                  value={
                    filters.open_shift_flag === undefined &&
                    filters.night_shift_flag === undefined
                      ? "all"
                      : filters.open_shift_flag === true
                      ? "open"
                      : filters.night_shift_flag === true
                      ? "night"
                      : "regular"
                  }
                  onValueChange={handleShiftTypeFilter}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="open">
                      {t("scheduling.schedules.openShift")}
                    </SelectItem>
                    <SelectItem value="night">
                      {t("scheduling.schedules.nightShift")}
                    </SelectItem>
                    <SelectItem value="regular">
                      {t("scheduling.schedules.regularShift")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Boolean Filters */}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.ramadan_flag === true}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ramadan_flag: checked ? true : undefined })
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t("scheduling.schedules.ramadan")}
              </DropdownMenuCheckboxItem>

              {activeFiltersCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      {t("common.clearFilters")}
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t("common.delete")} ({selectedCount})
            </Button>
          )}

          <Button onClick={onAddSchedule} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("scheduling.schedules.addSchedule")}
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">
            {t("common.activeFilters")}:
          </span>

          {filters.code && (
            <Badge variant="secondary" className="gap-1">
              <span className="text-xs">{t("scheduling.schedules.code")}:</span>
              {filters.code}
              <button
                onClick={() => onFiltersChange({ code: undefined })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.organization_name && (
            <Badge variant="secondary" className="gap-1">
              <Building2 className="h-3 w-3" />
              <span className="text-xs">{t("common.org")}:</span>
              {filters.organization_name}
              <button
                onClick={() =>
                  onFiltersChange({ organization_name: undefined })
                }
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.status_flag !== undefined && (
            <Badge variant="secondary" className="gap-1">
              {filters.status_flag ? (
                <ToggleRight className="h-3 w-3" />
              ) : (
                <ToggleLeft className="h-3 w-3" />
              )}
              <span className="text-xs">{t("common.status")}:</span>
              {filters.status_flag ? t("common.active") : t("common.inactive")}
              <button
                onClick={() => onFiltersChange({ status_flag: undefined })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          {(filters.open_shift_flag !== undefined ||
            filters.night_shift_flag !== undefined) && (
            <Badge variant="secondary" className="gap-1">
              {filters.night_shift_flag ? (
                <Moon className="h-3 w-3" />
              ) : (
                <Sun className="h-3 w-3" />
              )}
              <span className="text-xs">
                {t("scheduling.schedules.shift")}:
              </span>
              {filters.open_shift_flag
                ? t("scheduling.schedules.open")
                : filters.night_shift_flag
                ? t("scheduling.schedules.night")
                : t("scheduling.schedules.regular")}
              <button
                onClick={() =>
                  onFiltersChange({
                    open_shift_flag: undefined,
                    night_shift_flag: undefined,
                  })
                }
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.ramadan_flag && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {t("scheduling.schedules.ramadan")}
              <button
                onClick={() => onFiltersChange({ ramadan_flag: undefined })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs h-7"
          >
            {t("common.clearAll")}
          </Button>
        </div>
      )}
    </div>
  );
};
