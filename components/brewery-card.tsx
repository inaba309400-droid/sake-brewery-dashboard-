"use client"

import { TemperatureChart } from "./temperature-chart"
import { WeatherWidget } from "./weather-widget"
import type { BreweryData } from "@/lib/brewery-data"

interface BreweryCardProps {
  brewery: BreweryData
  timeRange?: keyof BreweryData["ambientTempHistory"]
}

const getStatusBg = (status: string): string => {
  switch (status) {
    case "normal":
      return "bg-chart-2/10 border-chart-2"
    case "warning":
      return "bg-chart-4/10 border-chart-4"
    case "critical":
      return "bg-destructive/10 border-destructive"
    default:
      return "bg-background border-border"
  }
}

const getStatusBadge = (status: string): string => {
  switch (status) {
    case "normal":
      return "text-chart-2 bg-chart-2/20"
    case "warning":
      return "text-chart-4 bg-chart-4/20"
    case "critical":
      return "text-destructive bg-destructive/20"
    default:
      return "text-muted-foreground bg-muted"
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "normal":
      return "正常"
    case "warning":
      return "警告"
    case "critical":
      return "異常"
    default:
      return ""
  }
}

export function BreweryCard({ brewery, timeRange = "24h" }: BreweryCardProps) {
  return (
    <div className={`rounded-lg border-2 bg-card p-6 transition-all ${getStatusBg(brewery.status)}`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-foreground">{brewery.name}</h3>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">ID: {brewery.id}</p>
          <p className="text-xs text-muted-foreground">{brewery.prefecture}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(brewery.status)}`}>
          {getStatusLabel(brewery.status)}
        </span>
      </div>

      {/* Weather Widget Section */}
      <div className="mb-4">
        <WeatherWidget weather={brewery.weather} />
      </div>

      <div className="space-y-4 mb-4">
        {/* Ambient Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">気温</p>
              <p className="text-lg font-bold text-foreground">{brewery.ambientTemp.toFixed(1)}°C</p>
            </div>
          </div>
          <TemperatureChart label="気温" color="#3b82f6" data={brewery.ambientTempHistory[timeRange]} />
        </div>

        {/* Room Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">室温</p>
              <p className="text-lg font-bold text-foreground">{brewery.roomTemp.toFixed(1)}°C</p>
            </div>
          </div>
          <TemperatureChart label="室温" color="#10b981" data={brewery.roomTempHistory[timeRange]} />
        </div>

        {/* Product Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">品温</p>
              <p className="text-lg font-bold text-foreground">{brewery.productTemp.toFixed(1)}°C</p>
            </div>
          </div>
          <TemperatureChart label="品温" color="#f59e0b" data={brewery.productTempHistory[timeRange]} />
        </div>

        {/* Humidity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">湿度</p>
              <p className="text-lg font-bold text-foreground">{brewery.humidity}%</p>
            </div>
          </div>
          <TemperatureChart label="湿度" color="#8b5cf6" data={brewery.humidityHistory[timeRange]} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-3 text-xs text-muted-foreground">
        <p>最終更新: {brewery.lastUpdated}</p>
      </div>
    </div>
  )
}
