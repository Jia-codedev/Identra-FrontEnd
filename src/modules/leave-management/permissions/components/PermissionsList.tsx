"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IPermission } from "../types";

interface Props {
  permissions: IPermission[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  onEdit: (permission: IPermission) => void;
  onDeletePermission: (id: number) => void;
  isLoading?: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const formatDate = (dt: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy");
  } catch {
    return dt;
  }
};

const formatTime = (time: string) => {
  if (!time) return "-";
  try {
    // Handle if time already includes date
    if (time.includes("T")) {
      return format(parseISO(time), "hh:mm a");
    }
    return format(parseISO(`2000-01-01T${time}`), "hh:mm a");
  } catch {
    return time;
  }
};

const statusMap: Record<number, { label: string; color: string }> = {
  0: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  1: {
    label: "Approved",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  2: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export const PermissionsList: React.FC<Props> = ({
  permissions,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectItem,
  onSelectAll,
  onEdit,
  onDeletePermission,
  isLoading,
  onPageChange,
  onPageSizeChange,
  canEdit,
  canDelete,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IPermission>[] = [
    {
      key: "employee",
      header: t("leaveManagement.permissions.columns.employee") || "Employee",
      accessor: (permission: any) => {
        const empName =
          permission.employee_name ||
          (permission.employee_master
            ? `${permission.employee_master.firstname_eng || ""} ${
                permission.employee_master.lastname_eng || ""
              }`.trim()
            : "N/A");
        const empNo = permission.employee_master?.emp_no || "N/A";
        return (
          <div>
            <div className="font-medium">{empName}</div>
            <div className="text-sm text-muted-foreground">{empNo}</div>
          </div>
        );
      },
    },
    {
      key: "type",
      header: t("leaveManagement.permissions.columns.type") || "Type",
      accessor: (permission: any, isRTL) => {
        if (permission.permission_type_name)
          return permission.permission_type_name;
        if (permission.permission_types) {
          return isRTL
            ? permission.permission_types.permission_type_arb ||
                permission.permission_types.permission_type_eng
            : permission.permission_types.permission_type_eng ||
                permission.permission_types.permission_type_arb;
        }
        return permission.permission_type_id || "N/A";
      },
    },
    {
      key: "fromDate",
      header: t("leaveManagement.permissions.columns.from") || "From",
      accessor: (permission) => formatDate(permission.from_date),
    },
    {
      key: "toDate",
      header: t("leaveManagement.permissions.columns.to") || "To",
      accessor: (permission) => formatDate(permission.to_date),
    },
    {
      key: "time",
      header: t("leaveManagement.permissions.columns.time") || "Time",
      accessor: (permission) =>
        permission.from_time && permission.to_time
          ? `${formatTime(permission.from_time)} - ${formatTime(
              permission.to_time
            )}`
          : "-",
    },
    {
      key: "status",
      header: t("leaveManagement.permissions.columns.status") || "Status",
      accessor: (permission) => {
        const status =
          statusMap[permission.approve_reject_flag] || statusMap[0];
        return (
          <Badge
            className={`${status.color} px-2 py-1 rounded text-xs font-medium`}
            variant="outline"
          >
            {status.label}
          </Badge>
        );
      },
    },
    {
      key: "remarks",
      header: t("leaveManagement.permissions.columns.remarks") || "Remarks",
      accessor: (permission) => (
        <div className="max-w-xs truncate" title={permission.remarks}>
          {permission.remarks || "None"}
        </div>
      ),
    },
  ];

  return (
    <GenericTable
      canEdit={canEdit}
      canDelete={canDelete}
      data={permissions}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) =>
        item.employee_short_permission_id || item.short_permission_id
      }
      getItemDisplayName={(item: any, isRTL) => {
        const empName =
          item.employee_name ||
          (item.employee_master
            ? `${item.employee_master.firstname_eng || ""} ${
                item.employee_master.lastname_eng || ""
              }`.trim()
            : "Permission");
        return empName;
      }}
      onSelectItem={(id) => onSelectItem(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEdit}
      onDeleteItem={(id) => onDeletePermission(Number(id))}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={
        t("leaveManagement.permissions.noPermissionsFound") ||
        "No permissions found"
      }
      isLoading={isLoading}
    />
  );
};

export default PermissionsList;
