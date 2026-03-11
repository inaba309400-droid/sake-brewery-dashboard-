"use client"

import { Search } from "lucide-react"

interface BreweryFilterProps {
  selectedStatus: "all" | "normal" | "warning" | "critical"
  searchQuery: string
  onStatusChange: (status: "all" | "normal" | "warning" | "critical") => void
  onSearchChange: (query: string) => void
  showSearch?: boolean
}

export function BreweryFilter({
  selectedStatus,
  searchQuery,
  onStatusChange,
  onSearchChange,
  showSearch = true,
}: BreweryFilterProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      {showSearch && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="酒蔵名で検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}

      {/* Status Filters */}
      <div className="flex gap-2">
        {(["all", "normal", "warning", "critical"] as const).map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              selectedStatus === status
                ? status === "all"
                  ? "bg-primary text-primary-foreground"
                  : status === "normal"
                    ? "bg-chart-2 text-background"
                    : status === "warning"
                      ? "bg-chart-4 text-background"
                      : "bg-destructive text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {status === "all" ? "すべて" : status === "normal" ? "正常" : status === "warning" ? "警告" : "異常"}
          </button>
        ))}
      </div>
    </div>
  )
}
