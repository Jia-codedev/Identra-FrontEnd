"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  WorkflowsTable,
  WorkflowsHeader,
  useWorkflows,
  useWorkflowMutations,
  IWorkflow,
} from "../index";

export default function WorkflowModulePage() {
  const { t } = useTranslations();
  const router = useRouter();
  const { createWorkflow, updateWorkflow, deleteWorkflow } =
    useWorkflowMutations();
  const {
    workflows,
    selected,
    search,
    page,
    pageCount,
    pageSize,
    allChecked,
    setSearch,
    setPage,
    setPageSize,
    selectWorkflow,
    selectAll,
    isLoading,
    refetch,
  } = useWorkflows();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    workflow: IWorkflow | null;
  }>({
    isOpen: false,
    mode: "add",
    workflow: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk" | null;
    id?: number;
  }>({ open: false, type: null });

  const handleAddWorkflow = () => {
    // navigate to add page where a modal-based form will be shown
    router.push("/workforce/process-automation/add");
  };

  const handleEditWorkflow = (workflow: IWorkflow) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      workflow,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "add",
      workflow: null,
    });
  };

  const handleSaveWorkflow = (data: Omit<IWorkflow, "workflow_id">) => {
    if (modalState.mode === "add") {
      createWorkflow(data, {
        onSuccess: () => refetch(),
      });
    } else if (modalState.mode === "edit" && modalState.workflow) {
      updateWorkflow(
        {
          id: modalState.workflow.workflow_id!,
          workflowData: data,
        },
        {
          onSuccess: () => refetch(),
        }
      );
    }
    handleCloseModal();
  };

  const handleDeleteWorkflow = (id: number) => {
    setDeleteDialog({ open: true, type: "single", id });
  };

  const handleDeleteSelected = () => {
    setDeleteDialog({ open: true, type: "bulk" });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "single" && deleteDialog.id !== undefined) {
      deleteWorkflow(deleteDialog.id, {
        onSuccess: () => refetch(),
      });
    } else if (deleteDialog.type === "bulk" && selected.length > 0) {
      // deleteWorkflows(selected, {
      //   onSuccess: () => refetch(),
      // });
    }
    setDeleteDialog({ open: false, type: null });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, type: null });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90">
          <WorkflowsHeader
            search={search}
            onSearchChange={setSearch}
            onAddWorkflow={handleAddWorkflow}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
          />

          <WorkflowsTable
            workflows={workflows}
            selected={selected}
            allChecked={allChecked}
            onDeleteWorkflow={handleDeleteWorkflow}
            onSelectAll={selectAll}
            isLoading={isLoading}
            onEditWorkflow={handleEditWorkflow}
            onSelectWorkflow={selectWorkflow}
          />

          <CustomPagination
            currentPage={page}
            totalPages={pageCount}
            onPageChange={setPage}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]} // Add this line
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <DialogContent className="p-0">
          <DialogHeader className="p-2">
            <DialogTitle className="mb-1 p-2">
              {t("common.confirm") + " " + t("common.delete")}
            </DialogTitle>
            <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
              <DialogDescription>
                {deleteDialog.type === "single"
                  ? t("messages.confirm.delete")
                  : t("messages.confirm.delete", { count: selected.length })}
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
