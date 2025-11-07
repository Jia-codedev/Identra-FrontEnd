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
  onSelectItem: (id: string | number) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEditItem?: (item: Leave) => void;
  onDeleteItem?: (id: string | number) => void;
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
  console.log("LeavesList rendered with leaves:", leaves);
  const { t } = useTranslations();
  const columns: TableColumn<Leave>[] = [
    {
      key: "code",
      header: t("leaveManagement.leaveTypes.columns.code") || "Code",
      accessor: (leave) => leave.code || "-",
    },
    {
      key: "name",
      header: t("leaveManagement.leaveTypes.columns.name") || "Name",
      accessor: (leave) => leave.leave_type || "-",
    },
    {
      key: "status",
      header: t("leaveManagement.leaveTypes.columns.status") || "Status",
      accessor: (leave) => (
        <Badge
          className={
            (leave.status ? "bg-card text-green-800" : "text-destructive") +
            " px-2 py-0.5 rounded text-xs font-medium"
          }
          variant="outline"
        >
          {leave.status
            ? t("common.active") || "Active"
            : t("common.inactive") || "Inactive"}
        </Badge>
      ),
    },
    {
      key: "created",
      header: t("leaveManagement.leaveTypes.columns.created") || "Created",
      accessor: (leave) => formatDateTime(leave.created_date),
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
      onSelectItem={onSelectItem}
      onSelectAll={onSelectAll}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
      noDataMessage={t("leaveManagement.leaveTypes.noData") || "No items found"}
      isLoading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      showActions={!!(onEditItem || onDeleteItem)}
    />
  );
};

export default LeavesList;
