"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TemperatureChartProps {
  label: string
  color: string
  data: Array<{ time: string; value: number }>
}

export function TemperatureChart({ label, color, data }: TemperatureChartProps) {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
          <XAxis dataKey="time" stroke="rgba(0,0,0,0.5)" style={{ fontSize: "10px" }} />
          <YAxis stroke="rgba(0,0,0,0.5)" style={{ fontSize: "10px" }} width={30} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "none",
              borderRadius: "4px",
              color: "white",
              fontSize: "12px",
            }}
            formatter={(value) => `${value.toFixed(1)}°C`}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
