"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { MonthlyRosterRow } from '../types';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '@/components/ui/button';
import { GenericTable, TableColumn } from '@/components/common/GenericTable';
import { ScheduleCalendarModal } from './ScheduleCalendarModal';
import { Calendar } from 'lucide-react';
import { ca } from 'date-fns/locale';

interface MonthlyRosterTableProps {
  data: MonthlyRosterRow[];
  isLoading?: boolean;
  onEdit?: (row: MonthlyRosterRow) => void;
  onFinalize?: (row: MonthlyRosterRow) => void;
  onDelete?: (row: MonthlyRosterRow) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}



export const MonthlyRosterTable: React.FC<MonthlyRosterTableProps> = ({
  data,
  isLoading,
  onEdit,
  onFinalize,
  onDelete,
  canEdit,
  canDelete
}) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const [selectedEmployee, setSelectedEmployee] = useState<MonthlyRosterRow | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // We'll fetch schedule data when opening the calendar modal instead
  // No need to pre-calculate day keys since we're not showing day columns

  // Schedule data will be fetched inside the calendar modal when needed

  const handleViewSchedule = (row: MonthlyRosterRow) => {
    setSelectedEmployee(row);
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
    setSelectedEmployee(null);
  };

  const columns: TableColumn<MonthlyRosterRow>[] = useMemo(() => {
    const baseColumns: TableColumn<MonthlyRosterRow>[] = [
      {
        key: "emp_no",
        header: t('scheduling.monthlyRoster.table.empNo') || 'Emp No',
        accessor: (row) => row.emp_no || "-",
      },
      {
        key: "employee_name",
        header: t('common.name') || 'Name',
        accessor: (row) => isRTL ? row.employee_name_arb || row.employee_name : row.employee_name || row.employee_name_arb,
      },
      {
        key: "view_schedule",
        header: t('scheduling.monthlyRoster.table.viewSchedule') || 'View Schedule',
        accessor: (row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewSchedule(row)}
            className="flex items-center gap-2"
          >
            <Calendar size={16} />
            {t('scheduling.monthlyRoster.table.viewSchedule') || 'View Schedule'}
          </Button>
        ),
        width: "w-32",
        className: "text-center",
      },
    ];

    return baseColumns;
  }, [isRTL, t]);
  const noDataMessage = t('scheduling.monthlyRoster.table.noData') || 'No monthly roster data found';

  return (
    <>
      <GenericTable
        canEdit={canEdit} 
        canDelete={canDelete}
        data={data}
        columns={columns}
        selected={[]}
        page={1}
        pageSize={data.length}
        allChecked={false}
        getItemId={(item) => item.schedule_roster_id}
        getItemDisplayName={(item) => item.employee_name || item.employee_name_arb || 'Unknown'}
        onSelectItem={() => {}}
        onSelectAll={() => {}}
        onEditItem={onEdit}
        onDeleteItem={(id) => {
          const row = data.find(r => r.schedule_roster_id === id);
          if (row && onDelete) onDelete(row);
        }}
        noDataMessage={noDataMessage}
        isLoading={isLoading}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        showActions={false}
      />
      
      {selectedEmployee && (
        <ScheduleCalendarModal
          isOpen={isCalendarOpen}
          onClose={handleCloseCalendar}
          employeeData={selectedEmployee}
        />
      )}
    </>
  );
};
