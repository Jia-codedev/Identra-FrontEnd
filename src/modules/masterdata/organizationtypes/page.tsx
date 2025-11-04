"use client";
import React, { useState } from "react";
import { useOrganizationTypes } from "@/modules/masterdata/organizationtypes/hooks/useOrganizationTypes";
import { OrganizationTypesHeader } from "@/modules/masterdata/organizationtypes/components/OrganizationTypesHeader";
import { OrganizationTypesTable } from "@/modules/masterdata/organizationtypes/components/OrganizationTypesTable";
import { OrganizationTypeModal } from "@/modules/masterdata/organizationtypes/components/OrganizationTypeModal";
import { IOrganizationType } from "@/modules/masterdata/organizationtypes/types";
import { useTranslations } from "@/hooks/use-translations";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useOrganizationTypeMutations } from "./hooks/useMutations";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";

const OrganizationTypesPage = () => {
  const { t } = useTranslations();
  const {
    organizationtypes,
    selected,
    search,
    page,
    pageSize,
    pageCount,
    allChecked,
    isLoading,
    setSearch,
    setPage,
    setPageSize,
    selectOrganizationType,
    selectAll,
    clearSelection,
  } = useOrganizationTypes();

  const {
    createOrganizationType,
    updateOrganizationType,
    deleteOrganizationType,
    deleteOrganizationTypes,
  } = useOrganizationTypeMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentOrganizationType, setCurrentOrganizationType] =
    useState<IOrganizationType | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    setModalMode("add");
    setCurrentOrganizationType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (organizationType: IOrganizationType) => {
    setModalMode("edit");
    setCurrentOrganizationType(organizationType);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteSelected = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      deleteOrganizationType(deleteId);
    } else if (selected.length > 0) {
      deleteOrganizationTypes(selected);
      clearSelection();
    }
    setIsConfirmOpen(false);
    setDeleteId(null);
  };

  const handleSave = (data: IOrganizationType) => {
    const handleClose = () => setIsModalOpen(false);
    if (modalMode === "add") {
      createOrganizationType({
        organizationTypeData: data,
        onClose: handleClose,
        search,
        pageSize,
      });
    } else if (currentOrganizationType) {
      updateOrganizationType({
        id: currentOrganizationType.organization_type_id,
        organizationTypeData: data,
        onClose: handleClose,
        search,
        pageSize,
      });
    }
  };
  const { canView, canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "organization",
    "organization-type"
  );

  return (
    <div className="h-full flex flex-col">
      <OrganizationTypesHeader
        canCreate={canCreate}
        canDelete={canDelete}
        search={search}
        onSearchChange={setSearch}
        onAddOrganizationType={handleAdd}
        selectedCount={selected.length}
        onDeleteSelected={handleDeleteSelected}
      />
      <div className="flex-grow overflow-y-auto">
        <OrganizationTypesTable
          canEdit={canEdit}
          canDelete={canDelete}
          organizationTypes={organizationtypes}
          selected={selected}
          page={page}
          pageSize={pageSize}
          allChecked={allChecked}
          onSelectOrganizationType={selectOrganizationType}
          onSelectAll={selectAll}
          onEditOrganizationType={handleEdit}
          onDeleteOrganizationType={handleDelete}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
        />
      </div>
      <CustomPagination
        currentPage={page}
        pageSizeOptions={[10, 20, 50, 100]}
        totalPages={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <OrganizationTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        organizationType={currentOrganizationType}
        mode={modalMode}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t("common.confirmDelete")}
        description={
          !!selected?.length
            ? t("common.messages.confirmDeleteMultipleDescription", {
                count: selected?.length,
                deleteType: "Organization types",
              })
            : t("common.messages.confirmDeleteSingleDescription", {
                deleteType: "Organization type",
              })
        }
      />
    </div>
  );
};

export default OrganizationTypesPage;
