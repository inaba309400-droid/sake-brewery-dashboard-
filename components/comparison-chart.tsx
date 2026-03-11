"use client"

import { useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { TimeRangeSelector } from "./time-range-selector"
import type { TimeRange } from "@/lib/brewery-data"

interface ComparisonChartProps {
  title: string
  unit: string
  dataA: Record<TimeRange, Array<{ time: string; value: number }>>
  dataB: Record<TimeRange, Array<{ time: string; value: number }>>
  nameA: string
  nameB: string
  colorA: string
  colorB: string
  currentA: number
  currentB: number
}

export function ComparisonChart({
  title,
  unit,
  dataA,
  dataB,
  nameA,
  nameB,
  colorA,
  colorB,
  currentA,
  currentB,
}: ComparisonChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")
  const seriesA = dataA[timeRange]
  const seriesB = dataB[timeRange]

  const mergedData = seriesA.map((item, i) => ({
    time: item.time,
    [nameA]: item.value,
    [nameB]: seriesB[i]?.value ?? 0,
  }))

  const diff = currentA - currentB

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: colorA }} />
                <span className="text-xl font-bold" style={{ color: colorA }}>
                  {currentA.toFixed(1)}
                  <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: colorB }} />
                <span className="text-xl font-bold" style={{ color: colorB }}>
                  {currentB.toFixed(1)}
                  <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-muted px-3 py-1.5 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">差分</p>
            <p className={`text-lg font-bold ${diff > 0 ? "text-chart-1" : diff < 0 ? "text-chart-2" : "text-foreground"}`}>
              {diff > 0 ? "+" : ""}{diff.toFixed(1)}
              <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>
            </p>
          </div>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
              formatter={(value: number, name: string) => [`${value.toFixed(1)}${unit}`, name]}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Line
              type="monotone"
              dataKey={nameA}
              stroke={colorA}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={nameB}
              stroke={colorB}
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="6 3"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
