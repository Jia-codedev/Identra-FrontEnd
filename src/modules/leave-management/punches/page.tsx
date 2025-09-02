"use client";

import React, { useState, useEffect } from "react";
import PunchesHeader from "./components/PunchesHeader";
import PunchesList from "./components/PunchesList";
import useAttendance from "./hooks/useAttendance";

type ViewMode = "table" | "grid";

export default function PunchesPage() {
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
    console.log("Add new punch");
  };

  const handleEdit = (punch: any) => {
    // TODO: Implement edit punch functionality
    console.log("Edit punch:", punch);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete punch functionality
    console.log("Delete punch:", id);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export punches");
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log("Import punches");
  };

  if (error) {
    return (
      <div className="border rounded-2xl p-6">
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-red-600">
            Error loading punches
          </h3>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-2xl p-6 space-y-6">
      <PunchesHeader
        selectedCount={selectedItems.length}
        onRefresh={refresh}
        onFiltersChange={handleFiltersChange}
        search={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <PunchesList
        punches={data || []}
        viewMode={viewMode}
        currentPage={page}
        totalPages={totalPages}
        pageSize={limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handleLimitChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
