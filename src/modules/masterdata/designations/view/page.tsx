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
import { useDesignations } from "../hooks/useDesignation";
import { IDesignation } from "../types";
import { useDesignationMutations } from "../hooks/useMutations";
import {
  DesignationsTable,
  DesignationModal,
  DesignationsHeader,
} from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function DesignationsPage() {
  const { t } = useTranslations();
  const {
    createDesignation,
    updateDesignation,
    deleteDesignation,
    deleteDesignations,
  } = useDesignationMutations();

  const {
    designations,
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
    selectDesignation,
    selectAll,
    isLoading,
  } = useDesignations();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    designation: IDesignation | null;
  }>({
    isOpen: false,
    mode: "add",
    designation: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddDesignation = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      designation: null,
    });
  };

  const handleEditDesignation = (designation: IDesignation) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      designation,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      designation: null,
    });
  };

  const handleSaveDesignation = (data: IDesignation) => {
    if (modalState.mode === "add") {
      createDesignation({
        designationData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    } else if (modalState.mode === "edit" && modalState.designation) {
      updateDesignation({
        id: modalState.designation.designation_id,
        designationData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    }
  };

  const handleDeleteDesignation = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteDesignation(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteDesignations(selected);
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
          <DesignationsHeader
            search={search}
            onSearchChange={setSearch}
            onAddDesignation={handleAddDesignation}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <DesignationsTable
            designations={designations}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectDesignation={selectDesignation}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditDesignation={handleEditDesignation}
            onDeleteDesignation={handleDeleteDesignation}
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

      <DesignationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDesignation}
        designation={modalState.designation}
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
