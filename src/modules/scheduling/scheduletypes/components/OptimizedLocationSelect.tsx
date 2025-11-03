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
import { Check, ChevronsUpDown, Search, X, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import locationsApi from '@/services/masterdata/locations';
import { debounce } from 'lodash';

interface Location {
  location_id: number;
  location_code: string;
  location_eng: string;
  location_arb: string;
  city?: string;
  region_name?: string;
}

interface OptimizedLocationSelectProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const OptimizedLocationSelect: React.FC<OptimizedLocationSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled,
  error,
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

  const { data: locationsData, isLoading, error: queryError } = useQuery({
    queryKey: ['locations-dropdown', debouncedSearch],
    queryFn: () => locationsApi.getLocationsForDropdown({
      name: debouncedSearch,
      limit: 50,
      offset: 0,
    }),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const locations: Location[] = locationsData?.data?.data || [];

  const selectedLocation = locations.find(loc => loc.location_id === value);

  const handleSelect = (locId: string) => {
    const id = locId === 'none' ? undefined : parseInt(locId, 10);
    if (locId === 'none' || isNaN(id!)) {
      onValueChange(undefined);
    } else {
      onValueChange(id);
    }
    setOpen(false);
    setSearch('');
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
              <MapPin className="h-4 w-4 shrink-0" />
              {selectedLocation ? (
                <span className="truncate">
                  {isRTL ? selectedLocation.location_arb : selectedLocation.location_eng}
                </span>
              ) : (
                <span className="truncate">
                  {placeholder || t('scheduling.schedules.selectLocation')}
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
                    {locations.map((location) => (
                      <CommandItem
                        key={location.location_id}
                        value={location.location_id.toString()}
                        onSelect={() => handleSelect(location.location_id.toString())}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === location.location_id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {isRTL ? location.location_arb : location.location_eng}
                          </span>
                          <div className="flex gap-1 text-xs text-muted-foreground">
                            <span>{location.location_code}</span>
                            {location.city && (
                              <>
                                <span>•</span>
                                <span>{location.city}</span>
                              </>
                            )}
                            {location.region_name && (
                              <>
                                <span>•</span>
                                <span>{location.region_name}</span>
                              </>
                            )}
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
