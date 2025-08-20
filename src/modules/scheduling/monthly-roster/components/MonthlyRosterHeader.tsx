"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import employeeGroupApi from '@/services/employeemaster/employeeGroup';
import organizationsApi from '@/services/masterdata/organizations';
import { MonthlyRosterFilters } from '../types';
import { useMonthlyRosterMutations } from '../hooks/useMutations';

interface MonthlyRosterHeaderProps {
  filters: MonthlyRosterFilters;
  onFiltersChange: (filters: Partial<MonthlyRosterFilters>) => void;
  onAddRoster?: () => void;
  onAddSampleData?: () => void;
}

export const MonthlyRosterHeader: React.FC<MonthlyRosterHeaderProps> = ({ filters, onFiltersChange, onAddRoster, onAddSampleData }) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  // Organizations dropdown
  const [orgOpen, setOrgOpen] = useState(false);
  const [orgSearch, setOrgSearch] = useState('');
  const [orgs, setOrgs] = useState<any[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);

  // Employee groups dropdown
  const [egOpen, setEgOpen] = useState(false);
  const [egSearch, setEgSearch] = useState('');
  const [egs, setEgs] = useState<any[]>([]);
  const [egLoading, setEgLoading] = useState(false);

  // Month/year state
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        setOrgLoading(true);
        const res = await organizationsApi.getOrganizationsForDropdown({ name: orgSearch });
        setOrgs(res?.data?.data || []);
      } finally {
        setOrgLoading(false);
      }
    };
    if (orgOpen) loadOrgs();
  }, [orgOpen, orgSearch]);

  useEffect(() => {
    const loadEgs = async () => {
      try {
        setEgLoading(true);
        const res = await employeeGroupApi.getEmployeeGroupsForDropdown(egSearch);
        setEgs(res?.data?.data || []);
      } finally {
        setEgLoading(false);
      }
    };
    if (egOpen) loadEgs();
  }, [egOpen, egSearch]);

  const selectedOrg = useMemo(() => orgs.find(o => o.organization_id === filters.organization_id), [orgs, filters.organization_id]);
  const selectedEg = useMemo(() => egs.find(g => g.employee_group_id === filters.employee_group_id), [egs, filters.employee_group_id]);

  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' },
  ];

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  const { importMutation, exportMutation } = useMonthlyRosterMutations();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    if (!fileInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        try {
          await importMutation.mutateAsync(fd);
        } catch (err) {
          console.error('Import failed', err);
        }
      };
      fileInputRef.current = input as HTMLInputElement;
    }
    fileInputRef.current.click();
  };

  const handleExportClick = async () => {
    if (!filters.organization_id || !filters.month || !filters.year) {
      // prefer client to ensure export filters are set
      alert('Select organization, month and year before export');
      return;
    }
    try {
      const blobRes = await exportMutation.mutateAsync({ organization_id: filters.organization_id!, month: filters.month!, year: filters.year!, employee_group_id: filters.employee_group_id });
      const blob = blobRes?.data;
      if (!blob) throw new Error('No blob returned');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monthly_roster_${filters.organization_id}_${filters.year}_${filters.month}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-6 border-b">
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">Monthly Roster</h1>
            <p className="text-muted-foreground">Assign schedules per day for the month</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddRoster} className="gap-2">
              <Calendar className="h-4 w-4" />
              Add Monthly Roster
            </Button>
            {onAddSampleData && (
              <Button onClick={onAddSampleData} variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Add Sample Data
              </Button>
            )}
            <Button variant="outline" onClick={handleImportClick}>Import</Button>
            <Button variant="outline" onClick={handleExportClick}>Export</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Organization filter */}
          <Popover open={orgOpen} onOpenChange={setOrgOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {selectedOrg ? (isRTL ? selectedOrg.organization_name_arb : selectedOrg.organization_name_eng) : 'Select Organization'}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <div className="p-2">
                <Input placeholder="Search" value={orgSearch} onChange={(e) => setOrgSearch(e.target.value)} className="h-8" />
              </div>
              <div className="max-h-[240px] overflow-auto">
                {orgLoading ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start h-8 text-xs" onClick={() => onFiltersChange({ organization_id: undefined })}>All</Button>
                    {orgs.map(org => (
                      <Button key={org.organization_id} variant="ghost" className="w-full justify-start h-8 text-xs" onClick={() => onFiltersChange({ organization_id: org.organization_id })}>
                        {isRTL ? org.organization_name_arb : org.organization_name_eng}
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
                  {selectedEg ? (isRTL ? selectedEg.group_name_arb : selectedEg.group_name_eng) : 'Select Employee Group'}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <div className="p-2">
                <Input placeholder="Search" value={egSearch} onChange={(e) => setEgSearch(e.target.value)} className="h-8" />
              </div>
              <div className="max-h-[240px] overflow-auto">
                {egLoading ? (
                  <div className="p-2 text-sm text-center text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start h-8 text-xs" onClick={() => onFiltersChange({ employee_group_id: undefined })}>All</Button>
                    {egs.map(g => (
                      <Button key={g.employee_group_id} variant="ghost" className="w-full justify-start h-8 text-xs" onClick={() => onFiltersChange({ employee_group_id: g.employee_group_id })}>
                        {isRTL ? g.group_name_arb : g.group_name_eng}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Month */}
          <Popover open={monthOpen} onOpenChange={setMonthOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {months.find(m => m.value === filters.month)?.label || 'Month'}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-2">
              <div className="grid grid-cols-3 gap-1">
                {months.map(m => (
                  <Button key={m.value} variant="ghost" className="h-8" onClick={() => onFiltersChange({ month: m.value })}>{m.label}</Button>
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
                {years.map(y => (
                  <Button key={y} variant="ghost" className="h-8" onClick={() => onFiltersChange({ year: y })}>{y}</Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear */}
          <Button variant="ghost" onClick={() => onFiltersChange({ organization_id: undefined, employee_group_id: undefined, month: undefined, year: undefined })}>Clear Filters</Button>
        </div>
      </div>
    </div>
  );
}
