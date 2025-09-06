"use client";

import React, { useEffect, useState } from 'react';
import { Search, Table, Grid3X3, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';

export type ViewMode = 'table' | 'grid';

interface LeavesHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  selectedCount: number;
  onDeleteSelected?: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh?: () => void;
}

export const LeavesHeader: React.FC<LeavesHeaderProps> = ({ 
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
            {t('leaveManagement.leaves.title') || t('leaveManagement.leaves')}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-normal mb-2">
            {t('leaveManagement.leaves.description')}
          </p>
          {selectedCount > 0 && (
            <p className="text-sm text-primary font-medium">{t('common.selectedCount', { count: selectedCount })}</p>
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

          {/* Refresh Button */}
          {onRefresh && (
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              size="sm"
              className="px-3"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}

          <div className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`${isRTL ? 'pr-2 pl-1' : 'pl-2 pr-1'} text-xl text-primary/80`}>
              <Search size={22} />
            </span>
            <Input
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2"
            />
            <span className="mx-2 h-6 w-px bg-border" />
            {selectedCount > 0 && onDeleteSelected ? (
              <Button onClick={onDeleteSelected} className="font-semibold text-base px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 transition-all shadow-none" variant="destructive">
                <span className="hidden sm:inline">{t('common.delete')}</span>
                <span className="sm:hidden text-xl leading-none">🗑️</span>
              </Button>
            ) : (
              <Button onClick={onAdd} className="font-semibold text-base px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-none" variant="default">
                <span className="hidden sm:inline">+ {t('common.add')}</span>
                <span className="sm:hidden text-xl leading-none">+</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavesHeader;
