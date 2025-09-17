"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";

import RamadanDatesHeader from "../components/RamadanDatesHeader";
import { RamadanDatesTable } from "../components/RamadanDatesTable";
import RamadanDateModal from "../components/RamadanDateModal";
import { useRamadanDates } from "../hooks/useRamadanDates";
import { useCreateRamadanDate, useUpdateRamadanDate, useDeleteRamadanDate } from "../hooks/useMutations";
import { IRamadanDate, CreateRamadanDateRequest, UpdateRamadanDateRequest } from "../types";

const RamadanDatesPage: React.FC = () => {
  const { t } = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRamadanDate, setSelectedRamadanDate] = useState<IRamadanDate | null>(null);

  const {
    ramadanDates,
    selected,
    search,
    page,
    // pageCount, // Commented out unused variables
    pageSize,
    // pageSizeOptions,
    filters,
    allChecked,
    setSearch,
    // setPage,
    // setPageSize,
    setFilters,
    selectRamadanDate,
    selectAll,
    isLoading,
    error,
    refetch,
  } = useRamadanDates();

  const createMutation = useCreateRamadanDate();
  const updateMutation = useUpdateRamadanDate();
  const deleteMutation = useDeleteRamadanDate();

  const handleAddNew = () => {
    setSelectedRamadanDate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ramadanDate: IRamadanDate) => {
    setSelectedRamadanDate(ramadanDate);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t("scheduling.ramadanDates.confirmDelete"))) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting Ramadan date:", error);
      }
    }
  };

  const handleModalSubmit = async (data: CreateRamadanDateRequest | UpdateRamadanDateRequest) => {
    try {
      if (selectedRamadanDate) {
        await updateMutation.mutateAsync({
          id: selectedRamadanDate.ramadan_id,
          data: data as UpdateRamadanDateRequest,
        });
      } else {
        await createMutation.mutateAsync(data as CreateRamadanDateRequest);
      }
      setIsModalOpen(false);
      setSelectedRamadanDate(null);
    } catch (error) {
      console.error("Error saving Ramadan date:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRamadanDate(null);
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (error) {
    return (
      <div className="px-4 py-8 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {t("common.error")}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("scheduling.ramadanDates.loadError")}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6-lg">
      <RamadanDatesHeader
        search={search}
        onSearchChange={setSearch}
        onAddNew={handleAddNew}
        selectedCount={selected.length}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <RamadanDatesTable
        ramadanDates={ramadanDates}
        selected={selected}
        page={page}
        pageSize={pageSize}
        allChecked={allChecked}
        onSelectRamadanDate={selectRamadanDate}
        onSelectAll={selectAll}
        isLoading={isLoading}
        onEditRamadanDate={handleEdit}
        onDeleteRamadanDate={handleDelete}
  onPageChange={() => {}}
  onPageSizeChange={() => {}}
      />

      <RamadanDateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        ramadanDate={selectedRamadanDate}
        isLoading={isMutating}
      />
    </div>
  );
};

export default RamadanDatesPage;
