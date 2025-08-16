"use client";

import React from 'react';
import { GenericTable, TableColumn } from '@/components/common/GenericTable';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { IGroupSchedule } from '@/services/scheduling/groupSchedules';
import { format } from 'date-fns';

interface WeeklyRosterTableProps {
  data: IGroupSchedule[];
  selectedItems: number[];
  onSelectionChange: (ids: number[]) => void;
  onEdit: (item: IGroupSchedule) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

const ScheduleCell: React.FC<{
  schedule?: {
    schedule_id: number;
    schedule_code: string;
    in_time?: string;
    out_time?: string;
    sch_color?: string;
  };
  isRTL: boolean;
}> = ({ schedule, isRTL }) => {
  const { t } = useTranslations();

  if (!schedule) {
    return (
      <span className="text-muted-foreground text-sm">
        {t('scheduling.weeklyRoster.fields.noSchedule')}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Badge 
        variant="outline" 
        className="text-xs"
        style={{ 
          backgroundColor: schedule.sch_color || '#f3f4f6',
          borderColor: schedule.sch_color || '#d1d5db'
        }}
      >
        {schedule.schedule_code}
      </Badge>
      {schedule.in_time && schedule.out_time && (
        <span className="text-xs text-muted-foreground">
          {schedule.in_time} - {schedule.out_time}
        </span>
      )}
    </div>
  );
};

export const WeeklyRosterTable: React.FC<WeeklyRosterTableProps> = ({
  data,
  selectedItems,
  onSelectionChange,
  onEdit,
  onDelete,
  isLoading = false,
  isDeleting = false,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const columns: TableColumn<IGroupSchedule>[] = [
    {
      key: 'employee_group',
      header: t('scheduling.weeklyRoster.fields.employeeGroup'),
      accessor: (item, isRTL) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {item.employee_group ? 
              (isRTL ? item.employee_group.group_arb : item.employee_group.group_eng) || 
              `Group #${item.employee_group_id}` : 
              `Group #${item.employee_group_id}`
            }
          </span>
          <span className="text-xs text-muted-foreground">
            ID: {item.employee_group_id}
          </span>
        </div>
      ),
      width: "200px",
    },
    {
      key: 'date_range',
      header: t('scheduling.weeklyRoster.fields.dateRange'),
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="text-sm">
            {format(new Date(item.from_date), 'MMM dd, yyyy')}
          </span>
          <span className="text-xs text-muted-foreground">
            to {format(new Date(item.to_date), 'MMM dd, yyyy')}
          </span>
        </div>
      ),
      width: "180px",
    },
    {
      key: 'monday',
      header: t('scheduling.weeklyRoster.fields.monday'),
      accessor: (item, isRTL) => (
        <ScheduleCell schedule={item.monday_schedule} isRTL={isRTL} />
      ),
      width: "120px",
    },
    {
      key: 'tuesday',
      header: t('scheduling.weeklyRoster.fields.tuesday'),
      accessor: (item, isRTL) => (
        <ScheduleCell schedule={item.tuesday_schedule} isRTL={isRTL} />
      ),
      width: "120px",
    },
    {
      key: 'wednesday',
      header: t('scheduling.weeklyRoster.fields.wednesday'),
      accessor: (item, isRTL) => (
        <ScheduleCell schedule={item.wednesday_schedule} isRTL={isRTL} />
      ),
      width: "120px",
    },
    {
      key: 'thursday',
      header: t('scheduling.weeklyRoster.fields.thursday'),
      accessor: (item, isRTL) => (
        <ScheduleCell schedule={item.thursday_schedule} isRTL={isRTL} />
      ),
      width: "120px",
    },
    {
      key: 'friday',
      header: t('scheduling.weeklyRoster.fields.friday'),
      accessor: (item, isRTL) => (
        <ScheduleCell schedule={item.friday_schedule} isRTL={isRTL} />
      ),
      width: "120px",
    },
    {
      key: 'saturday',
      header: t('scheduling.weeklyRoster.fields.saturday'),
      accessor: (item, isRTL) => (
        <ScheduleCell schedule={item.saturday_schedule} isRTL={isRTL} />
      ),
      width: "120px",
    },
    {
      key: 'sunday',
      header: t('scheduling.weeklyRoster.fields.sunday'),
      accessor: (item, isRTL) => (
        <ScheduleCell schedule={item.sunday_schedule} isRTL={isRTL} />
      ),
      width: "120px",
    },
  ];

  // Helper functions for GenericTable
  const handleSelectItem = (id: number) => {
    const newSelection = selectedItems.includes(id) 
      ? selectedItems.filter(item => item !== id)
      : [...selectedItems, id];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = data.map(item => item.group_schedule_id!);
    const newSelection = selectedItems.length === data.length ? [] : allIds;
    onSelectionChange(newSelection);
  };

  const allChecked = data.length > 0 && selectedItems.length === data.length;

  return (
    <GenericTable
      data={data}
      columns={columns}
      selected={selectedItems}
      page={1}
      pageSize={data.length}
      allChecked={allChecked}
      getItemId={(item) => item.group_schedule_id!}
      getItemDisplayName={(item, isRTL) => 
        item.employee_group ? 
          (isRTL ? item.employee_group.group_arb : item.employee_group.group_eng) || 
          `Group #${item.employee_group_id}` : 
          `Group #${item.employee_group_id}`
      }
      onSelectItem={handleSelectItem}
      onSelectAll={handleSelectAll}
      onEditItem={onEdit}
      onDeleteItem={onDelete}
      noDataMessage={t('scheduling.weeklyRoster.noData')}
      isLoading={isLoading}
    />
  );
};
