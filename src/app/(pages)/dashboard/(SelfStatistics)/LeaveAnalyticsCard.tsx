
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/BarChart"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { month: "January", leaves: 8, absent: 1 },
  { month: "February", leaves: 5, absent: 2 },
  { month: "March", leaves: 7, absent: 5 },
  { month: "April", leaves: 3, absent: 3 },
  { month: "May", leaves: 2, absent: 0 },
  { month: "June", leaves: 5, absent: 4 },
  { month: "July", leaves: 6, absent: 1 },
  { month: "August", leaves: 4, absent: 2 },
  { month: "September", leaves: 7, absent: 3 },
  { month: "October", leaves: 1, absent: 0 },
  { month: "November", leaves: 0, absent: 0 },
  { month: "December", leaves: 0, absent: 0 },
]

const chartConfig = {
  leaves: {
    label: "Leaves taken",
    color: "hsl(var(--chart-leaves))",
    // color: "var(--chart-leave)",
  },
  absent: {
    label: "Leaves absent",
    color: "hsl(var(--chart-absent))",
    // color: "var(--chart-absent)",
  },
} satisfies ChartConfig

function LeaveAnalyticsCard() {
  return (
    <div className="shadow-card rounded-[10px] bg-foreground p-2">
      <div className='flex flex-row justify-between p-4'>
        <h5 className='text-lg text-text-primary font-bold'>Leave Analytics</h5>
      </div>
      {/* <ChartContainer config={chartConfig} className="relative left-[-30px]">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={2}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            type="number"
            tickLine={false}
            tickMargin={2}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent/>}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="leaves" fill="var(--color-leaves)" radius={0} />
          <Bar dataKey="absent" fill="var(--color-absent)" radius={0} />
        </BarChart>
      </ChartContainer> */}
      <ChartContainer config={chartConfig} className="relative left-[-30px]">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={2}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            type="number"
            tickLine={false}
            tickMargin={2}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent/>}
          />
          <ChartLegend content={<ChartLegendContent />} className="pb-3"/>
          <Bar dataKey="leaves" stackId="a" fill="var(--color-leaves)" radius={[0, 0, 2, 2]} />
          <Bar dataKey="absent" stackId="a" fill="var(--color-absent)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div> 
  )
}

export default LeaveAnalyticsCard;