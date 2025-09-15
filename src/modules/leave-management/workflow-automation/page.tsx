"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useRouter } from "next/navigation";
import WorkflowHeader from "./components/WorkflowHeader";
import WorkflowList from "./components/WorkflowList";
import useWorkflow from "./hooks/useWorkflow";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function WorkflowAutomationPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

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
    router.push('/leave-management/workflow-automation/add');
  };

  const handleEdit = (workflow: any) => {
    // TODO: Implement edit workflow functionality
    console.log(t('leaveManagement.workflowAutomation.actions.edit') || "Edit workflow:", workflow);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete workflow functionality
    console.log(t('leaveManagement.workflowAutomation.actions.delete') || "Delete workflow:", id);
  };

  const handleToggleStatus = (id: number, status: 'ACTIVE' | 'INACTIVE') => {
    // TODO: Implement toggle workflow status functionality
    console.log(t('leaveManagement.workflowAutomation.actions.activate') || "Toggle workflow status:", id, status);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log(t('common.export') || "Export workflows");
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log(t('common.import') || "Import workflows");
  };

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log(t('common.settings') || "Open workflow settings");
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full relative">
          <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-destructive">
                {t('leaveManagement.workflowAutomation.errorLoading') || t('common.errorLoading') || 'Error loading workflows'}
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
            onAddNew={handleAddNew}
            onExport={handleExport}
            onImport={handleImport}
            onSettings={handleSettings}
          />

          <div className="w-full mt-4">
            <WorkflowList
              workflows={workflowTypes || []}
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
