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
  AppSettingsTable,
  AppSettingsHeader,
  useAppSettings,
  useAppSettingMutations,
  IAppSetting,
} from "@/modules/app-settings/appSettings";
import { AppSettingsModal } from "@/modules/app-settings/appSettings/components/AppSettingsModal";

export default function AppSettingsPage() {
  const { t } = useTranslations();
  const { createAppSetting, updateAppSetting, deleteAppSetting, deleteAppSettings } =
    useAppSettingMutations();
  const {
    appSettings,
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
    selectAppSetting,
    selectAll,
    isLoading,
  } = useAppSettings();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    appSetting: IAppSetting | null;
  }>({
    isOpen: false,
    mode: "add",
    appSetting: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    versionName?: string;
  }>({ open: false, type: null });

  const handleAddAppSetting = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      appSetting: null,
    });
  };

  const handleEditAppSetting = (appSetting: IAppSetting) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      appSetting,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      appSetting: null,
    });
  };

  const handleSaveAppSetting = (data: IAppSetting) => {
    if (modalState.mode === "add") {
      createAppSetting(data);
    } else if (modalState.mode === "edit" && modalState.appSetting?.version_name) {
      updateAppSetting(modalState.appSetting.version_name, data);
    }
    handleCloseModal();
  };

  const handleDeleteAppSetting = (id: string | number) => {
    setDeleteDialog({ open: true, type: "single", versionName: id as string });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.versionName !== undefined) {
      deleteAppSetting(deleteDialog.versionName);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteAppSettings(selected);
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
          <AppSettingsHeader
            search={search}
            onSearchChange={setSearch}
            onAddAppSetting={handleAddAppSetting}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <AppSettingsTable
            appSettings={appSettings}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onDeleteAppSetting={handleDeleteAppSetting}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditAppSetting={handleEditAppSetting}
            onSelectAppSetting={selectAppSetting}
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

      <AppSettingsModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        appSetting={modalState.appSetting}
        onClose={handleCloseModal}
        onSave={handleSaveAppSetting}
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
