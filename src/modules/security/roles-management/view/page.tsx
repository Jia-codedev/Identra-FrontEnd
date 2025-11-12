"use client";

import React, { useState } from "react";
import { RolesHeader } from "../components/RolesHeader";
import { RolesTable } from "../components/RolesTable";
import { RoleModal } from "../components/RoleModal";
import { useRoles } from "../hooks/useRoles";
import { useRoleMutations } from "../hooks/useMutations";
import { SecRole } from "@/services/security/securityRoles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";

export default function RolesManagementPage() {
  const {
    roles,
    selected,
    search,
    page,
    pageCount,
    pageSize,
    pageSizeOptions,
    allChecked,
    isLoading,
    setSearch,
    setPage,
    setPageSize,
    selectRole,
    selectAll,
    clearSelection,
    refetch,
  } = useRoles();
  const { createRole, updateRole, deleteRole, deleteRoles } = useRoleMutations();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    role: SecRole | null;
  }>({ isOpen: false, mode: "add", role: null });

 const { canView, canCreate, canEdit, canDelete } = useSubModulePrivileges(
        "user-security",
        "roles-management"
      );
      console.log("Privileges:", { canView, canCreate, canEdit, canDelete });
  

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: "single" | "bulk" | null; id?: number }>({ open: false, type: null });

  const handleAddRole = () => {
    setModalState({ isOpen: true, mode: "add", role: null });
  };
  const handleEditRole = (role: SecRole) => {
    setModalState({ isOpen: true, mode: "edit", role });
  };
  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: "add", role: null });
  };
  const handleSaveRole = (data: { role_name: string; editable_flag: boolean }) => {
    if (modalState.mode === "add") {
      createRole({ roleData: data, onClose: handleCloseModal });
    } else if (modalState.mode === "edit" && modalState.role) {
      updateRole({ id: modalState.role.role_id, roleData: data, onClose: handleCloseModal });
    }
  };
  const handleDeleteRole = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };
  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };
  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteRole(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteRoles(selected);
    }
    setDeleteDialog({ open: false, type: null });
    clearSelection();
  };
  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90">
          <RolesHeader
            canCreate={canCreate}
            canDelete={canDelete}
            search={search}
            onSearchChange={setSearch}
            onAddRole={handleAddRole}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />
          <RolesTable
            canEdit={canEdit}
            canDelete={canDelete} 
            roles={roles}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectRole={selectRole}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
          {/* Pagination can be added here if you have a CustomPagination component */}
        </div>
      </div>
      <RoleModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRole}
        role={modalState.role}
        mode={modalState.mode}
      />
      <Dialog open={deleteDialog.open} onOpenChange={open => !open && handleCancelDelete()}>
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">Confirm Delete</DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single"
                  ? "Are you sure you want to delete this role?"
                  : `Are you sure you want to delete ${selected.length} roles?`}
              </DialogDescription>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={handleCancelDelete}>Cancel</Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}