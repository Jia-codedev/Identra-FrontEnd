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
import { useSchedules } from "../hooks/useSchedules";
import { ISchedule, CreateScheduleRequest } from "../types";
import { useScheduleMutations } from "../hooks/useMutations";
import {
  SchedulesTable,
  ScheduleModal,
  SchedulesHeader
} from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function ScheduleTypesPage() {
  const { t } = useTranslations();
  const { 
    createSchedule, 
    updateSchedule, 
    deleteSchedule, 
    deleteMultipleSchedules,
    isCreating,
    isUpdating,
    isDeleting,
    isDeletingMultiple 
  } = useScheduleMutations();
  const {
    schedules,
    selected,
    search,
    page,
    pageCount,
    pageSize,
    pageSizeOptions,
    filters,
    allChecked,
    setSearch,
    setPage,
    setPageSize,
    setFilters,
    selectSchedule,
    selectAll,
    isLoading,
  } = useSchedules();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    schedule: ISchedule | null;
  }>({
    isOpen: false,
    mode: "add",
    schedule: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddSchedule = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      schedule: null,
    });
  };

  const handleEditSchedule = (schedule: ISchedule) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      schedule,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      schedule: null,
    });
  };

  const handleSaveSchedule = (data: CreateScheduleRequest) => {
    
    if (modalState.mode === "add") {
      createSchedule({ scheduleData: data, onClose: handleCloseModal, search, pageSize });
    } else if (modalState.mode === "edit" && modalState.schedule) {
      updateSchedule({ 
        id: modalState.schedule.schedule_id, 
        scheduleData: data, 
        onClose: handleCloseModal, 
        search, 
        pageSize 
      });
    } else {
      console.error('Invalid modal state for save:', modalState);
    }
  };

  const handleDeleteSchedule = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteSchedule(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteMultipleSchedules(selected);
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
          <SchedulesHeader
            search={search}
            onSearchChange={setSearch}
            onAddSchedule={handleAddSchedule}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <SchedulesTable
            schedules={schedules}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectSchedule={selectSchedule}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
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
        </div>
      </div>

      <ScheduleModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSchedule}
        schedule={modalState.schedule}
        mode={modalState.mode}
        isLoading={modalState.mode === 'add' ? isCreating : isUpdating}
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
