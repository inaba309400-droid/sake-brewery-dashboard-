"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { breweries } from "@/lib/brewery-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Calendar as MonthCalendar, CalendarDayButton } from "@/components/ui/calendar"
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
import { Plus, Pencil, Trash2, Search, Calendar } from "lucide-react"
import type { DayButtonProps } from "react-day-picker"

interface ScheduleData {
  id: string
  lotId: string
  lotNumber: string
  productName: string
  breweryId: string
  breweryName: string
  startDateTime: string
  endDateTime: string
  assignee: string
  status: "scheduled" | "in-progress" | "completed"
}

const mockLots = [
  { id: "lot-001", lotNumber: "2024-001", productName: "純米大吟醸 華", breweryId: "0001" },
  { id: "lot-002", lotNumber: "2024-002", productName: "本醸造 月", breweryId: "0001" },
  { id: "lot-003", lotNumber: "2024-003", productName: "純米酒 風", breweryId: "0002" },
]

const initialSchedules: ScheduleData[] = [
  {
    id: "sch-001",
    lotId: "lot-001",
    lotNumber: "2024-001",
    productName: "純米大吟醸 華",
    breweryId: "0001",
    breweryName: "石川酒造",
    startDateTime: "2024-03-01T08:00",
    endDateTime: "2024-03-01T17:00",
    assignee: "田中一郎",
    status: "completed",
  },
  {
    id: "sch-002",
    lotId: "lot-001",
    lotNumber: "2024-001",
    productName: "純米大吟醸 華",
    breweryId: "0001",
    breweryName: "石川酒造",
    startDateTime: "2024-03-02T08:00",
    endDateTime: "2024-03-02T17:00",
    assignee: "佐藤花子",
    status: "in-progress",
  },
  {
    id: "sch-003",
    lotId: "lot-003",
    lotNumber: "2024-003",
    productName: "純米酒 風",
    breweryId: "0002",
    breweryName: "落酒造",
    startDateTime: "2024-03-03T09:00",
    endDateTime: "2024-03-03T18:00",
    assignee: "山田太郎",
    status: "scheduled",
  },
]

