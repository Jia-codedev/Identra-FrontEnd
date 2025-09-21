"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { MonthlyRosterRow } from '../types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '@/components/ui/button';
import schedulesApi from '@/services/scheduling/schedules';

interface MonthlyRosterTableProps {
  data: MonthlyRosterRow[];
  isLoading?: boolean;
  onEdit?: (row: MonthlyRosterRow) => void;
  onFinalize?: (row: MonthlyRosterRow) => void;
  onDelete?: (row: MonthlyRosterRow) => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export const MonthlyRosterTable: React.FC<MonthlyRosterTableProps> = ({ data, isLoading, onEdit, onFinalize, onDelete }) => {
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
    // Collect unique schedule IDs from visible data
    const ids = new Set<number>();
    for (const row of data || []) {
      for (const key of dayKeys) {
        const val = (row as any)[key];
        if (typeof val === 'number' && !scheduleMap[val]) ids.add(val);
      }
    }
    const toFetch = Array.from(ids).slice(0, 200); // guard excessive calls
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
          <p>{t('monthlyRoster.table.noData') || 'No monthly roster data found'}</p>
    <p className="text-xs mt-2">{t('monthlyRoster.table.selectOrgMonthYear') || 'Make sure to select Organization, Month, and Year filters'}</p>
          {data && <p className="text-xs mt-1">{t('monthlyRoster.table.dataLength', { count: data.length }) || `Data array length: ${data.length}`}</p>}
        </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="w-full h-[520px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-left">{t('monthlyRoster.table.empNo') || 'Emp No'}</th>
              <th className="px-3 py-2 text-left">{t('common.name') || 'Name'}</th>
              <th className="px-3 py-2 text-left">{t('common.actions') || 'Actions'}</th>
              {dayKeys.map((key, idx) => (
                <th key={key} className="px-2 py-2 text-center min-w-10">
                  {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.schedule_roster_id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{row.emp_no || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{isRTL ? row.employee_name_arb || row.employee_name : row.employee_name || row.employee_name_arb}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex gap-1">
                    {onEdit && <Button size="sm" variant="outline" onClick={() => onEdit(row)}>{t('common.edit') || 'Edit'}</Button>}
                    {onFinalize && <Button size="sm" variant="secondary" onClick={() => onFinalize(row)} disabled={!!row.finalize_flag}>{t('monthlyRoster.table.finalize') || 'Finalize'}</Button>}
                    {onDelete && <Button size="sm" variant="destructive" onClick={() => onDelete(row)}>{t('common.delete') || 'Delete'}</Button>}
                  </div>
                </td>
                {dayKeys.map(key => {
                  const scheduleId = (row as any)[key] as number | null | undefined;
                  const code = scheduleId ? scheduleMap[scheduleId]?.code : '';
                  const color = scheduleId ? scheduleMap[scheduleId]?.color : undefined;
                  return (
                    <td key={key} className="px-2 py-1 text-center">
                      {scheduleId ? (
                        <span className="inline-flex items-center gap-1">
                          {color && <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
                          <span>{code || scheduleId}</span>
                        </span>
                      ) : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </Card>
  );
};
