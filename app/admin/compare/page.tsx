"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ComparisonChart } from "@/components/comparison-chart"
import { breweries, type BreweryData } from "@/lib/brewery-data"
import { ChevronLeft, ArrowLeftRight, MapPin, Clock, Thermometer, Droplets } from "lucide-react"

const CHART_COLORS = {
  a: "#2563eb",
  b: "#e11d48",
}

function BrewerySelector({
  label,
  selectedId,
  onChange,
  color,
}: {
  label: string
  selectedId: string
  onChange: (id: string) => void
  color: string
}) {
  const selected = breweries.find((b) => b.id === selectedId)

  return (
    <div className="flex-1 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {breweries.map((b) => (
          <option key={b.id} value={b.id}>
            {b.id} - {b.name}({b.prefecture})
          </option>
        ))}
      </select>
      {selected && (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {selected.address}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {"最終更新: "}{selected.lastUpdated}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-md bg-muted px-2.5 py-2 text-center">
              <Thermometer className="mx-auto mb-0.5 h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">品温</p>
              <p className="text-sm font-bold text-foreground">{selected.productTemp.toFixed(1)}&deg;C</p>
            </div>
            <div className="rounded-md bg-muted px-2.5 py-2 text-center">
              <Droplets className="mx-auto mb-0.5 h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">湿度</p>
              <p className="text-sm font-bold text-foreground">{selected.humidity.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryTable({ breweryA, breweryB }: { breweryA: BreweryData; breweryB: BreweryData }) {
  const rows = [
    { label: "気温", valueA: breweryA.ambientTemp, valueB: breweryB.ambientTemp, unit: "\u00B0C" },
    { label: "室温", valueA: breweryA.roomTemp, valueB: breweryB.roomTemp, unit: "\u00B0C" },
    { label: "品温", valueA: breweryA.productTemp, valueB: breweryB.productTemp, unit: "\u00B0C" },
    { label: "湿度", valueA: breweryA.humidity, valueB: breweryB.humidity, unit: "%" },
  ]

  return (
    <div className="rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">項目</th>
            <th className="px-4 py-3 text-right font-medium" style={{ color: CHART_COLORS.a }}>{breweryA.name}</th>
            <th className="px-4 py-3 text-right font-medium" style={{ color: CHART_COLORS.b }}>{breweryB.name}</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">差分</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const diff = row.valueA - row.valueB
            return (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {row.valueA.toFixed(1)}{row.unit}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {row.valueB.toFixed(1)}{row.unit}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${diff > 0 ? "text-chart-1" : diff < 0 ? "text-chart-2" : "text-foreground"}`}>
                  {diff > 0 ? "+" : ""}{diff.toFixed(1)}{row.unit}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminComparePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [idA, setIdA] = useState("0001")
  const [idB, setIdB] = useState("0002")

  useEffect(() => {
    if (isLoading) return
    if (!user || user.role !== "admin") {
      router.replace("/login")
    }
  }, [isLoading, router, user])

  if (isLoading || !user) return null

  const breweryA = breweries.find((b) => b.id === idA)!
  const breweryB = breweries.find((b) => b.id === idB)!

  const handleSwap = () => {
    setIdA(idB)
    setIdB(idA)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <button
            onClick={() => router.push("/admin")}
            className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            管理ダッシュボードに戻る
          </button>
          <h1 className="text-2xl font-bold text-foreground">酒蔵データ比較</h1>
          <p className="mt-1 text-sm text-muted-foreground">2つの酒蔵の環境データを並べて比較できます</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          <BrewerySelector label="酒蔵A" selectedId={idA} onChange={setIdA} color={CHART_COLORS.a} />
          <button
            onClick={handleSwap}
            className="flex shrink-0 items-center justify-center self-center rounded-full border border-border bg-card p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="入れ替え"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <BrewerySelector label="酒蔵B" selectedId={idB} onChange={setIdB} color={CHART_COLORS.b} />
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">現在値サマリー</h2>
          <SummaryTable breweryA={breweryA} breweryB={breweryB} />
        </div>

        <div className="mb-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">24時間推移比較</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ComparisonChart
            title="気温"
            unit="&deg;C"
            dataA={breweryA.ambientTempHistory}
            dataB={breweryB.ambientTempHistory}
            nameA={breweryA.name}
            nameB={breweryB.name}
            colorA={CHART_COLORS.a}
            colorB={CHART_COLORS.b}
            currentA={breweryA.ambientTemp}
            currentB={breweryB.ambientTemp}
          />
          <ComparisonChart
            title="室温"
            unit="&deg;C"
            dataA={breweryA.roomTempHistory}
            dataB={breweryB.roomTempHistory}
            nameA={breweryA.name}
            nameB={breweryB.name}
            colorA={CHART_COLORS.a}
            colorB={CHART_COLORS.b}
            currentA={breweryA.roomTemp}
            currentB={breweryB.roomTemp}
          />
          <ComparisonChart
            title="品温"
            unit="&deg;C"
            dataA={breweryA.productTempHistory}
            dataB={breweryB.productTempHistory}
            nameA={breweryA.name}
            nameB={breweryB.name}
            colorA={CHART_COLORS.a}
            colorB={CHART_COLORS.b}
            currentA={breweryA.productTemp}
            currentB={breweryB.productTemp}
          />
          <ComparisonChart
            title="湿度"
            unit="%"
            dataA={breweryA.humidityHistory}
            dataB={breweryB.humidityHistory}
            nameA={breweryA.name}
            nameB={breweryB.name}
            colorA={CHART_COLORS.a}
            colorB={CHART_COLORS.b}
            currentA={breweryA.humidity}
            currentB={breweryB.humidity}
          />
        </div>
      </main>
    </div>
  )
}
