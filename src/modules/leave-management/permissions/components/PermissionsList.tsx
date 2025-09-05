"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { format, parseISO } from "date-fns";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import PermissionActions from "./PermissionActions";

type Permission = any;

type ViewMode = 'table' | 'grid';

interface Props {
  permissions: Permission[];
  loading?: boolean;
  selected: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  viewMode: ViewMode;
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
const formatDateTime = (dateStr: string | Date | null): string => {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, 'dd MMM yyyy');
  } catch (error) {
    return String(dateStr);
  }
};

const formatTime = (timeStr: string | null): string => {
  if (!timeStr) return '-';
  try {
    return format(parseISO(`2000-01-01T${timeStr}`), 'HH:mm');
  } catch (error) {
    return String(timeStr);
  }
};

const statusMap: Record<string | number, { label: string; color: string }> = {
  0: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  1: { label: "Approved", color: "bg-green-100 text-green-800" },
  2: { label: "Rejected", color: "bg-red-100 text-red-800" },
  'pending': { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  'approved': { label: "Approved", color: "bg-green-100 text-green-800" },
  'rejected': { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const PermissionsList: React.FC<Props> = ({
  permissions,
  loading = false,
  selected,
  onSelectItem,
  onSelectAll,
  allChecked,
  viewMode,
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
      accessor: (permission) => (
        <Badge className={statusMap[permission.status]?.color || 'bg-gray-100 text-gray-800'}>
          {statusMap[permission.status]?.label || permission.status || 'Unknown'}
        </Badge>
      ),
    },
    {
      key: "remarks",
      header: t('leaveManagement.permissions.columns.remarks') || 'Remarks',
      accessor: (permission) => (
        <div className="max-w-xs truncate" title={permission.remarks}>
          {permission.remarks || '-'}
        </div>
      ),
    },
  ];

  const getItemId = (permission: Permission) => permission.id || permission.permission_id || 0;
  const getItemDisplayName = (permission: Permission) => permission.employee?.employee_name || 'N/A';

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {permissions.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">{t('leaveManagement.permissions.noData') || 'No permissions found'}</p>
        </div>
      ) : (
        permissions.map((permission) => (
          <Card key={permission.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selected.includes(getItemId(permission))}
                    onCheckedChange={() => onSelectItem(getItemId(permission))}
                  />
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {permission.employee?.employee_name || 'N/A'}
                    </CardTitle>
                    <p className="text-xs text-gray-500">{permission.employee?.employee_no || 'N/A'}</p>
                  </div>
                </div>
                <Badge className={statusMap[permission.status]?.color || 'bg-gray-100 text-gray-800'}>
                  {statusMap[permission.status]?.label || permission.status || 'Unknown'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.type') || 'Type'}:</span>
                  <span className="ml-2">{permission.permission_type?.permission_type_eng || permission.permission_type_id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.date') || 'Date'}:</span>
                  <span className="ml-2">{formatDateTime(permission.from_date)} - {formatDateTime(permission.to_date)}</span>
                </div>
                {(permission.from_time || permission.to_time) && (
                  <div>
                    <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.time') || 'Time'}:</span>
                    <span className="ml-2">{formatTime(permission.from_time)} - {formatTime(permission.to_time)}</span>
                  </div>
                )}
                {permission.remarks && (
                  <div>
                    <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.remarks') || 'Remarks'}:</span>
                    <p className="mt-1 text-xs text-gray-700">{permission.remarks}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <PermissionActions
                  permission={permission}
                  onEdit={() => onEdit(permission)}
                  onRefresh={onRefresh}
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {viewMode === 'table' ? (
        <GenericTable
          data={permissions}
          columns={columns}
          selected={selected}
          page={currentPage}
          pageSize={pageSize}
          allChecked={allChecked}
          getItemId={getItemId}
          getItemDisplayName={getItemDisplayName}
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
      ) : (
        renderGridView()
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          pageSize={pageSize}
          pageSizeOptions={[10, 20, 50, 100]}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default PermissionsList;
