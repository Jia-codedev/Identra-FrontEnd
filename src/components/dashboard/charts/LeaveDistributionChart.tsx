"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LeaveDistributionChartProps {
  className?: string;
}

const LeaveDistributionChart: React.FC<LeaveDistributionChartProps> = ({ className }) => {
  const data = {
    labels: [
      'Annual Leave',
      'Sick Leave', 
      'Emergency Leave',
      'Maternity Leave',
      'Personal Leave'
    ],
    datasets: [
      {
        data: [35, 25, 15, 10, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
  };

  return (
    <Card className={`p-3 sm:p-4 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">
        Leave Usage Distribution
      </h3>
      <div className="h-[250px] sm:h-[280px]">
        <Doughnut data={data} options={options} />
      </div>
    </Card>
  );
};

export default LeaveDistributionChart;
