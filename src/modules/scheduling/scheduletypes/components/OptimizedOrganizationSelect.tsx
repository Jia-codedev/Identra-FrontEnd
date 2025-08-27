"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Search, X, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import organizationsApi from '@/services/masterdata/organizations';
import { debounce } from 'lodash';

interface Organization {
  organization_id: number;
  organization_code: string;
  organization_eng: string;
  organization_arb: string;
}

interface OptimizedOrganizationSelectProps {
  value?: number;
  onValueChange: (value: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const OptimizedOrganizationSelect: React.FC<OptimizedOrganizationSelectProps> = ({
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

  // Debounce search to avoid too many API calls
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

  // Fetch organizations with search
  const { data: organizationsData, isLoading, error: queryError } = useQuery({
    queryKey: ['organizations-dropdown', debouncedSearch],
    queryFn: () => organizationsApi.getOrganizationsForDropdown({
      name: debouncedSearch,
      limit: 50, // Limit results for performance
      offset: 0,
    }),
    enabled: true, // Always enabled to allow initial data load
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const organizations: Organization[] = organizationsData?.data?.data || [];

  // Find selected organization
  const selectedOrg = organizations.find(org => org.organization_id === value);

  const handleSelect = (orgId: string) => {
    const id = orgId === 'none' ? undefined : parseInt(orgId);
    onValueChange(id);
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
              <Building2 className="h-4 w-4 shrink-0" />
              {selectedOrg ? (
                <span className="truncate">
                  {isRTL ? selectedOrg.organization_arb : selectedOrg.organization_eng}
                </span>
              ) : (
                <span className="truncate">
                  {placeholder || t('scheduling.schedules.selectOrganization')}
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
                    {organizations.map((org) => (
                      <CommandItem
                        key={org.organization_id}
                        value={org.organization_id.toString()}
                        onSelect={() => handleSelect(org.organization_id.toString())}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === org.organization_id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {isRTL ? org.organization_arb : org.organization_eng}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {org.organization_code}
                          </span>
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
