"use client"

import * as React from "react"

interface CircleProgressProps {
  value: number
  description?: React.ReactNode
  strokeWidth?: number
  size?: number
}

export default function CircleProgress({
  value,
  description,
  strokeWidth = 8,
  size = 180,
}: CircleProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="rotate-[-90deg]"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            className="stroke-muted"
            strokeWidth={strokeWidth}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          {/* Progress circle */}
          <circle
            className="stroke-primary transition-all duration-300 ease-in-out"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{value}%</span>
        </div>
      </div>
      {description && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  )
}