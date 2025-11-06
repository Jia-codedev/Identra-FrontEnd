"use client";

import React from "react";
import { Search, Calendar, List } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HolidayFilters } from "../types";

interface HolidaysHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddHoliday: () => void;
  selectedCount: number;
  onDeleteSelected?: () => void;
  filters: HolidayFilters;
  onFiltersChange: (filters: Partial<HolidayFilters>) => void;
  viewMode?: "table" | "calendar";
  onViewModeChange?: (mode: "table" | "calendar") => void;
  canCreate?: boolean;
  canDelete?: boolean;
}

export const HolidaysHeader: React.FC<HolidaysHeaderProps> = ({
  search,
  onSearchChange,
  onAddHoliday,
  selectedCount,
  onDeleteSelected,
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  canCreate,
  canDelete,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const getMonthName = (monthNum: number) => {
    try {
      return t(
        `common.months.${
          [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
          ][monthNum - 1]
        }`
      );
    } catch {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return monthNames[monthNum - 1];
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1),
  }));

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 ">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
              {t("scheduling.holidays.title")}
            </h1>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
            <div
              className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <span
                className={`${
                  isRTL ? "pr-2 pl-1" : "pl-2 pr-1"
                } text-xl text-primary/80`}
              >
                <Search size={22} />
              </span>
              <Input
                placeholder={t("scheduling.holidays.searchPlaceholder")}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2"
              />
              <span className="mx-2 h-6 w-px bg-border" />
              {selectedCount > 0 && onDeleteSelected && canDelete ? (
                <Button
                  onClick={onDeleteSelected}
                  className="font-semibold text-base px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 transition-all shadow-none"
                  variant="destructive"
                >
                  <span className="hidden sm:inline">
                    {t("common.deleteSelected")}
                  </span>
                  <span className="sm:hidden text-xl leading-none">🗑️</span>
                </Button>
              ) : (
                <Button
                  disabled={!canCreate}
                  onClick={onAddHoliday}
                  className="font-semibold text-base px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-none"
                  variant="default"
                >
                  <span className="hidden sm:inline">+ {t("common.add")}</span>
                  <span className="sm:hidden text-xl leading-none">+</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          {viewMode !== "calendar" && (
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1">
                <Calendar
                  size={14}
                  className="sm:size-4 text-muted-foreground hidden sm:block"
                />
                <Select
                  value={filters.year?.toString() || "all"}
                  onValueChange={(value) =>
                    onFiltersChange({
                      year: value === "all" ? undefined : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-[90px] sm:w-[120px] h-8 sm:h-9 text-xs sm:text-sm">
                    <SelectValue placeholder={t("common.year")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.allYears")}</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Calendar
                  size={14}
                  className="sm:size-4 text-muted-foreground hidden sm:block"
                />
                <Select
                  value={filters.month?.toString() || "all"}
                  onValueChange={(value) =>
                    onFiltersChange({
                      month: value === "all" ? undefined : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-[100px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm">
                    <SelectValue placeholder={t("common.month")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.allMonths")}</SelectItem>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div
            className={`flex items-center ${
              viewMode === "calendar" ? "sm:ml-auto" : ""
            }`}
          >
            <div
              role="tablist"
              aria-label="View mode"
              className="inline-flex rounded-lg bg-muted/10 p-1"
            >
              <button
                role="tab"
                aria-pressed={viewMode !== "calendar"}
                onClick={() => onViewModeChange && onViewModeChange("table")}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  !viewMode || viewMode === "table"
                    ? "bg-card shadow text-card-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <List size={14} />
                <span className="hidden sm:inline">Table</span>
              </button>

              <button
                role="tab"
                aria-pressed={viewMode === "calendar"}
                onClick={() => onViewModeChange && onViewModeChange("calendar")}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  viewMode === "calendar"
                    ? "bg-card shadow text-card-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Calendar size={14} />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
