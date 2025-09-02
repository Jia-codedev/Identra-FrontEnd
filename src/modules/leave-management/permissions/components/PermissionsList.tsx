import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/Checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { format, parseISO } from "date-fns";
import { useTranslations } from "@/hooks/use-translations";
import { CustomPagination } from "@/components/common/dashboard/Pagination";
import PermissionActions from "./PermissionActions";
import { ViewMode } from "./PermissionsHeader";

type Permission = any;

type Props = {
  permissions: Permission[];
  loading?: boolean;
  selected: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  onRefresh: () => void;
  onEdit: (permission: Permission) => void;
  viewMode: ViewMode;
  // Pagination props
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  total: number;
};

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const formatDateTime = (dt?: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy");
  } catch {
    return dt;
  }
};

const formatTime = (time?: string) => {
  if (!time) return "-";
  return time;
};

const PermissionsList: React.FC<Props> = ({ 
  permissions, 
  loading, 
  selected, 
  onSelectItem, 
  onSelectAll, 
  allChecked,
  onRefresh,
  onEdit,
  viewMode,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  total
}) => {
  const { t } = useTranslations();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allChecked}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>{t('leaveManagement.permissions.columns.employee')}</TableHead>
            <TableHead>{t('leaveManagement.permissions.columns.type')}</TableHead>
            <TableHead>{t('leaveManagement.permissions.columns.from')}</TableHead>
            <TableHead>{t('leaveManagement.permissions.columns.to')}</TableHead>
            <TableHead>{t('leaveManagement.permissions.columns.time')}</TableHead>
            <TableHead>{t('leaveManagement.permissions.columns.status')}</TableHead>
            <TableHead>{t('leaveManagement.permissions.columns.remarks')}</TableHead>
            <TableHead className="w-32">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                {t('leaveManagement.permissions.noData')}
              </TableCell>
            </TableRow>
          ) : (
            permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(permission.id)}
                    onCheckedChange={() => onSelectItem(permission.id)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{permission.employee?.employee_name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{permission.employee?.employee_no || 'N/A'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {permission.permission_type?.permission_type_eng || permission.permission_type_id}
                </TableCell>
                <TableCell>{formatDateTime(permission.from_date)}</TableCell>
                <TableCell>{formatDateTime(permission.to_date)}</TableCell>
                <TableCell>
                  {permission.from_time && permission.to_time ? (
                    `${formatTime(permission.from_time)} - ${formatTime(permission.to_time)}`
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Badge className={statusMap[permission.status]?.color || 'bg-gray-100 text-gray-800'}>
                    {statusMap[permission.status]?.label || permission.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={permission.remarks}>
                    {permission.remarks || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <PermissionActions
                    permission={permission}
                    onEdit={() => onEdit(permission)}
                    onRefresh={onRefresh}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {permissions.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">{t('leaveManagement.permissions.noData')}</p>
        </div>
      ) : (
        permissions.map((permission) => (
          <Card key={permission.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selected.includes(permission.id)}
                    onCheckedChange={() => onSelectItem(permission.id)}
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
                  <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.type')}:</span>
                  <span className="ml-2">{permission.permission_type?.permission_type_eng || permission.permission_type_id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.date')}:</span>
                  <span className="ml-2">{formatDateTime(permission.from_date)} - {formatDateTime(permission.to_date)}</span>
                </div>
                {(permission.from_time || permission.to_time) && (
                  <div>
                    <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.time')}:</span>
                    <span className="ml-2">{formatTime(permission.from_time)} - {formatTime(permission.to_time)}</span>
                  </div>
                )}
                {permission.remarks && (
                  <div>
                    <span className="font-medium text-gray-600">{t('leaveManagement.permissions.columns.remarks')}:</span>
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
      {viewMode === 'table' ? renderTableView() : renderGridView()}
      
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
