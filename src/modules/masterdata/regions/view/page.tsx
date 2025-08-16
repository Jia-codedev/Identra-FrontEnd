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
import { useRegions } from "../hooks/useRegions";
import { RegionsHeader } from "../components/RegionsHeader";
import { RegionsTable } from "../components/RegionsTable";
import { RegionModal } from "../components/RegionModal";
import { IRegion } from "../types";
import { useRegionMutations } from "../hooks/useMutations";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function RegionsPage() {
  const { t } = useTranslations();
  const { createRegion, updateRegion, deleteRegion, deleteRegions } = useRegionMutations();
  const {
    regions,
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
    selectRegion,
    selectAll,
    isLoading,
  } = useRegions();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    region: IRegion | null;
  }>({
    isOpen: false,
    mode: "add",
    region: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddRegion = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      region: null,
    });
  };

  const handleEditRegion = (region: IRegion) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      region,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      region: null,
    });
  };

  const handleSaveRegion = (data: IRegion) => {
    if (modalState.mode === "add") {
      createRegion({ regionData: data, onClose: handleCloseModal, search, pageSize });
    } else if (modalState.mode === "edit" && modalState.region) {
      updateRegion({ id: modalState.region.location_id, regionData: data, onClose: handleCloseModal, search, pageSize });
    }
  };

  const handleDeleteRegion = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteRegion(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteRegions(selected);
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
          <RegionsHeader
            search={search}
            onSearchChange={setSearch}
            onAddRegion={handleAddRegion}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <RegionsTable
            regions={regions}
            selected={selected}
            page={page}
            pageSize={5}
            allChecked={allChecked}
            onSelectRegion={selectRegion}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditRegion={handleEditRegion}
            onDeleteRegion={handleDeleteRegion}
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

      <RegionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRegion}
        region={modalState.region}
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
            >{t("common.confirm") + " " + t("common.delete")}</DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single"
                  ? t("messages.confirm.delete")
                  : t("messages.confirm.delete", { count: selected.length })}
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
