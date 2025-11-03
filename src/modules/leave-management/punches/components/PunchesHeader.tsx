"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { RefreshCw, Download, Filter, Search } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from '@/providers/language-provider';
import useAttendanceMutations from "../hooks/useMutations";

interface Props {
  selectedCount: number;
  onRefresh: () => void;
  onFiltersChange: (filters: any) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const PunchesHeader: React.FC<Props> = ({
  selectedCount,
  onRefresh,
  onFiltersChange,
  search,
  onSearchChange,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const mutations = useAttendanceMutations();
  const [searchTerm, setSearchTerm] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
    onFiltersChange({ 
      search: value,
      employee_no: value
    });
  };

  const handleExport = () => {
    mutations.exportData.mutate({});
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 ">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t('leaveManagement.punches.title') || 'Punches & Attendance'}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-normal mb-2">
            {t('leaveManagement.punches.description') || 'Manage employee attendance records and punch data'}
          </p>
          {selectedCount > 0 && (
            <p className="text-sm text-primary font-medium">
              {t('leaveManagement.common.selectedCount', { count: selectedCount }) || `${selectedCount} records selected`}
            </p>
          )}
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`${isRTL ? 'pr-2 pl-1' : 'pl-2 pr-1'} text-xl text-primary/80`}>
              <Search size={22} />
            </span>
            <Input
              placeholder={t('leaveManagement.punches.searchPlaceholder') || 'Search by employee number...'}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2"
            />
            <span className="mx-2 h-6 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="px-2 py-1 rounded-lg"
              title={t('leaveManagement.common.filters') || 'Filters'}
            >
              <Filter className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={mutations.exportData.isPending}
              className="px-2 py-1 rounded-lg"
              title={t('leaveManagement.common.export') || 'Export'}
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="px-2 py-1 rounded-lg"
              title={t('leaveManagement.common.refresh') || 'Refresh'}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                {t('leaveManagement.punches.fromDate') || 'From Date'}
              </label>
              <Input
                type="date"
                onChange={(e) => onFiltersChange({ from_date: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                {t('leaveManagement.punches.toDate') || 'To Date'}
              </label>
              <Input
                type="date"
                onChange={(e) => onFiltersChange({ to_date: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                {t('leaveManagement.punches.status') || 'Status'}
              </label>
              <select
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                onChange={(e) => onFiltersChange({ status: e.target.value })}
              >
                <option value="">{t('leaveManagement.punches.allStatus') || 'All Status'}</option>
                <option value="Present">{t('leave-management.punches.present') || 'Present'}</option>
                <option value="Absent">{t('leave-management.punches.absent') || 'Absent'}</option>
                <option value="Late">{t('leave-management.punches.late') || 'Late'}</option>
                <option value="Half Day">{t('leave-management.punches.halfDay') || 'Half Day'}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchesHeader;
