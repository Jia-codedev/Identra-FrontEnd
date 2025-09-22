"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { useQuery } from '@tanstack/react-query';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/Input";;
import { Check, ChevronsUpDown, Search, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import schedulesApi from '@/services/scheduling/schedules';
import { debounce } from 'lodash';

interface Schedule {
  schedule_id: number;
  schedule_code: string;
  organization_id: number;
  organization_eng?: string;
  organization_arb?: string;
  in_time?: string;
  out_time?: string;
  sch_color?: string;
}

interface OptimizedParentScheduleSelectProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  organizationId?: number;
  excludeScheduleId?: number; 
  refreshTrigger?: number;
}

export const OptimizedParentScheduleSelect: React.FC<OptimizedParentScheduleSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled,
  error,
  organizationId,
  excludeScheduleId,
  refreshTrigger, 
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debouncedSetSearch = useMemo(
    () => debounce((searchValue: string) => {
      setDebouncedSearch(searchValue);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(search);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [search, debouncedSetSearch]);
  const { data: schedulesData, isLoading, error: queryError } = useQuery({
    queryKey: ['parent-schedules-search', debouncedSearch, organizationId, refreshTrigger],
    queryFn: () => schedulesApi.getSchedulesForDropdown({
      status_flag: true,
      organization_id: organizationId,
    }),
    enabled: true,
    staleTime: 10 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false, 
  });

  let schedules: Schedule[] = schedulesData?.data?.data || [];
  const [selectedFallback, setSelectedFallback] = useState<Schedule | undefined>(undefined);
  
  if (debouncedSearch) {
    schedules = schedules.filter((schedule: any) => 
      schedule.schedule_code?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }
  
  if (excludeScheduleId) {
    schedules = schedules.filter((schedule: any) => schedule.schedule_id !== excludeScheduleId);
  }
  
  schedules = schedules.slice(0, 50);

  const selectedSchedule = schedules.find(sch => sch.schedule_id === value);

  useEffect(() => {
    const loadSelectedIfMissing = async () => {
      if (value && !selectedSchedule) {
        try {
          const res = await schedulesApi.getScheduleById(value);
          const sch: Schedule | undefined = res?.data?.data;
          if (sch) setSelectedFallback(sch);
        } catch (_) {
        }
      } else if (!value) {
        setSelectedFallback(undefined);
      }
    };
    loadSelectedIfMissing();
  }, [value, selectedSchedule]);

  const effectiveSelected = selectedSchedule ?? selectedFallback;

  const handleSelect = (schId: string) => {
    const id = schId === 'none' ? undefined : parseInt(schId, 10);
    if (schId === 'none' || isNaN(id!)) {
      onValueChange(undefined);
    } else {
      onValueChange(id);
    }
    setOpen(false);
    setSearch('');
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toTimeString().slice(0, 5);
    } catch {
      return timeString;
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <Clock className="h-4 w-4 shrink-0" />
              {effectiveSelected ? (
                <div className="flex items-center gap-2 truncate">
          <span className="truncate">{effectiveSelected?.schedule_code}</span>
          {effectiveSelected?.sch_color && (
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: effectiveSelected.sch_color }}
                    />
                  )}
                </div>
              ) : (
                <span className="truncate">
                  {placeholder || t('scheduling.schedules.selectParentSchedule')}
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder={t('common.search') + '...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setSearch('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <CommandList className="max-h-[200px]">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t('common.loading')}
                </div>
              ) : queryError ? (
                <div className="p-4 text-center text-sm text-destructive">
                  {t('common.errorLoading')}
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {t('common.noResults')}
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="none"
                      onSelect={() => handleSelect('none')}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {t('common.none')}
                    </CommandItem>
                    {schedules.map((schedule) => (
                      <CommandItem
                        key={schedule.schedule_id}
                        value={schedule.schedule_id.toString()}
                        onSelect={() => handleSelect(schedule.schedule_id.toString())}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === schedule.schedule_id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{schedule.schedule_code}</span>
                              {schedule.sch_color && (
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: schedule.sch_color }}
                                />
                              )}
                            </div>
                            <div className="flex gap-1 text-xs text-muted-foreground">
                              {schedule.organization_eng && (
                                <span>{isRTL ? schedule.organization_arb : schedule.organization_eng}</span>
                              )}
                              {schedule.in_time && schedule.out_time && (
                                <>
                                  {schedule.organization_eng && <span>•</span>}
                                  <span>{formatTime(schedule.in_time)} - {formatTime(schedule.out_time)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
