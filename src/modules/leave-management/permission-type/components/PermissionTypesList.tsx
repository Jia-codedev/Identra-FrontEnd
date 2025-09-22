import React from "react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { useTranslations } from "@/hooks/use-translations";

type PermissionType = any;

type Props = {
  permissionTypes: PermissionType[];
  loading?: boolean;
  selected: number[];
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  allChecked: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEditItem?: (item: PermissionType) => void;
  onDeleteItem?: (id: number) => void;
};

const formatDateTime = (dt?: string) => {
  if (!dt) return "-";
  try {
    return format(parseISO(dt), "dd MMM yyyy, hh:mm a");
  } catch {
    return dt;
  }
};

const PermissionTypesList: React.FC<Props> = ({ 
  permissionTypes, 
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
  onDeleteItem
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<PermissionType>[] = [
    {
      key: "code",
      header: t('leaveManagement.permissionTypes.columns.code') || 'Code',
      accessor: (item) => item.code || '-',
    },
    {
      key: "name",
      header: t('leaveManagement.permissionTypes.columns.name') || 'Name',
      accessor: (item) => item.permission_type || '-',
    },
    {
      key: "status",
      header: t('leaveManagement.permissionTypes.columns.status') || 'Status',
      accessor: (item) => (
        <Badge className={(item.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700') + ' px-2 py-1 rounded text-xs font-medium'} variant="outline">
          {item.status ? (t('common.active') || 'Active') : (t('common.inactive') || 'Inactive')}
        </Badge>
      ),
    },
    {
      key: "created",
      header: t('leaveManagement.permissionTypes.columns.created') || 'Created',
      accessor: (item) => formatDateTime(item.created_date),
    },
  ];

  return (
    <GenericTable
      data={permissionTypes}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.id}
      getItemDisplayName={(item) => item.permission_type}
      onSelectItem={onSelectItem}
      onSelectAll={onSelectAll}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
      noDataMessage={t('leaveManagement.permissionTypes.noData') || 'No items found'}
      isLoading={loading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      showActions={!!(onEditItem || onDeleteItem)}
    />
  );
};

export default PermissionTypesList;
