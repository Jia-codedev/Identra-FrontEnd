"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import WorkflowHeader from "./components/WorkflowHeader";
import WorkflowList from "./components/WorkflowList";
import useWorkflow from "./hooks/useWorkflow";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

type ViewMode = 'table' | 'grid';

export default function WorkflowAutomationPage() {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const { 
    workflowTypes, 
    total,
    page,
    limit,
    isLoading, 
    error,
    handlePageChange,
    handleLimitChange,
    handleFiltersChange
  } = useWorkflow({
    initialPage: 1,
    initialLimit: 25,
  });

  // Update filters when search term changes
  useEffect(() => {
    handleFiltersChange({ search: searchTerm });
  }, [searchTerm]); // Remove handleFiltersChange from dependencies

  const totalPages = Math.ceil(total / limit);

  const handleAddNew = () => {
    // TODO: Implement add new workflow functionality
    console.log("Add new workflow");
  };

  const handleEdit = (workflow: any) => {
    // TODO: Implement edit workflow functionality
    console.log("Edit workflow:", workflow);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete workflow functionality
    console.log("Delete workflow:", id);
  };

  const handleToggleStatus = (id: string, status: 'ACTIVE' | 'INACTIVE') => {
    // TODO: Implement toggle workflow status functionality
    console.log("Toggle workflow status:", id, status);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export workflows");
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log("Import workflows");
  };

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log("Open workflow settings");
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full relative">
          <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-destructive">
                {t('common.error')} {t('workflowAutomation.errorLoading')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
          <WorkflowHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddNew={handleAddNew}
            onExport={handleExport}
            onImport={handleImport}
            onSettings={handleSettings}
          />

          <div className="w-full mt-4">
            <WorkflowList
              workflows={workflowTypes || []}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-4">
            <CustomPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={limit}
              pageSizeOptions={[5, 10, 20, 50]}
              onPageSizeChange={handleLimitChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
