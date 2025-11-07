"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWorkflowApprovals } from "./hooks/useWorkflowApprovals";
import { useWorkflowApprovalMutations } from "./hooks/useMutations";
import { ApprovalsHeader } from "./components/ApprovalsHeader";
import { ApprovalsModal } from "./components/ApprovalsModal";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IWorkflowApproval } from "./types";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserId } from "@/store/userStore";
import useLeaves from "@/modules/leave-management/leaves/hooks/useLeaves";
import useEmployeePermissions from "@/modules/leave-management/permissions/hooks/useEmployeePermissions";
import ApprovalsList from "./components/ApprovalsList";
import employeeLeavesApi from "@/services/leaveManagement/employeeLeaves";
import employeeShortPermissionsApi from "@/services/leaveManagement/employeeShortPermissions";
import { useTabPrivileges } from "@/hooks/security/useSubModulePrivileges";

export default function ApprovalsPage() {
  const { t } = useTranslations();
  const userId = useUserId();
  const [activeTab, setActiveTab] = useState<"leaves" | "permissions">(
    "leaves"
  );

  // Fetch leaves and permissions where manager_id === userId
  const leavesHook = useLeaves({ manager_id: userId || undefined });
  const leavesQuery = {
    data: leavesHook.leaves,
    isLoading: leavesHook.isLoading,
  } as any;
  const permissionsQuery = useEmployeePermissions({
    manager_id: userId || undefined,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApproval, setEditingApproval] =
    useState<IWorkflowApproval | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "single" | "bulk";
    approval?: IWorkflowApproval;
  }>({ open: false, type: "single" });

  const {
    approvals,
    selected,
    search,
    page,
    pageSize,
    pageSizeOptions,
    pageCount,
    allChecked,
    isLoading,
    setSearch,
    setPage,
    setPageSize,
    selectApproval,
    selectAll,
    clearSelection,
    filters,
    setFilters,
  } = useWorkflowApprovals();

  const {
    createApproval,
    updateApproval,
    processApproval,
    deleteApproval,
    isCreating,
    isUpdating,
    isProcessing,
    isDeleting,
  } = useWorkflowApprovalMutations();

  const handleAddApproval = () => {
    setEditingApproval(null);
    setModalOpen(true);
  };

  const handleEditApproval = (approval: IWorkflowApproval) => {
    setEditingApproval(approval);
    setModalOpen(true);
  };

  const handleSaveApproval = async (data: any) => {
    try {
      if (editingApproval) {
        await updateApproval({
          id: editingApproval.workflow_approval_id,
          data,
        });
      } else {
        await createApproval(data);
      }
      setModalOpen(false);
      setEditingApproval(null);
    } catch (error) {
      console.error("Error saving approval:", error);
    }
  };

  const processLeave = async (id: number, action: "APPROVED" | "REJECTED") => {
    try {
      if (action === "APPROVED") {
        await employeeLeavesApi.approve(id);
        toast.success(
          t("workforce.approvals.approvedLeave") || "Leave approved"
        );
      } else {
        await employeeLeavesApi.reject(id);
        toast.success(
          t("workforce.approvals.rejectedLeave") || "Leave rejected"
        );
      }
      leavesHook.refetch();
    } catch (err) {
      console.error("Error processing leave", err);
      toast.error(t("common.error") || "Failed to process leave");
    }
  };

  const processPermission = async (
    id: number,
    action: "APPROVED" | "REJECTED"
  ) => {
    try {
      if (action === "APPROVED") {
        await employeeShortPermissionsApi.approve(id, {
          approve_reject_flag: 1,
        });
        toast.success(
          t("workforce.approvals.approvedPermission") || "Permission approved"
        );
      } else {
        await employeeShortPermissionsApi.approve(id, {
          approve_reject_flag: 2,
        });
        toast.success(
          t("workforce.approvals.rejectedPermission") || "Permission rejected"
        );
      }
      permissionsQuery.refetch();
    } catch (err) {
      console.error("Error processing permission", err);
      toast.error(t("common.error") || "Failed to process permission");
    }
  };

  const handleDeleteApproval = (id: number) => {
    const approval = approvals.find(
      (a: IWorkflowApproval) => a.workflow_approval_id === id
    );
    if (approval) {
      setDeleteDialog({
        open: true,
        type: "single",
        approval,
      });
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length > 0) {
      setDeleteDialog({
        open: true,
        type: "bulk",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      if (deleteDialog.type === "single" && deleteDialog.approval) {
        await deleteApproval(deleteDialog.approval.workflow_approval_id);
      } else if (deleteDialog.type === "bulk") {
        for (const approval of selected) {
          await deleteApproval(approval.workflow_approval_id);
        }
        clearSelection();
      }
      setDeleteDialog({ open: false, type: "single" });
    } catch (error) {
      console.error("Error deleting approval(s):", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingApproval(null);
  };

  const {
    canView: canViewLeaves,
    canCreate: canCreateLeaves,
    canEdit: canEditLeaves,
    canDelete: canDeleteLeaves,
  } = useTabPrivileges("workforce", "approvals", "leave-approval");

  const {
    canView: canViewPermissions,
    canCreate: canCreatePermissions,
    canEdit: canEditPermissions,
    canDelete: canDeletePermissions,
  } = useTabPrivileges("workforce", "approvals", "permissions-approval");
  React.useEffect(() => {
    if (!canViewLeaves && canViewPermissions) {
      setActiveTab("permissions");
    } else if (canViewLeaves && !canViewPermissions) {
      setActiveTab("leaves");
    }
  }, [canViewLeaves, canViewPermissions]);
  if (!canViewLeaves && !canViewPermissions) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">
            {t("common.noAccess") || "No Access"}
          </h3>
          <p className="text-muted-foreground">
            {t("common.noAccessMessage") ||
              "You don't have permission to view this page."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="py-4 border-border bg-background/90 p-4">
          <Tabs
            value={activeTab}
            onValueChange={(tab) =>
              setActiveTab(tab as "leaves" | "permissions")
            }
            className="w-full"
          >
            <TabsList className="mb-4">
              {canViewLeaves && (
                <TabsTrigger value="leaves">
                  {t("workforce.approvals.leavesTab") || "Leaves"}
                </TabsTrigger>
              )}
              {canViewPermissions && (
                <TabsTrigger value="permissions">
                  {t("workforce.approvals.permissionsTab") || "Permissions"}
                </TabsTrigger>
              )}
            </TabsList>
            {canViewLeaves && (
              <TabsContent value="leaves">
                <ApprovalsHeader
                  searchTerm={search}
                  onSearchChange={setSearch}
                  selectedCount={selected.length}
                  onDeleteSelected={handleDeleteSelected}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
                <div className="w-full mt-4">
                  <ApprovalsList
                    items={leavesQuery.data || []}
                    selectedIds={[]}
                    page={leavesHook.page}
                    pageSize={leavesHook.pageSize}
                    total={leavesHook.total}
                    allChecked={allChecked}
                    onSelectItem={() => {}}
                    onSelectAll={selectAll}
                    onEditItem={canEditLeaves ? handleEditApproval : undefined}
                    onDeleteItem={
                      canDeleteLeaves ? handleDeleteApproval : undefined
                    }
                    onProcessItem={canEditLeaves ? processLeave : undefined}
                    isLoading={leavesQuery.isLoading}
                    onPageChange={leavesHook.setPage}
                    onPageSizeChange={leavesHook.setPageSize}
                    type="leaves"
                  />
                </div>
                <div className="mt-4">
                  {pageCount > 1 && (
                    <CustomPagination
                      currentPage={page}
                      totalPages={pageCount}
                      onPageChange={setPage}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      onPageSizeChange={setPageSize}
                    />
                  )}
                </div>
              </TabsContent>
            )}
            {canViewPermissions && (
              <TabsContent value="permissions">
                <ApprovalsHeader
                  searchTerm={search}
                  onSearchChange={setSearch}
                  selectedCount={selected.length}
                  onDeleteSelected={handleDeleteSelected}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
                <div className="w-full mt-4">
                  <ApprovalsList
                    items={permissionsQuery.data || []}
                    selectedIds={[]}
                    page={permissionsQuery.page ?? 1}
                    pageSize={permissionsQuery.pageSize ?? 10}
                    total={permissionsQuery.total}
                    allChecked={allChecked}
                    onSelectItem={() => {}}
                    onSelectAll={selectAll}
                    onEditItem={
                      canEditPermissions ? handleEditApproval : undefined
                    }
                    onDeleteItem={
                      canDeletePermissions ? handleDeleteApproval : undefined
                    }
                    onProcessItem={
                      canEditPermissions ? processPermission : undefined
                    }
                    isLoading={permissionsQuery.isLoading}
                    onPageChange={(p: number) => permissionsQuery.setPage?.(p)}
                    onPageSizeChange={(s: number) =>
                      permissionsQuery.setPageSize?.(s)
                    }
                    type="permissions"
                  />
                </div>
                <div className="mt-4">
                  {pageCount > 1 && (
                    <CustomPagination
                      currentPage={page}
                      totalPages={pageCount}
                      onPageChange={setPage}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      onPageSizeChange={setPageSize}
                    />
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
          <ApprovalsModal
            isOpen={modalOpen}
            onClose={handleModalClose}
            onSave={handleSaveApproval}
            editingApproval={editingApproval}
            isLoading={isCreating || isUpdating}
          />
          <Dialog
            open={deleteDialog.open}
            onOpenChange={(open) =>
              !open && setDeleteDialog({ open: false, type: "single" })
            }
          >
            <DialogContent className="p-0">
              <DialogHeader className="p-2">
                <DialogTitle className="mb-1 p-2">
                  {deleteDialog.type === "bulk"
                    ? t("workforce.approvals.confirmDeleteMultiple") ||
                      "Confirm Delete"
                    : t("workforce.approvals.confirmDelete") ||
                      "Confirm Delete"}
                </DialogTitle>
                <div className="bg-black/5 p-4 rounded-lg dark:bg-white/5">
                  <DialogDescription>
                    {deleteDialog.type === "bulk"
                      ? t("workforce.approvals.confirmDeleteMultipleMessage") ||
                        `Are you sure you want to delete ${selected.length} approvals?`
                      : t("workforce.approvals.confirmDeleteMessage") ||
                        "Are you sure you want to delete this approval?"}
                  </DialogDescription>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setDeleteDialog({ open: false, type: "single" })
                      }
                      disabled={isDeleting}
                    >
                      {t("common.cancel") || "Cancel"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting
                        ? t("common.deleting") || "Deleting..."
                        : t("common.delete") || "Delete"}
                    </Button>
                  </div>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
