"use client";

import React, { useState } from "react";
import PermissionsHeader from "./components/PermissionsHeader";
import PermissionsList from "./components/PermissionsList";
import usePermissions from "./hooks/usePermissions";

type ViewMode = 'table' | 'grid';

export default function PermissionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const { 
    permissions, 
    page,
    pageSize,
    pageCount,
    total,
    isLoading,
    selected, 
    selectItem,
    selectAll,
    clearSelection,
    setPage,
    setPageSize,
    search,
    setSearch,
    refetch
  } = usePermissions();

  const handleAddNew = () => {
    // TODO: Implement add new permission functionality
    console.log("Add new permission");
  };

  const handleEdit = (permission: any) => {
    // TODO: Implement edit permission functionality
    console.log("Edit permission:", permission);
  };

  const handleDeleteSelected = () => {
    // TODO: Implement delete selected permissions functionality
    console.log("Delete selected permissions:", selected);
    clearSelection();
  };

  const allChecked = selected.length > 0 && selected.length === permissions.length;

  return (
    <div className="border rounded-2xl p-6 space-y-6">
      <PermissionsHeader
        search={search}
        onSearchChange={setSearch}
        onAdd={handleAddNew}
        selectedCount={selected.length}
        onDeleteSelected={handleDeleteSelected}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={refetch}
      />

      <PermissionsList
        permissions={permissions}
        loading={isLoading}
        selected={selected}
        onSelectItem={selectItem}
        onSelectAll={selectAll}
        allChecked={allChecked}
        onRefresh={refetch}
        onEdit={handleEdit}
        viewMode={viewMode}
        currentPage={page}
        totalPages={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        total={total}
      />
    </div>
  );
}
