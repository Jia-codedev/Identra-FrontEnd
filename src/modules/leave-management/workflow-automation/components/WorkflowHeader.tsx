"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Search, Plus, FileText, Download, Table2, Grid3X3, Settings, Play } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

interface WorkflowHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onAddNew?: () => void;
  onInitiateWorkflow?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onSettings?: () => void;
}

export default function WorkflowHeader({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddNew,
  onInitiateWorkflow,
  onExport,
  onImport,
  onSettings,
}: WorkflowHeaderProps) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => setSearch(searchTerm), [searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t('leaveManagement.workflowAutomation.title') || 'Workflow Automation'}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-normal mb-2">
            {t('leaveManagement.workflowAutomation.description') || 'Manage automated workflows and approval processes'}
          </p>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          {/* Search and Actions Container */}
          <div className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`${isRTL ? 'pr-2 pl-1' : 'pl-2 pr-1'} text-xl text-primary/80`}>
              <Search size={22} />
            </span>
            <Input
              placeholder={t('leaveManagement.workflowAutomation.searchPlaceholder') || 'Search workflows...'}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2"
            />
            <span className="mx-2 h-6 w-px bg-border" />
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-0 bg-muted/50 border border-border rounded-lg p-0.5 mr-2">
              <Button
                onClick={() => onViewModeChange('table')}
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3"
              >
                <Table2 size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span className="hidden sm:inline">{t('view.table')}</span>
              </Button>
              <Button
                onClick={() => onViewModeChange('grid')}
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3"
              >
                <Grid3X3 size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span className="hidden sm:inline">{t('view.grid')}</span>
              </Button>
            </div>

            <span className="mx-2 h-6 w-px bg-border" />

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {onSettings && (
                <Button variant="ghost" size="sm" onClick={onSettings} className="p-2">
                  <Settings className="w-4 h-4" />
                  <span className="sr-only">{t('common.settings')}</span>
                </Button>
              )}
              {onImport && (
                <Button variant="ghost" size="sm" onClick={onImport} className="p-2">
                  <FileText className="w-4 h-4" />
                  <span className="sr-only">{t('common.import')}</span>
                </Button>
              )}
              {onExport && (
                <Button variant="ghost" size="sm" onClick={onExport} className="p-2">
                  <Download className="w-4 h-4" />
                  <span className="sr-only">{t('common.export')}</span>
                </Button>
              )}
            </div>

            <span className="mx-2 h-6 w-px bg-border" />

            {onAddNew && (
              <Button onClick={onAddNew} className="font-semibold text-base px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-none" variant="default">
                <span className="hidden sm:inline">+ {t('leaveManagement.workflowAutomation.actions.create') || 'Create Workflow'}</span>
                <span className="sm:hidden text-xl leading-none">+</span>
              </Button>
            )}

            {onInitiateWorkflow && (
              <Button 
                onClick={onInitiateWorkflow} 
                className="font-semibold text-base px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all shadow-none ml-2" 
                variant="default"
              >
                <Play className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('leaveManagement.workflowAutomation.actions.initiate') || 'Initiate Request'}</span>
                <span className="sm:hidden">Start</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
