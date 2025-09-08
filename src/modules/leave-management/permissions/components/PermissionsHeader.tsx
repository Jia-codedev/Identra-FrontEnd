"use client";

import React, { useEffect, useState } from 'react';
import { Search, Table, Grid3X3, Filter, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from '@/components/ui/button';
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
          {/* View Mode Toggle */}
          <div className="flex items-center bg-card/80 border border-border rounded-xl p-1">
            <Button
              onClick={() => onViewModeChange('table')}
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
            >
              <Table className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span className="hidden sm:inline">{t('view.table')}</span>
            </Button>
            <Button
              onClick={() => onViewModeChange('grid')}
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
            >
              <Grid3X3 className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span className="hidden sm:inline">{t('view.grid')}</span>
            </Button>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="h-8 px-3"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <div className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`${isRTL ? 'pr-2 pl-1' : 'pl-2 pr-1'} text-xl text-primary/80`}>
              <Search size={22} />
            </span>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('common.search')}
              className="border-0 bg-transparent outline-none focus:outline-none focus:border-0 focus:ring-0 shadow-none"
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

export default PermissionsHeader;
