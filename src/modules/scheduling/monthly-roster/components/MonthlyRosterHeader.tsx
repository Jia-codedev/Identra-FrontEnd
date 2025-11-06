"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Users, Building2, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
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

  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        setOrgLoading(true);
        const res = await organizationsApi.getOrganizationsForDropdown({
          name: orgSearch,
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
      try {
        setManagerLoading(true);
        // Load 10 records by default, or search results
        const res = await employeeApi.searchEmployees(managerSearch, 10);
        setManagers(res?.data?.data || []);
      } finally {
        setManagerLoading(false);
      }
    };
    loadManagers();
  }, [managerSearch]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setEmployeeLoading(true);
        const res = await employeeApi.searchEmployees(employeeSearch, 10);
        setEmployees(res?.data?.data || []);
      } finally {
        setEmployeeLoading(false);
      }
    };
    loadEmployees();
  }, [employeeSearch]);

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

  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - 5 + i
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
          day: filters.day,
          finalize_flag: filters.finalize_flag,
          month: filters.month,
          year: filters.year,
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
      if (payload.year) fnParts.push(String(payload.year));
      if (payload.month) fnParts.push(String(payload.month));
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
              <Calendar className="h-4 w-4" />
              {t("scheduling.monthlyRoster.addRoster")}
            </Button>
            {onAddSampleData && (
              <Button
                onClick={onAddSampleData}
                variant="outline"
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
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
              <Button variant="outline" className="w-[220px] justify-between">
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
              <Button variant="outline" className="w-[200px] justify-between">
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
              <Button variant="outline" className="w-[200px] justify-between">
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
              <Button variant="outline" className="w-[200px] justify-between">
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
              <Button variant="outline" className="w-[180px] justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
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
            />
            <Label
              htmlFor="applyVersionFilter"
              className="text-sm cursor-pointer"
            >
              Apply version filter
            </Label>
          </div>

          {/* Day filter */}
          <Popover open={dayOpen} onOpenChange={setDayOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {filters.day ? `Day ${filters.day}` : "Choose Day"}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-2">
              <div className="grid grid-cols-7 gap-1">
                <Button
                  variant="ghost"
                  className="col-span-7 h-8 text-xs"
                  onClick={() => {
                    onFiltersChange({ day: undefined });
                    setDayOpen(false);
                  }}
                >
                  All Days
                </Button>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <Button
                    key={d}
                    variant="ghost"
                    className="h-8 text-xs"
                    onClick={() => {
                      onFiltersChange({ day: d });
                      setDayOpen(false);
                    }}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Month */}
          <Popover open={monthOpen} onOpenChange={setMonthOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {months.find((m) => m.value === filters.month)?.label ||
                    t("common.month")}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-2">
              <div className="grid grid-cols-3 gap-1">
                {months.map((m) => (
                  <Button
                    key={m.value}
                    variant="ghost"
                    className="h-8"
                    onClick={() => {
                      onFiltersChange({ month: m.value });
                      setMonthOpen(false);
                    }}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Year */}
          <Popover open={yearOpen} onOpenChange={setYearOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {filters.year || new Date().getFullYear()}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="grid grid-cols-2 gap-1">
                {years.map((y) => (
                  <Button
                    key={y}
                    variant="ghost"
                    className="h-8"
                    onClick={() => {
                      onFiltersChange({ year: y });
                      setYearOpen(false);
                    }}
                  >
                    {y}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

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
                day: undefined,
                month: undefined,
                year: undefined,
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
