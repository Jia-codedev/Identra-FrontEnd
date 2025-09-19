"use client";

import React from 'react';
import { Search, Filter, Calendar, Clock, Users, List } from 'lucide-react';
import { Input } from "@/components/ui/Input";;
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HolidayFilters } from '../types';
// Using simple segmented buttons for better UX instead of Toggle

interface HolidaysHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddHoliday: () => void;
  selectedCount: number;
  onDeleteSelected?: () => void;
  filters: HolidayFilters;
  onFiltersChange: (filters: Partial<HolidayFilters>) => void;
  // view mode: 'table' or 'calendar'
  viewMode?: 'table' | 'calendar';
  onViewModeChange?: (mode: 'table' | 'calendar') => void;
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
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  
  // Use a more reliable approach for months
  const getMonthName = (monthNum: number) => {
    try {
      return t(`common.months.${['january', 'february', 'march', 'april', 'may', 'june', 
                 'july', 'august', 'september', 'october', 'november', 'december'][monthNum - 1]}`);
    } catch {
      // Fallback to English month names
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return monthNames[monthNum - 1];
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1)
  }));

  return (
    <div className="sticky top-0 z-10 bg-background rounded-t-3xl px-2 sm:px-4 py-4 sm:py-8 ">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Title and Description */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
              {t('scheduling.holidays.title')}
            </h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Segmented view toggle for better UX */}
            <div className="flex items-center">
              <div role="tablist" aria-label="View mode" className="inline-flex rounded-lg bg-muted/10 p-1">
                <button
                  role="tab"
                  aria-pressed={viewMode !== 'calendar'}
                  onClick={() => onViewModeChange && onViewModeChange('table')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring ${!viewMode || viewMode === 'table' ? 'bg-card shadow text-card-foreground' : 'text-muted-foreground'}`}
                >
                  <List size={14} />
                  <span className="hidden sm:inline">Table</span>
                </button>

                <button
                  role="tab"
                  aria-pressed={viewMode === 'calendar'}
                  onClick={() => onViewModeChange && onViewModeChange('calendar')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring ${viewMode === 'calendar' ? 'bg-card shadow text-card-foreground' : 'text-muted-foreground'}`}
                >
                  <Calendar size={14} />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
              </div>
            </div>
            {selectedCount > 0 && onDeleteSelected && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteSelected}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                {t('common.deleteSelected')}
              </Button>
            )}
            <Button onClick={onAddHoliday} className="gap-2 text-xs sm:text-sm h-8 sm:h-9">
              <Calendar size={14} className="sm:size-4" />
              <span className="hidden sm:inline">{t('common.add')}</span>
              <span className="sm:hidden">{t('common.add')}</span>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 w-full">
          {/* Search */}
          <div className={`flex flex-2 items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`${isRTL ? 'pr-2 pl-1' : 'pl-2 pr-1'} text-lg sm:text-xl text-primary/80`}>
              <Search size={18} className="sm:size-[22px]" />
            </span>
            <Input
              placeholder={t('scheduling.holidays.searchPlaceholder')}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex flex-wrap gap-2">
              {/* Year Filter */}
              <div className="flex items-center gap-1">
                <Calendar size={14} className="sm:size-4 text-muted-foreground hidden sm:block" />
                <Select
                  value={filters.year?.toString() || "all"}
                  onValueChange={(value) => 
                    onFiltersChange({ 
                      year: value === "all" ? undefined : parseInt(value)
                    })
                  }
                >
                  <SelectTrigger className="w-[90px] sm:w-[120px] h-8 sm:h-9 text-xs sm:text-sm">
                    <SelectValue placeholder={t('common.year')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allYears')}</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Month Filter */}
              <div className="flex items-center gap-1">
                <Calendar size={14} className="sm:size-4 text-muted-foreground hidden sm:block" />
                <Select
                  value={filters.month?.toString() || "all"}
                  onValueChange={(value) => 
                    onFiltersChange({ 
                      month: value === "all" ? undefined : parseInt(value)
                    })
                  }
                >
                  <SelectTrigger className="w-[100px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm">
                    <SelectValue placeholder={t('common.month')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allMonths')}</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recurring Filter */}
              <div className="flex items-center gap-1">
                <Clock size={14} className="sm:size-4 text-muted-foreground hidden sm:block" />
                <Select
                  value={filters.recurring_flag === undefined ? "all" : filters.recurring_flag.toString()}
                  onValueChange={(value) => 
                    onFiltersChange({ 
                      recurring_flag: value === "all" ? undefined : value === "true"
                    })
                  }
                >
                  <SelectTrigger className="w-[110px] sm:w-[160px] h-8 sm:h-9 text-xs sm:text-sm">
                    <SelectValue placeholder={t('scheduling.holidays.recurringFilter')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('scheduling.holidays.allTypes')}</SelectItem>
                    <SelectItem value="true">{t('scheduling.holidays.recurringOnly')}</SelectItem>
                    <SelectItem value="false">{t('scheduling.holidays.oneTimeOnly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Public Holiday Filter */}
              <div className="flex items-center gap-1">
                <Users size={14} className="sm:size-4 text-muted-foreground hidden sm:block" />
                <Select
                  value={filters.public_holiday_flag === undefined ? "all" : filters.public_holiday_flag.toString()}
                  onValueChange={(value) => 
                    onFiltersChange({ 
                      public_holiday_flag: value === "all" ? undefined : value === "true"
                    })
                  }
                >
                  <SelectTrigger className="w-[110px] sm:w-[160px] h-8 sm:h-9 text-xs sm:text-sm">
                    <SelectValue placeholder={t('scheduling.holidays.publicHolidayFilter')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('scheduling.holidays.allHolidays')}</SelectItem>
                    <SelectItem value="true">{t('scheduling.holidays.publicOnly')}</SelectItem>
                    <SelectItem value="false">{t('scheduling.holidays.privateOnly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
