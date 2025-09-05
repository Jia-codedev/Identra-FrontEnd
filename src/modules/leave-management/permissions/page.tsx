"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import PermissionsHeader from "./components/PermissionsHeader";
import PermissionsList from "./components/PermissionsList";
import usePermissions from "./hooks/usePermissions";

type ViewMode = 'table' | 'grid';

export default function PermissionsPage() {
  const { t } = useTranslations();
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
    console.log(t('permissions.add') || t('common.add') || "Add new permission");
  };

  const handleEdit = (permission: any) => {
    // TODO: Implement edit permission functionality
    console.log(t('permissions.edit') || t('common.edit') || "Edit permission:", permission);
  };

  const handleDeleteSelected = () => {
    // TODO: Implement delete selected permissions functionality
    console.log(t('permissions.deleteSelected') || t('common.deleteSelected') || "Delete selected permissions:", selected);
    clearSelection();
  };

  const allChecked = selected.length > 0 && selected.length === permissions.length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
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

          <div className="w-full mt-4">
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
        </div>
      </div>
    </div>
  );
}
