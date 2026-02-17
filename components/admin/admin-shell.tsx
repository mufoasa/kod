"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CalendarDays, UtensilsCrossed, LogOut, Home } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Reservations", icon: CalendarDays },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
]

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-6 py-5">
          <span className="font-serif text-xl font-bold text-primary">KOD</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Admin
          </span>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <p className="mb-3 truncate text-xs text-muted-foreground">{userEmail}</p>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-2 border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Home className="h-3 w-3" />
              Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-2 border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
            >
              <LogOut className="h-3 w-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
