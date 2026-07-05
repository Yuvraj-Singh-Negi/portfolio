"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  animated?: boolean;
  delay?: number;
}

export function ProgressRing({
  progress,
  size = 56,
  strokeWidth = 3,
  color = "var(--accent-green)",
  trackColor = "var(--elevation-3)",
  showLabel = true,
  animated = true,
  delay = 0,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(progress, 100) / 100);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-bold" style={{ color }}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
