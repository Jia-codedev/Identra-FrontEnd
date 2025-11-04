"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
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
import { useLanguage } from "@/providers/language-provider";
import { ScheduleFilters } from "../types";

interface SchedulesHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAddSchedule: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  filters: ScheduleFilters;
  onFiltersChange: (filters: Partial<ScheduleFilters>) => void;
  canDelete?: boolean;
  canCreate?: boolean;
}

export const SchedulesHeader: React.FC<SchedulesHeaderProps> = ({
  search,
  onSearchChange,
  onAddSchedule,
  selectedCount,
  onDeleteSelected,
  filters,
  onFiltersChange,
  canDelete,
  canCreate,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount =
    Object.values(filters).filter(
      (value) => value !== undefined && value !== "" && value !== null
    ).length - 1;

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
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-2 sm:px-4 py-4 sm:py-8 ">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Title and Search/Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
              {t("scheduling.schedules.title")}
            </h1>
          </div>

          <div
            className={`flex items-center gap-2 bg-card/80 border border-border rounded-xl px-2 py-1 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span
              className={`${
                isRTL ? "pr-2 pl-1" : "pl-2 pr-1"
              } text-lg sm:text-xl text-primary/80`}
            >
              <Search size={18} />
            </span>
            <Input
              placeholder={t("scheduling.schedules.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-muted-foreground/70"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              {selectedCount > 0 && canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDeleteSelected}
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  {t("common.deleteSelected")} ({selectedCount})
                </Button>
              )}
              <Button
                disabled={!canCreate}
                onClick={onAddSchedule}
                className="gap-2 text-xs sm:text-sm h-8 sm:h-9"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">{t("common.add")}</span>
                <span className="sm:hidden">{t("common.add")}</span>
              </Button>
            </div>
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {t("common.activeFilters")}:
            </span>
            {filters.code && (
              <Badge variant="secondary" className="gap-1">
                <span className="text-xs">
                  {t("scheduling.schedules.code")}:
                </span>
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
                {filters.status_flag
                  ? t("common.active")
                  : t("common.inactive")}
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
    </div>
  );
};

export default SchedulesHeader;
