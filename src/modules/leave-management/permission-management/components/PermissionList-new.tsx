import React from "react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";

// Helper to format date/time
const formatDateTime = (dt: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy, hh:mm a");
  } catch {
    return dt;
  }
};

type Permission = any;

type Props = {
  permissions: Permission[];
  loading?: boolean;
  selected?: string[];
  onSelectItem?: (id: string) => void;
  onSelectAll?: () => void;
  allChecked?: boolean;
  onRefresh?: () => void;
  onEdit?: (permission: Permission) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  total?: number;
  onEditItem?: (permission: Permission) => void;
  onDeleteItem?: (permission: Permission) => void;
};

const statusMap: Record<number, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  0: { label: "Pending", variant: "secondary" },
  1: { label: "Approved", variant: "default" },
  2: { label: "Rejected", variant: "destructive" },
};

const PermissionList: React.FC<Props> = ({ 
  permissions, 
  loading = false,
  selected = [],
  onSelectItem,
  onSelectAll,
  allChecked = false,
  onRefresh,
  onEdit,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  pageSize = 10,
  onPageSizeChange = () => {},
  total = 0,
  onEditItem,
  onDeleteItem
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<Permission>[] = [
    {
      key: "permission_type",
      header: t('leaveManagement.permissionManagement.columns.type') || 'Permission Type',
      accessor: (permission) => (
        <div className="font-medium">
          {permission.permission_types?.permission_type_eng || "Unknown"}
        </div>
      ),
    },
    {
      key: "employee_name",
      header: t('leaveManagement.permissionManagement.columns.employee') || 'Employee',
      accessor: (permission) => {
        const employee = permission.employee_master_employee_short_permissions_employee_idToemployee_master;
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {employee?.firstname_eng || "-"}
            </div>
            <div className="text-sm text-muted-foreground">
              {employee?.emp_no || "-"}
            </div>
          </div>
        );
      },
    },
    {
      key: "dates",
      header: t('leaveManagement.permissionManagement.columns.dates') || 'Dates',
      accessor: (permission) => (
        <div className="text-sm">
          <div><strong>From:</strong> {formatDateTime(permission.from_date)}</div>
          <div><strong>To:</strong> {formatDateTime(permission.to_date)}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: t('leaveManagement.permissionManagement.columns.status') || 'Status',
      accessor: (permission) => {
        const status = statusMap[permission.approve_reject_flag] || statusMap[0];
        return (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        );
      },
    },
    {
      key: "remarks",
      header: t('leaveManagement.permissionManagement.columns.remarks') || 'Remarks',
      accessor: (permission) => (
        <div className="max-w-xs truncate" title={permission.remarks || ""}>
          {permission.remarks || (
            <span className="italic text-muted-foreground">None</span>
          )}
        </div>
      ),
    },
  ];

  // Convert string IDs to numbers for GenericTable
  const numericSelected = selected.map(id => parseInt(id.toString(), 10)).filter(id => !isNaN(id));
  
  const handleSelectItem = (id: number) => {
    onSelectItem?.(id.toString());
  };

  return (
    <GenericTable
      data={permissions}
      columns={columns}
      selected={numericSelected}
      page={currentPage}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.single_permissions_id || item.id}
      getItemDisplayName={(item) => `${item.permission_types?.permission_type_eng || 'Permission'} - ${item.employee_master_employee_short_permissions_employee_idToemployee_master?.firstname_eng || 'Employee'}`}
      onSelectItem={handleSelectItem}
      onSelectAll={onSelectAll || (() => {})}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem ? (id) => {
        const permission = permissions.find(p => p.single_permissions_id === id);
        if (permission) onDeleteItem(permission);
      } : undefined}
      noDataMessage={t('leaveManagement.permissionManagement.noData') || 'No permission requests found.'}
      isLoading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      showActions={!!(onEditItem || onDeleteItem)}
    />
  );
};

export default PermissionList;
