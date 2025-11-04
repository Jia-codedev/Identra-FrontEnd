"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/BarChart";

interface DailyWorkData {
  day: string;
  workHours: number;
  overtime: number;
}

// Backend API shape for work hours trends
interface ApiWorkHourItem {
  DayofDate?: number | null;
  WorkingDay?: string | null; // ISO date string
  WorkMinutes?: number | string | null;
  MissedMinutes?: number | string | null;
  ExpectedWork?: number | string | null; // minutes
}

interface WorkHoursTrendsProps {
  /** Optional pre-normalized chart data */
  data?: DailyWorkData[];
  /** Raw API items in backend shape */
  apiData?: ApiWorkHourItem[];
  month?: string;
  year?: number;
}

// Generate default data for 31 days
const generateDefaultData = (): DailyWorkData[] => {
  const data: DailyWorkData[] = [];
  for (let i = 1; i <= 31; i++) {
    data.push({
      day: i.toString(),
      workHours: Math.floor(Math.random() * 4) + 6, // Random 6-10 hours
      overtime: Math.floor(Math.random() * 3), // Random 0-2 hours
    });
  }
  return data;
};

const defaultData = generateDefaultData();

const chartConfig = {
  workHours: {
    label: "Work Hours",
    color: "var(--primary)",
  },
  overtime: {
    label: "Overtime",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function WorkHoursTrends({
  data = defaultData,
  apiData,
  month,
  year,
}: WorkHoursTrendsProps) {
  // Helpers to coerce values safely
  const toMinutes = (val: number | string | null | undefined): number => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };
  const toHours = (minutes: number): number => {
    return Math.max(0, Number(((minutes || 0) / 60).toFixed(1)));
  };

  // Normalize API data if provided
  const normalizedFromApi: DailyWorkData[] | null = Array.isArray(apiData)
    ? apiData.map((item) => {
        const workMin = toMinutes(item.WorkMinutes);
        const expectedMin = toMinutes(item.ExpectedWork);
        const overtimeMin = expectedMin > 0 ? Math.max(0, workMin - expectedMin) : 0;
        const dayLabel = item?.DayofDate != null
          ? String(item.DayofDate)
          : (() => {
              const d = item?.WorkingDay ? new Date(item.WorkingDay) : null;
              return d ? String(d.getDate()) : "";
            })();
        return {
          day: dayLabel || "",
          workHours: toHours(workMin),
          overtime: toHours(overtimeMin),
        };
      })
    : null;

  const normalizedData: DailyWorkData[] = (normalizedFromApi && normalizedFromApi.length > 0)
    ? normalizedFromApi
    : data;

  // Derive month/year from API if not provided explicitly
  const derivedDate = ((): Date | null => {
    if (Array.isArray(apiData) && apiData.length > 0) {
      const first = apiData.find(i => i?.WorkingDay) || apiData[0];
      if (first?.WorkingDay) {
        const d = new Date(first.WorkingDay);
        return isNaN(d.getTime()) ? null : d;
      }
    }
    return null;
  })();

  const displayMonth = month ?? (derivedDate
    ? derivedDate.toLocaleString("default", { month: "long" })
    : new Date().toLocaleString("default", { month: "long" }));
  const displayYear = year ?? (derivedDate ? derivedDate.getFullYear() : new Date().getFullYear());

  // Calculate totals
  const totalWorkHours = normalizedData.reduce((sum, item) => sum + (item.workHours || 0), 0);
  const totalOvertime = normalizedData.reduce((sum, item) => sum + (item.overtime || 0), 0);

  return (
    <div className="bg-card border rounded-xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">
          Work Hours Trends
        </h3>
        <p className="text-sm text-muted-foreground">
          Daily work hours for {displayMonth} {displayYear}
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <BarChart accessibilityLayer data={normalizedData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="workHours"
            fill="var(--primary)"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="overtime"
            fill="var(--primary)"
            radius={[8, 8, 0, 0]}
            opacity={0.5}
          />
        </BarChart>
      </ChartContainer>
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: "hsl(var(--chart-1))" }}
          >
            {totalWorkHours}h
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total Work Hours</p>
        </div>
        <div className="text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: "hsl(var(--chart-2))" }}
          >
            {totalOvertime}h
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total Overtime</p>
        </div>
      </div>
    </div>
  );
}

export default WorkHoursTrends;
