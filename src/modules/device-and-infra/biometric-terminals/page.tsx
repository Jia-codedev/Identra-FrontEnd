"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Dialog } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import BiometricTerminalsHeader from "./components/BiometricTerminalsHeader";
import BiometricTerminalsList from "./components/BiometricTerminalsList";
import BiometricTerminalForm from "./components/BiometricTerminalForm";
import useBiometricTerminals from "./hooks/useBiometricTerminals";
import useBiometricTerminalMutations from "./hooks/useBiometricTerminalMutations";
import { BiometricTerminal } from "@/services/biometric-terminals/biometricTerminalsApi";

export default function BiometricTerminalManagementPage() {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<BiometricTerminal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [terminalToDelete, setTerminalToDelete] = useState<number | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const mutations = useBiometricTerminalMutations();

  const {
    biometricTerminals,
    page,
    pageSize,
    pageCount,
    total,
    isLoading,
    selected,
    allChecked,
    search,
    statusFilter,
    selectItem,
    selectAll,
    clearSelection,
    setPage,
    setPageSize,
    setSearch,
    setStatusFilter,
    refetch,
    pageSizeOptions,
  } = useBiometricTerminals();

  const handleAddNew = () => {
    setEditingTerminal(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (terminal: any) => {
    setEditingTerminal(terminal.raw);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = (refresh?: boolean) => {
    setIsAddModalOpen(false);
    setEditingTerminal(null);
    if (refresh) {
      refetch();
    }
  };

  const handleDelete = (id: number) => {
    setTerminalToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (terminalToDelete) {
      await mutations.deleteBiometricTerminal.mutateAsync(terminalToDelete);
      setShowDeleteConfirm(false);
      setTerminalToDelete(null);
      refetch();
    }
  };

  const handleBulkDelete = () => {
    if (selected.length > 0) {
      setShowBulkDeleteConfirm(true);
    }
  };

  const confirmBulkDelete = async () => {
    for (const id of selected) {
      await mutations.deleteBiometricTerminal.mutateAsync(id);
    }
    setShowBulkDeleteConfirm(false);
    clearSelection();
    refetch();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90">
          <BiometricTerminalsHeader
            search={search}
            statusFilter={statusFilter}
            selectedCount={selected.length}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onAddNew={handleAddNew}
            onDeleteSelected={handleBulkDelete}
          />

          <BiometricTerminalsList
            biometricTerminals={biometricTerminals}
            selected={selected}
            allChecked={allChecked}
            isLoading={isLoading}
            onSelectItem={selectItem}
            onSelectAll={selectAll}
            onEditItem={handleEdit}
            onDeleteItem={handleDelete}
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

      {/* Add/Edit Biometric Terminal Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
        <BiometricTerminalForm terminal={editingTerminal} onClose={handleCloseModal} />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.confirmDeleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.confirmBulkDeleteDescription", { count: selected.length })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}