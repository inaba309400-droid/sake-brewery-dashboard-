"use client"

import { useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DetailChart } from "@/components/detail-chart"
import { WeatherWidget } from "@/components/weather-widget"
import { breweries, getStatusLabel } from "@/lib/brewery-data"
import { ChevronLeft, MapPin, Clock, Activity } from "lucide-react"

export default function BreweryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const id = useMemo(() => {
    const raw = (params as { id?: string | string[] })?.id
    return Array.isArray(raw) ? raw[0] : raw
  }, [params])

  useEffect(() => {
    if (isLoading) return
    if (user?.role === "user" && id && user.breweryId && id !== user.breweryId) {
      router.replace("/dashboard")
    }
  }, [id, isLoading, router, user?.breweryId, user?.role])

  const brewery = breweries.find((b) => b.id === id)

  if (!brewery) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            戻る
          </button>
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">酒蔵データが見つかりません</p>
          </div>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            管理ダッシュボードへ戻る
          </button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {brewery.id}
                </div>
                <h1 className="text-2xl font-bold text-foreground">{brewery.name}</h1>
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
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${statusBadgeClass}`}>
              <Activity className="h-3.5 w-3.5" />
              {getStatusLabel(brewery.status)}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">
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
