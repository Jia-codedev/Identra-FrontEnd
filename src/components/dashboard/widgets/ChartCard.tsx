"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartCardProps {
  title: string;
  type: "line" | "bar" | "doughnut" | "pie";
  data: any;
  className?: string;
  height?: number;
  options?: ChartOptions<any>;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  className,
  height = 300,
  options = {},
}) => {
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: type !== "doughnut" && type !== "pie" ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
    ...options,
  };

  const renderChart = () => {
    const commonProps = {
      data,
      options: defaultOptions,
      height,
    };

    switch (type) {
      case "line":
        return <Line {...commonProps} />;
      case "bar":
        return <Bar {...commonProps} />;
      case "doughnut":
        return <Doughnut {...commonProps} />;
      case "pie":
        return <Pie {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </Card>
  );
};

export default ChartCard;
