"use client";

import React, { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { LeavesHeader } from "./components/LeavesHeader";
import LeavesList from "./components/LeavesList";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LeaveTypeModal from "./components/LeaveTypeModal";

import { debounce } from "lodash";
import useLeaves from "./hooks/useLeavesType";
import useLeaveTypeMutations from "./hooks/useMutations";
import { format, parseISO } from "date-fns";
import { useSubModulePrivileges } from "@/hooks/security/useSubModulePrivileges";
import { toast } from "sonner";

type LeaveType = {
  id: number;
  code: string;
  leave_type: string;
  status: string;
  created_date: string;
  raw?: any;
};

export default function LeavesTypePage() {
  const { t } = useTranslations();
  const router = useRouter();

  const {
    leaves: data,
    isLoading,
    page,
    pageSize,
    pageCount,
    setPage,
    setPageSize,
    search,
    setSearch,
    selected,
    selectItem,
    selectAll,
    clearSelection,
    refetch,
  } = useLeaves();

  const mutations = useLeaveTypeMutations();
  const debouncedSetSearch = debounce((v: string) => setSearch(v), 300);
  const handleSearchChange = (value: string) => {
    debouncedSetSearch(value);
  };

  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<LeaveType | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const { canView, canCreate, canEdit, canDelete } = useSubModulePrivileges(
    "self-services",
    "leave-types"
  );
  console.log("Privileges:", { canView, canCreate, canEdit, canDelete });

  const handleAdd = () => {
    setEditingItem(null);
    setShowDialog(true);
  };
  const handleEdit = (item: LeaveType) => {
    setEditingItem(item.raw);
    setShowDialog(true);
  };
  const handleDeleteClick = (id: string | number) => {
    setDeleteDialog({ open: true, type: "single", id: Number(id) });
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
        const res = await mutations.delete.mutateAsync(deleteDialog.id);

        clearSelection();
      } else if (deleteDialog.type === "bulk" && selected.length > 0) {
        const res = await mutations.bulkDelete.mutateAsync(selected);

        clearSelection();
      }
      setDeleteDialog({ open: false, type: null });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };

  const handleDialogClose = (refresh = false) => {
    setShowDialog(false);
    setEditingItem(null);
    if (refresh) refetch();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90 p-4">
          <LeavesHeader
            canCreate={canCreate}
            canDelete={canDelete}
            search={search}
            onSearchChange={handleSearchChange}
            onAdd={handleAdd}
            selectedCount={selected.length}
            onDeleteSelected={handleBulkDelete}
          />

          <div className="w-full mt-4">
            <LeavesList
              canEdit={canEdit}
              canDelete={canDelete}
              leaves={data}
              loading={isLoading}
              selected={selected}
              onSelectItem={(id: string | number) => selectItem(Number(id))}
              onSelectAll={selectAll}
              allChecked={
                selected.length > 0 && selected.length === data.length
              }
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEditItem={handleEdit}
              onDeleteItem={handleDeleteClick}
            />
          </div>

          <div className="mt-4">
            <CustomPagination
              currentPage={page}
              totalPages={pageCount}
              onPageChange={setPage}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20, 50]}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </div>
      <LeaveTypeModal
        open={showDialog}
        initialData={editingItem as any}
        onSuccess={() => handleDialogClose(true)}
        onCancel={() => handleDialogClose(false)}
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
                  {t("common.cancel") || "Cancel"}
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  {t("common.delete") || "Delete"}
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
