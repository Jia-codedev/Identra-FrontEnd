"use client"

import React, { useState } from 'react'
import { useTranslations } from '@/hooks/use-translations'
import { GenericTable, TableColumn } from '@/components/common/GenericTable'
import { CustomPagination } from '@/components/common/dashboard/Pagination'
import { useRouter } from 'next/navigation'

import usePermissions from './hooks/usePermissions'
import employeeShortPermissionsApi from '@/services/leaveManagement/employeeShortPermissions'
import PermissionHeader from './components/PermissionHeader'
import PermissionList from './components/PermissionList'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import PermissionRequestForm from './components/PermissionRequestForm'

type PermissionItem = any


const PermissionManagementPage: React.FC = () => {
  const { t } = useTranslations();
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const {
    data,
    isLoading,
    refetch,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    pageCount,
    selected,
    selectItem,
    selectAll,
    clearSelection
  } = usePermissions();

  const items: PermissionItem[] = Array.isArray((data as any)?.data) ? (data as any).data : [];

  const handleAdd = () => setShowDialog(true);
  const handleDialogClose = (refresh = false) => {
    setShowDialog(false);
    if (refresh) refetch();
  };

  const handleSearchChange = (value: string) => setSearch(value);

  // Table columns definition
  const columns: TableColumn<any>[] = [
    {
      key: 'permission_type',
      header: t('leaveManagement.permissions.columns.type') || 'Type',
      accessor: (item) => item.permission_type_eng || item.permission_type_code,
    },
    {
      key: 'from_date',
      header: t('leaveManagement.permissions.columns.from') || 'From',
      accessor: (item) => `${item.from_date} ${item.from_time}`,
    },
    {
      key: 'to_date',
      header: t('leaveManagement.permissions.columns.to') || 'To',
      accessor: (item) => `${item.to_date} ${item.to_time}`,
    },
    {
      key: 'remarks',
      header: t('leaveManagement.permissions.columns.remarks') || 'Remarks',
      accessor: (item) => item.remarks,
    },
    {
      key: 'status',
      header: t('leaveManagement.permissions.columns.status') || 'Status',
      accessor: (item) => {
        if (item.approve_reject_flag === 1) return t('common.approved') || 'Approved';
        if (item.approve_reject_flag === 2) return t('common.rejected') || 'Rejected';
        return t('common.pending') || 'Pending';
      },
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
          <PermissionHeader
            search={search}
            onSearchChange={handleSearchChange}
            onAdd={handleAdd}
            selectedCount={selected.length}
            view={view}
            onViewChange={setView}
          />

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogTitle>{t('leaveManagement.permissions.actions.add') || 'Add Permission Request'}</DialogTitle>
              <PermissionRequestForm onSuccess={() => handleDialogClose(true)} onCancel={() => handleDialogClose(false)} />
            </DialogContent>
          </Dialog>

          <div className="w-full overflow-x-auto mt-4">
            {view === 'grid' ? (
              <PermissionList permissions={items} loading={isLoading} />
            ) : (
              <GenericTable
                data={items}
                columns={columns}
                selected={selected}
                page={page}
                pageSize={pageSize}
                allChecked={false}
                getItemId={(item: any) => item.single_permissions_id}
                getItemDisplayName={(item: any) => item.permission_type_eng || item.permission_type_code}
                onSelectItem={selectItem}
                onSelectAll={selectAll}
                noDataMessage={t('leaveManagement.permissions.noData') || 'No data'}
                isLoading={isLoading}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </div>

          <div className="mt-4">
            <CustomPagination currentPage={page} totalPages={pageCount} onPageChange={setPage} pageSize={pageSize} pageSizeOptions={[5,10,20,50]} onPageSizeChange={setPageSize} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManagementPage;
