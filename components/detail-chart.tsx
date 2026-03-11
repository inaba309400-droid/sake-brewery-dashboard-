"use client"

import { useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { TimeRangeSelector } from "./time-range-selector"
import type { TimeRange } from "@/lib/brewery-data"

interface DetailChartProps {
  title: string
  unit: string
  color: string
  currentValue: number
  data: Record<TimeRange, Array<{ time: string; value: number }>>
}

export function DetailChart({ title, unit, color, currentValue, data }: DetailChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")
  const chartData = data[timeRange]

  const minValue = Math.min(...chartData.map((d) => d.value))
  const maxValue = Math.max(...chartData.map((d) => d.value))
  const avgValue = chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold" style={{ color }}>
              {currentValue.toFixed(1)}
              <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-right text-xs">
            <div>
              <p className="text-muted-foreground">最小</p>
              <p className="font-semibold text-foreground">{minValue.toFixed(1)}{unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">平均</p>
              <p className="font-semibold text-foreground">{avgValue.toFixed(1)}{unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">最大</p>
              <p className="font-semibold text-foreground">{maxValue.toFixed(1)}{unit}</p>
            </div>
          </div>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${title}-${timeRange}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: "11px" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: "11px" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-foreground)",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${title}-${timeRange})`}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
