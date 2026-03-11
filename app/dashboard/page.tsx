"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { BreweryCard } from "@/components/brewery-card"
import { BreweryFilter } from "@/components/brewery-filter"
import { BreweryCommandSearch } from "@/components/brewery-command-search"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { breweries, type TimeRange } from "@/lib/brewery-data"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<"all" | "normal" | "warning" | "critical">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  // If user is not admin, filter to only their brewery
  const userBreweries = user?.role === "admin" ? breweries : breweries.filter((b) => b.id === user?.breweryId)

  const filteredBreweries = userBreweries.filter((brewery) => {
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
        <div className="px-6 py-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">酒蔵 DX パイロット</h1>
              <p className="mt-2 text-muted-foreground">
                {user?.role === "admin" ? "複数の酒蔵のリアルタイム環境監視ダッシュボード" : `${user?.breweryName}の環境監視`}
              </p>
            </div>

            {user?.role === "admin" && (
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:max-w-md">
                  <BreweryCommandSearch
                    breweries={breweries}
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    onSelectBreweryId={(id) => handleBreweryClick(id)}
                  />
                </div>
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      {user?.role === "admin" && (
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
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
      )}

      {/* Filters */}
      {user?.role === "admin" && (
        <div className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <BreweryFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showSearch={false}
            />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="p-6">
        {filteredBreweries.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">該当する酒蔵が見つかりません</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBreweries.map((brewery) => (
              <button
                key={brewery.id}
                onClick={() => handleBreweryClick(brewery.id)}
                className="text-left transition-transform hover:scale-[1.02]"
              >
                <BreweryCard brewery={brewery} timeRange={timeRange} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
