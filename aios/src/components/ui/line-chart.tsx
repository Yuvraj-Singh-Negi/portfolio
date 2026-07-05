"use client";

import { useId } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
}

export function LineChart({
  data,
  height = 120,
  color = "var(--accent-green)",
  showGrid = true,
  showLabels = true,
}: LineChartProps) {
  const id = useId();
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = data.length * 48;
  const padding = { top: 8, right: 8, bottom: showLabels ? 20 : 8, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padding.top + chartH - (d.value / max) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {showGrid &&
        [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + chartH - ratio * chartH;
          return (
            <line
              key={ratio}
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          );
        })}

      <path d={areaD} fill={`url(#grad-${id})`} />

      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2.5"
          fill={color}
          stroke="var(--card)"
          strokeWidth="1"
        />
      ))}

      {showLabels &&
        points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 4}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize="9"
          >
            {p.label}
          </text>
        ))}
    </svg>
  );
}
