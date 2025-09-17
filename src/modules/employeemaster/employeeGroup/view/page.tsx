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
import { useEmployeeGroups } from "../hooks/useEmployeeGroups";
import { IEmployeeGroup } from "../types";
import { useEmployeeGroupMutations } from "../hooks/useMutations";
import {
  EmployeeGroupTable,
  EmployeeGroupModal,
  EmployeeGroupHeader,
} from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function EmployeeGroupsPage() {
  const { t } = useTranslations();
  const {
    createEmployeeGroup,
    updateEmployeeGroup,
    deleteEmployeeGroup,
    deleteEmployeeGroups,
  } = useEmployeeGroupMutations();
  const {
    employeeGroups,
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
    selectEmployeeGroup,
    selectAll,
    isLoading,
  } = useEmployeeGroups();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    employeeGroup: IEmployeeGroup | null;
  }>({
    isOpen: false,
    mode: "add",
    employeeGroup: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  // --- Modal Handlers ---
  const handleAddEmployeeGroup = () => {
    setModalState({ isOpen: true, mode: "add", employeeGroup: null });
  };

  const handleEditEmployeeGroup = (employeeGroup: IEmployeeGroup) => {
    setModalState({ isOpen: true, mode: "edit", employeeGroup });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: "add", employeeGroup: null });
  };

  const handleSaveEmployeeGroup = (
    data: IEmployeeGroup & {
      schedule?: boolean;
      reportingGroup?: boolean;
      from_date?: string;
      to_date?: string;
      reporting_person?: string;
    }
  ) => {
    if (modalState.mode === "add") {
      createEmployeeGroup({
        employeeGroupData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    } else if (modalState.mode === "edit" && modalState.employeeGroup) {
      updateEmployeeGroup({
        id: modalState.employeeGroup.employee_group_id!,
        employeeGroupData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    }
  };

  // --- Delete Handlers ---
  const handleDeleteEmployeeGroup = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteEmployeeGroup(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteEmployeeGroups(selected);
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
          <EmployeeGroupHeader
            search={search}
            onSearchChange={setSearch}
            onAddEmployeeGroup={handleAddEmployeeGroup}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <EmployeeGroupTable
            employeeGroups={employeeGroups}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectEmployeeGroup={selectEmployeeGroup}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditEmployeeGroup={handleEditEmployeeGroup}
            onDeleteEmployeeGroup={handleDeleteEmployeeGroup}
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

      {/* Employee Group Modal */}
      <EmployeeGroupModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployeeGroup}
        employeeGroup={modalState.employeeGroup}
        mode={modalState.mode}
      />

      {/* Delete Confirmation Dialog */}
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
