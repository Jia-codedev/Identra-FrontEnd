"use client";
import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHolidays } from "../hooks/useHolidays";
import { IHoliday, CreateHolidayRequest } from "../types";
import { useHolidayMutations } from "../hooks/useMutations";
import {
  HolidaysTable,
  HolidayModal,
  HolidaysHeader
} from "../index";
import HolidaysCalendarView from "../components/HolidaysCalendarView";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function HolidaysPage() {
  const { t } = useTranslations();
  const { createHoliday, updateHoliday, deleteHoliday } = useHolidayMutations();
  const {
    holidays,
    selected,
    search,
    page,
    pageCount,
    pageSize,
    pageSizeOptions,
    filters,
    allChecked,
    // total, // Commented out as unused
    setSearch,
    setPage,
    setPageSize,
    setFilters,
    selectHoliday,
    selectAll,
    isLoading,
  } = useHolidays();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    holiday: IHoliday | null;
  }>({
    isOpen: false,
    mode: "add",
    holiday: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const handleAddHoliday = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      holiday: null,
    });
  };

  const handleEditHoliday = (holiday: IHoliday) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      holiday,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      holiday: null,
    });
  };

  const handleSaveHoliday = (data: CreateHolidayRequest) => {
    if (modalState.mode === "add") {
      createHoliday({ holidayData: data, onClose: handleCloseModal, search, pageSize });
    } else if (modalState.mode === "edit" && modalState.holiday) {
      updateHoliday({ id: modalState.holiday.holiday_id, holidayData: data, onClose: handleCloseModal, search, pageSize });
    }
  };

  const handleDeleteHoliday = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteHoliday(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      // Note: Bulk delete is not implemented in the API yet
      // You can implement this when the API supports it
      selected.forEach(id => deleteHoliday(id));
    }
    setDeleteDialog({ open: false, type: null });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90">
          <HolidaysHeader
            search={search}
            onSearchChange={setSearch}
            onAddHoliday={handleAddHoliday}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          {viewMode === 'table' ? (
            <HolidaysTable
              holidays={holidays}
              selected={selected}
              page={page}
              pageSize={pageSize}
              allChecked={allChecked}
              onSelectHoliday={selectHoliday}
              onSelectAll={selectAll}
              isLoading={isLoading}
              onEditHoliday={handleEditHoliday}
              onDeleteHoliday={handleDeleteHoliday}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          ) : (
            <HolidaysCalendarView holidays={holidays} />
          )}

          <CustomPagination
            currentPage={page}
            totalPages={pageCount}
            onPageChange={setPage}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      <HolidayModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveHoliday}
        holiday={modalState.holiday}
        mode={modalState.mode}
      />
      
      <Dialog open={deleteDialog.open} onOpenChange={open => !open && handleCancelDelete()}>
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">
              {t("common.confirmDelete")}
            </DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single"
                  ? t("messages.confirm.delete")
                  : t("messages.confirm.deleteMultiple", { count: selected.length })}
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
      </Dialog>
    </div>
  );
}
