"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";

import RamadanDatesHeader from "../components/RamadanDatesHeader";
import { RamadanDatesTable } from "../components/RamadanDatesTable";
import RamadanDateModal from "../components/RamadanDateModal";
import { useRamadanDates } from "../hooks/useRamadanDates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CommonDeleteModal } from "@/components/common/CommonDeleteModal";
import { Button } from "@/components/ui/button";
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
    setPage,
    setPageSize,
    pageSize,
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
        search={search}
        onSearchChange={setSearch}
        onAddNew={handleAddNew}
        selectedCount={selected.length}
        filters={filters}
        onDeleteSelected={handleDeleteSelected}
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
        onDeleteRamadanDate={(id: number) => {
          setDeleteDialog({ open: true, type: "single", id });
        }}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <RamadanDateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        ramadanDate={selectedRamadanDate}
        isLoading={isMutating}
      />

      {/* <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">
              {t("common.confirmDelete")}
            </DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single" || selected.length === 1
                  ? t("scheduling.holidays.confirmDeleteSingle", {
                      id: deleteDialog.id,
                    })
                  : t("scheduling.holidays.confirmDeleteMulitple", {
                      count: selected.length,
                    })}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={handleCancelDelete}>
                  {t("common.cancel")}
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  {t("common.delete")}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
      <CommonDeleteModal
        open={deleteDialog.open}
        dialogTitle={t("common.confirmDelete")}
        dialogDescription={
          deleteDialog.type === "single" || selected.length === 1
            ? t("messages.confirmDeleteSingleDescription", {
                deleteType: "ramadan date",
              })
            : t("messages.confirmDeleteMultipleDescription", {
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
