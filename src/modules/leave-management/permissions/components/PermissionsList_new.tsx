"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import PermissionActions from "./PermissionActions";

type Permission = any;

interface Props {
  permissions: Permission[];
  loading?: boolean;
  selected: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  onEdit: (permission: Permission) => void;
  onRefresh: () => void;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// Helper functions
const formatDateTime = (dt: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy, hh:mm a");
  } catch {
    return dt;
  }
};

const formatTime = (time: string) => {
  if (!time) return "-";
  try {
    return format(parseISO(`2000-01-01T${time}`), "hh:mm a");
  } catch {
    return time;
  }
};

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  1: { label: "Approved", color: "bg-green-100 text-green-800" },
  2: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const PermissionsList: React.FC<Props> = ({
  permissions,
  loading = false,
  selected,
  onSelectItem,
  onSelectAll,
  allChecked,
  onEdit,
  onRefresh,
  currentPage,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  // Table columns definition
  const columns: TableColumn<Permission>[] = [
    {
      key: "employee",
      header: t('leaveManagement.permissions.columns.employee') || 'Employee',
      accessor: (permission) => (
        <div>
          <div className="font-medium">{permission.employee?.employee_name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{permission.employee?.employee_no || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: t('leaveManagement.permissions.columns.type') || 'Type',
      accessor: (permission) => permission.permission_type?.permission_type_eng || permission.permission_type_id || 'N/A',
    },
    {
      key: "fromDate",
      header: t('leaveManagement.permissions.columns.from') || 'From',
      accessor: (permission) => formatDateTime(permission.from_date),
    },
    {
      key: "toDate",
      header: t('leaveManagement.permissions.columns.to') || 'To',
      accessor: (permission) => formatDateTime(permission.to_date),
    },
    {
      key: "time",
      header: t('leaveManagement.permissions.columns.time') || 'Time',
      accessor: (permission) =>
        permission.from_time && permission.to_time ?
          `${formatTime(permission.from_time)} - ${formatTime(permission.to_time)}` : '-',
    },
    {
      key: "status",
      header: t('leaveManagement.permissions.columns.status') || 'Status',
      accessor: (permission) => {
        const status = statusMap[permission.approve_reject_flag] || statusMap[0];
        return (
          <Badge
            className={status.color + " px-2 py-1 rounded text-xs font-medium"}
            variant="outline"
          >
            {status.label}
          </Badge>
        );
      },
    },
    {
      key: "remarks",
      header: t('leaveManagement.permissions.columns.remarks') || 'Remarks',
      accessor: (permission) => (
        <div className="max-w-xs truncate" title={permission.remarks}>
          {permission.remarks || 'None'}
        </div>
      ),
    },
  ];

  return (
    <GenericTable
      data={permissions}
      columns={columns}
      selected={selected}
      page={currentPage}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.single_permissions_id || item.id}
      getItemDisplayName={(item) => `${item.permission_type?.permission_type_eng || 'Permission'} - ${item.employee?.employee_name || 'Unknown'}`}
      onSelectItem={onSelectItem}
      onSelectAll={onSelectAll}
      onEditItem={onEdit}
      actions={(permission) => (
        <PermissionActions
          permission={permission}
          onEdit={() => onEdit(permission)}
          onRefresh={onRefresh}
        />
      )}
      noDataMessage={t('leaveManagement.permissions.noData') || 'No permissions found'}
      isLoading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
};

export default PermissionsList;
