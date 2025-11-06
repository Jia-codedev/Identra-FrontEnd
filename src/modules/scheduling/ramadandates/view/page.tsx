"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";

import RamadanDatesHeader from "../components/RamadanDatesHeader";
import { RamadanDatesTable } from "../components/RamadanDatesTable";
import RamadanDateModal from "../components/RamadanDateModal";
import { useRamadanDates } from "../hooks/useRamadanDates";
import { CommonDeleteModal } from "@/components/common/CommonDeleteModal";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";
import {
  useCreateRamadanDate,
  useUpdateRamadanDate,
  useDeleteRamadanDate,
} from "../hooks/useMutations";
import {
  IRamadanDate,
  CreateRamadanDateRequest,
  UpdateRamadanDateRequest,
} from "../types";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

const RamadanDatesPage: React.FC = () => {
  const { t } = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });
  const [selectedRamadanDate, setSelectedRamadanDate] =
    useState<IRamadanDate | null>(null);

  const {
    ramadanDates,
    selected,
    search,
    page,
    pageCount,
    setPage,
    setPageSize,
    pageSize,
    pageSizeOptions,
    filters,
    allChecked,
    setSearch,
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

  const { canView, canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "roster-management",
    "ramadan-hours"
  );
  console.log("Privileges:", { canView, canCreate, canEdit, canDelete });

  const handleAddNew = () => {
    setSelectedRamadanDate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ramadanDate: IRamadanDate) => {
    setSelectedRamadanDate(ramadanDate);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (
    data: CreateRamadanDateRequest | UpdateRamadanDateRequest
  ) => {
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

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    try {
      if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
        deleteMutation.mutateAsync(deleteDialog.id);
      } else if (deleteDialog.type === "bulk" && selected.length > 0) {
        selected.forEach((id) => deleteMutation.mutateAsync(id));
      }
    } catch (error) {
      console.error("Error deleting Ramadan date:", error);
    } finally {
      setDeleteDialog({ open: false, type: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

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
        canDelete={canDelete}
        canCreate={canCreate}
        search={search}
        onSearchChange={setSearch}
        onAddNew={handleAddNew}
        selectedCount={selected.length}
        filters={filters}
        onDeleteSelected={handleDeleteSelected}
        onFiltersChange={setFilters}
      />

      <RamadanDatesTable
        canEdit={canEdit}
        canDelete={canDelete}
        ramadanDates={ramadanDates}
        selected={selected}
        page={page}
        pageSize={pageSize}
        allChecked={allChecked}
        onSelectRamadanDate={selectRamadanDate}
        onSelectAll={selectAll}
        isLoading={isLoading}
        onEditRamadanDate={handleEdit}
        onDeleteRamadanDate={(id: number) => {
          setDeleteDialog({ open: true, type: "single", id });
        }}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <CustomPagination
        currentPage={page}
        totalPages={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={setPageSize}
      />

      <RamadanDateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        ramadanDate={selectedRamadanDate}
        isLoading={isMutating}
      />
      <CommonDeleteModal
        open={deleteDialog.open}
        dialogTitle={t("common.confirmDelete")}
        dialogDescription={
          deleteDialog.type === "single" || selected.length === 1
            ? t("messages.confirm.delete", {
                deleteType: "ramadan date",
              })
            : t("messages.confirm.deleteMultiple", {
                count: selected.length,
                deleteType: "ramadan dates",
              })
        }
        cancelText={t("common.cancel")}
        confirmText={t("common.delete")}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default RamadanDatesPage;
