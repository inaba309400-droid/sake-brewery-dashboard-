"use client"

import { useParams, useRouter } from "next/navigation"
import { breweries, getStatusLabel } from "@/lib/brewery-data"
import { DetailChart } from "@/components/detail-chart"
import { WeatherWidget } from "@/components/weather-widget"
import {
  ChevronLeft,
  MapPin,
  Clock,
  Thermometer,
  Droplets,
  Home,
  Activity,
} from "lucide-react"

export default function BreweryViewPage() {
  const params = useParams()
  const router = useRouter()
  const brewery = breweries.find((b) => b.id === params.id)

  if (!brewery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">酒蔵データが見つかりません</p>
          <button
            onClick={() => router.push("/view")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            酒蔵選択へ戻る
          </button>
        </div>
      </div>
    )
  }

  const statusBadgeClass =
    brewery.status === "normal"
      ? "bg-chart-2/15 text-chart-2 border-chart-2/30"
      : brewery.status === "warning"
        ? "bg-chart-4/15 text-chart-4 border-chart-4/30"
        : "bg-destructive/15 text-destructive border-destructive/30"

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <button
            onClick={() => router.push("/view")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            酒蔵選択
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            管理画面
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {brewery.id}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{brewery.name}</h1>
                  <p className="text-sm text-muted-foreground">{today}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{brewery.prefecture} {brewery.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>最終更新: {brewery.lastUpdated}</span>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-sm font-medium ${statusBadgeClass}`}>
              <Activity className="h-3.5 w-3.5" />
              {getStatusLabel(brewery.status)}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Current Values Summary */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-medium text-muted-foreground">気温</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{brewery.ambientTemp.toFixed(1)}<span className="ml-0.5 text-sm font-normal text-muted-foreground">°C</span></p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-medium text-muted-foreground">室温</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{brewery.roomTemp.toFixed(1)}<span className="ml-0.5 text-sm font-normal text-muted-foreground">°C</span></p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-amber-500" />
              <p className="text-xs font-medium text-muted-foreground">品温</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{brewery.productTemp.toFixed(1)}<span className="ml-0.5 text-sm font-normal text-muted-foreground">°C</span></p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-500" />
              <p className="text-xs font-medium text-muted-foreground">湿度</p>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{brewery.humidity}<span className="ml-0.5 text-sm font-normal text-muted-foreground">%</span></p>
          </div>
        </div>

        {/* Weather */}
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">天気情報</h2>
          <WeatherWidget weather={brewery.weather} />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">24時間推移グラフ</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <DetailChart
              title="気温"
              unit="°C"
              color="#3b82f6"
              currentValue={brewery.ambientTemp}
              data={brewery.ambientTempHistory}
            />
            <DetailChart
              title="室温"
              unit="°C"
              color="#10b981"
              currentValue={brewery.roomTemp}
              data={brewery.roomTempHistory}
            />
            <DetailChart
              title="品温"
              unit="°C"
              color="#f59e0b"
              currentValue={brewery.productTemp}
              data={brewery.productTempHistory}
            />
            <DetailChart
              title="湿度"
              unit="%"
              color="#0ea5e9"
              currentValue={brewery.humidity}
              data={brewery.humidityHistory}
            />
          </div>
        </div>

        {/* Brewery Info */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">酒蔵情報</h2>
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <span className="text-sm text-muted-foreground">酒蔵ID</span>
              <span className="font-mono text-sm font-medium text-foreground">{brewery.id}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <span className="text-sm text-muted-foreground">酒蔵名</span>
              <span className="text-sm font-medium text-foreground">{brewery.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <span className="text-sm text-muted-foreground">都道府県</span>
              <span className="text-sm font-medium text-foreground">{brewery.prefecture}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <span className="text-sm text-muted-foreground">住所</span>
              <span className="text-sm font-medium text-foreground">{brewery.address}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">ステータス</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusBadgeClass}`}>
                {getStatusLabel(brewery.status)}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
