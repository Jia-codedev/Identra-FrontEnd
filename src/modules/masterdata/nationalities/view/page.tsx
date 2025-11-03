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
import { useNationalities } from "../hooks/useNationalities";
import { INationality } from "../types";
import { useNationalityMutations } from "../hooks/useMutations";
import {
  NationalitiesTable,
  NationalityModal,
  NationalitiesHeader,
} from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";

export default function NationalitiesPage() {
  const { canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "enterprise-settings",
    "citizenship-info"
  );
  const { t } = useTranslations();
  const {
    createNationality,
    updateNationality,
    deleteNationality,
    deleteNationalities,
  } = useNationalityMutations();
  const {
    nationalities,
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
    selectNationality,
    selectAll,
    isLoading,
  } = useNationalities();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    nationality: INationality | null;
  }>({
    isOpen: false,
    mode: "add",
    nationality: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddNationality = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      nationality: null,
    });
  };

  const handleEditNationality = (nationality: INationality) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      nationality,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      nationality: null,
    });
  };

  const handleSaveNationality = (data: INationality) => {
    if (modalState.mode === "add") {
      createNationality({
        nationalityData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    } else if (modalState.mode === "edit" && modalState.nationality) {
      updateNationality({
        id: modalState.nationality.citizenship_id,
        nationalityData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    }
  };

  const handleDeleteNationality = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteNationality(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteNationalities(selected);
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
          <NationalitiesHeader
            canCreate={canCreate}
            canDelete={canDelete}
            search={search}
            onSearchChange={setSearch}
            onAddNationality={handleAddNationality}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <NationalitiesTable
            canEdit={canEdit}
            canDelete={canDelete}
            nationalities={nationalities}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectNationality={selectNationality}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditNationality={handleEditNationality}
            onDeleteNationality={handleDeleteNationality}
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

      <NationalityModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNationality}
        nationality={modalState.nationality}
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
