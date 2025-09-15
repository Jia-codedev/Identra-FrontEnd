"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/Input";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';

interface AccessZonesHeaderProps {
  search: string;
  statusFilter: boolean | undefined;
  typeFilter: string | undefined;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: boolean | undefined) => void;
  onTypeFilterChange: (value: string | undefined) => void;
  onAddNew: () => void;
  onDeleteSelected: () => void;
}

export default function AccessZonesHeader({
  search,
  statusFilter,
  typeFilter,
  selectedCount,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onAddNew,
  onDeleteSelected,
}: AccessZonesHeaderProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t('accessZones.title')}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-normal mb-2">
            {t('accessZones.description')}
          </p>
          {selectedCount > 0 && (
            <p className="text-sm text-primary font-medium">
              {t('common.selectedCount', { count: selectedCount })}
            </p>
          )}
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Search className="h-4 w-4 text-muted-foreground mx-2" />
            <Input
              type="text"
              placeholder={t('accessZones.searchPlaceholder')}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-transparent h-8 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 text-sm"
            />
          </div>
          
          <Select 
            value={typeFilter || "all"} 
            onValueChange={(value) => onTypeFilterChange(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-full sm:w-32 h-10 bg-card/80 border-border">
              <SelectValue placeholder={t('accessZones.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="entry">{t('accessZones.types.entry')}</SelectItem>
              <SelectItem value="exit">{t('accessZones.types.exit')}</SelectItem>
              <SelectItem value="both">{t('accessZones.types.both')}</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={statusFilter?.toString() || "all"} 
            onValueChange={(value) => onStatusFilterChange(value === "all" ? undefined : value === "true")}
          >
            <SelectTrigger className="w-full sm:w-32 h-10 bg-card/80 border-border">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="true">{t('common.active')}</SelectItem>
              <SelectItem value="false">{t('common.inactive')}</SelectItem>
            </SelectContent>
          </Select>

          {selectedCount > 0 && (
            <Button
              onClick={onDeleteSelected}
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto"
            >
              {t('common.deleteSelected')}
            </Button>
          )}
          <Button
            onClick={onAddNew}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t('accessZones.addNew')}
          </Button>
        </div>
      </div>
    </div>
  );
}