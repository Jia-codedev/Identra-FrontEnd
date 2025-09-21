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
import { useEmployeeTypes } from "../hooks/useEmployeeTypes";
import { IEmployeeType } from "../types";
import { useEmployeeTypeMutations } from "../hooks/useMutations";
import {
  EmployeeTypesTable,
  EmployeeTypeModal,
  EmployeeTypesHeader
} from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function EmployeeTypesPage() {
  const { t } = useTranslations();
  const { createEmployeeType, updateEmployeeType, deleteEmployeeType, deleteEmployeeTypes } = useEmployeeTypeMutations();
  const {
    employeeTypes,
    selected,
    search,
    page,
    pageCount,
    pageSize,
    pageSizeOptions,
    allChecked,
    setSearch,
    setPage,
    setPageSize,
    selectEmployeeType,
    selectAll,
    isLoading,
  } = useEmployeeTypes();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    employeeType: IEmployeeType | null;
  }>({
    isOpen: false,
    mode: "add",
    employeeType: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddEmployeeType = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      employeeType: null,
    });
  };

  const handleEditEmployeeType = (employeeType: IEmployeeType) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      employeeType,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      employeeType: null,
    });
  };

  const handleSaveEmployeeType = (data: IEmployeeType) => {
    if (modalState.mode === "add") {
      createEmployeeType({ employeeTypeData: data, onClose: handleCloseModal, search, pageSize });
    } else if (modalState.mode === "edit" && modalState.employeeType) {
      updateEmployeeType({ id: modalState.employeeType.employee_type_id, employeeTypeData: data, onClose: handleCloseModal, search, pageSize });
    }
  };

  const handleDeleteEmployeeType = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteEmployeeType(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteEmployeeTypes(selected);
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
          <EmployeeTypesHeader
            search={search}
            onSearchChange={setSearch}
            onAddEmployeeType={handleAddEmployeeType}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <EmployeeTypesTable
            employeeTypes={employeeTypes}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectEmployeeType={selectEmployeeType}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditEmployeeType={handleEditEmployeeType}
            onDeleteEmployeeType={handleDeleteEmployeeType}
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

      <EmployeeTypeModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployeeType}
        employeeType={modalState.employeeType}
        mode={modalState.mode}
      />
      <Dialog open={deleteDialog.open} onOpenChange={open => !open && handleCancelDelete()}>
        <DialogContent
          className="p-0"
        >
          <DialogHeader
            className="p-2"
          >
            <DialogTitle
              className="mb-1 p-2"
            >{t("common.confirmDelete")}</DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single"
                  ? t("messages.confirm.delete")
                  : t("messages.confirm.deleteMultiple", { count: selected.length })}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={handleCancelDelete}>{t("common.cancel")}</Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>{t("common.delete")}</Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}