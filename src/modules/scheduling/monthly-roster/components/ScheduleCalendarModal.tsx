"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { MonthlyRosterRow } from "../types";
import schedulesApi from "@/services/scheduling/schedules";
import { cn } from "@/lib/utils";

interface ScheduleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeData: MonthlyRosterRow;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ScheduleCalendarModal: React.FC<ScheduleCalendarModalProps> = ({
  isOpen,
  onClose,
  employeeData,
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
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const startDate = new Date(employeeData.from_date);
  const year = startDate.getFullYear();
  const month = startDate.getMonth();
  const monthName = startDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Get days in month and first day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Get today's date for highlighting
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = isCurrentMonth ? today.getDate() : -1;

  // Generate day keys for the month
  const dayKeys = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => `D${i + 1}` as const),
    [daysInMonth]
  );

  // Fetch schedule data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const ids = new Set<number>();
    for (const key of dayKeys) {
      const val = (employeeData as any)[key];
      if (typeof val === "number" && !scheduleMap[val]) {
        ids.add(val);
      }
    }

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
  }, [isOpen, employeeData, dayKeys, scheduleMap]);

  // Helper function to get day type and styling
  const getDayStyles = (day: number, schedule: any) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    const isToday = day === todayDate;
    const hasSchedule = !!schedule;
    const isHovered = hoveredDay === day;
    const isPastDate = isCurrentMonth && day < todayDate;

    return {
      isWeekend,
      isToday,
      hasSchedule,
      dayOfWeek,
      isPastDate,
      isHovered,
      baseClasses: cn(
        // Base styling - removed aspect-square and sizing as it's handled by parent
        "transition-all duration-300 cursor-pointer group relative overflow-hidden",
        // Hover effects
        "hover:bg-opacity-80 hover:shadow-inner",
        // Background based on day type
        isToday &&
          "bg-gradient-to-br from-primary/15 to-primary/8 shadow-inner",
        isWeekend && !isToday && "bg-gradient-to-br from-muted/30 to-muted/15",
        !isWeekend &&
          !isToday &&
          !isPastDate &&
          "bg-gradient-to-br from-background to-muted/8 hover:from-muted/15 hover:to-muted/25",
        isPastDate && "bg-gradient-to-br from-muted/15 to-muted/8 opacity-70",
        // Interactive states
        isHovered && "shadow-inner bg-opacity-90",
        // Remove individual borders as they're handled by the grid
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
  };

  // Create calendar grid
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add actual days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = `D${day}`;
    const scheduleId = (employeeData as any)[dayKey] as number | null;
    const schedule = scheduleId ? scheduleMap[scheduleId] : null;

    calendarDays.push({
      day,
      scheduleId,
      schedule,
      styles: getDayStyles(day, schedule),
    });
  }

  const employeeName = isRTL
    ? employeeData.employee_name_arb || employeeData.employee_name
    : employeeData.employee_name || employeeData.employee_name_arb;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              {t("scheduling.monthlyRoster.calendar.title") ||
                "Monthly Schedule"}{" "}
              - {employeeName}
            </div>
            <Badge variant="outline" className="text-sm">
              {monthName}
            </Badge>
          </DialogTitle>
        </DialogHeader>

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
              <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden bg-card">
                {Array.from({ length: 42 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square border-r border-b border-border/50 p-3 last:border-r-0",
                      "[&:nth-child(7n)]:border-r-0",
                      "[&:nth-last-child(-n+7)]:border-b-0",
                      "min-h-[80px] max-h-[80px] bg-muted/5"
                    )}
                  >
                    <Skeleton className="h-4 w-6 mb-2" />
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
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
            <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden bg-card shadow-sm">
              {calendarDays.map((dayData, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
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
                          "min-h-[80px] max-h-[80px]"
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
                            <div className="flex-1 flex flex-col items-center justify-center">
                              {dayData.schedule && (
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "text-xs px-2 py-1 shadow-sm border transition-all duration-200",
                                    "hover:scale-105 hover:shadow-md",
                                    dayData.schedule.color && "border-current"
                                  )}
                                  style={
                                    dayData.schedule.color
                                      ? {
                                          backgroundColor: `${dayData.schedule.color}15`,
                                          borderColor: dayData.schedule.color,
                                          color: dayData.schedule.color,
                                        }
                                      : undefined
                                  }
                                >
                                  {dayData.schedule.code}
                                </Badge>
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
                              year,
                              month,
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
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Legend */}
          {Object.keys(scheduleMap).length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  {t("scheduling.monthlyRoster.calendar.legend") ||
                    "Schedule Types"}
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.values(scheduleMap).map((schedule, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-3 py-1.5 font-medium transition-all duration-200 hover:scale-105",
                        schedule.color && "border-current shadow-sm"
                      )}
                      style={
                        schedule.color
                          ? {
                              backgroundColor: `${schedule.color}12`,
                              borderColor: schedule.color,
                              color: schedule.color,
                            }
                          : undefined
                      }
                    >
                      {schedule.color && (
                        <div
                          className="w-2.5 h-2.5 rounded-full mr-2"
                          style={{ backgroundColor: schedule.color }}
                        />
                      )}
                      <span className="font-medium">{schedule.code}</span>
                      {schedule.name && schedule.name !== schedule.code && (
                        <span className="text-xs opacity-75 ml-1">
                          ({schedule.name})
                        </span>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
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
