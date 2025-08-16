"use client";

import React from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/providers/language-provider';
import { Calendar, Clock } from 'lucide-react';
import { IRamadanDate } from '../types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { GenericTable, TableColumn } from '@/components/common/GenericTable';

interface RamadanDatesTableProps {
  ramadanDates: IRamadanDate[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectRamadanDate: (id: number) => void;
  onSelectAll: () => void;
  isLoading: boolean;
  onEditRamadanDate: (ramadanDate: IRamadanDate) => void;
  onDeleteRamadanDate: (id: number) => void;
}

export const RamadanDatesTable: React.FC<RamadanDatesTableProps> = ({
  ramadanDates,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectRamadanDate,
  onSelectAll,
  isLoading,
  onEditRamadanDate,
  onDeleteRamadanDate,
}) => {
  const { t } = useTranslations();
  const { currentLocale } = useLanguage();
  // const isRTL = currentLocale === 'ar'; // Commented out as unused

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const isDateRange = (fromDate: string, toDate: string) => {
    try {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return from.toDateString() !== to.toDateString();
    } catch {
      return false;
    }
  };

  const calculateDuration = (fromDate: string, toDate: string) => {
    try {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    } catch {
      return 1;
    }
  };

  const columns: TableColumn<IRamadanDate>[] = [
    {
      key: 'name',
      header: t('scheduling.ramadanDates.fields.name'),
      width: 'min-w-[200px]',
      accessor: (ramadanDate: IRamadanDate, isRTL: boolean) => (
        <div className="font-medium">
          {isRTL ? ramadanDate.ramadan_name_arb : ramadanDate.ramadan_name_eng}
        </div>
      ),
    },
    {
      key: 'dates',
      header: t('scheduling.ramadanDates.fields.dateRange'),
      width: 'min-w-[200px]',
      accessor: (ramadanDate: IRamadanDate) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} className="text-muted-foreground" />
          <span>
            {isDateRange(ramadanDate.from_date, ramadanDate.to_date)
              ? `${formatDate(ramadanDate.from_date)} - ${formatDate(ramadanDate.to_date)}`
              : formatDate(ramadanDate.from_date)
            }
          </span>
        </div>
      ),
    },
    {
      key: 'duration',
      header: t('scheduling.ramadanDates.fields.duration'),
      width: 'min-w-[100px]',
      accessor: (ramadanDate: IRamadanDate) => {
        const days = calculateDuration(ramadanDate.from_date, ramadanDate.to_date);
        return (
          <Badge variant="secondary" className="w-fit">
            <Clock size={12} className="mr-1" />
            {days} {days === 1 ? t('common.day') : t('common.days')}
          </Badge>
        );
      },
    },
    {
      key: 'remarks',
      header: t('scheduling.ramadanDates.fields.remarks'),
      width: 'min-w-[200px]',
      accessor: (ramadanDate: IRamadanDate) => (
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
          {ramadanDate.remarks || '-'}
        </div>
      ),
    },
  ];

  return (
    <GenericTable<IRamadanDate>
      data={ramadanDates}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(ramadanDate) => ramadanDate.ramadan_id}
      getItemDisplayName={(ramadanDate, isRTL) => isRTL ? ramadanDate.ramadan_name_arb : ramadanDate.ramadan_name_eng}
      onSelectItem={onSelectRamadanDate}
      onSelectAll={onSelectAll}
      onEditItem={onEditRamadanDate}
      onDeleteItem={onDeleteRamadanDate}
      noDataMessage={t('scheduling.ramadanDates.noData')}
      isLoading={isLoading}
    />
  );
};

export default RamadanDatesTable;
