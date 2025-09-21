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
import { useGrades } from "../hooks/useGrades";
import { IGrade } from "../types";
import { useGradeMutations } from "../hooks/useMutations";
import {
  GradesTable,
  GradeModal,
  GradesHeader
} from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function GradesPage() {
  const { t } = useTranslations();
  const { createGrade, updateGrade, deleteGrade, deleteGrades } = useGradeMutations();
  const {
    grades,
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
    selectGrade,
    selectAll,
    isLoading,
  } = useGrades();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    grade: IGrade | null;
  }>({
    isOpen: false,
    mode: "add",
    grade: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddGrade = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      grade: null,
    });
  };

  const handleEditGrade = (grade: IGrade) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      grade,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      grade: null,
    });
  };

  const handleSaveGrade = (data: IGrade) => {
    if (modalState.mode === "add") {
      createGrade({ gradeData: data, onClose: handleCloseModal, search, pageSize });
    } else if (modalState.mode === "edit" && modalState.grade) {
      updateGrade({ id: modalState.grade.grade_id, gradeData: data, onClose: handleCloseModal, search, pageSize });
    }
  };

  const handleDeleteGrade = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteGrade(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteGrades(selected);
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
          <GradesHeader
            search={search}
            onSearchChange={setSearch}
            onAddGrade={handleAddGrade}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <GradesTable
            grades={grades}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectGrade={selectGrade}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditGrade={handleEditGrade}
            onDeleteGrade={handleDeleteGrade}
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

      <GradeModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGrade}
        grade={modalState.grade}
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
