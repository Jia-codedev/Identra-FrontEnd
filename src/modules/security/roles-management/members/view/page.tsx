"use client";

import React, { useState } from "react";
import { useMembers } from "../hooks/useMembers";
import { MembersHeader } from "../components/MembersHeader";
import { MembersTable } from "../components/MembersTable";
import { AddMembersDialog } from "../components/AddMembersDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";

function ManageUserRoleMembers({ roleId }: { roleId: number }) {
  const { t } = useTranslations();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const {
    members,
    availableEmployees,
    selected,
    search,
    organizationFilter,
    page,
    pageSize,
    pageSizeOptions,
    pageCount,
    allChecked,
    isLoading,
    setSearch,
    setOrganizationFilter,
    setPage,
    setPageSize,
    selectMember,
    selectAll,
    clearSelection,
    addMembers,
    removeMembers,
  } = useMembers(roleId);

  if (!roleId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          {t("security.roles.roleIdRequired") || "Role ID is required"}
        </p>
      </div>
    );
  }

  const handleAddMembers = () => {
    setIsAddDialogOpen(true);
  };

  const handleRemoveSelected = () => {
    if (selected.length > 0) {
      setIsRemoveDialogOpen(true);
    }
  };

  const handleConfirmRemove = () => {
    removeMembers(selected);
    setIsRemoveDialogOpen(false);
  };

  const handleRemoveSingle = (userRoleId: number) => {
    removeMembers([userRoleId]);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-6 space-y-6">
        <MembersHeader
          search={search}
          organizationFilter={organizationFilter}
          onSearchChange={setSearch}
          onOrganizationFilterChange={setOrganizationFilter}
          onAddMembers={handleAddMembers}
          onRemoveMembers={handleRemoveSelected}
          selectedCount={selected.length}
        />

        <MembersTable
          members={members}
          selected={selected}
          page={page}
          pageSize={pageSize}
          allChecked={allChecked}
          onSelectMember={selectMember}
          onSelectAll={selectAll}
          isLoading={isLoading}
          onRemoveMember={handleRemoveSingle}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Add Members Dialog */}
      <AddMembersDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        availableEmployees={availableEmployees}
        onAddMembers={addMembers}
        isLoading={isLoading}
      />

      {/* Remove Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("security.roles.confirmRemove") || "Confirm Remove"}
            </DialogTitle>
            <DialogDescription>
              {t("security.roles.confirmRemoveDescription") ||
                `Are you sure you want to remove ${selected.length} member(s) from this role?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              {t("common.remove") || "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageUserRoleMembers;
