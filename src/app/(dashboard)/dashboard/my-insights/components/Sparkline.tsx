"use client";

import * as React from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
}

export default function Sparkline({
  data,
  width = 200,
  height = 40,
  stroke = "#60a5fa",
  fill = "rgba(96,165,250,0.12)",
}: Props) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-muted-foreground">No data</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const pathD = `M ${points.split(" ").join(" L ")}`;

  const areaD = `M ${points
    .split(" ")
    .join(" L ")} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={areaD} fill={fill} stroke="none" />
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
