"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { breweries } from "@/lib/brewery-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, ClipboardCheck, Thermometer, Droplets } from "lucide-react"

interface QualityData {
  id: string
  lotId: string
  lotNumber: string
  productName: string
  breweryId: string
  breweryName: string
  temperature: number
  humidity: number
  productTemp: number
  roomTemp: number
  brix: number
  measuredAt: string
}

const mockLots = [
  { id: "lot-001", lotNumber: "2024-001", productName: "純米大吟醸 華", breweryId: "0001" },
  { id: "lot-002", lotNumber: "2024-002", productName: "本醸造 月", breweryId: "0001" },
  { id: "lot-003", lotNumber: "2024-003", productName: "純米酒 風", breweryId: "0002" },
]

const initialQualityRecords: QualityData[] = [
  {
    id: "qc-001",
    lotId: "lot-001",
    lotNumber: "2024-001",
    productName: "純米大吟醸 華",
    breweryId: "0001",
    breweryName: "石川酒造",
    temperature: 15.2,
    humidity: 62,
    productTemp: 8.3,
    roomTemp: 18.5,
    brix: 13.2,
    measuredAt: "2024-03-01T10:00",
  },
  {
    id: "qc-002",
    lotId: "lot-001",
    lotNumber: "2024-001",
    productName: "純米大吟醸 華",
    breweryId: "0001",
    breweryName: "石川酒造",
    temperature: 15.5,
    humidity: 60,
    productTemp: 8.5,
    roomTemp: 18.8,
    brix: 13.8,
    measuredAt: "2024-03-01T14:00",
  },
  {
    id: "qc-003",
    lotId: "lot-003",
    lotNumber: "2024-003",
    productName: "純米酒 風",
    breweryId: "0002",
    breweryName: "落酒造",
    temperature: 14.8,
    humidity: 58,
    productTemp: 7.9,
    roomTemp: 17.2,
    brix: 12.9,
    measuredAt: "2024-03-02T09:00",
  },
]

