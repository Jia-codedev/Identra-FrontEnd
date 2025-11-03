"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import BuildingsHeader from "@/modules/device-and-infra/buildings/components/BuildingsHeader";
import BuildingsList from "@/modules/device-and-infra/buildings/components/BuildingsList";
import BuildingForm from "@/modules/device-and-infra/buildings/components/BuildingForm";
import { useBuildings } from "@/modules/device-and-infra/buildings/hooks/useBuildings";
import useBuildingMutations from "@/modules/device-and-infra/buildings/hooks/useBuildingMutations";
import { Building } from "@/services/device-and-infra/buildingsApi";

export default function BuildingsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

  const {
    buildings,
    search,
    statusFilter,
    typeFilter,
    cityFilter,
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
    setCityFilter,
    setPage,
    setPageSize,
    selectItem,
    selectAll,
    clearSelection,
    pageSizeOptions,
  } = useBuildings();

  const { deleteBuilding, bulkDeleteBuildings } = useBuildingMutations();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleStatusFilterChange = (value: boolean | undefined) => {
    setStatusFilter(value);
  };

  const handleTypeFilterChange = (value: string | undefined) => {
    setTypeFilter(value);
  };

  const handleCityFilterChange = (value: string | undefined) => {
    setCityFilter(value);
  };

  const handleSelectAll = () => {
    selectAll();
  };

  const handleSelectBuilding = (buildingId: string | number) => {
    selectItem(Number(buildingId));
  };

  const handleAddBuilding = () => {
    setEditingBuilding(null);
    setShowForm(true);
  };

  const handleEditBuilding = (building: any) => {
    setEditingBuilding(building.raw);
    setShowForm(true);
  };

  const handleDeleteBuilding = (buildingId: string | number) => {
    deleteBuilding.mutate(Number(buildingId));
  };

  const handleBulkDeleteBuildings = () => {
    if (selected.length > 0) {
      bulkDeleteBuildings.mutate(selected, {
        onSuccess: () => {
          clearSelection();
        },
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBuilding(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <BuildingsHeader
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        cityFilter={cityFilter}
        selectedCount={selected.length}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onCityFilterChange={handleCityFilterChange}
        onAddNew={handleAddBuilding}
        onDeleteSelected={handleBulkDeleteBuildings}
      />

      <BuildingsList
        buildings={buildings}
        selected={selected}
        allChecked={allChecked}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        onSelectItem={handleSelectBuilding}
        onSelectAll={handleSelectAll}
        onEditItem={handleEditBuilding}
        onDeleteItem={handleDeleteBuilding}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {buildings.length > 0 && (
        <CustomPagination
          currentPage={page}
          totalPages={pageCount}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <BuildingForm building={editingBuilding} onClose={handleCloseForm} />
      </Dialog>
    </div>
  );
}
