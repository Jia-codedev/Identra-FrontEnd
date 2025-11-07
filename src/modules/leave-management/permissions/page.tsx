"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PermissionsHeader from "./components/PermissionsHeader";
import PermissionsList from "./components/PermissionsList";
import PermissionRequestForm from "./components/PermissionRequestForm";
import usePermissions from "./hooks/usePermissions";
import usePermissionMutations from "./hooks/useMutations";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";
import { IPermission } from "./types";
import { CustomPagination } from "@/components/common/dashboard/Pagination";

export default function PermissionsPage() {
  const { t } = useTranslations();
  const { user } = useAuth();
  const {
    createPermission,
    updatePermission,
    deletePermission,
    deletePermissions,
  } = usePermissionMutations();

  const {
    permissions,
    page,
    pageSize,
    pageCount,
    pageSizeOptions,
    total,
    isLoading,
    selected,
    selectItem,
    selectAll,
    clearSelection,
    setPage,
    setPageSize,
    search,
    setSearch,
    allChecked,
    refetch,
  } = usePermissions({ employeeId: user?.employeenumber });

  const { canView, canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "self-services",
    "permission-management"
  );

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    permission: IPermission | null;
  }>({
    isOpen: false,
    mode: "add",
    permission: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddNew = () => {
    setModalState({
      isOpen: true,
      mode: "add",
      permission: null,
    });
  };

  const handleEdit = (permission: IPermission) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      permission,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      permission: null,
    });
  };

  const handleSavePermission = (data: any) => {
    if (modalState.mode === "add") {
      createPermission.mutate({
        permissionData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    } else if (modalState.mode === "edit" && modalState.permission) {
      const permissionId =
        modalState.permission.employee_short_permission_id ||
        modalState.permission.short_permission_id;

      if (!permissionId) {
        console.error("Permission ID is missing");
        return;
      }

      updatePermission.mutate({
        id: permissionId,
        permissionData: data,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    }
  };

  const handleDeletePermission = (id: number) => {
    if (!canDelete) {
      return;
    }
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    if (!canDelete) {
      return;
    }
    if (selected.length === 0) return;
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (!canDelete) {
      return;
    }
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deletePermission.mutate(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deletePermissions.mutate(selected);
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
          <PermissionsHeader
            canCreate={canCreate}
            canDelete={canDelete}
            search={search}
            onSearchChange={setSearch}
            onAdd={handleAddNew}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
            onRefresh={refetch}
          />

          <PermissionsList
            canEdit={canEdit}
            canDelete={canDelete}
            permissions={permissions}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectItem={selectItem}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDeletePermission={handleDeletePermission}
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

      {/* Add/Edit Permission Modal */}
      {modalState.isOpen && (
        <PermissionRequestForm
          permission={modalState.permission}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
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
                  ? t("messages.confirm.delete") ||
                    "Are you sure you want to delete this permission? This action cannot be undone."
                  : t("messages.confirm.deleteMultiple", {
                      count: selected.length,
                    }) ||
                    `Are you sure you want to delete ${selected.length} permissions? This action cannot be undone.`}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={handleCancelDelete}>
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={
                    deletePermission.isPending || deletePermissions.isPending
                  }
                >
                  {deletePermission.isPending || deletePermissions.isPending
                    ? t("common.deleting") || "Deleting..."
                    : t("common.delete") || "Delete"}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