export default function QualityPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<QualityData[]>(initialQualityRecords)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<QualityData | null>(null)

  // Form state
  const [formLotId, setFormLotId] = useState("")
  const [formTemperature, setFormTemperature] = useState("")
  const [formHumidity, setFormHumidity] = useState("")
  const [formProductTemp, setFormProductTemp] = useState("")
  const [formRoomTemp, setFormRoomTemp] = useState("")
  const [formBrix, setFormBrix] = useState("")
  const [formMeasuredAt, setFormMeasuredAt] = useState("")

  // Filter based on user role
  const userRecords = user?.role === "admin" ? records : records.filter((r) => r.breweryId === user?.breweryId)

  const userLots = user?.role === "admin" ? mockLots : mockLots.filter((l) => l.breweryId === user?.breweryId)

  const filteredRecords = userRecords.filter(
    (r) =>
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormLotId("")
    setFormTemperature("")
    setFormHumidity("")
    setFormProductTemp("")
    setFormRoomTemp("")
    setFormBrix("")
    setFormMeasuredAt("")
    setEditingRecord(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (record: QualityData) => {
    setEditingRecord(record)
    setFormLotId(record.lotId)
    setFormTemperature(record.temperature.toString())
    setFormHumidity(record.humidity.toString())
    setFormProductTemp(record.productTemp.toString())
    setFormRoomTemp(record.roomTemp.toString())
    setFormBrix(record.brix.toString())
    setFormMeasuredAt(record.measuredAt)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const lot = mockLots.find((l) => l.id === formLotId)
    const brewery = breweries.find((b) => b.id === lot?.breweryId)

    if (editingRecord) {
      setRecords(
        records.map((r) =>
          r.id === editingRecord.id
            ? {
                ...r,
                lotId: formLotId,
                lotNumber: lot?.lotNumber || "",
                productName: lot?.productName || "",
                breweryId: lot?.breweryId || "",
                breweryName: brewery?.name || "",
                temperature: parseFloat(formTemperature),
                humidity: parseFloat(formHumidity),
                productTemp: parseFloat(formProductTemp),
                roomTemp: parseFloat(formRoomTemp),
                brix: parseFloat(formBrix),
                measuredAt: formMeasuredAt,
              }
            : r
        )
      )
    } else {
      const newRecord: QualityData = {
        id: `qc-${Date.now()}`,
        lotId: formLotId,
        lotNumber: lot?.lotNumber || "",
        productName: lot?.productName || "",
        breweryId: lot?.breweryId || "",
        breweryName: brewery?.name || "",
        temperature: parseFloat(formTemperature),
        humidity: parseFloat(formHumidity),
        productTemp: parseFloat(formProductTemp),
        roomTemp: parseFloat(formRoomTemp),
        brix: parseFloat(formBrix),
        measuredAt: formMeasuredAt,
      }
      setRecords([...records, newRecord])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (recordId: string) => {
    if (window.confirm("この品質記録を削除しますか？")) {
      setRecords(records.filter((r) => r.id !== recordId))
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">品質管理</h1>
            <p className="mt-2 text-muted-foreground">品質管理のための測定データを登録</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                新規記録
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingRecord ? "品質記録編集" : "新規品質記録"}</DialogTitle>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="lot">製造ロット</FieldLabel>
                  <Select value={formLotId} onValueChange={setFormLotId}>
                    <SelectTrigger>
                      <SelectValue placeholder="ロットを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {userLots.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.lotNumber} - {l.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="temperature">温度 (°C)</FieldLabel>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={formTemperature}
                      onChange={(e) => setFormTemperature(e.target.value)}
                      placeholder="測定温度"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="humidity">湿度 (%)</FieldLabel>
                    <Input
                      id="humidity"
                      type="number"
                      step="0.1"
                      value={formHumidity}
                      onChange={(e) => setFormHumidity(e.target.value)}
                      placeholder="測定湿度"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="productTemp">品温 (°C)</FieldLabel>
                    <Input
                      id="productTemp"
                      type="number"
                      step="0.1"
                      value={formProductTemp}
                      onChange={(e) => setFormProductTemp(e.target.value)}
                      placeholder="液体温度"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="roomTemp">室温 (°C)</FieldLabel>
                    <Input
                      id="roomTemp"
                      type="number"
                      step="0.1"
                      value={formRoomTemp}
                      onChange={(e) => setFormRoomTemp(e.target.value)}
                      placeholder="室内温度"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="brix">糖度 (Brix)</FieldLabel>
                  <Input
                    id="brix"
                    type="number"
                    step="0.1"
                    value={formBrix}
                    onChange={(e) => setFormBrix(e.target.value)}
                    placeholder="糖度"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="measuredAt">測定日時</FieldLabel>
                  <Input
                    id="measuredAt"
                    type="datetime-local"
                    value={formMeasuredAt}
                    onChange={(e) => setFormMeasuredAt(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">キャンセル</Button>
                </DialogClose>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !formLotId ||
                    !formTemperature ||
                    !formHumidity ||
                    !formProductTemp ||
                    !formRoomTemp ||
                    !formBrix ||
                    !formMeasuredAt
                  }
                >
                  {editingRecord ? "更新" : "保存"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Search */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="記録を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>品質記録一覧 ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">品質記録がありません</div>
            ) : (
              <div className="divide-y divide-border">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <ClipboardCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {record.lotNumber} - {record.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(record.measuredAt)} | {record.breweryName}
                          </p>
                          {/* Measurement Values */}
                          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-chart-1" />
                              <span className="text-sm">
                                <span className="text-muted-foreground">温度:</span>{" "}
                                <span className="font-medium">{record.temperature}°C</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-chart-3" />
                              <span className="text-sm">
                                <span className="text-muted-foreground">湿度:</span>{" "}
                                <span className="font-medium">{record.humidity}%</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-chart-4" />
                              <span className="text-sm">
                                <span className="text-muted-foreground">品温:</span>{" "}
                                <span className="font-medium">{record.productTemp}°C</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-chart-2" />
                              <span className="text-sm">
                                <span className="text-muted-foreground">室温:</span>{" "}
                                <span className="font-medium">{record.roomTemp}°C</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-primary" />
                              <span className="text-sm">
                                <span className="text-muted-foreground">糖度:</span>{" "}
                                <span className="font-medium">{record.brix}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(record)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
