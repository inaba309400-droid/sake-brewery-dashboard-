"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BreweryCard } from "./brewery-card"
import { BreweryFilter } from "./brewery-filter"
import { breweries } from "@/lib/brewery-data"
import { Eye, ArrowLeftRight } from "lucide-react"

export function BreweryDashboard() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<"all" | "normal" | "warning" | "critical">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBreweries = breweries.filter((brewery) => {
    const matchesStatus = selectedStatus === "all" || brewery.status === selectedStatus
    const matchesSearch = brewery.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleBreweryClick = (id: string) => {
    router.push(`/brewery/${id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">酒蔵 DX パイロット</h1>
              <p className="mt-2 text-muted-foreground">複数の酒蔵のリアルタイム環境監視ダッシュボード</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/compare")}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <ArrowLeftRight className="h-4 w-4" />
                酒蔵比較
              </button>
              <button
                onClick={() => router.push("/view")}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <Eye className="h-4 w-4" />
                酒蔵別閲覧画面
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">合計</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{breweries.length}</p>
            </div>
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">正常</p>
              <p className="mt-1 text-2xl font-bold text-chart-2">
                {breweries.filter((b) => b.status === "normal").length}
              </p>
            </div>
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">警告</p>
              <p className="mt-1 text-2xl font-bold text-chart-4">
                {breweries.filter((b) => b.status === "warning").length}
              </p>
            </div>
            <div className="rounded-lg bg-background p-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">異常</p>
              <p className="mt-1 text-2xl font-bold text-destructive">
                {breweries.filter((b) => b.status === "critical").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <BreweryFilter
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
            onStatusChange={setSelectedStatus}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {filteredBreweries.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">検索条件に合致する酒蔵がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBreweries.map((brewery) => (
              <button
                key={brewery.id}
                onClick={() => handleBreweryClick(brewery.id)}
                className="text-left transition-transform hover:scale-105"
              >
                <BreweryCard brewery={brewery} />
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
