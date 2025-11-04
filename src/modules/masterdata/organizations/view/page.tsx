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
import { useOrganizations } from "../index";
import { IOrganization } from "../types";
import { useOrganizationMutations } from "../hooks/useMutations";
import {
  OrganizationsTable,
  OrganizationModal,
  OrganizationHeader,
} from "../index";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";


export default function OrganizationsPage() {
  const { t } = useTranslations();
  const {
    createOrganization,
    updateOrganization,
    deleteOrganization,
    deleteOrganizations,
  } = useOrganizationMutations();
  const {
    organizations,
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
    selectOrganization,
    selectAll,
    isLoading,
  } = useOrganizations();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    organization: IOrganization | null;
  }>({
    isOpen: false,
    mode: "add",
    organization: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const { canView, canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "organization",
    "organizations"
  );


  const handleAddOrganization = () => {
    if (!canCreate) {
      alert(t("common.noPermission"));
      return;
    }

    setModalState({
      isOpen: true,
      mode: "add",
      organization: null,
    });
  };

  const handleEditOrganization = (organization: IOrganization) => {
    if (!canEdit) {
      alert(t("common.noPermission"));
      return;
    }

    setModalState({
      isOpen: true,
      mode: "edit",
      organization,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      organization: null,
    });
  };

  const handleSaveOrganization = async (data: Partial<IOrganization>) => {
    if (modalState.mode === "add") {
      createOrganization({
        organizationData: data as IOrganization,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    } else if (modalState.mode === "edit" && modalState.organization) {
      updateOrganization({
        id: modalState.organization.organization_id,
        organizationData: data as IOrganization,
        onClose: handleCloseModal,
        search,
        pageSize,
      });
    }
  };

  const handleDeleteOrganization = (id: number) => {
    if (!canDelete) {
      alert(t("common.noPermission"));
      return;
    }

    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    if (!canDelete) {
      alert(t("common.noPermission"));
      return;
    }

    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteOrganization(deleteDialog.id);
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      deleteOrganizations(selected);
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
          <OrganizationHeader
            canDelete={canDelete}
            canCreate={canCreate}
            search={search}
            onSearchChange={setSearch}
            onAddOrganization={handleAddOrganization}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <OrganizationsTable
            canEdit={canEdit}
            canDelete={canDelete}
            organizations={organizations}
            selected={selected}
            page={page}
            pageSize={pageSize}
            allChecked={allChecked}
            onSelectOrganization={selectOrganization}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditOrganization={handleEditOrganization}
            onDeleteOrganization={handleDeleteOrganization}
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

      <OrganizationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        isLoading={isLoading}
        onSave={handleSaveOrganization}
        organization={modalState.organization}
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
                {selected?.length === 1 || deleteDialog.type === "single"
                  ? t("common.messages.confirmDeleteSingleDescription", {
                    deleteType: "Organization",
                  })
                  : t("common.messages.confirmDeleteMultipleDescription", {
                    count: selected?.length,
                    deleteType: "Organizations",
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
