"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import {
  Clock,
  Building2,
  MapPin,
  Palette,
  Moon,
  Sun,
  Calendar,
} from "lucide-react";
import { ISchedule } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";

interface SchedulesTableProps {
  schedules: ISchedule[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectSchedule: (id: number) => void;
  onSelectAll: () => void;
  isLoading: boolean;
  onEditSchedule: (schedule: ISchedule) => void;
  onDeleteSchedule: (id: number) => void;
}

export const SchedulesTable: React.FC<SchedulesTableProps> = ({
  schedules,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectSchedule,
  onSelectAll,
  isLoading,
  onEditSchedule,
  onDeleteSchedule,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  const formatTime = (timeString?: string) => {
    if (!timeString) return "-";
    try {
      const date = new Date(timeString);
      return format(date, "HH:mm");
    } catch {
      return timeString;
    }
  };

  const formatWorkHours = (timeString?: string) => {
    if (!timeString) return "-";
    if (timeString.includes(":")) {
      const parts = timeString.split(":");
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  const getScheduleColor = (color?: string) => {
    return color || "#6B7280";
  };

  const columns: TableColumn<ISchedule>[] = [
    {
      key: "code",
      header: t("scheduling.schedules.scheduleCode"),
      width: "min-w-[120px]",
      accessor: (schedule: ISchedule) => (
        <div className="font-medium flex items-center gap-2">
          {schedule.schedule_code}
        </div>
      ),
    },
    {
      key: "color",
      header: t("scheduling.schedules.color"),
      width: "min-w-[80px]",
      accessor: (schedule: ISchedule) => (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-6 rounded-full border"
            style={{ backgroundColor: getScheduleColor(schedule.sch_color) }}
          />
        </div>
      ),
    },
    {
      key: "organization",
      header: t("common.organization"),
      width: "min-w-[180px]",
      accessor: (schedule: ISchedule, isRTL: boolean) => (
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-muted-foreground" />
          <span className="font-medium">
            {schedule.organizations
              ? isRTL
                ? schedule.organizations.organization_arb
                : schedule.organizations.organization_eng
              : "-"}
          </span>
        </div>
      ),
    },
    {
      key: "inTime",
      header: t("scheduling.schedules.inTime"),
      width: "min-w-[120px]",
      accessor: (schedule: ISchedule) => (
        <div className="flex items-center gap-1 text-sm">
          <Clock size={14} className="text-muted-foreground" />
          <span>{formatTime(schedule.in_time)}</span>
        </div>
      ),
    },
    {
      key: "outTime",
      header: t("scheduling.schedules.outTime"),
      width: "min-w-[120px]",
      accessor: (schedule: ISchedule) => (
        <div className="flex items-center gap-1 text-sm">
          <Clock size={14} className="text-muted-foreground" />
          <span>{formatTime(schedule.out_time)}</span>
        </div>
      ),
    },
    {
      key: "workHours",
      header: t("scheduling.schedules.workHours"),
      width: "min-w-[100px]",
      accessor: (schedule: ISchedule) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} className="text-muted-foreground" />
          <span>{formatWorkHours(schedule.required_work_hours)}</span>
        </div>
      ),
    },
  ];

  return (
    <GenericTable<ISchedule>
      data={schedules}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(schedule) => schedule.schedule_id}
      getItemDisplayName={(schedule) => schedule.schedule_code}
      onSelectItem={onSelectSchedule}
      onSelectAll={onSelectAll}
      onEditItem={onEditSchedule}
      onDeleteItem={onDeleteSchedule}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={t("scheduling.schedules.noSchedules")}
      isLoading={isLoading}
    />
  );
};
