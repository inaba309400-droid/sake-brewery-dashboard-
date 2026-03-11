"use client"

import { useRouter } from "next/navigation"
import { breweries } from "@/lib/brewery-data"
import { MapPin, ArrowRight } from "lucide-react"

export default function BrewerySelectPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-10 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">Sake Brewery DX</p>
          <h1 className="text-3xl font-bold text-foreground">酒蔵別 閲覧画面</h1>
          <p className="mt-3 text-muted-foreground">
            ご自身の酒蔵を選択して、環境データを確認してください
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="grid gap-3">
          {breweries.map((brewery) => (
            <button
              key={brewery.id}
              onClick={() => router.push(`/view/${brewery.id}`)}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-6 py-5 text-left transition-colors hover:border-primary/30 hover:bg-accent"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {brewery.id}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{brewery.name}</h2>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{brewery.prefecture} {brewery.address}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            管理ダッシュボードへ戻る
          </button>
        </div>
      </main>
    </div>
  )
}
