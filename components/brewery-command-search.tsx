"use client"

import { useEffect, useMemo, useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { BreweryData } from "@/lib/brewery-data"
import { Search } from "lucide-react"

function shortcutLabel() {
  if (typeof navigator === "undefined") return "Ctrl K"
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
  return isMac ? "⌘K" : "Ctrl K"
}

export function BreweryCommandSearch({
  breweries,
  query,
  onQueryChange,
  onSelectBreweryId,
  placeholder = "酒蔵、センサーを検索...",
}: {
  breweries: BreweryData[]
  query: string
  onQueryChange: (value: string) => void
  onSelectBreweryId: (id: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return breweries
    return breweries.filter((b) => {
      const hay = `${b.name} ${b.id} ${b.prefecture}`.toLowerCase()
      return hay.includes(q)
    })
  }, [breweries, query])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 truncate text-left">{query ? query : placeholder}</span>
        <kbd className="rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {shortcutLabel()}
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} title="検索" description="酒蔵名やIDで検索">
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={(v) => onQueryChange(v)}
        />
        <CommandList>
          <CommandEmpty>該当する候補がありません</CommandEmpty>
          <CommandGroup heading="酒蔵">
            {items.map((b) => (
              <CommandItem
                key={b.id}
                value={`${b.name} ${b.id} ${b.prefecture}`}
                onSelect={() => {
                  onQueryChange(b.name)
                  setOpen(false)
                  onSelectBreweryId(b.id)
                }}
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{b.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      ID: {b.id}・{b.prefecture}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {b.status === "normal" ? "正常" : b.status === "warning" ? "警告" : "異常"}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

