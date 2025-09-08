"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import PunchesHeader from "./components/PunchesHeader";
import { PunchViewType } from "./components/PunchesHeader";
import PunchesList from "./components/PunchesList";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import useAttendance from "./hooks/useAttendance";

type ViewMode = "table" | "grid";

export default function PunchesPage() {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [punchViewType, setPunchViewType] = useState<PunchViewType>("self");
  
  // TODO: Get manager status and user ID from user context or API
  // For now, we'll use demo values
  const currentUserId = 1; // This should come from auth context
  const managerId = 1; // This should come from user profile
  const isManager = true; // This should be determined from user roles/permissions

  const {
    data,
    total,
    page,
    limit,
    selectedItems,
    isLoading,
    error,
    handlePageChange,
    handleLimitChange,
    handleFiltersChange,
    handleSelectItem,
    handleSelectAll,
    isAllSelected,
    refresh,
  } = useAttendance({
    initialPage: 1,
    initialLimit: 25,
  });

  // Update filters when search term or punch view type changes
  useEffect(() => {
    const filters: any = { search: searchTerm };
    
    // Add view type filter for managers
    if (isManager) {
      if (punchViewType === 'self') {
        // Show only current user's punches
        filters.employee_id = currentUserId;
      } else if (punchViewType === 'team') {
        // Show punches of employees under this manager
        filters.manager_id = managerId;
      }
    } else {
      // Non-managers can only see their own punches
      filters.employee_id = currentUserId;
    }
    
    handleFiltersChange(filters);
  }, [searchTerm, punchViewType, isManager, currentUserId, managerId]); // Remove handleFiltersChange from dependencies

  const totalPages = Math.ceil(total / limit);

  const handleAddNew = () => {
    // TODO: Implement add new punch functionality
    console.log(t("leaveManagement.punches.actions.add") || "Add new punch");
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log(t("common.export") || "Export punches");
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log(t("common.import") || "Import punches");
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full relative">
          <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-destructive">
                {t("punches.errorLoading") ||
                  t("common.errorLoading") ||
                  "Error loading punches"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {error.message}
              </p>
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
          <PunchesHeader
            selectedCount={selectedItems.length}
            onRefresh={refresh}
            onFiltersChange={handleFiltersChange}
            search={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            punchViewType={punchViewType}
            onPunchViewTypeChange={setPunchViewType}
            isManager={isManager}
          />

          <div className="w-full mt-4">
            <PunchesList
              punches={(data || []).map((item: any) => ({
                ...item,
                Ddate: item.Ddate ?? "", // Provide a default or map accordingly
              }))}
              viewMode={viewMode}
              isLoading={isLoading}
              selected={selectedItems}
              allChecked={isAllSelected}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
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
