"use client";

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import AccessZonesHeader from '@/modules/device-and-infra/access-zones/components/AccessZonesHeader';
import AccessZonesList from '@/modules/device-and-infra/access-zones/components/AccessZonesList';
import AccessZoneForm from '@/modules/device-and-infra/access-zones/components/AccessZoneForm';
import { useAccessZones } from '@/modules/device-and-infra/access-zones/hooks/useAccessZones';
import { AccessZone } from '@/services/device-and-infra/accessZonesApi';
import { CustomPagination } from '@/components/common/dashboard/Pagination';

export default function AccessZonesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState<AccessZone | null>(null);

  const {
    accessZones,
    search,
    statusFilter,
    typeFilter,
    selected,
    isLoading,
    page,
    pageSize,
    pageCount,
    total,
    allChecked,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    setPage,
    setPageSize,
    selectItem,
    selectAll,
    clearSelection,
    pageSizeOptions,
  } = useAccessZones();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusFilterChange = (value: boolean | undefined) => {
    setStatusFilter(value);
  };

  const handleTypeFilterChange = (value: string | undefined) => {
    setTypeFilter(value);
  };

  const handleSelectAll = () => {
    selectAll();
  };

  const handleSelectZone = (zoneId: number) => {
    selectItem(zoneId);
  };

  const handleAddZone = () => {
    setEditingZone(null);
    setShowForm(true);
  };

  const handleEditZone = (zone: any) => {
    setEditingZone(zone.raw); // Use the raw AccessZone data
    setShowForm(true);
  };

  const handleDeleteZone = (zoneId: number) => {
    // TODO: Implement delete functionality
    console.log("Delete zone:", zoneId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingZone(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <AccessZonesHeader
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        selectedCount={selected.length}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onAddNew={handleAddZone}
        onDeleteSelected={() => {
          // TODO: Implement bulk delete
          console.log("Delete selected zones:", selected);
          clearSelection();
        }}
      />
      
      <AccessZonesList
        accessZones={accessZones}
        selected={selected}
        allChecked={allChecked}
        isLoading={isLoading}
        onSelectItem={handleSelectZone}
        onSelectAll={handleSelectAll}
        onEditItem={handleEditZone}
        onDeleteItem={handleDeleteZone}
      />
      <CustomPagination
        currentPage={page}
        totalPages={pageCount}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <AccessZoneForm
          zone={editingZone}
          onClose={handleCloseForm}
        />
      </Dialog>
    </div>
  );
}