"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import employeeGroupApi from "@/services/employeemaster/employeeGroup";
import { WeeklyRosterFilters, EmployeeGroup } from "../types";

interface WeeklyRosterHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAddRoster: () => void;
  selectedCount: number;
  filters?: WeeklyRosterFilters;
  onFiltersChange?: (filters: Partial<WeeklyRosterFilters>) => void;
  onDeleteSelected?: () => void;
}

export const WeeklyRosterHeader: React.FC<WeeklyRosterHeaderProps> = ({
  search,
  onSearchChange,
  onAddRoster,
  selectedCount,
  filters = {},
  onFiltersChange,
  onDeleteSelected,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  // Employee Groups state
  const [employeeGroups, setEmployeeGroups] = useState<EmployeeGroup[]>([]);
  const [employeeGroupSearch, setEmployeeGroupSearch] = useState("");
  const [isEmployeeGroupOpen, setIsEmployeeGroupOpen] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Calendar state
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Load employee groups
  const loadEmployeeGroups = async (searchTerm: string = "") => {
    try {
      setIsLoadingGroups(true);
      const response = await employeeGroupApi.getEmployeeGroupsForDropdown(
        searchTerm
      );
      setEmployeeGroups(response.data.data);
    } catch (error) {
      console.error("Failed to load employee groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Load initial employee groups
  useEffect(() => {
    loadEmployeeGroups();
  }, []);

  // Debounced search for employee groups
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEmployeeGroupOpen) {
        loadEmployeeGroups(employeeGroupSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [employeeGroupSearch, isEmployeeGroupOpen]);

  const selectedEmployeeGroup = employeeGroups?.find(
    (group) => group.employee_group_id === filters.employee_group_id
  );

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-2 sm:px-4 py-4 sm:py-8 ">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Title and Description */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
              {t("scheduling.weeklyRoster.title")}
            </h1>
            {selectedCount > 0 && (
              <p className="text-xs sm:text-sm text-primary font-medium">
                {t("common.selectedCount", { count: selectedCount })}
              </p>
            )}
          </div>

          {/* Search + Action Buttons (Ramadan-style) */}
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
              placeholder={t("scheduling.weeklyRoster.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-muted-foreground/70"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              {selectedCount > 0 && onDeleteSelected && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDeleteSelected}
                  className="text-xs sm:text-sm h-8 sm:h-9"
                >
                  {t("common.deleteSelected")}
                </Button>
              )}
              <Button
                onClick={onAddRoster}
                className="gap-2 text-xs sm:text-sm h-8 sm:h-9"
              >
                +<span className="">{t("common.add")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          {/* Search (moved to top row) */}

          {/* Filters */}
          {onFiltersChange && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex flex-wrap gap-2">
                {/* Employee Group Filter */}
                <div className="flex items-center gap-1">
                  <Users
                    size={14}
                    className="sm:size-4 text-muted-foreground hidden sm:block"
                  />
                  <Popover
                    open={isEmployeeGroupOpen}
                    onOpenChange={setIsEmployeeGroupOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isEmployeeGroupOpen}
                        className="w-[200px] sm:w-[250px] h-8 sm:h-9 justify-between text-xs sm:text-sm"
                      >
                        {selectedEmployeeGroup
                          ? isRTL
                            ? selectedEmployeeGroup.group_name_arb
                            : selectedEmployeeGroup.group_name_eng
                          : t("scheduling.weeklyRoster.selectEmployeeGroup")}
                        <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0">
                      <div className="p-2">
                        <Input
                          placeholder={t("common.search")}
                          value={employeeGroupSearch}
                          onChange={(e) =>
                            setEmployeeGroupSearch(e.target.value)
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="max-h-[200px] overflow-auto">
                        {isLoadingGroups ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            {t("common.loading")}
                          </div>
                        ) : !employeeGroups || employeeGroups.length === 0 ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            {t("common.noResults")}
                          </div>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-8 text-xs"
                              onClick={() => {
                                onFiltersChange({
                                  employee_group_id: undefined,
                                });
                                setIsEmployeeGroupOpen(false);
                              }}
                            >
                              {t("common.all")}
                            </Button>
                            {employeeGroups.map((group) => (
                              <Button
                                key={group.employee_group_id}
                                variant="ghost"
                                className="w-full justify-start h-8 text-xs"
                                onClick={() => {
                                  onFiltersChange({
                                    employee_group_id: group.employee_group_id,
                                  });
                                  setIsEmployeeGroupOpen(false);
                                }}
                              >
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">
                                    {isRTL
                                      ? group.group_name_arb
                                      : group.group_name_eng}
                                  </span>
                                  {group.group_code && (
                                    <span className="text-xs text-muted-foreground">
                                      {group.group_code}
                                    </span>
                                  )}
                                </div>
                              </Button>
                            ))}
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Start Date Filter */}
                <div className="flex items-center gap-1">
                  <Calendar
                    size={14}
                    className="sm:size-4 text-muted-foreground hidden sm:block"
                  />
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] sm:w-[180px] h-8 sm:h-9 justify-start text-left font-normal text-xs sm:text-sm",
                          !filters.start_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {filters.start_date ? (
                          format(filters.start_date, "MMM dd, yyyy")
                        ) : (
                          <span>{t("common.startDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.start_date}
                        onSelect={(date) => {
                          onFiltersChange({ start_date: date });
                          setStartDateOpen(false);
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date Filter */}
                <div className="flex items-center gap-1">
                  <Calendar
                    size={14}
                    className="sm:size-4 text-muted-foreground hidden sm:block"
                  />
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] sm:w-[180px] h-8 sm:h-9 justify-start text-left font-normal text-xs sm:text-sm",
                          !filters.end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {filters.end_date ? (
                          format(filters.end_date, "MMM dd, yyyy")
                        ) : (
                          <span>{t("common.endDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.end_date}
                        onSelect={(date) => {
                          onFiltersChange({ end_date: date });
                          setEndDateOpen(false);
                        }}
                        disabled={(date) => {
                          if (date < new Date("1900-01-01")) return true;
                          if (filters.start_date && date < filters.start_date)
                            return true;
                          return false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Clear Filters */}
                {(filters.employee_group_id ||
                  filters.start_date ||
                  filters.end_date) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onFiltersChange({
                        employee_group_id: undefined,
                        start_date: undefined,
                        end_date: undefined,
                      })
                    }
                    className="h-8 sm:h-9 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                  >
                    {t("common.clearFilters")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
