"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { MonthlyRosterRow } from '../types';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '@/components/ui/button';
import schedulesApi from '@/services/scheduling/schedules';
import { GenericTable, TableColumn } from '@/components/common/GenericTable';

interface MonthlyRosterTableProps {
  data: MonthlyRosterRow[];
  isLoading?: boolean;
  onEdit?: (row: MonthlyRosterRow) => void;
  onFinalize?: (row: MonthlyRosterRow) => void;
  onDelete?: (row: MonthlyRosterRow) => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export const MonthlyRosterTable: React.FC<MonthlyRosterTableProps> = ({
  data,
  isLoading,
  onEdit,
  onFinalize,
  onDelete
}) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const [scheduleMap, setScheduleMap] = useState<Record<number, { code: string; color?: string }>>({});

  const sample = data?.[0];
  const start = sample ? new Date(sample.from_date) : new Date();
  const year = start.getFullYear();
  const month = start.getMonth() + 1;
  const days = getDaysInMonth(year, month);

  const dayKeys = useMemo(() => Array.from({ length: days }, (_, i) => `D${i + 1}` as const), [days]);

  useEffect(() => {
    const ids = new Set<number>();
    for (const row of data || []) {
      for (const key of dayKeys) {
        const val = (row as any)[key];
        if (typeof val === 'number' && !scheduleMap[val]) ids.add(val);
      }
    }
    const toFetch = Array.from(ids).slice(0, 200); 
    if (toFetch.length === 0) return;

    let mounted = true;
    (async () => {
      try {
        const results = await Promise.allSettled(toFetch.map((id) => schedulesApi.getScheduleById(id)));
        const next: Record<number, { code: string; color?: string }> = {};
        results.forEach((res, idx) => {
          if (res.status === 'fulfilled') {
            const sch = res.value?.data?.data;
            if (sch?.schedule_id) {
              next[sch.schedule_id] = { code: sch.schedule_code, color: sch.sch_color };
            }
          }
        });
        if (mounted && Object.keys(next).length) {
          setScheduleMap((prev) => ({ ...prev, ...next }));
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, [data, dayKeys]);

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
    ];

    const dayColumns: TableColumn<MonthlyRosterRow>[] = dayKeys.map((key, idx) => ({
      key,
      header: `${idx + 1}`,
      accessor: (row) => {
        const scheduleId = (row as any)[key] as number | null | undefined;
        const code = scheduleId ? scheduleMap[scheduleId]?.code : '';
        const color = scheduleId ? scheduleMap[scheduleId]?.color : undefined;
        return scheduleId ? (
          <span className="inline-flex items-center gap-1">
            {color && <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
            <span>{code.slice(0, 2) || scheduleId}</span>
          </span>
        ) : '';
      },
      width: "w-20",
      className: "text-center",
    }));

    return [...baseColumns, ...dayColumns];
  }, [dayKeys, scheduleMap, isRTL, t]);
  const noDataMessage = t('scheduling.monthlyRoster.table.noData') || 'No monthly roster data found';

  return (
    <GenericTable
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
  );
};
