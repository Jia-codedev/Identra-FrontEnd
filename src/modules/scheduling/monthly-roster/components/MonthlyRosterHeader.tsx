"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Users,
  Building2,
  User,
  Clock,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { format } from "date-fns";
import employeeGroupApi from "@/services/employeemaster/employeeGroup";
import organizationsApi from "@/services/masterdata/organizations";
import employeeApi from "@/services/employeemaster/employee";
import schedulesApi from "@/services/scheduling/schedules";
import { MonthlyRosterFilters } from "../types";
import { useMonthlyRosterMutations } from "../hooks/useMutations";

interface MonthlyRosterHeaderProps {
  filters: MonthlyRosterFilters;
  onFiltersChange: (filters: Partial<MonthlyRosterFilters>) => void;
  onAddRoster?: () => void;
  onAddSampleData?: () => void;
  selectedIds?: number[];
  canCreate?: boolean;
  canDelete?: boolean;
}

export const MonthlyRosterHeader: React.FC<MonthlyRosterHeaderProps> = ({
  filters,
  onFiltersChange,
  onAddRoster,
  onAddSampleData,
  selectedIds,
  canCreate,
  canDelete,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const [orgOpen, setOrgOpen] = useState(false);
  const [orgSearch, setOrgSearch] = useState("");
  const [orgs, setOrgs] = useState<any[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);

  const [egOpen, setEgOpen] = useState(false);
  const [egSearch, setEgSearch] = useState("");
  const [egs, setEgs] = useState<any[]>([]);
  const [egLoading, setEgLoading] = useState(false);

  const [managerOpen, setManagerOpen] = useState(false);
  const [managerSearch, setManagerSearch] = useState("");
  const [managers, setManagers] = useState<any[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);

  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [versionOpen, setVersionOpen] = useState(false);
  const [applyVersionFilter, setApplyVersionFilter] = useState(false);

  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  // Clear dependent filters when organization changes
  useEffect(() => {
    if (!filters.organization_id) {
      onFiltersChange({
        employee_group_id: undefined,
        manager_id: undefined,
        employee_id: undefined,
        schedule_id: undefined,
      });
    }
  }, [filters.organization_id]);

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        setOrgLoading(true);
        const res = await organizationsApi.getOrganizationsForDropdown({
          search: orgSearch,
          limit: 40,
        });
        setOrgs(res?.data?.data || []);
      } finally {
        setOrgLoading(false);
      }
    };
    loadOrgs();
  }, [orgSearch]);

  useEffect(() => {
    const loadEgs = async () => {
      try {
        setEgLoading(true);
        const res = await employeeGroupApi.getEmployeeGroupsForDropdown(
          egSearch
        );
        setEgs(res?.data?.data || []);
      } finally {
        setEgLoading(false);
      }
    };
    loadEgs();
  }, [egSearch]);

  useEffect(() => {
    const loadManagers = async () => {
      if (!filters.organization_id) {
        setManagers([]);
        return;
      }
      try {
        setManagerLoading(true);
        const res = await employeeApi.getEmployees({
          offset: 1,
          limit: 10,
          search: managerSearch,
          organization_id: filters.organization_id,
        });
        setManagers(res?.data?.data || []);
      } finally {
        setManagerLoading(false);
      }
    };
    loadManagers();
  }, [managerSearch, filters.organization_id]);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!filters.organization_id) {
        setEmployees([]);
        return;
      }
      try {
        setEmployeeLoading(true);
        const res = await employeeApi.getEmployees({
          offset: 1,
          limit: 10,
          search: employeeSearch,
          organization_id: filters.organization_id,
        });
        setEmployees(res?.data?.data || []);
      } finally {
        setEmployeeLoading(false);
      }
    };
    loadEmployees();
  }, [employeeSearch, filters.organization_id]);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setScheduleLoading(true);
        const res = await schedulesApi.getSchedulesForDropdown({
          organization_id: filters.organization_id,
        });
        setSchedules(res?.data?.data || []);
      } finally {
        setScheduleLoading(false);
      }
    };
    loadSchedules();
  }, [scheduleSearch, filters.organization_id]);

  const selectedOrg = useMemo(
    () => orgs.find((o) => o.organization_id === filters.organization_id),
    [orgs, filters.organization_id]
  );
  const selectedEg = useMemo(
    () => egs.find((g) => g.employee_group_id === filters.employee_group_id),
    [egs, filters.employee_group_id]
  );
  const selectedManager = useMemo(
    () => managers.find((m) => m.employee_id === filters.manager_id),
    [managers, filters.manager_id]
  );
  const selectedEmployee = useMemo(
    () => employees.find((e) => e.employee_id === filters.employee_id),
    [employees, filters.employee_id]
  );
  const selectedSchedule = useMemo(
    () => schedules.find((s) => s.schedule_id === filters.schedule_id),
    [schedules, filters.schedule_id]
  );

  const { importMutation, exportMutation } = useMonthlyRosterMutations();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    if (!fileInputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept =
        ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        try {
          await importMutation.mutateAsync(fd);
        } catch (err) {
          console.error("Import failed", err);
        }
      };
      fileInputRef.current = input as HTMLInputElement;
    }
    fileInputRef.current.click();
  };

  const handleExportClick = async () => {
    try {
      let payload: any = {};
      if (selectedIds && selectedIds.length > 0) {
        payload = { ids: selectedIds };
      } else {
        payload = {
          organization_id: filters.organization_id,
          employee_group_id: filters.employee_group_id,
          employee_id: filters.employee_id,
          manager_id: filters.manager_id,
          schedule_id: filters.schedule_id,
          version_no: filters.version_no,
          from_date: filters.from_date,
          to_date: filters.to_date,
          finalize_flag: filters.finalize_flag,
        };
      }

      const blobRes = await exportMutation.mutateAsync(payload);
      const blob = blobRes?.data;
      if (!blob) throw new Error("No blob returned");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fnParts = ["monthly_roster"];
      if (payload.organization_id)
        fnParts.push(String(payload.organization_id));
      if (payload.from_date) fnParts.push(String(payload.from_date));
      if (payload.to_date) fnParts.push(String(payload.to_date));
      a.download = `${fnParts.join("_")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      const { toast } = require("sonner");
      try {
        toast.success("Export started");
      } catch {}
    } catch (err) {
      console.error("Export failed", err);
      const { toast } = require("sonner");
      try {
        toast.error("Export failed");
      } catch {}
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-6 border-b">
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {t("scheduling.monthlyRoster.title") || "Monthly Roster"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={!canCreate}
              onClick={onAddRoster}
              className="gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              {t("scheduling.monthlyRoster.addRoster")}
            </Button>
            {onAddSampleData && (
              <Button
                onClick={onAddSampleData}
                variant="outline"
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                Add Sample Data
              </Button>
            )}
            <Button variant="outline" onClick={handleImportClick}>
              {t("scheduling.monthlyRoster.import")}
            </Button>
            <Button variant="outline" onClick={handleExportClick}>
              {t("scheduling.monthlyRoster.export")}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Organization filter */}
          <Popover open={orgOpen} onOpenChange={setOrgOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {selectedOrg
                    ? isRTL
                      ? selectedOrg.organization_arb
                      : selectedOrg.organization_eng
                    : t("common.select") + " " + t("common.organization")}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <div className="p-2">
                <Input
                  placeholder={t("common.search")}
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="max-h-[240px] overflow-auto">
                {orgLoading ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <>
                    {orgs.map((org) => (
                      <Button
                        key={org.organization_id}
                        variant="ghost"
                        className="w-full justify-start h-8 text-xs"
                        onClick={() => {
                          onFiltersChange({
                            organization_id: org.organization_id,
                          });
                          setOrgOpen(false);
                        }}
                      >
                        {isRTL ? org.organization_arb : org.organization_eng}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Employee group filter */}
          <Popover open={egOpen} onOpenChange={setEgOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[220px] justify-between"
                disabled={!filters.organization_id}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {selectedEg
                    ? isRTL
                      ? selectedEg.group_name_arb
                      : selectedEg.group_name_eng
                    : t("common.select") +
                      " " +
                      t("employeeMaster.employeeGroups.title")}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <div className="p-2">
                <Input
                  placeholder={t("common.search")}
                  value={egSearch}
                  onChange={(e) => setEgSearch(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="max-h-[240px] overflow-auto">
                {egLoading ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-8 text-xs"
                      onClick={() => {
                        onFiltersChange({ employee_group_id: undefined });
                        setEgOpen(false);
                      }}
                    >
                      {t("common.all")}
                    </Button>
                    {egs.map((g) => (
                      <Button
                        key={g.employee_group_id}
                        variant="ghost"
                        className="w-full justify-start h-8 text-xs"
                        onClick={() => {
                          onFiltersChange({
                            employee_group_id: g.employee_group_id,
                          });
                          setEgOpen(false);
                        }}
                      >
                        {isRTL ? g.group_name_arb : g.group_name_eng}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Manager filter */}
          <Popover open={managerOpen} onOpenChange={setManagerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-between"
                disabled={!filters.organization_id}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedManager
                    ? `${selectedManager.firstname_eng || ""} ${
                        selectedManager.lastname_eng || ""
                      }`.trim()
                    : "Choose Manager"}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <div className="p-2">
                <Input
                  placeholder={t("common.search")}
                  value={managerSearch}
                  onChange={(e) => setManagerSearch(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="max-h-[240px] overflow-auto">
                {managerLoading ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-8 text-xs"
                      onClick={() => {
                        onFiltersChange({ manager_id: undefined });
                        setManagerOpen(false);
                      }}
                    >
                      {t("common.all")}
                    </Button>
                    {managers.map((mgr) => (
                      <Button
                        key={mgr.employee_id}
                        variant="ghost"
                        className="w-full justify-start h-8 text-xs"
                        onClick={() => {
                          onFiltersChange({ manager_id: mgr.employee_id });
                          setManagerOpen(false);
                        }}
                      >
                        {`${mgr.firstname_eng || ""} ${
                          mgr.lastname_eng || ""
                        }`.trim() || mgr.emp_no}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Employee filter */}
          <Popover open={employeeOpen} onOpenChange={setEmployeeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-between"
                disabled={!filters.organization_id}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedEmployee
                    ? `${selectedEmployee.firstname_eng || ""} ${
                        selectedEmployee.lastname_eng || ""
                      }`.trim()
                    : "Choose Employee"}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <div className="p-2">
                <Input
                  placeholder={t("common.search")}
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="max-h-[240px] overflow-auto">
                {employeeLoading ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-8 text-xs"
                      onClick={() => {
                        onFiltersChange({ employee_id: undefined });
                        setEmployeeOpen(false);
                      }}
                    >
                      {t("common.all")}
                    </Button>
                    {employees.map((emp) => (
                      <Button
                        key={emp.employee_id}
                        variant="ghost"
                        className="w-full justify-start h-8 text-xs"
                        onClick={() => {
                          onFiltersChange({ employee_id: emp.employee_id });
                          setEmployeeOpen(false);
                        }}
                      >
                        {`${emp.firstname_eng || ""} ${
                          emp.lastname_eng || ""
                        }`.trim() || emp.emp_no}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Schedule filter */}
          <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-between"
                disabled={!filters.organization_id}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedSchedule
                    ? isRTL
                      ? selectedSchedule.schedule_code
                      : "Choose Schedule"
                    : "Choose Schedule"}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <div className="p-2">
                <Input
                  placeholder={t("common.search")}
                  value={scheduleSearch}
                  onChange={(e) => setScheduleSearch(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="max-h-[240px] overflow-auto">
                {scheduleLoading ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-8 text-xs"
                      onClick={() => {
                        onFiltersChange({ schedule_id: undefined });
                        setScheduleOpen(false);
                      }}
                    >
                      {t("common.all")}
                    </Button>
                    {schedules
                      .filter(
                        (s) =>
                          !scheduleSearch ||
                          s.schedule_code
                            ?.toLowerCase()
                            .includes(scheduleSearch.toLowerCase())
                      )
                      .map((sch) => (
                        <Button
                          key={sch.schedule_id}
                          variant="ghost"
                          className="w-full justify-start h-8 text-xs"
                          onClick={() => {
                            onFiltersChange({ schedule_id: sch.schedule_id });
                            setScheduleOpen(false);
                          }}
                        >
                          {sch.schedule_code}
                        </Button>
                      ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Version No filter */}
          <Popover open={versionOpen} onOpenChange={setVersionOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-between"
                disabled={!filters.organization_id}
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  {filters.version_no
                    ? `Version ${filters.version_no}`
                    : "Choose Version"}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs"
                  onClick={() => {
                    onFiltersChange({ version_no: undefined });
                    setVersionOpen(false);
                  }}
                >
                  All
                </Button>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                  <Button
                    key={v}
                    variant="ghost"
                    className="h-8"
                    onClick={() => {
                      onFiltersChange({ version_no: v });
                      setVersionOpen(false);
                    }}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Apply version filter checkbox */}
          <div className="flex items-center space-x-2 px-2">
            <Checkbox
              id="applyVersionFilter"
              checked={applyVersionFilter}
              onCheckedChange={(checked) => {
                setApplyVersionFilter(checked as boolean);
                if (!checked) {
                  onFiltersChange({ version_no: undefined });
                }
              }}
              disabled={!filters.organization_id}
            />
            <Label
              htmlFor="applyVersionFilter"
              className="text-sm cursor-pointer"
            >
              Apply version filter
            </Label>
          </div>

          {/* From Date */}
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">From:</Label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger
                className="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 h-9 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-[200px]"
                disabled={!filters.organization_id}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.from_date
                  ? format(new Date(filters.from_date), "PPP")
                  : "Pick a date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.from_date ? new Date(filters.from_date) : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      onFiltersChange({
                        from_date: format(date, "yyyy-MM-dd"),
                      });
                    } else {
                      onFiltersChange({ from_date: undefined });
                    }
                    setFromDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">To:</Label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger
                className="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 h-9 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-[200px]"
                disabled={!filters.organization_id || !filters.from_date}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.to_date
                  ? format(new Date(filters.to_date), "PPP")
                  : "Pick a date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.to_date ? new Date(filters.to_date) : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      onFiltersChange({
                        to_date: format(date, "yyyy-MM-dd"),
                      });
                    } else {
                      onFiltersChange({ to_date: undefined });
                    }
                    setToDateOpen(false);
                  }}
                  initialFocus
                  disabled={(date) =>
                    filters.from_date
                      ? date < new Date(filters.from_date)
                      : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear */}
          <Button
            variant="ghost"
            onClick={() => {
              onFiltersChange({
                organization_id: undefined,
                employee_group_id: undefined,
                manager_id: undefined,
                employee_id: undefined,
                schedule_id: undefined,
                version_no: undefined,
                from_date: undefined,
                to_date: undefined,
              });
              setApplyVersionFilter(false);
            }}
          >
            {t("scheduling.monthlyRoster.clearFilters") ||
              t("common.clearFilters")}
          </Button>
        </div>
      </div>
    </div>
  );
};
