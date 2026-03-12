"use client"

import { useAuth } from "@/lib/auth-context"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const UNIT_MAP: Record<string, string> = {
  hinon: "℃",
  shitsuon: "℃",
  temperature: "℃",
  humidity: "%",
}
const LABEL_MAP: Record<string, string> = {
  hinon: "品温",
  shitsuon: "室温",
  temperature: "気温",
  humidity: "湿度",
}

const qualityData = [
  { day:  1, hinon: 18.1, shitsuon: 19.4, temperature: 18.1, humidity: 72 },
  { day:  2, hinon: 18.8, shitsuon: 19.0, temperature: 20.8, humidity: 73 },
  { day:  3, hinon: 19.3, shitsuon: 15.3, temperature: 17.8, humidity: 69 },
  { day:  4, hinon: 19.7, shitsuon: 15.0, temperature: 15.0, humidity: 61 },
  { day:  5, hinon: 20.5, shitsuon: 18.1, temperature: 11.8, humidity: 55 },
  { day:  6, hinon: 21.5, shitsuon: 20.0, temperature:  9.7, humidity: 56 },
  { day:  7, hinon: 22.3, shitsuon: 18.1, temperature: 11.0, humidity: 64 },
  { day:  8, hinon: 21.5, shitsuon: 15.5, temperature: 16.2, humidity: 74 },
  { day:  9, hinon: 20.6, shitsuon: 16.1, temperature: 18.7, humidity: 75 },
  { day: 10, hinon: 20.1, shitsuon: 18.7, temperature: 20.7, humidity: 69 },
  { day: 11, hinon: 19.3, shitsuon: 19.5, temperature: 17.4, humidity: 60 },
  { day: 12, hinon: 18.3, shitsuon: 17.5, temperature: 13.3, humidity: 55 },
  { day: 13, hinon: 17.9, shitsuon: 15.0, temperature: 10.6, humidity: 56 },
  { day: 14, hinon: 17.0, shitsuon: 16.4, temperature: 10.4, humidity: 66 },
  { day: 15, hinon: 16.2, shitsuon: 19.2, temperature: 11.6, humidity: 73 },
  { day: 16, hinon: 16.0, shitsuon: 20.0, temperature: 16.3, humidity: 75 },
  { day: 17, hinon: 15.2, shitsuon: 17.5, temperature: 18.8, humidity: 67 },
  { day: 18, hinon: 14.2, shitsuon: 15.0, temperature: 19.3, humidity: 62 },
  { day: 19, hinon: 13.9, shitsuon: 16.3, temperature: 17.7, humidity: 55 },
  { day: 20, hinon: 13.2, shitsuon: 19.4, temperature: 13.1, humidity: 56 },
  { day: 21, hinon: 12.3, shitsuon: 19.3, temperature: 10.7, humidity: 67 },
  { day: 22, hinon: 11.5, shitsuon: 16.4, temperature: 11.3, humidity: 73 },
  { day: 23, hinon: 10.6, shitsuon: 15.0, temperature: 12.0, humidity: 75 },
  { day: 24, hinon: 10.3, shitsuon: 16.9, temperature: 15.8, humidity: 68 },
  { day: 25, hinon:  9.8, shitsuon: 19.7, temperature: 20.5, humidity: 62 },
  { day: 26, hinon:  8.5, shitsuon: 19.4, temperature: 20.0, humidity: 55 },
  { day: 27, hinon:  7.9, shitsuon: 16.4, temperature: 16.1, humidity: 57 },
  { day: 28, hinon:  7.4, shitsuon: 15.5, temperature: 13.8, humidity: 65 },
  { day: 29, hinon:  6.7, shitsuon: 17.2, temperature: 11.1, humidity: 75 },
  { day: 30, hinon:  5.9, shitsuon: 20.0, temperature: 10.7, humidity: 73 },
]

export default function QualityPage() {
  useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground">品質管理</h1>
          <p className="mt-1 text-muted-foreground">純米大吟醸 華 — 30日間の経過記録</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Chart Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-6">品温 / 室温 / 気温 / 湿度 経過グラフ（30日間）</h2>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={qualityData} margin={{ top: 4, right: 40, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                ticks={[1, 5, 10, 15, 20, 25, 30]}
                tickFormatter={(v) => `${v}日`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              {/* 左Y軸（℃） */}
              <YAxis
                yAxisId="temp"
                domain={[0, 25]}
                tickFormatter={(v) => `${v}℃`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              {/* 右Y軸（湿度 %） */}
              <YAxis
                yAxisId="humi"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                offset={20}
                formatter={(value: number, name: string) => [
                  `${value}${UNIT_MAP[name] ?? ""}`,
                  LABEL_MAP[name] ?? name,
                ]}
                labelFormatter={(label) => `${label}日目`}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  padding: "10px 14px",
                }}
                itemStyle={{ padding: "2px 0" }}
                formatter={(value: number, name: string) => {
                  const colors: Record<string, string> = {
                    hinon: "#3b82f6",
                    shitsuon: "#f97316",
                    temperature: "#22c55e",
                    humidity: "#a855f7",
                  }
                  const color = colors[name] ?? "#666"
                  return [
                    <span key={name} style={{ color, fontWeight: 600 }}>
                      {value}{UNIT_MAP[name] ?? ""}
                    </span>,
                    <span key={`${name}-label`} style={{ color: "#374151" }}>
                      {LABEL_MAP[name] ?? name}
                    </span>,
                  ]
                }}
              />
              <Legend
                formatter={(value) => LABEL_MAP[value] ?? value}
                wrapperStyle={{ fontSize: "13px" }}
              />
              <Line yAxisId="temp" type="monotone" dataKey="hinon"       stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="temp" type="monotone" dataKey="shitsuon"    stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="humi" type="monotone" dataKey="humidity"    stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>


      </div>
    </div>
  )
}
