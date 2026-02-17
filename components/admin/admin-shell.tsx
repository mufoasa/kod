"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CalendarDays, UtensilsCrossed, LogOut, Home, Menu, X } from "lucide-react"

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
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-primary">KOD</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Admin
            </span>
          </div>

          {/* Close button mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
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
                  onClick={() => setIsOpen(false)}
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
          <p className="mb-3 truncate text-xs text-muted-foreground">
            {userEmail}
          </p>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-2 border border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"
            >
              <Home className="h-3 w-3" />
              Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-2 border border-border px-3 py-2 text-xs text-muted-foreground hover:border-destructive/50 hover:text-destructive"
            >
              <LogOut className="h-3 w-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        {/* Top Bar */}
        <header className="flex items-center border-b border-border px-4 py-3 md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
