"use client";

import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Users, GripVertical, Trash2 } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { MonthlyRosterRow } from "../types";
import schedulesApi from "@/services/scheduling/schedules";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ScheduleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeData: MonthlyRosterRow;
  onUpdateSchedule?: (day: number, scheduleId: number | null) => Promise<void>;
  isUpdating?: boolean;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Memoized schedule item component for better performance
const ScheduleItem = memo(
  ({
    schedule,
    onDragStart,
    onDragEnd,
    isDragged,
  }: {
    schedule: any;
    onDragStart: () => void;
    onDragEnd: () => void;
    isDragged: boolean;
  }) => {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={cn(
          "p-3 rounded-lg border cursor-move transition-all duration-200",
          "hover:shadow-md hover:scale-102 active:scale-98",
          "bg-card",
          isDragged && "opacity-50 scale-95"
        )}
        style={
          schedule.color
            ? {
                borderLeftColor: schedule.color,
                borderLeftWidth: "4px",
              }
            : undefined
        }
      >
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {schedule.color && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: schedule.color }}
                />
              )}
              <span className="font-medium text-sm truncate">
                {schedule.code}
              </span>
            </div>
            {schedule.name && schedule.name !== schedule.code && (
              <div className="text-xs text-muted-foreground truncate mb-1">
                {schedule.name}
              </div>
            )}
            {(schedule.startTime || schedule.endTime) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="truncate">
                  {schedule.startTime && schedule.endTime
                    ? `${schedule.startTime} - ${schedule.endTime}`
                    : schedule.startTime || schedule.endTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
ScheduleItem.displayName = "ScheduleItem";

export const ScheduleCalendarModal: React.FC<ScheduleCalendarModalProps> = ({
  isOpen,
  onClose,
  employeeData,
  onUpdateSchedule,
  isUpdating = false,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [scheduleMap, setScheduleMap] = useState<
    Record<
      number,
      {
        code: string;
        color?: string;
        name?: string;
        startTime?: string;
        endTime?: string;
      }
    >
  >({});
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [draggedSchedule, setDraggedSchedule] = useState<number | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const [updatingDay, setUpdatingDay] = useState<number | null>(null);
  const [localScheduleData, setLocalScheduleData] = useState<
    Record<string, number | null>
  >({});

  // Memoize date calculations
  const dateInfo = useMemo(() => {
    const startDate = new Date(employeeData.from_date);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const monthName = startDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === month;
    const todayDate = isCurrentMonth ? today.getDate() : -1;

    return {
      year,
      month,
      monthName,
      daysInMonth,
      firstDayOfWeek,
      todayDate,
      isCurrentMonth,
    };
  }, [employeeData.from_date]);

  const dayKeys = useMemo(
    () =>
      Array.from(
        { length: dateInfo.daysInMonth },
        (_, i) => `D${i + 1}` as const
      ),
    [dateInfo.daysInMonth]
  );

  // Combine the two duplicate useEffects into one
  useEffect(() => {
    if (isOpen) {
      const updatedData: Record<string, number | null> = {};
      for (const key of dayKeys) {
        updatedData[key] = (employeeData as any)[key] || null;
      }
      setLocalScheduleData(updatedData);
    }
  }, [isOpen, employeeData, dayKeys]);
  useEffect(() => {
    if (!isOpen) return;

    const loadSchedules = async () => {
      setIsLoadingSchedules(true);
      try {
        const res = await schedulesApi.getSchedulesForDropdown({});
        setAvailableSchedules(res?.data?.data || []);
      } catch (error) {
        console.error("Failed to load schedules:", error);
      } finally {
        setIsLoadingSchedules(false);
      }
    };

    loadSchedules();
  }, [isOpen]);

  // Optimize the schedule fetching useEffect with better dependency management
  useEffect(() => {
    if (!isOpen) return;

    const ids = new Set<number>();
    for (const key of dayKeys) {
      const val = localScheduleData[key];
      if (typeof val === "number" && !scheduleMap[val]) {
        ids.add(val);
      }
    }
    availableSchedules.forEach((sch) => {
      if (sch.schedule_id && !scheduleMap[sch.schedule_id]) {
        ids.add(sch.schedule_id);
      }
    });

    const toFetch = Array.from(ids);
    if (toFetch.length === 0) return;

    setIsLoading(true);
    let mounted = true;

    (async () => {
      try {
        const results = await Promise.allSettled(
          toFetch.map((id) => schedulesApi.getScheduleById(id))
        );
        const next: Record<
          number,
          {
            code: string;
            color?: string;
            name?: string;
            startTime?: string;
            endTime?: string;
          }
        > = {};

        results.forEach((res) => {
          if (res.status === "fulfilled") {
            const sch = res.value?.data?.data;
            if (sch?.schedule_id) {
              next[sch.schedule_id] = {
                code: sch.schedule_code || `S${sch.schedule_id}`,
                color: sch.sch_color,
                name: sch.schedule_name || sch.schedule_code,
                startTime: sch.start_time,
                endTime: sch.end_time,
              };
            }
          }
        });

        if (mounted && Object.keys(next).length) {
          setScheduleMap((prev) => ({ ...prev, ...next }));
        }
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, availableSchedules, dayKeys]);

  // Memoize event handlers
  const handleDragStart = useCallback((scheduleId: number) => {
    setDraggedSchedule(scheduleId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedSchedule(null);
    setDragOverDay(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, day: number) => {
    e.preventDefault();
    setDragOverDay(day);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverDay(null);
  }, []);

  const handleDrop = async (e: React.DragEvent, day: number) => {
    e.preventDefault();
    if (draggedSchedule === null) return;

    setDragOverDay(null);
    setUpdatingDay(day);

    try {
      const dayKey = `D${day}`;
      setLocalScheduleData((prev) => ({
        ...prev,
        [dayKey]: draggedSchedule,
      }));
      if (onUpdateSchedule) {
        await onUpdateSchedule(day, draggedSchedule);
        toast.success(t("toast.success.updated") || "Updated successfully");
      }
    } catch (error) {
      console.error("Failed to update schedule:", error);
      toast.error(
        t("toast.error.general") || "An error occurred. Please try again."
      );
      const dayKey = `D${day}`;
      setLocalScheduleData((prev) => ({
        ...prev,
        [dayKey]: (employeeData as any)[dayKey] || null,
      }));
    } finally {
      setUpdatingDay(null);
      setDraggedSchedule(null);
    }
  };

  const handleRemoveSchedule = async (day: number) => {
    setUpdatingDay(day);

    try {
      const dayKey = `D${day}`;
      setLocalScheduleData((prev) => ({
        ...prev,
        [dayKey]: null,
      }));
      if (onUpdateSchedule) {
        await onUpdateSchedule(day, null);
        toast.success(t("toast.success.deleted") || "Deleted successfully");
      }
    } catch (error) {
      console.error("Failed to remove schedule:", error);
      toast.error(
        t("toast.error.general") || "An error occurred. Please try again."
      );
      const dayKey = `D${day}`;
      setLocalScheduleData((prev) => ({
        ...prev,
        [dayKey]: (employeeData as any)[dayKey] || null,
      }));
    } finally {
      setUpdatingDay(null);
    }
  };

  // Memoize getDayStyles to avoid recalculating on every render
  const getDayStyles = useCallback(
    (day: number, schedule: any) => {
      const dayOfWeek = new Date(dateInfo.year, dateInfo.month, day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = day === dateInfo.todayDate;
      const hasSchedule = !!schedule;
      const isHovered = hoveredDay === day;
      const isPastDate = dateInfo.isCurrentMonth && day < dateInfo.todayDate;

      return {
        isWeekend,
        isToday,
        hasSchedule,
        dayOfWeek,
        isPastDate,
        isHovered,
        baseClasses: cn(
          "transition-all duration-200 cursor-pointer group relative overflow-hidden",
          "hover:bg-opacity-80 hover:shadow-inner",
          isToday &&
            "bg-gradient-to-br from-primary/15 to-primary/8 shadow-inner",
          isWeekend &&
            !isToday &&
            "bg-gradient-to-br from-muted/30 to-muted/15",
          !isWeekend &&
            !isToday &&
            !isPastDate &&
            "bg-gradient-to-br from-background to-muted/8 hover:from-muted/15 hover:to-muted/25",
          isPastDate && "bg-gradient-to-br from-muted/15 to-muted/8 opacity-70",
          isHovered && "shadow-inner bg-opacity-90",
          hasSchedule && "shadow-sm"
        ),
        numberClasses: cn(
          "text-sm font-medium mb-2 flex-shrink-0 flex items-center gap-1 transition-colors duration-200",
          isToday && "text-primary font-bold text-base",
          isWeekend && !isToday && "text-muted-foreground",
          !isWeekend &&
            !isToday &&
            !isPastDate &&
            "text-foreground group-hover:text-primary",
          isPastDate && "text-muted-foreground/70"
        ),
        containerClasses: cn(
          "rounded-lg overflow-hidden",
          hasSchedule && schedule.color && "ring-1 ring-opacity-20"
        ),
      };
    },
    [dateInfo, hoveredDay]
  );
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < dateInfo.firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= dateInfo.daysInMonth; day++) {
      const dayKey = `D${day}`;
      const scheduleId = localScheduleData[dayKey] as number | null;
      const schedule = scheduleId ? scheduleMap[scheduleId] : null;

      days.push({
        day,
        scheduleId,
        schedule,
        styles: getDayStyles(day, schedule),
      });
    }
    return days;
  }, [
    dateInfo.firstDayOfWeek,
    dateInfo.daysInMonth,
    localScheduleData,
    scheduleMap,
    getDayStyles,
  ]);

  const employeeName = isRTL
    ? employeeData.employee_name_arb || employeeData.employee_name
    : employeeData.employee_name || employeeData.employee_name_arb;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] min-w-[80vw] max-h-[90vh] overflow-hidden flex flex-col will-change-transform">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              {t("scheduling.monthlyRoster.calendar.title") ||
                "Monthly Schedule"}{" "}
              - {employeeName}
            </div>
            <Badge variant="outline" className="text-sm">
              {dateInfo.monthName}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          {/* Left Side - Schedule List */}
          <div className="w-64 flex-shrink-0 border-r border-border pr-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                {t("scheduling.monthlyRoster.calendar.availableSchedules") ||
                  "Available Schedules"}
              </h4>
            </div>

            <ScrollArea className="flex-1 pr-3">
              <div className="space-y-2">
                {isLoadingSchedules ? (
                  <>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </>
                ) : availableSchedules.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    {t("scheduling.monthlyRoster.calendar.noSchedules") ||
                      "No schedules available"}
                  </div>
                ) : (
                  availableSchedules.map((schedule) => {
                    const scheduleInfo = scheduleMap[schedule.schedule_id] || {
                      code: schedule.schedule_code,
                      color: schedule.sch_color,
                      name: schedule.schedule_name,
                      startTime: schedule.start_time,
                      endTime: schedule.end_time,
                    };

                    return (
                      <ScheduleItem
                        key={schedule.schedule_id}
                        schedule={scheduleInfo}
                        onDragStart={() =>
                          handleDragStart(schedule.schedule_id)
                        }
                        onDragEnd={handleDragEnd}
                        isDragged={draggedSchedule === schedule.schedule_id}
                      />
                    );
                  })
                )}
              </div>
            </ScrollArea>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">
                {t("scheduling.monthlyRoster.calendar.dragInstruction") ||
                  "Drag schedules to calendar days"}
              </div>
            </div>
          </div>

          {/* Right Side - Calendar */}
          <div className="flex-1 overflow-auto space-y-6">
            {isLoading && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 animate-spin" />
                    {t("common.loading") || "Loading schedule data..."}
                  </div>
                </div>
                {/* Loading skeleton */}
                <Skeleton className="border border-border rounded-lg overflow-hidden bg-card" />
              </div>
            )}

            {/* Calendar Grid */}
            <div className="space-y-4">
              {/* Header row with day names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day, index) => {
                  const isWeekend = index === 0 || index === 6; // Sunday or Saturday
                  return (
                    <div
                      key={day}
                      className={cn(
                        "p-3 text-center text-sm font-semibold border-b-2",
                        isWeekend
                          ? "text-destructive/80 border-destructive/20 bg-destructive/5"
                          : "text-muted-foreground border-border bg-muted/20"
                      )}
                    >
                      {t(`common.dayNames.${day.toLowerCase()}`) || day}
                    </div>
                  );
                })}
              </div>

              {/* Calendar days */}
              <TooltipProvider>
                <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden bg-card shadow-sm">
                  {calendarDays.map((dayData, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            // Base grid cell styling - ensures perfect squares
                            "relative w-full aspect-square border-r border-b border-border/50 last:border-r-0",
                            "[&:nth-child(7n)]:border-r-0", // Remove right border for last column
                            "[&:nth-last-child(-n+7)]:border-b-0", // Remove bottom border for last row
                            // Content styling
                            dayData ? dayData.styles.baseClasses : "bg-muted/5",
                            // Ensure consistent sizing
                            "min-h-[80px] max-h-[80px]",
                            // Drag over styling
                            dayData &&
                              dragOverDay === dayData.day &&
                              "ring-2 ring-primary ring-inset bg-primary/5",
                            // Updating styling
                            dayData &&
                              updatingDay === dayData.day &&
                              "opacity-50"
                          )}
                          style={
                            dayData?.schedule?.color
                              ? {
                                  borderLeftColor: dayData.schedule.color,
                                  borderLeftWidth: "4px",
                                }
                              : undefined
                          }
                          onMouseEnter={() =>
                            dayData && setHoveredDay(dayData.day)
                          }
                          onMouseLeave={() => setHoveredDay(null)}
                          onDragOver={(e) =>
                            dayData && handleDragOver(e, dayData.day)
                          }
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => dayData && handleDrop(e, dayData.day)}
                        >
                          {dayData && (
                            <div className="absolute inset-0 p-2 flex flex-col">
                              {/* Day number */}
                              <div
                                className={cn(
                                  "flex items-center justify-between mb-1",
                                  dayData.styles.numberClasses
                                )}
                              >
                                <span className="font-semibold">
                                  {dayData.day}
                                </span>
                                {dayData.styles.isToday && (
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                              </div>

                              {/* Schedule content */}
                              <div className="flex-1 flex flex-col items-center justify-center relative group">
                                {dayData.schedule && (
                                  <>
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        "text-xs px-2 py-1 shadow-sm border transition-all duration-200",
                                        "hover:scale-105 hover:shadow-md",
                                        dayData.schedule.color &&
                                          "border-current"
                                      )}
                                      style={
                                        dayData.schedule.color
                                          ? {
                                              backgroundColor: `${dayData.schedule.color}15`,
                                              borderColor:
                                                dayData.schedule.color,
                                              color: dayData.schedule.color,
                                            }
                                          : undefined
                                      }
                                    >
                                      {dayData.schedule.code}
                                    </Badge>
                                    {onUpdateSchedule && !updatingDay && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                          "absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100",
                                          "hover:bg-destructive hover:text-destructive-foreground transition-all"
                                        )}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveSchedule(dayData.day);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </>
                                )}

                                {!dayData.schedule &&
                                  dayData.styles.isWeekend && (
                                    <div className="text-xs text-muted-foreground/40 font-medium select-none">
                                      {dayData.styles.dayOfWeek === 0
                                        ? "Sun"
                                        : "Sat"}
                                    </div>
                                  )}
                              </div>

                              {/* Visual indicators */}
                              {dayData.styles.isPastDate && (
                                <div className="absolute top-1 right-1">
                                  <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                </div>
                              )}
                            </div>
                          )}

                          {/* Empty cell for days before month starts */}
                          {!dayData && (
                            <div className="w-full h-full bg-muted/5" />
                          )}
                        </div>
                      </TooltipTrigger>
                      {dayData && dayData.schedule && (
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {dayData.schedule.name || dayData.schedule.code}
                            </div>
                            {(dayData.schedule.startTime ||
                              dayData.schedule.endTime) && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {dayData.schedule.startTime &&
                                dayData.schedule.endTime
                                  ? `${dayData.schedule.startTime} - ${dayData.schedule.endTime}`
                                  : dayData.schedule.startTime ||
                                    dayData.schedule.endTime}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {new Date(
                                dateInfo.year,
                                dateInfo.month,
                                dayData.day
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="px-6">
            {t("common.close") || "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
