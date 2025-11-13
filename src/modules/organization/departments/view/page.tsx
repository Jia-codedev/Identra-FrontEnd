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
import { useDepartments } from "../hooks/useDepartments";
import { IDepartment } from "../types";
import { useDepartmentMutations } from "../hooks/useMutation";
import { DepartmentTable, DepartmentModal, DepartmentHeader } from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";

export default function DepartmentPage() {
  const { t } = useTranslations();
  const {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    deleteDepartments,
  } = useDepartmentMutations();

  const {
    departments,
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
    selectDepartment,
    selectAll,
    isLoading,
  } = useDepartments();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    department: IDepartment | null;
  }>({
    isOpen: false,
    mode: "add",
    department: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddDepartment = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      department: null,
    });
  };

  const handleEditDepartment = (department: IDepartment) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      department,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      department: null,
    });
  };

  const handleSaveDepartment = (data: IDepartment) => {
    if (modalState.mode === "add") {
      createDepartment({
        departmentData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    } else if (modalState.mode === "edit" && modalState.department) {
      updateDepartment({
        id: modalState.department.department_id,
        departmentData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    }
  };

  const handleDeleteDepartment = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteDepartment(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteDepartments(selected);
    }
    setDeleteDialog({ open: false, type: null });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };

  const { canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "organization",
    "departments"
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90">
          <DepartmentHeader
            canDelete={canDelete}
            canCreate={canCreate}
            search={search}
            onSearchChange={setSearch}
            onAddDepartment={handleAddDepartment}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <DepartmentTable
            canEdit={canEdit}
            canDelete={canDelete}
            departments={departments}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectDepartment={selectDepartment}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditDepartment={handleEditDepartment}
            onDeleteDepartment={handleDeleteDepartment}
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

      <DepartmentModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDepartment}
        department={modalState.department}
        mode={modalState.mode}
      />

      <Dialog
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
                {deleteDialog.type === "single"
                  ? t("messages.confirm.delete")
                  : t("messages.confirm.deleteMultiple", {
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
      </Dialog>
    </div>
  );
}
