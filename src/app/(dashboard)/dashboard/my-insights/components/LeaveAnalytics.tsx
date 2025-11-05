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
import { useTranslations } from "@/hooks/use-translations";

interface MonthlyLeaveData {
  month: string;
  leaves: number;
  absent: number;
}

interface LeaveAnalyticsProps {
  data?: MonthlyLeaveData[];
  year?: number;
}

const defaultData: MonthlyLeaveData[] = [
  { month: "Jan", leaves: 5, absent: 2 },
  { month: "Feb", leaves: 3, absent: 1 },
  { month: "Mar", leaves: 4, absent: 3 },
  { month: "Apr", leaves: 6, absent: 1 },
  { month: "May", leaves: 8, absent: 2 },
  { month: "Jun", leaves: 7, absent: 4 },
  { month: "Jul", leaves: 5, absent: 1 },
  { month: "Aug", leaves: 6, absent: 2 },
  { month: "Sep", leaves: 4, absent: 3 },
  { month: "Oct", leaves: 7, absent: 1 },
  { month: "Nov", leaves: 5, absent: 2 },
  { month: "Dec", leaves: 9, absent: 3 },
];

const chartConfig = {
  leaves: {
    label: "Leaves",
    color: "var(--primary)",
  },
  absent: {
    label: "Absent",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function LeaveAnalytics({
  data = defaultData,
  year = new Date().getFullYear(),
}: LeaveAnalyticsProps) {
  const { t } = useTranslations();
  
  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">
          {t("dashboard.leaveAnalytics")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.yearlyLeaveRecordFor")} {year}
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="leaves"
            fill="var(--primary)"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="var(--primary)"
            radius={[8, 8, 0, 0]}
            opacity={0.5}
          />
        </BarChart>
      </ChartContainer>
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "hsl(var(--chart-1))" }}>
            {data.reduce((sum, item) => sum + item.leaves, 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("dashboard.totalLeaves")}</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: "hsl(var(--chart-2))" }}>
            {data.reduce((sum, item) => sum + item.absent, 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("dashboard.totalAbsent")}</p>
        </div>
      </div>
    </div>
  );
}

export default LeaveAnalytics;
