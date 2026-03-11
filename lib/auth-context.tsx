"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "admin" | "user"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  breweryId?: string
  breweryName?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: "admin-001",
    name: "管理者",
    email: "admin@sakagura-dx.jp",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-001",
    name: "石川太郎",
    email: "ishikawa@sakagura-dx.jp",
    password: "user123",
    role: "user",
    breweryId: "0001",
    breweryName: "石川酒造",
  },
  {
    id: "user-002",
    name: "落花子",
    email: "ochi@sakagura-dx.jp",
    password: "user123",
    role: "user",
    breweryId: "0002",
    breweryName: "落酒造",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("sakagura-dx-user") : null
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("sakagura-dx-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("sakagura-dx-user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return { success: false, error: "メールアドレスまたはパスワードが正しくありません" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sakagura-dx-user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
