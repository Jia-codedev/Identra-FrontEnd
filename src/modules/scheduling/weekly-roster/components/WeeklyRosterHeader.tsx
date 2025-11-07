"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Filter,
  CalendarDays,
  Building2,
} from "lucide-react";
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
import organizationsApi from "@/services/masterdata/organizations";
import { SearchCombobox } from "@/components/ui/search-combobox";
import { WeeklyRosterFilters } from "../types";

interface WeeklyRosterHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAddRoster: () => void;
  selectedCount: number;
  filters?: WeeklyRosterFilters;
  onFiltersChange?: (filters: Partial<WeeklyRosterFilters>) => void;
  onDeleteSelected?: () => void;
  canDelete?: boolean;
  canCreate?: boolean;
}

export const WeeklyRosterHeader: React.FC<WeeklyRosterHeaderProps> = ({
  search,
  onSearchChange,
  onAddRoster,
  selectedCount,
  filters = {},
  onFiltersChange,
  onDeleteSelected,
  canCreate,
  canDelete,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [organizationSearch, setOrganizationSearch] = useState("");
  // popover replaced by SearchCombobox
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);

  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const loadOrganizations = async () => {
    try {
      setIsLoadingOrgs(true);
      // Use server-side dropdown API when available. Try dropdown-list first,
      // fall back to the paginated dropdown if needed.
      let response: any;
      try {
        response = await organizationsApi.getOrganizationDropdownList();
      } catch (err) {
        // fallback to generic dropdown with no params
        response = await organizationsApi.getOrganizationsForDropdown();
      }
      const data = response?.data?.data || response?.data || [];
      // Ensure we always set an array
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load organizations:", error);
      setOrganizations([]);
    } finally {
      setIsLoadingOrgs(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);
  // Debounced server-side search for organizations when the search term changes
  useEffect(() => {
    const t = setTimeout(() => {
      const fetchOrgs = async () => {
        try {
          setIsLoadingOrgs(true);
          // Prefer the search-capable endpoint if available
          const resp = await organizationsApi.getOrganizationDropdownList();
          const d = resp?.data?.data || resp?.data || [];
          setOrganizations(Array.isArray(d) ? d : []);
        } catch (err) {
          // As a fallback try the simple dropdown list
          try {
            const resp2 = await organizationsApi.getOrganizationDropdownList();
            const d2 = resp2?.data?.data || resp2?.data || [];
            setOrganizations(Array.isArray(d2) ? d2 : []);
          } catch (e) {
            console.error("Failed to search organizations:", e);
            setOrganizations([]);
          }
        } finally {
          setIsLoadingOrgs(false);
        }
      };

      // Only run fetch if there's a search term or to refresh results
      fetchOrgs();
    }, 300);

    return () => clearTimeout(t);
  }, [organizationSearch]);
  const filteredOrganizations = Array.isArray(organizations)
    ? organizations.filter((org) => {
        if (!organizationSearch) return true;
        const searchLower = organizationSearch.toLowerCase();
        const engMatch = org.organization_eng
          ?.toLowerCase()
          .includes(searchLower);
        const arbMatch = org.organization_arb
          ?.toLowerCase()
          .includes(searchLower);
        return engMatch || arbMatch;
      })
    : [];

  const selectedOrganization = organizations?.find(
    (org) => org.organization_id === filters.organization_id
  );

  const orgOptions = filteredOrganizations.map((org) => ({
    label: isRTL
      ? org.organization_arb || org.organization_eng
      : org.organization_eng || org.organization_arb || "",
    value: org.organization_id,
  }));

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
              {selectedCount > 0 && onDeleteSelected && canDelete && (
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
                disabled={!canCreate}
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
                {/* Organization Filter */}
                <div className="flex items-center gap-1">
                  <Building2
                    size={14}
                    className="sm:size-4 text-muted-foreground hidden sm:block"
                  />
                  <div className="w-[200px] sm:w-[250px]">
                    <SearchCombobox
                      options={orgOptions}
                      value={
                        selectedOrganization
                          ? selectedOrganization.organization_id
                          : null
                      }
                      onValueChange={(val) => {
                        const num = val === null ? undefined : Number(val);
                        onFiltersChange &&
                          onFiltersChange({ organization_id: num });
                      }}
                      onSearch={(q) => setOrganizationSearch(q)}
                      placeholder={
                        t("common.selectOrganization") || "Select Organization"
                      }
                      isLoading={isLoadingOrgs}
                      emptyMessage={t("common.noResults")}
                    />
                  </div>
                </div>

                {/* From Date Filter */}
                <div className="flex items-center gap-1">
                  <Calendar
                    size={14}
                    className="sm:size-4 text-muted-foreground hidden sm:block"
                  />
                  <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] sm:w-[180px] h-8 sm:h-9 justify-start text-left font-normal text-xs sm:text-sm",
                          !filters.from_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {filters.from_date ? (
                          format(filters.from_date, "MMM dd, yyyy")
                        ) : (
                          <span>{t("common.fromDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.from_date}
                        onSelect={(date) => {
                          onFiltersChange({ from_date: date });
                          setFromDateOpen(false);
                        }}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* To Date Filter */}
                <div className="flex items-center gap-1">
                  <Calendar
                    size={14}
                    className="sm:size-4 text-muted-foreground hidden sm:block"
                  />
                  <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] sm:w-[180px] h-8 sm:h-9 justify-start text-left font-normal text-xs sm:text-sm",
                          !filters.to_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {filters.to_date ? (
                          format(filters.to_date, "MMM dd, yyyy")
                        ) : (
                          <span>{t("common.toDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.to_date}
                        onSelect={(date) => {
                          onFiltersChange({ to_date: date });
                          setToDateOpen(false);
                        }}
                        disabled={(date) => {
                          if (date < new Date("1900-01-01")) return true;
                          if (filters.from_date && date < filters.from_date)
                            return true;
                          return false;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Clear Filters */}
                {(filters.organization_id ||
                  filters.from_date ||
                  filters.to_date) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onFiltersChange({
                        organization_id: undefined,
                        from_date: undefined,
                        to_date: undefined,
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
