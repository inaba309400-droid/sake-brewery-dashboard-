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
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react"

interface LotData {
  id: string
  productName: string
  lotNumber: string
  breweryId: string
  breweryName: string
  createdAt: string
  status: "in-progress" | "completed"
}

const initialLots: LotData[] = [
  {
    id: "lot-001",
    productName: "純米大吟醸 華",
    lotNumber: "2024-001",
    breweryId: "0001",
    breweryName: "石川酒造",
    createdAt: "2024-01-15",
    status: "in-progress",
  },
  {
    id: "lot-003",
    productName: "純米酒 風",
    lotNumber: "2024-003",
    breweryId: "0002",
    breweryName: "落酒造",
    createdAt: "2024-02-10",
    status: "in-progress",
  },
]

export default function LotsPage() {
  const { user } = useAuth()
  const [lots, setLots] = useState<LotData[]>(initialLots)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLot, setEditingLot] = useState<LotData | null>(null)

  // Form state
  const [formProductName, setFormProductName] = useState("")
  const [formLotNumber, setFormLotNumber] = useState("")
  const [formBreweryId, setFormBreweryId] = useState(user?.breweryId || "")

  // Filter lots based on user role
  const userLots = user?.role === "admin" ? lots : lots.filter((l) => l.breweryId === user?.breweryId)

  const filteredLots = userLots.filter(
    (l) =>
      l.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormProductName("")
    setFormLotNumber("")
    setFormBreweryId(user?.breweryId || "")
    setEditingLot(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (lot: LotData) => {
    setEditingLot(lot)
    setFormProductName(lot.productName)
    setFormLotNumber(lot.lotNumber)
    setFormBreweryId(lot.breweryId)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const brewery = breweries.find((b) => b.id === formBreweryId)

    if (editingLot) {
      setLots(
        lots.map((l) =>
          l.id === editingLot.id
            ? {
                ...l,
                productName: formProductName,
                lotNumber: formLotNumber,
                breweryId: formBreweryId,
                breweryName: brewery?.name || "",
              }
            : l
        )
      )
    } else {
      const newLot: LotData = {
        id: `lot-${Date.now()}`,
        productName: formProductName,
        lotNumber: formLotNumber,
        breweryId: formBreweryId,
        breweryName: brewery?.name || "",
        createdAt: new Date().toISOString().split("T")[0],
        status: "in-progress",
      }
      setLots([...lots, newLot])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (lotId: string) => {
    if (window.confirm("このロットを削除しますか？")) {
      setLots(lots.filter((l) => l.id !== lotId))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">製造ロット管理</h1>
            <p className="mt-2 text-muted-foreground">製品ごとの製造単位を管理</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                新規登録
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLot ? "ロット編集" : "新規ロット登録"}</DialogTitle>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="productName">製品名</FieldLabel>
                  <Input
                    id="productName"
                    value={formProductName}
                    onChange={(e) => setFormProductName(e.target.value)}
                    placeholder="製造する製品"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lotNumber">ロット番号</FieldLabel>
                  <Input
                    id="lotNumber"
                    value={formLotNumber}
                    onChange={(e) => setFormLotNumber(e.target.value)}
                    placeholder="例: 2024-001"
                  />
                </Field>
                {user?.role === "admin" && (
                  <Field>
                    <FieldLabel htmlFor="brewery">酒蔵</FieldLabel>
                    <Select value={formBreweryId} onValueChange={setFormBreweryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="酒蔵を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {breweries.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">キャンセル</Button>
                </DialogClose>
                <Button onClick={handleSubmit} disabled={!formProductName || !formLotNumber}>
                  {editingLot ? "更新" : "登録"}
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
            placeholder="ロットを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lot List */}
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>製造ロット一覧 ({filteredLots.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLots.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">ロットが登録されていません</div>
            ) : (
              <div className="divide-y divide-border">
                {filteredLots.map((lot) => (
                  <div key={lot.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lot.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          ロット番号: {lot.lotNumber} | {lot.breweryName}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${lot.status === "in-progress" ? "bg-chart-4/10 text-chart-4" : "bg-chart-2/10 text-chart-2"}`}
                          >
                            {lot.status === "in-progress" ? "製造中" : "完了"}
                          </span>
                          <span className="text-xs text-muted-foreground">登録日: {lot.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(lot)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(lot.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
