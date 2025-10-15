"use client";

import * as React from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function MiniBarChart({
  data,
  width = 220,
  height = 48,
  color = "#34d399",
}: Props) {
  if (!data || data.length === 0)
    return <div className="text-sm text-muted-foreground">No data</div>;

  const max = Math.max(...data);
  const barW = width / data.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((v, i) => {
        const h = (v / max) * height;
        const x = i * barW;
        return (
          <rect
            key={i}
            x={x + 2}
            y={height - h}
            width={Math.max(2, barW - 4)}
            height={h}
            rx={2}
            fill={color}
          />
        );
      })}
    </svg>
  );
}
