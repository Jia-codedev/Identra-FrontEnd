"use client";

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { WeeklyRosterHeader } from './components/WeeklyRosterHeader';
import { WeeklyRosterTable } from './components/WeeklyRosterTable';
import { WeeklyRosterModal } from './components/WeeklyRosterModal';
import { useWeeklyRoster } from './hooks/useWeeklyRoster';
import { useWeeklyRosterState } from './hooks/useWeeklyRosterState';
import { useMutations } from './hooks/useMutations';
import { IGroupSchedule, ICreateGroupSchedule, IUpdateGroupSchedule } from '@/services/scheduling/groupSchedules';
import { WeeklyRosterFilters } from './types';
import { toast } from 'sonner';

export default function WeeklyRosterPage() {
  const { t } = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<IGroupSchedule | null>(null);

  // Use the weekly roster state hook
  const {
    weeklyRosters,
    selected,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    onFiltersChange,
    isLoading: stateLoading,
    error: stateError,
    selectWeeklyRoster,
    selectAll,
    allChecked,
  } = useWeeklyRosterState();

  // Fetch data using the custom hook with filters and pagination
  const {
    data: weeklySchedulesResp,
    isLoading,
    error,
    refetch
  } = useWeeklyRoster({ page, pageSize, filters, search });

  const weeklySchedules = weeklySchedulesResp?.data ?? [];
  const total = weeklySchedulesResp?.total ?? 0;

  // Mutations for CRUD operations
  const {
    createMutation,
    updateMutation,
    deleteMutation,
    deleteManyMutation
  } = useMutations();

  const handleAdd = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: IGroupSchedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t('common.deleteSuccess'));
      refetch();
    } catch (error) {
      toast.error(t('common.deleteError'));
    }
  };

  const handleDeleteMany = async () => {
    if (selected.length === 0) {
      toast.warning(t('common.selectItemsToDelete'));
      return;
    }

    try {
      await deleteManyMutation.mutateAsync(selected);
      toast.success(t('common.deleteSuccess'));
      refetch();
    } catch (error) {
      toast.error(t('common.deleteError'));
    }
  };

  const handleSave = async (data: ICreateGroupSchedule | IUpdateGroupSchedule) => {
    try {
      if (editingSchedule) {
        // Update existing schedule
        await updateMutation.mutateAsync({
          id: editingSchedule.group_schedule_id!,
          data: data as IUpdateGroupSchedule
        });
        toast.success(t('common.updateSuccess'));
      } else {
        // Create new schedule
        await createMutation.mutateAsync(data as ICreateGroupSchedule);
        toast.success(t('common.createSuccess'));
      }
      setIsModalOpen(false);
      setEditingSchedule(null);
      refetch();
    } catch (error) {
      toast.error(editingSchedule ? t('common.updateError') : t('common.createError'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  if (error || stateError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">{t('common.errorLoading')}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <WeeklyRosterHeader
        search={search}
        onSearchChange={setSearch}
        onAddRoster={handleAdd}
        selectedCount={selected.length}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onDeleteSelected={selected.length > 0 ? handleDeleteMany : undefined}
      />

      <WeeklyRosterTable
  data={weeklySchedules}
        isLoading={isLoading || stateLoading}
        selectedItems={selected}
  onSelectionChange={(selectedIds: number[]) => {
          // Update the selected state based on the new selection
          selectedIds.forEach(id => {
            if (!selected.includes(id)) {
              selectWeeklyRoster(id);
            }
          });
          // Remove deselected items
          selected.forEach(id => {
            if (!selectedIds.includes(id)) {
              selectWeeklyRoster(id);
            }
          });
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <WeeklyRosterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSave}
        groupSchedule={editingSchedule || undefined}
        mode={editingSchedule ? 'edit' : 'create'}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
