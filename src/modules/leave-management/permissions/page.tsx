"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import PermissionsHeader from "./components/PermissionsHeader";
import PermissionsList from "./components/PermissionsList";
import PermissionRequestForm from "./components/PermissionRequestForm";
import usePermissions from "./hooks/usePermissions";
import usePermissionMutations from "./hooks/useMutations";

export default function PermissionsPage() {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const mutations = usePermissionMutations();

  const { 
    permissions, 
    page,
    pageSize,
    pageCount,
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
    refetch
  } = usePermissions();

  const handleAddNew = () => {
    setEditingPermission(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (permission: any) => {
    setEditingPermission(permission);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = (refresh?: boolean) => {
    setIsAddModalOpen(false);
    setEditingPermission(null);
    if (refresh) {
      refetch();
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) {
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      for (const permissionId of selected) {
        await mutations.remove.mutateAsync(permissionId);
      }
      clearSelection();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting permissions:', error);
    }
  };

  const allChecked = selected.length > 0 && selected.length === permissions.length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90 p-4">
          <PermissionsHeader
            search={search}
            onSearchChange={setSearch}
            onAdd={handleAddNew}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
            onRefresh={refetch}
          />
          <div className="w-full mt-4">
            <PermissionsList
              permissions={permissions}
              loading={isLoading}
              selected={selected}
              onSelectItem={selectItem}
              onSelectAll={selectAll}
              allChecked={allChecked}
              onRefresh={refetch}
              onEdit={handleEdit}
              currentPage={page}
              totalPages={pageCount}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              total={total}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Permission Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <PermissionRequestForm
          permission={editingPermission}
          onClose={handleCloseModal}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('common.confirmDelete') || 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selected.length === 1 
                ? (t('leaveManagement.permissions.confirmDeleteSingle') || 'Are you sure you want to delete this permission? This action cannot be undone.')
                : (t('leaveManagement.permissions.confirmDeleteMultiple')?.replace('{count}', selected.length.toString()) || `Are you sure you want to delete ${selected.length} permissions? This action cannot be undone.`)
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('common.cancel') || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={mutations.remove.isPending}
            >
              {mutations.remove.isPending 
                ? (t('common.deleting') || 'Deleting...') 
                : (t('common.delete') || 'Delete')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