export default function SchedulePage() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<ScheduleData[]>(initialSchedules)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleData | null>(null)

  // Form state
  const [formLotId, setFormLotId] = useState("")
  const [formStartDateTime, setFormStartDateTime] = useState("")
  const [formEndDateTime, setFormEndDateTime] = useState("")
  const [formAssignee, setFormAssignee] = useState("")

  // Filter based on user role
  const userSchedules = user?.role === "admin" ? schedules : schedules.filter((s) => s.breweryId === user?.breweryId)

  const userLots = user?.role === "admin" ? mockLots : mockLots.filter((l) => l.breweryId === user?.breweryId)

  const filteredSchedules = userSchedules.filter(
    (s) =>
      s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toDateKey = (date: Date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const scheduleDateKey = (s: ScheduleData) => toDateKey(new Date(s.startDateTime))

  const dayStatusMap = useMemo(() => {
    const map = new Map<string, Set<ScheduleData["status"]>>()
    for (const s of filteredSchedules) {
      const key = scheduleDateKey(s)
      const set = map.get(key) ?? new Set<ScheduleData["status"]>()
      set.add(s.status)
      map.set(key, set)
    }
    return map
  }, [filteredSchedules])

  const selectedDaySchedules = useMemo(() => {
    if (!selectedDate) return []
    const key = toDateKey(selectedDate)
    return filteredSchedules.filter((s) => scheduleDateKey(s) === key)
  }, [filteredSchedules, selectedDate])

  const CalendarDay = (props: DayButtonProps) => {
    const dayKey = toDateKey(props.day.date)
    const statuses = dayStatusMap.get(dayKey)

    return (
      <CalendarDayButton {...props}>
        {props.children}
        {statuses && statuses.size > 0 && (
          <span className="flex items-center justify-center gap-1">
            {statuses.has("scheduled") && <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />}
            {statuses.has("in-progress") && <span className="h-1.5 w-1.5 rounded-full bg-chart-4" />}
            {statuses.has("completed") && <span className="h-1.5 w-1.5 rounded-full bg-chart-2" />}
          </span>
        )}
      </CalendarDayButton>
    )
  }

  const resetForm = () => {
    setFormLotId("")
    setFormStartDateTime("")
    setFormEndDateTime("")
    setFormAssignee("")
    setEditingSchedule(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (schedule: ScheduleData) => {
    setEditingSchedule(schedule)
    setFormLotId(schedule.lotId)
    setFormStartDateTime(schedule.startDateTime)
    setFormEndDateTime(schedule.endDateTime)
    setFormAssignee(schedule.assignee)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const lot = mockLots.find((l) => l.id === formLotId)
    const brewery = breweries.find((b) => b.id === lot?.breweryId)

    if (editingSchedule) {
      setSchedules(
        schedules.map((s) =>
          s.id === editingSchedule.id
            ? {
                ...s,
                lotId: formLotId,
                lotNumber: lot?.lotNumber || "",
                productName: lot?.productName || "",
                breweryId: lot?.breweryId || "",
                breweryName: brewery?.name || "",
                startDateTime: formStartDateTime,
                endDateTime: formEndDateTime,
                assignee: formAssignee,
              }
            : s
        )
      )
    } else {
      const newSchedule: ScheduleData = {
        id: `sch-${Date.now()}`,
        lotId: formLotId,
        lotNumber: lot?.lotNumber || "",
        productName: lot?.productName || "",
        breweryId: lot?.breweryId || "",
        breweryName: brewery?.name || "",
        startDateTime: formStartDateTime,
        endDateTime: formEndDateTime,
        assignee: formAssignee,
        status: "scheduled",
      }
      setSchedules([...schedules, newSchedule])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (scheduleId: string) => {
    if (window.confirm("この製造日程を削除しますか？")) {
      setSchedules(schedules.filter((s) => s.id !== scheduleId))
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-muted text-muted-foreground"
      case "in-progress":
        return "bg-chart-4/10 text-chart-4"
      case "completed":
        return "bg-chart-2/10 text-chart-2"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "予定"
      case "in-progress":
        return "作業中"
      case "completed":
        return "完了"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">製造日程</h1>
            <p className="mt-2 text-muted-foreground">製造工程の作業時間および担当者を記録</p>
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
                <DialogTitle>{editingSchedule ? "製造日程編集" : "新規製造日程登録"}</DialogTitle>
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
                <Field>
                  <FieldLabel htmlFor="startDateTime">開始日時</FieldLabel>
                  <Input
                    id="startDateTime"
                    type="datetime-local"
                    value={formStartDateTime}
                    onChange={(e) => setFormStartDateTime(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="endDateTime">終了日時</FieldLabel>
                  <Input
                    id="endDateTime"
                    type="datetime-local"
                    value={formEndDateTime}
                    onChange={(e) => setFormEndDateTime(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="assignee">担当者</FieldLabel>
                  <Input
                    id="assignee"
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    placeholder="作業担当者名"
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">キャンセル</Button>
                </DialogClose>
                <Button
                  onClick={handleSubmit}
                  disabled={!formLotId || !formStartDateTime || !formEndDateTime || !formAssignee}
                >
                  {editingSchedule ? "更新" : "保存"}
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
            placeholder="日程を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Schedule List */}
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>カレンダー ({filteredSchedules.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MonthCalendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              components={{ DayButton: CalendarDay }}
            />
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? `${selectedDate.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })} のロット一覧 (${selectedDaySchedules.length})`
                  : `ロット一覧 (${selectedDaySchedules.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDaySchedules.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">この日の製造日程がありません</div>
              ) : (
                <div className="divide-y divide-border">
                  {selectedDaySchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {schedule.lotNumber} - {schedule.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(schedule.startDateTime)} 〜 {formatDateTime(schedule.endDateTime)}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(schedule.status)}`}>
                              {getStatusLabel(schedule.status)}
                            </span>
                            <span className="text-xs text-muted-foreground">担当: {schedule.assignee}</span>
                            <span className="text-xs text-muted-foreground">| {schedule.breweryName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(schedule)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(schedule.id)}
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
    </div>
  )
}
