"use client"

import React, { useState } from 'react'
import { useTranslations } from '@/hooks/use-translations'

import usePermissions from './hooks/usePermissions'
import PermissionHeader from './components/PermissionHeader'
import PermissionList from './components/PermissionList'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import PermissionRequestForm from './components/PermissionRequestForm'

type PermissionItem = any


const PermissionManagementPage: React.FC = () => {
  const { t } = useTranslations();
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");
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

  const handleEdit = (permission: PermissionItem) => {
    // TODO: Implement edit functionality
    console.log('Edit permission:', permission);
  };

  const handleDeleteSelected = () => {
    // TODO: Implement delete functionality
    console.log('Delete selected permissions:', selected);
    clearSelection();
  };

  const allChecked = selected.length > 0 && selected.length === items.length;

  // Convert numeric IDs to strings for the PermissionList component
  const stringSelected = selected.map(id => id.toString());
  const handleSelectItem = (id: string) => {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      selectItem(numericId);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full relative">
        <div className="rounded-2xl border py-4 border-border bg-background/90 p-4">
          <PermissionHeader
            search={search}
            onSearchChange={handleSearchChange}
            onAdd={handleAdd}
            selectedCount={selected.length}
            onDeleteSelected={handleDeleteSelected}
            onRefresh={refetch}
          />

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogTitle>{t('leaveManagement.permissions.actions.add') || 'Add Permission Request'}</DialogTitle>
              <PermissionRequestForm onSuccess={() => handleDialogClose(true)} onCancel={() => handleDialogClose(false)} />
            </DialogContent>
          </Dialog>

          <div className="w-full mt-4">
            <PermissionList
              permissions={items}
              loading={isLoading}
              selected={stringSelected}
              onSelectItem={handleSelectItem}
              onSelectAll={selectAll}
              allChecked={allChecked}
              onRefresh={refetch}
              onEdit={handleEdit}
              currentPage={page}
              totalPages={pageCount}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManagementPage;
