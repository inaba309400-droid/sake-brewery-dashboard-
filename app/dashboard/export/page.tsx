"use client"

import { useState } from "react"
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

export default function ExportPage() {
  const { user } = useAuth()
  const [downloaded, setDownloaded] = useState<string[]>([])

  const markDownloaded = (key: string) => {
    setDownloaded((prev) => [...prev, key])
    setTimeout(() => setDownloaded((prev) => prev.filter((k) => k !== key)), 3000)
  }

  const handleQualityExport = () => {
    const QUALITY_30DAY = [
      [1,18.1,19.4,18.1,72],[2,18.8,19.0,20.8,73],[3,19.3,15.3,17.8,69],
      [4,19.7,15.0,15.0,61],[5,20.5,18.1,11.8,55],[6,21.5,20.0,9.7,56],
      [7,22.3,18.1,11.0,64],[8,21.5,15.5,16.2,74],[9,20.6,16.1,18.7,75],
      [10,20.1,18.7,20.7,69],[11,19.3,19.5,17.4,60],[12,18.3,17.5,13.3,55],
      [13,17.9,15.0,10.6,56],[14,17.0,16.4,10.4,66],[15,16.2,19.2,11.6,73],
      [16,16.0,20.0,16.3,75],[17,15.2,17.5,18.8,67],[18,14.2,15.0,19.3,62],
      [19,13.9,16.3,17.7,55],[20,13.2,19.4,13.1,56],[21,12.3,19.3,10.7,67],
      [22,11.5,16.4,11.3,73],[23,10.6,15.0,12.0,75],[24,10.3,16.9,15.8,68],
      [25,9.8,19.7,20.5,62],[26,8.5,19.4,20.0,55],[27,7.9,16.4,16.1,57],
      [28,7.4,15.5,13.8,65],[29,6.7,17.2,11.1,75],[30,5.9,20.0,10.7,73],
    ]
    const headers = ["Day", "品温(℃)", "室温(℃)", "気温(℃)", "湿度(%)"]
    downloadCSV(`酒蔵DX_品質管理データ_${today()}.csv`, toCSV(headers, QUALITY_30DAY))
    markDownloaded("quality")
  }

  const handleScheduleExport = () => {
    const headers = ["日程ID", "ロット番号", "製品名", "酒蔵名", "仕込み開始日", "上槽予定日", "担当者", "ステータス"]
    const rows = DUMMY_SCHEDULE.filter((r) => user?.role === "admin" || r.brewery === user?.breweryName).map((r) => [
      r.id,
      r.batchNo,
      r.product,
      r.brewery,
      r.startDate,
      r.pressDate,
      r.worker,
      r.status,
    ])
    downloadCSV(`酒蔵DX_製造日程データ_${today()}.csv`, toCSV(headers, rows))
    markDownloaded("schedule")
  }

  const handleSensorExport = () => {
    const headers = ["酒蔵ID", "酒蔵名", "都道府県", "ステータス", "気温(°C)", "室温(°C)", "品温(°C)", "湿度(%)", "風速(m/s)", "天気", "最終更新"]
    const rows = breweries.filter((b) => user?.role === "admin" || b.id === user?.breweryId).map((b) => [
      b.id,
      b.name,
      b.prefecture,
      b.status,
      b.ambientTemp,
      b.roomTemp,
      b.productTemp,
      b.humidity,
      b.weather.windSpeed,
      b.weather.condition,
      b.lastUpdated,
    ])
    downloadCSV(`酒蔵DX_センサーデータ_${today()}.csv`, toCSV(headers, rows))
    markDownloaded("sensor")
  }

  const exports = [
    {
      key: "quality",
      title: "品質管理データ",
      desc: "温度・湿度・品温・室温の測定記録（30日間）",
      count: 30,
      handler: handleQualityExport,
      showFor: ["admin", "user"],
    },
    {
      key: "schedule",
      title: "製造日程データ",
      desc: "仕込みロット・開始日・上槽予定日・担当者",
      count: DUMMY_SCHEDULE.filter((r) => user?.role === "admin" || r.brewery === user?.breweryName).length,
      handler: handleScheduleExport,
      showFor: ["admin"],
    },
    {
      key: "sensor",
      title: "酒蔵データ比較",
      desc: "全酒蔵の環境データを比較・分析",
      count: breweries.filter((b) => user?.role === "admin" || b.id === user?.breweryId).length,
      handler: handleSensorExport,
      showFor: ["admin"],
    },
  ].filter((ex) => ex.showFor.includes(user?.role ?? ""))

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
                <p className="text-xs text-muted-foreground mt-1">{ex.count}件</p>
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

