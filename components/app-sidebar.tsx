"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Wine,
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  ClipboardCheck,
  Download,
  LogOut,
  Eye,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
  hideForUser?: boolean
}

const navItems: NavItem[] = [
  { label: "ダッシュボード", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "酒蔵別閲覧", href: "/view", icon: <Eye className="h-5 w-5" />, hideForUser: true },
  { label: "酒蔵比較", href: "/compare", icon: <ArrowLeftRight className="h-5 w-5" />, hideForUser: true },
  { label: "ユーザー管理", href: "/dashboard/users", icon: <Users className="h-5 w-5" />, adminOnly: true },
  { label: "製造ロット管理", href: "/dashboard/lots", icon: <Package className="h-5 w-5" /> },
  { label: "製造日程", href: "/dashboard/schedule", icon: <Calendar className="h-5 w-5" /> },
  { label: "品質管理", href: "/dashboard/quality", icon: <ClipboardCheck className="h-5 w-5" /> },
  { label: "データ出力", href: "/dashboard/export", icon: <Download className="h-5 w-5" /> },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && user?.role !== "admin") return false
    if (item.hideForUser && user?.role === "user") return false
    return true
  })

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Wine className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-foreground">酒蔵DX</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {user && !collapsed && (
        <div className="border-b border-border p-4">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.role === "admin" ? "管理者" : user.breweryName}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "ログアウト" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && "ログアウト"}
        </button>
      </div>
    </aside>
  )
}
