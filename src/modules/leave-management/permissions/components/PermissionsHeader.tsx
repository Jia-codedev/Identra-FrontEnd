"use client";

import React, { useEffect, useState } from 'react';
import { Search, Table, Grid3X3, Filter, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';

export type ViewMode = 'table' | 'grid';

interface PermissionsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  selectedCount: number;
  onDeleteSelected?: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
}

export const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({ 
  search, 
  onSearchChange, 
  onAdd, 
  selectedCount, 
  onDeleteSelected,
  viewMode,
  onViewModeChange,
  onRefresh
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => setSearchTerm(search), [search]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t('leaveManagement.permissions.title')}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-normal mb-2">
            {t('leaveManagement.permissions.description')}
          </p>
          {selectedCount > 0 && (
            <p className="text-sm text-primary font-medium">
              {t('common.selectedCount', { count: selectedCount })}
            </p>
          )}
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          {/* View Toggle */}
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as ViewMode)}>
            <ToggleGroupItem value="table" aria-label="Table view" size="sm">
              <Table className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`${isRTL ? 'pr-2 pl-1' : 'pl-2 pr-1'} text-xl text-primary/80`}>
              <Search size={22} />
            </span>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('leaveManagement.permissions.actions.search')}
              className="border-0 bg-transparent outline-none focus:outline-none focus:border-0 focus:ring-0 shadow-none"
            />
            <span className="mx-2 h-6 w-px bg-border" />
            
            {/* Refresh Button */}
            <Button 
              onClick={onRefresh} 
              variant="ghost" 
              size="sm"
              className="px-2 py-1 rounded-lg"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            {selectedCount > 0 && onDeleteSelected && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteSelected}
                className="h-10"
              >
                {t('common.deleteSelected', { count: selectedCount })}
              </Button>
            )}
            <Button onClick={onAdd} className="h-10">
              {t('leaveManagement.permissions.actions.add')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsHeader;
