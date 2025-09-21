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
import { useSites } from "../hooks/useSites";
import { SitesHeader } from "../components/SiteHeader";
import { SitesTable } from "../components/SiteTable";
import { SiteModal } from "../components/SiteModal";
import { ISite } from "../types";
import { useSiteMutations } from "../hooks/useMutations";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function SitesPage() {
  const { t } = useTranslations();
  const { createSite, updateSite, deleteSite, deleteSites } =
    useSiteMutations();
  const {
    sites,
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
    selectSite,
    selectAll,
    isLoading,
  } = useSites();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    site: ISite | null;
  }>({
    isOpen: false,
    mode: "add",
    site: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddSite = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      site: null,
    });
  };

  const handleEditSite = (site: ISite) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      site,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      site: null,
    });
  };

  const handleSaveSite = (data: ISite) => {
    if (modalState.mode === "add") {
      createSite({
        siteData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    } else if (modalState.mode === "edit" && modalState.site) {
      updateSite({
        id: modalState.site.location_id,
        siteData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    }
  };

  const handleDeleteSite = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteSite(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteSites(selected);
    }
    setDeleteDialog({ open: false, type: null });
    // Clear selection so the header returns to the normal (Add) state
    try {
      selectAll(false);
    } catch (e) {
      // swallow if selectAll not available for some reason
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded bg-background/90">
          <SitesHeader
            search={search}
            onSearchChange={setSearch}
            onAddSite={handleAddSite}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <SitesTable
            sites={sites}
            selected={selected}
            page={page}
            pageSize={5}
            allChecked={allChecked}
            onSelectSite={selectSite}
            onSelectAll={() => selectAll(true)}
            isLoading={isLoading}
            onEditSite={handleEditSite}
            onDeleteSite={handleDeleteSite}
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

      <SiteModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSite}
        site={modalState.site}
        mode={modalState.mode}
      />
      <Dialog
        open={deleteDialog.open}
        onOpenChange={() => handleCancelDelete()}
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

export interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ISite) => void;
  mode: "add" | "edit";
  site: ISite | null;
}
