import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/Checkbox";
import { format, parseISO } from "date-fns";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";

type Leave = any;

type ViewMode = 'table' | 'grid';

interface Props {
  leaves: Leave[];
  loading?: boolean;
  viewMode: ViewMode;
  selected: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  onEdit?: (leave: Leave) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const statusMap: Record<string, { label: string; color: string }> = {
  "pending": { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  "approved": { label: "Approved", color: "bg-green-100 text-green-800" },
  "rejected": { label: "Rejected", color: "bg-red-100 text-red-800" },
  "cancelled": { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  "0": { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  "1": { label: "Approved", color: "bg-green-100 text-green-800" },
  "2": { label: "Rejected", color: "bg-red-100 text-red-800" },
  "3": { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
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
  loading = false,
  viewMode,
  selected,
  onSelectItem,
  onSelectAll,
  allChecked,
  onEdit,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  // Table columns definition
  const columns: TableColumn<Leave>[] = [
    {
      key: "employee",
      header: t('leaveManagement.leaves.columns.employee') || 'Employee',
      accessor: (leave) => (
        <div>
          <div className="font-medium">{leave.employee_name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{leave.employee_no || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: t('leaveManagement.leaves.columns.type') || 'Leave Type',
      accessor: (leave) => leave.leave_type || 'N/A',
    },
    {
      key: "fromDate",
      header: t('leaveManagement.leaves.columns.start') || 'From',
      accessor: (leave) => formatDateTime(leave.start_date),
    },
    {
      key: "toDate",
      header: t('leaveManagement.leaves.columns.end') || 'To',
      accessor: (leave) => formatDateTime(leave.end_date),
    },
    {
      key: "days",
      header: t('leaveManagement.leaves.columns.days') || 'Days',
      accessor: (leave) => leave.total_days || '-',
    },
    {
      key: "status",
      header: t('leaveManagement.leaves.columns.status') || 'Status',
      accessor: (leave) => {
        const statusRaw = leave.status || "pending";
        const status = statusMap[statusRaw?.toLowerCase?.()] || statusMap["pending"];
        return (
          <Badge className={status.color}>
            {t(`leaveManagement.leaves.status.${statusRaw?.toLowerCase()}`) || status.label}
          </Badge>
        );
      },
    },
    {
      key: "remarks",
      header: t('leaveManagement.leaves.columns.remarks') || 'Remarks',
      accessor: (leave) => (
        <div className="max-w-xs truncate" title={leave.employee_remarks}>
          {leave.employee_remarks || '-'}
        </div>
      ),
    },
  ];

  const getItemId = (leave: Leave) => leave.id || 0;
  const getItemDisplayName = (leave: Leave) => leave.leave_type || 'Leave';

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leaves.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <span className="text-sm text-muted-foreground">No leave requests found.</span>
        </div>
      ) : (
        leaves.map((l: any) => {
          const statusRaw = l.status || "pending";
          const status = statusMap[statusRaw?.toLowerCase?.()] || statusMap["pending"];
          const cardKey = l.leave_unique_ref_no || l.id;

          return (
            <Card key={cardKey} className="transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selected.includes(getItemId(l))}
                    onCheckedChange={() => onSelectItem(getItemId(l))}
                  />
                  <CardTitle className="text-base font-semibold">
                    {l.leave_type}
                  </CardTitle>
                </div>
                <Badge
                  className={status.color + " px-2 py-1 rounded text-xs font-medium"}
                  variant="outline"
                >
                  {t(`leaveManagement.leaves.status.${statusRaw?.toLowerCase()}`) || status.label}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="text-muted-foreground">
                  <span className="font-medium">{t('leaveManagement.leaves.columns.employee') || 'Employee'}:</span>{" "}
                  {l.employee_name}
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium">{t('leaveManagement.leaves.columns.empNo') || 'Emp No'}:</span>{" "}
                  {l.employee_no}
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium">{t('leaveManagement.leaves.columns.start') || 'From'}:</span>{" "}
                  {formatDateTime(l.start_date)}
                </div>
                <div className="text-muted-foreground">
                  <span className="font-medium">{t('leaveManagement.leaves.columns.end') || 'To'}:</span>{" "}
                  {formatDateTime(l.end_date)}
                </div>
                <div>
                  <span className="font-medium">{t('leaveManagement.leaves.columns.days') || 'Days'}:</span>{" "}
                  {l.total_days || '-'}
                </div>
                <div>
                  <span className="font-medium">{t('leaveManagement.leaves.columns.remarks') || 'Remarks'}:</span>{" "}
                  {l.employee_remarks || <span className="italic text-gray-400">{t('common.none') || 'None'}</span>}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {l.leave_unique_ref_no}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-3 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!leaves || leaves.length === 0 && !loading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <span className="text-sm">No leave requests found.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === 'table' ? (
        <GenericTable
          data={leaves}
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
          noDataMessage={t('leaveManagement.leaves.noData') || 'No leaves found'}
          isLoading={loading}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      ) : (
        renderGridView()
      )}
    </div>
  );
};

export default LeavesList;
