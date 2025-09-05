"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import PunchesHeader from "./components/PunchesHeader";
import PunchesList from "./components/PunchesList";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import useAttendance from "./hooks/useAttendance";

type ViewMode = "table" | "grid";

export default function PunchesPage() {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

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

  // Update filters when search term changes
  useEffect(() => {
    handleFiltersChange({ search: searchTerm });
  }, [searchTerm]); // Remove handleFiltersChange from dependencies

  const totalPages = Math.ceil(total / limit);

  const handleAddNew = () => {
    // TODO: Implement add new punch functionality
    console.log(t('punches.addNew') || "Add new punch");
  };

  const handleEdit = (punch: any) => {
    // TODO: Implement edit punch functionality
    console.log(t('punches.edit') || "Edit punch:", punch);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete punch functionality
    console.log(t('punches.delete') || "Delete punch:", id);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log(t('punches.export') || "Export punches");
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log(t('punches.import') || "Import punches");
  };

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full relative">
          <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-destructive">
                {t('punches.errorLoading') || 'Error loading punches'}
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
          <PunchesHeader
            selectedCount={selectedItems.length}
            onRefresh={refresh}
            onFiltersChange={handleFiltersChange}
            search={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="w-full mt-4">
            <PunchesList
              punches={data || []}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
