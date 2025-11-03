"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { Calendar, RefreshCw, Globe } from "lucide-react";
import { IHoliday } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";

interface HolidaysTableProps {
  holidays: IHoliday[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectHoliday: (id: number) => void;
  onSelectAll: () => void;
  isLoading: boolean;
  onEditHoliday: (holiday: IHoliday) => void;
  onDeleteHoliday: (id: number) => void;
}

export const HolidaysTable: React.FC<HolidaysTableProps> = ({
  holidays,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectHoliday,
  onSelectAll,
  isLoading,
  onEditHoliday,
  onDeleteHoliday,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
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

  const columns: TableColumn<IHoliday>[] = [
    {
      key: "name",
      header: t("scheduling.holidays.holidayName"),
      width: "min-w-[200px]",
      accessor: (holiday: IHoliday, isRTL: boolean) => (
        <div className="font-medium">
          {isRTL ? holiday.holiday_arb : holiday.holiday_eng}
        </div>
      ),
    },
    {
      key: "dates",
      header: t("scheduling.holidays.dateRange"),
      width: "min-w-[150px]",
      accessor: (holiday: IHoliday) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} className="text-muted-foreground" />
          <span>
            {isDateRange(holiday.from_date, holiday.to_date)
              ? `${formatDate(holiday.from_date)} - ${formatDate(
                  holiday.to_date
                )}`
              : formatDate(holiday.from_date)}
          </span>
        </div>
      ),
    },
    {
      key: "recurring",
      header: t("scheduling.holidays.recurring"),
      width: "min-w-[100px]",
      accessor: (holiday: IHoliday) => (
        <Badge
          variant={holiday.recurring_flag ? "default" : "outline"}
          className="w-fit"
        >
          {holiday.recurring_flag && <RefreshCw size={12} className="mr-1" />}
          {holiday.recurring_flag ? t("common.yes") : t("common.no")}
        </Badge>
      ),
    },
    {
      key: "publicHoliday",
      header: t("scheduling.holidays.publicHoliday"),
      width: "min-w-[120px]",
      accessor: (holiday: IHoliday) => (
        <Badge
          variant={holiday.public_holiday_flag ? "default" : "secondary"}
          className="w-fit"
        >
          {holiday.public_holiday_flag ? t("common.yes") : t("common.no")}
        </Badge>
      ),
    },
  ];

  return (
    <GenericTable<IHoliday>
      data={holidays}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(holiday) => holiday.holiday_id}
      getItemDisplayName={(holiday, isRTL) =>
        isRTL ? holiday.holiday_arb : holiday.holiday_eng
      }
      onSelectItem={(id) => onSelectHoliday(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditHoliday}
      onDeleteItem={(id) => onDeleteHoliday(Number(id))}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={t("scheduling.holidays.noHolidays")}
      isLoading={isLoading}
    />
  );
};
