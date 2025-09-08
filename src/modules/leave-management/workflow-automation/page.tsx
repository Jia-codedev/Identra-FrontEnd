"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useRouter } from "next/navigation";
import WorkflowHeader from "./components/WorkflowHeader";
import WorkflowList from "./components/WorkflowList";
import useWorkflow from "./hooks/useWorkflow";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

type ViewMode = 'table' | 'grid';

export default function WorkflowAutomationPage() {
  const { t } = useTranslations();
  const router = useRouter();
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

  // Sample data for testing if no real data is available
  const sampleWorkflows = workflowTypes && workflowTypes.length > 0 ? workflowTypes : [
    {
      id: "wf-001",
      name: "Leave Approval Workflow",
      description: "Automatic approval workflow for employee leave requests",
      type: "APPROVAL" as const,
      status: "ACTIVE" as const,
      triggerCondition: "Leave request submitted",
      assignedUsers: ["manager@company.com", "hr@company.com"],
      approvalLevels: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastExecuted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      executionCount: 15
    },
    {
      id: "wf-002",
      name: "Overtime Notification",
      description: "Notify managers when employees work overtime",
      type: "NOTIFICATION" as const,
      status: "ACTIVE" as const,
      triggerCondition: "Work hours > 8",
      assignedUsers: ["manager@company.com"],
      approvalLevels: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      executionCount: 8
    },
    {
      id: "wf-003",
      name: "Late Arrival Escalation",
      description: "Escalate repeated late arrivals to HR",
      type: "ESCALATION" as const,
      status: "DRAFT" as const,
      triggerCondition: "Late arrival > 3 times in month",
      assignedUsers: ["hr@company.com"],
      approvalLevels: 1,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      executionCount: 0
    }
  ];

  const handleAddNew = () => {
    // Navigate to generate workflows page
    router.push("/leave-management/workflow-automation/generate-workflows");
  };

  const handleInitiateWorkflow = () => {
    // Navigate to initiate workflow page  
    router.push("/leave-management/workflow-automation/initiate-workflow");
  };

  const handleEdit = (workflow: any) => {
    // TODO: Implement edit workflow functionality
    console.log(t('leaveManagement.workflowAutomation.actions.edit') || "Edit workflow:", workflow);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete workflow functionality
    console.log(t('leaveManagement.workflowAutomation.actions.delete') || "Delete workflow:", id);
  };

  const handleToggleStatus = (id: string, status: 'ACTIVE' | 'INACTIVE') => {
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
                {t('leaveManagement.workflowAutomation.errorLoading') || 'Error loading workflows'}
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
            onInitiateWorkflow={handleInitiateWorkflow}
            onExport={handleExport}
            onImport={handleImport}
            onSettings={handleSettings}
          />

          <div className="w-full mt-4">
            <WorkflowList
              workflows={sampleWorkflows || []}
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
