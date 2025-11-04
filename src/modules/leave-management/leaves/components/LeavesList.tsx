import React from "react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { useTranslations } from "@/hooks/use-translations";

type Leave = any;

type Props = {
  leaves: Leave[];
  loading?: boolean;
  selected: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEditItem?: (item: Leave) => void;
  onDeleteItem?: (id: number) => void;
  canDelete?: boolean;
  canEdit?: boolean;
};

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const formatDateTime = (dt?: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy, hh:mm a");
  } catch {
    return dt;
  }
};

const LeavesList: React.FC<Props> = ({
  leaves,
  loading,
  selected,
  onSelectItem,
  onSelectAll,
  allChecked,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEditItem,
  onDeleteItem,
  canDelete,
  canEdit,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<Leave>[] = [
    {
      key: "leave_type",
      header: t("leaveManagement.leaves.columns.type") || "Leave Type",
      accessor: (leave) => leave.leave_type || "Unknown",
    },
    {
      key: "dates",
      header: t("leaveManagement.leaves.columns.dates") || "Dates",
      accessor: (leave) => (
        <div className="text-sm">
          <div>
            <strong>From:</strong> {formatDateTime(leave.start_date)}
          </div>
          <div>
            <strong>To:</strong> {formatDateTime(leave.end_date)}
          </div>
        </div>
      ),
    },
    {
      key: "duration",
      header: t("leaveManagement.leaves.columns.duration") || "Duration",
      accessor: (leave) =>
        leave.number_of_leaves ? `${leave.number_of_leaves} days` : "-",
    },
    {
      key: "status",
      header: t("leaveManagement.leaves.columns.status") || "Status",
      accessor: (leave) => {
        const statusRaw = leave.status || "pending";
        const status =
          statusMap[statusRaw?.toLowerCase?.()] || statusMap["pending"];
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
      header: t("leaveManagement.leaves.columns.remarks") || "Remarks",
      accessor: (leave) => (
        <div className="max-w-xs truncate" title={leave.employee_remarks}>
          {leave.employee_remarks || "None"}
        </div>
      ),
    },
    {
      key: "reference",
      header: t("leaveManagement.leaves.columns.reference") || "Reference",
      accessor: (leave) => (
        <div className="text-xs text-gray-500 font-mono">
          {leave.leave_unique_ref_no || "-"}
        </div>
      ),
    },
  ];

  return (
    <GenericTable
      canEdit={canEdit} 
      canDelete={canDelete}
      data={leaves}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.id || item.employee_leave_id}
      getItemDisplayName={(item) =>
        `${item.leave_type} - ${item.leave_unique_ref_no}`
      }
      onSelectItem={(id) => onSelectItem(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditItem}
      onDeleteItem={(id) => onDeleteItem && onDeleteItem(Number(id))}
      noDataMessage={
        t("leaveManagement.leaves.noData") || "No leave requests found"
      }
      isLoading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      showActions={!!(onEditItem || onDeleteItem)}
    />
  );
};

export default LeavesList;
