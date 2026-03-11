"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Plus, Pencil, Trash2, Search, Shield, User } from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  breweryId?: string
  breweryName?: string
  createdAt: string
}

const initialUsers: UserData[] = [
  { id: "admin-001", name: "管理者", email: "admin@sakagura-dx.jp", role: "admin", createdAt: "2024-01-01" },
  {
    id: "user-001",
    name: "石川太郎",
    email: "ishikawa@sakagura-dx.jp",
    role: "user",
    breweryId: "0001",
    breweryName: "石川酒造",
    createdAt: "2024-01-15",
  },
  {
    id: "user-002",
    name: "落花子",
    email: "ochi@sakagura-dx.jp",
    role: "user",
    breweryId: "0002",
    breweryName: "落酒造",
    createdAt: "2024-02-01",
  },
]

export default function UserManagementPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [users, setUsers] = useState<UserData[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formRole, setFormRole] = useState<"admin" | "user">("user")
  const [formBreweryId, setFormBreweryId] = useState("")

  useEffect(() => {
    if (isLoading) return
    if (user?.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [isLoading, router, user?.role])

  if (isLoading || user?.role !== "admin") {
    return null
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormName("")
    setFormEmail("")
    setFormRole("user")
    setFormBreweryId("")
    setEditingUser(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (userData: UserData) => {
    setEditingUser(userData)
    setFormName(userData.name)
    setFormEmail(userData.email)
    setFormRole(userData.role)
    setFormBreweryId(userData.breweryId || "")
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const brewery = breweries.find((b) => b.id === formBreweryId)

    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formName,
                email: formEmail,
                role: formRole,
                breweryId: formRole === "user" ? formBreweryId : undefined,
                breweryName: formRole === "user" ? brewery?.name : undefined,
              }
            : u
        )
      )
    } else {
      // Create new user
      const newUser: UserData = {
        id: `user-${Date.now()}`,
        name: formName,
        email: formEmail,
        role: formRole,
        breweryId: formRole === "user" ? formBreweryId : undefined,
        breweryName: formRole === "user" ? brewery?.name : undefined,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (userId: string) => {
    if (window.confirm("このユーザーを削除しますか？")) {
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ユーザー管理</h1>
            <p className="mt-2 text-muted-foreground">ユーザーアカウントの作成および権限設定</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "ユーザー編集" : "新規ユーザー作成"}</DialogTitle>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">氏名</FieldLabel>
                  <Input
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="利用者名"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="ログインID"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="role">権限</FieldLabel>
                  <Select value={formRole} onValueChange={(v) => setFormRole(v as "admin" | "user")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">管理者</SelectItem>
                      <SelectItem value="user">利用者</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                {formRole === "user" && (
                  <Field>
                    <FieldLabel htmlFor="brewery">所属酒蔵</FieldLabel>
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
                <Button onClick={handleSubmit} disabled={!formName || !formEmail}>
                  {editingUser ? "更新" : "登録"}
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
            placeholder="ユーザーを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* User List */}
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>登録ユーザー ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {filteredUsers.map((userData) => (
                <div key={userData.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${userData.role === "admin" ? "bg-primary/10" : "bg-muted"}`}
                    >
                      {userData.role === "admin" ? (
                        <Shield className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{userData.name}</p>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${userData.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                        >
                          {userData.role === "admin" ? "管理者" : "利用者"}
                        </span>
                        {userData.breweryName && (
                          <span className="text-xs text-muted-foreground">{userData.breweryName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(userData)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(userData.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
