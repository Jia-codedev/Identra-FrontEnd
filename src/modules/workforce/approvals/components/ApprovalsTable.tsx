"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IWorkflowApproval } from "../types";

interface ApprovalsTableProps {
  approvals: IWorkflowApproval[];
  selected: IWorkflowApproval[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectApproval: (id: number) => void;
  onSelectAll: () => void;
  onEditApproval: (approval: IWorkflowApproval) => void;
  onDeleteApproval: (id: number) => void;
  onProcessApproval: (id: number, action: 'APPROVED' | 'REJECTED') => void;
  isLoading?: boolean;
}

export const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  approvals,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectApproval,
  onSelectAll,
  onEditApproval,
  onDeleteApproval,
  onProcessApproval,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const getLocalizedWorkflowName = (approval: IWorkflowApproval) => {
    return approval.workflow_name_eng || approval.workflow_name_arb || '-';
  };

  const getLocalizedStepName = (approval: IWorkflowApproval) => {
    return approval.step_eng || approval.step_arb || '-';
  };

  const getEmployeeName = (approval: IWorkflowApproval) => {
    const firstName = approval.firstname_eng || approval.firstname_arb || '';
    const lastName = approval.lastname_eng || approval.lastname_arb || '';
    return `${firstName} ${lastName}`.trim() || '-';
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'WAITING': 'bg-blue-100 text-blue-800',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const columns: TableColumn<IWorkflowApproval>[] = [
    {
      key: "workflow_approval_id",
      header: t("workforce.approvals.id") || "ID",
      accessor: (item) => item.workflow_approval_id,
    },
    {
      key: "workflow_name",
      header: t("workforce.approvals.workflowName") || "Workflow Name",
      accessor: (item) => getLocalizedWorkflowName(item),
    },
    {
      key: "step_name",
      header: t("workforce.approvals.stepName") || "Step Name",
      accessor: (item) => getLocalizedStepName(item),
    },
    {
      key: "approver_name",
      header: t("workforce.approvals.approverName") || "Approver Name",
      accessor: (item) => getEmployeeName(item),
    },
    {
      key: "approval_status",
      header: t("workforce.approvals.status") || "Status",
      accessor: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.approval_status)}`}>
          {item.approval_status}
        </span>
      ),
    },
    {
      key: "approval_date",
      header: t("workforce.approvals.approvalDate") || "Approval Date",
      accessor: (item) => item.approval_date ? new Date(item.approval_date).toLocaleDateString() : '-',
    },
    {
      key: "comments",
      header: t("workforce.approvals.comments") || "Comments",
      accessor: (item) => item.comments || '-',
    },
  ];

  return (
    <GenericTable<IWorkflowApproval>
      data={approvals}
      columns={columns}
      selected={selected.map(a => a.workflow_approval_id)}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.workflow_approval_id}
      getItemDisplayName={(item) => `Approval ${item.workflow_approval_id}`}
      onSelectItem={(id) => onSelectApproval(id as number)}
      onSelectAll={onSelectAll}
      onEditItem={onEditApproval}
      onDeleteItem={(id) => onDeleteApproval(id as number)}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={
        t("workforce.approvals.noApprovalsFound") || "No approvals found"
      }
      isLoading={isLoading}
      showActions={true}
      actions={(item: IWorkflowApproval) => (
        <div className="flex gap-2">
          {item.approval_status === 'PENDING' && (
            <>
              <button
                onClick={() => onProcessApproval(item.workflow_approval_id, 'APPROVED')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                {t("workforce.approvals.approve") || "Approve"}
              </button>
              <button
                onClick={() => onProcessApproval(item.workflow_approval_id, 'REJECTED')}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t("workforce.approvals.reject") || "Reject"}
              </button>
            </>
          )}
        </div>
      )}
    />
  );
};