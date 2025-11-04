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

interface WorkHoursTrendsProps {
  data?: DailyWorkData[];
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
  month = new Date().toLocaleString("default", { month: "long" }),
  year = new Date().getFullYear(),
}: WorkHoursTrendsProps) {
  // Calculate totals
  const totalWorkHours = data.reduce((sum, item) => sum + item.workHours, 0);
  const totalOvertime = data.reduce((sum, item) => sum + item.overtime, 0);

  return (
    <div className="bg-card border rounded-xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">
          Work Hours Trends
        </h3>
        <p className="text-sm text-muted-foreground">
          Daily work hours for {month} {year}
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <BarChart accessibilityLayer data={data}>
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
