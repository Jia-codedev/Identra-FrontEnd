"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WorkHoursTrendChartProps {
  className?: string;
}

const WorkHoursTrendChart: React.FC<WorkHoursTrendChartProps> = ({ className }) => {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Worked Hours',
        data: [38, 42, 40, 45, 43],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Required Hours',
        data: [40, 40, 40, 40, 40],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} hours`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Period'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        },
        max: 50,
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <Card className={`p-3 sm:p-4 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">
        Shift Completion Progress
      </h3>
      <div className="h-[250px] sm:h-[280px]">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};

export default WorkHoursTrendChart;
