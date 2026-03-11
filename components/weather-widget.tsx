"use client"

import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from "lucide-react"

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "snowy"
  temperature: number
  humidity: number
  windSpeed: number
}

interface WeatherWidgetProps {
  weather: WeatherData
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-chart-1" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-muted-foreground" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-chart-3" />
      case "snowy":
        return <CloudSnow className="h-8 w-8 text-blue-300" />
      default:
        return <Sun className="h-8 w-8 text-chart-1" />
    }
  }

  const getWeatherLabel = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "晴天"
      case "cloudy":
        return "曇り"
      case "rainy":
        return "雨"
      case "snowy":
        return "雪"
      default:
        return "不明"
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">天気</p>
          <div className="mt-2 flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <p className="text-lg font-semibold text-foreground">{weather.temperature}°C</p>
              <p className="text-xs text-muted-foreground">{getWeatherLabel(weather.condition)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">湿度</span>
          </div>
          <span className="font-medium text-foreground">{weather.humidity}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">風速</span>
          </div>
          <span className="font-medium text-foreground">{weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  )
}
