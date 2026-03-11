"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { breweries, getStatusLabel } from "@/lib/brewery-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Download,
  Droplets,
  LayoutGrid,
  List,
  LogOut,
  Search,
  Thermometer,
  Wind,
  Wine,
  XCircle,
} from "lucide-react"

const STATUS_FILTERS = ["all", "normal", "warning", "critical"] as const
const TIME_FILTERS = ["1h", "6h", "12h", "24h", "all"] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]
type TimeFilter = (typeof TIME_FILTERS)[number]

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: "すべて",
  normal: "正常",
  warning: "警告",
  critical: "異常",
}
const TIME_LABEL: Record<TimeFilter, string> = {
  "1h": "1時間",
  "6h": "6時間",
  "12h": "12時間",
  "24h": "24時間",
  all: "全期間",
}

const WEATHER_ICON: Record<string, string> = { sunny: "☀️", cloudy: "☁️", rainy: "🌧️", snowy: "❄️" }
const WEATHER_LABEL: Record<string, string> = { sunny: "晴天", cloudy: "曇り", rainy: "雨", snowy: "雪" }

function MiniSparkline({ color }: { color: string }) {
  const points = Array.from({ length: 8 }, () => Math.random() * 20 + 5)
  const max = Math.max(...points)
  const min = Math.min(...points)
  const w = 60
  const h = 20
  const coords = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((v - min) / (max - min + 0.001)) * h
      return `${x},${y}`
    })
    .join(" ")
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={coords} />
    </svg>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config =
    {
      normal: { label: "正常", bg: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      warning: { label: "警告", bg: "bg-amber-100 text-amber-700 border-amber-200" },
      critical: { label: "異常", bg: "bg-red-100 text-red-700 border-red-200" },
    }[status] ?? { label: status, bg: "bg-gray-100 text-gray-700 border-gray-200" }

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", config.bg)}>
      {config.label}
    </span>
  )
}

function SensorValue({
  icon,
  label,
  value,
  unit,
  alert,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit: string
  alert?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <div className={cn("flex items-center gap-0.5", alert ? "text-red-500" : "text-slate-800")}>
        {icon}
        <span className="text-lg font-bold leading-none">{value}</span>
        <span className="text-xs text-slate-400">{unit}</span>
        {alert && <AlertTriangle className="h-3 w-3 text-amber-500" />}
      </div>
      <MiniSparkline color={alert ? "#ef4444" : "#00BFA5"} />
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [_timeFilter, setTimeFilter] = useState<TimeFilter>("24h")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  const filtered = breweries.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    total: breweries.length,
    normal: breweries.filter((b) => b.status === "normal").length,
    warning: breweries.filter((b) => b.status === "warning").length,
    critical: breweries.filter((b) => b.status === "critical").length,
  }

  const handleExportCSV = () => {
    const headers = [
      "酒蔵ID",
      "酒蔵名",
      "都道府県",
      "ステータス",
      "気温(°C)",
      "室温(°C)",
      "品温(°C)",
      "湿度(%)",
      "風速(m/s)",
      "天気",
      "最終更新",
    ]
    const rows = breweries.map((b) => [
      b.id,
      b.name,
      b.prefecture,
      getStatusLabel(b.status),
      b.ambientTemp,
      b.roomTemp,
      b.productTemp,
      b.humidity,
      b.weather.windSpeed,
      WEATHER_LABEL[b.weather.condition] ?? b.weather.condition,
      b.lastUpdated,
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `酒蔵DX_全酒蔵データ_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#0D1117] flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00BFA5]/20">
            <Wine className="h-4 w-4 text-[#00BFA5]" />
          </div>
          <span className="text-white font-bold">酒蔵DX</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { label: "ホーム", href: "/admin", active: true },
            { label: "酒蔵一覧", href: "/view" },
            { label: "センサー管理", href: "/compare" },
            { label: "レポート", href: "/dashboard/export" },
            { label: "ユーザー設定", href: "/dashboard/users" },
            { label: "システム設定", href: "#" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "bg-[#00BFA5]/20 text-[#00BFA5]"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => {
              logout()
              router.push("/login")
            }}
            className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-card border-b border-border flex items-center gap-4 px-6 py-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="酒蔵、センサーを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-accent">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {counts.critical}
              </span>
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary font-bold">管</span>
              </div>
              山田 管理者
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Page Title + CSV */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">管理者ダッシュボード</h1>
              <p className="text-sm text-muted-foreground mt-1">登録酒蔵とセンサーの監視</p>
            </div>
            <Button onClick={handleExportCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              CSV出力
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "合計酒蔵数", value: counts.total, color: "text-foreground", border: "border-border", icon: null },
              {
                label: "環境安定",
                value: counts.normal,
                color: "text-emerald-600",
                border: "border-emerald-200",
                icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
              },
              {
                label: "要注意",
                value: counts.warning,
                color: "text-amber-600",
                border: "border-amber-200",
                icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
              },
              {
                label: "即時対応必要",
                value: counts.critical,
                color: "text-red-600",
                border: "border-red-200",
                icon: <XCircle className="h-5 w-5 text-red-500" />,
              },
            ].map((card) => (
              <div key={card.label} className={cn("rounded-xl border bg-card p-4", card.border)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  {card.icon}
                </div>
                <p className={cn("text-3xl font-bold", card.color)}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>

            {/* Time Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              {TIME_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    _timeFilter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {TIME_LABEL[t]}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Brewery Cards */}
          <div className={cn("grid gap-4", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
            {filtered.map((brewery) => (
              <div
                key={brewery.id}
                className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/brewery/${brewery.id}`)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{brewery.name}</h3>
                      <StatusBadge status={brewery.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ID: {brewery.id} | {brewery.prefecture} | {brewery.lastUpdated}
                    </p>
                  </div>
                </div>

                {/* Weather Box */}
                <div className="rounded-lg bg-muted/50 p-3 mb-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{WEATHER_ICON[brewery.weather.condition]}</span>
                    <span className="font-semibold text-foreground">{brewery.weather.temperature}°C</span>
                    <span className="text-muted-foreground">
                      {WEATHER_LABEL[brewery.weather.condition] ?? brewery.weather.condition}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" /> 湿度 {brewery.weather.humidity}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="h-3 w-3" /> 風速 {brewery.weather.windSpeed} m/s
                    </span>
                  </div>
                </div>

                {/* Sensor Values */}
                <div className="grid grid-cols-4 gap-2">
                  <SensorValue
                    icon={<Thermometer className="h-3.5 w-3.5" />}
                    label="気温"
                    value={brewery.ambientTemp}
                    unit="°C"
                    alert={brewery.ambientTemp > 20}
                  />
                  <SensorValue
                    icon={<Thermometer className="h-3.5 w-3.5" />}
                    label="室温"
                    value={brewery.roomTemp}
                    unit="°C"
                    alert={brewery.roomTemp > 25}
                  />
                  <SensorValue
                    icon={<Thermometer className="h-3.5 w-3.5" />}
                    label="品温"
                    value={brewery.productTemp}
                    unit="°C"
                    alert={brewery.productTemp > 15}
                  />
                  <SensorValue
                    icon={<Droplets className="h-3.5 w-3.5" />}
                    label="湿度"
                    value={brewery.humidity}
                    unit="%"
                    alert={brewery.humidity > 75}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

