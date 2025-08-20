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
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import {
  EmployeesTable,
  EmployeeModal,
  EmployeesHeader,
  useEmployees,
  useEmployeeMutations,
  IEmployee,
} from "../index";

export default function EmployeePage() {
  const { t } = useTranslations();
  const { createEmployee, updateEmployee, deleteEmployee, deleteEmployees } =
    useEmployeeMutations();
  const {
    employees,
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
    selectEmployee,
    selectAll,
    isLoading,
  } = useEmployees();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    employee: IEmployee | null;
  }>({
    isOpen: false,
    mode: "add",
    employee: null,
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
      employee: null,
    });
  };

  const handleEditEmployee = (employee: IEmployee) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      employee,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      employee: null,
    });
  };

  const handleSaveEmployee = (data: IEmployee) => {
    if (modalState.mode === "add") {
      createEmployee(data);
    } else if (modalState.mode === "edit" && modalState.employee) {
      updateEmployee({
        id: modalState.employee.employee_id!,
        employeeData: data,
      });
    }
    handleCloseModal();
  };

  const handleDeleteEmployee = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteEmployee(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteEmployees(selected);
    }
    setDeleteDialog({ open: false, type: null });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90">
          <EmployeesHeader
            search={search}
            onSearchChange={setSearch}
            onAddEmployee={handleAddEmployeeType}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <EmployeesTable
            employee={employees}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onDeleteEmployee={handleDeleteEmployee}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditEmployee={handleEditEmployee}
            onSelectEmployee={selectEmployee}
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

      <EmployeeModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        employee={modalState.employee}
        mode={modalState.mode}
      />
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">
              {t("common.confirm") + " " + t("common.delete")}
            </DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single"
                  ? t("messages.confirm.delete")
                  : t("messages.confirm.delete", { count: selected.length })}
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
