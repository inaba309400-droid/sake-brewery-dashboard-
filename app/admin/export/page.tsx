"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { breweries } from "@/lib/brewery-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Download, FileText } from "lucide-react"

const DUMMY_QUALITY = [
  {
    id: "QC001",
    lotNo: "SK0001",
    product: "純米吟醸「一ノ蔵」",
    brewery: "石川酒造",
    temperature: 15.2,
    humidity: 62.0,
    productTemp: 8.3,
    roomTemp: 18.5,
    recordedAt: "2026-03-10 10:00",
  },
  {
    id: "QC002",
    lotNo: "SK0001",
    product: "純米吟醸「一ノ蔵」",
    brewery: "石川酒造",
    temperature: 15.5,
    humidity: 60.5,
    productTemp: 8.5,
    roomTemp: 18.8,
    recordedAt: "2026-03-10 14:00",
  },
  {
    id: "QC003",
    lotNo: "SK0002",
    product: "大吟醸「山田錦」",
    brewery: "石川酒造",
    temperature: 14.8,
    humidity: 58.0,
    productTemp: 7.9,
    roomTemp: 17.2,
    recordedAt: "2026-03-11 09:00",
  },
  {
    id: "QC004",
    lotNo: "SK0003",
    product: "特別純米「霧ヶ峰」",
    brewery: "落酒造",
    temperature: 13.1,
    humidity: 55.5,
    productTemp: 7.2,
    roomTemp: 16.0,
    recordedAt: "2026-03-11 11:30",
  },
  {
    id: "QC005",
    lotNo: "SK0003",
    product: "特別純米「霧ヶ峰」",
    brewery: "落酒造",
    temperature: 13.4,
    humidity: 56.0,
    productTemp: 7.4,
    roomTemp: 16.3,
    recordedAt: "2026-03-11 15:00",
  },
]

const DUMMY_SCHEDULE = [
  {
    id: "SC001",
    batchNo: "SK0001",
    product: "純米吟醸「一ノ蔵」",
    brewery: "石川酒造",
    startDate: "2026-03-10",
    pressDate: "2026-04-10",
    worker: "石川太郎",
    status: "仕込み中",
  },
  {
    id: "SC002",
    batchNo: "SK0002",
    product: "大吟醸「山田錦」",
    brewery: "石川酒造",
    startDate: "2026-03-01",
    pressDate: "2026-04-01",
    worker: "石川太郎",
    status: "発酵中",
  },
  {
    id: "SC003",
    batchNo: "SK0003",
    product: "特別純米「霧ヶ峰」",
    brewery: "落酒造",
    startDate: "2026-02-15",
    pressDate: "2026-03-15",
    worker: "落花子",
    status: "完了",
  },
  {
    id: "SC004",
    batchNo: "SK0004",
    product: "純米酒「春の風」",
    brewery: "落酒造",
    startDate: "2026-03-05",
    pressDate: "2026-04-05",
    worker: "落花子",
    status: "仕込み中",
  },
]

function toCSV(headers: string[], rows: (string | number)[][]) {
  return [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")
}

function downloadCSV(filename: string, content: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const today = () => new Date().toISOString().slice(0, 10)

export default function AdminExportPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [downloaded, setDownloaded] = useState<string[]>([])

  useEffect(() => {
    if (isLoading) return
    if (!user || user.role !== "admin") {
      router.replace("/login")
    }
  }, [isLoading, router, user])

  if (isLoading || !user) return null

  const markDownloaded = (key: string) => {
    setDownloaded((prev) => [...prev, key])
    setTimeout(() => setDownloaded((prev) => prev.filter((k) => k !== key)), 3000)
  }

  const handleQualityExport = () => {
    const headers = ["記録ID", "ロット番号", "製品名", "酒蔵名", "温度(°C)", "湿度(%)", "品温(°C)", "室温(°C)", "測定日時"]
    const rows = DUMMY_QUALITY.map((r) => [
      r.id, r.lotNo, r.product, r.brewery, r.temperature, r.humidity, r.productTemp, r.roomTemp, r.recordedAt,
    ])
    downloadCSV(`酒蔵DX_品質管理データ_${today()}.csv`, toCSV(headers, rows))
    markDownloaded("quality")
  }

  const handleScheduleExport = () => {
    const headers = ["日程ID", "ロット番号", "製品名", "酒蔵名", "仕込み開始日", "上槽予定日", "担当者", "ステータス"]
    const rows = DUMMY_SCHEDULE.map((r) => [
      r.id, r.batchNo, r.product, r.brewery, r.startDate, r.pressDate, r.worker, r.status,
    ])
    downloadCSV(`酒蔵DX_製造日程データ_${today()}.csv`, toCSV(headers, rows))
    markDownloaded("schedule")
  }

  const handleSensorExport = () => {
    const headers = ["酒蔵ID", "酒蔵名", "都道府県", "ステータス", "気温(°C)", "室温(°C)", "品温(°C)", "湿度(%)", "風速(m/s)", "天気", "最終更新"]
    const rows = breweries.map((b) => [
      b.id, b.name, b.prefecture, b.status, b.ambientTemp, b.roomTemp, b.productTemp,
      b.humidity, b.weather.windSpeed, b.weather.condition, b.lastUpdated,
    ])
    downloadCSV(`酒蔵DX_センサーデータ_${today()}.csv`, toCSV(headers, rows))
    markDownloaded("sensor")
  }

  const exports = [
    {
      key: "quality",
      title: "品質管理データ",
      desc: "温度・湿度・品温・室温の測定記録",
      count: DUMMY_QUALITY.length,
      handler: handleQualityExport,
    },
    {
      key: "schedule",
      title: "製造日程データ",
      desc: "仕込みロット・開始日・上槽予定日・担当者",
      count: DUMMY_SCHEDULE.length,
      handler: handleScheduleExport,
    },
    {
      key: "sensor",
      title: "酒蔵データ比較",
      desc: "全酒蔵の環境データを比較・分析",
      count: breweries.length,
      handler: handleSensorExport,
      adminNote: "全酒蔵分",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground">CSV出力</h1>
        <p className="mt-2 text-muted-foreground">各種データをCSV形式でエクスポート</p>
      </header>

      <div className="p-6 space-y-4 max-w-2xl">
        {exports.map((ex) => (
          <Card key={ex.key}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />
                {ex.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{ex.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ex.count}件 {ex.adminNote && `（${ex.adminNote}）`}
                </p>
              </div>
              <Button
                onClick={ex.handler}
                variant={downloaded.includes(ex.key) ? "outline" : "default"}
                className="gap-2 min-w-[120px]"
              >
                {downloaded.includes(ex.key) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ダウンロード済み
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    ダウンロード
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}

        <p className="text-xs text-muted-foreground pt-2">
          ※ ダウンロードされるCSVはデモ用ダミーデータです。文字コードはUTF-8（BOM付き）。
        </p>
      </div>
    </div>
  )
}
